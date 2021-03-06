import { values, omit, takeWhile } from 'lodash';
import {
  LOAD_MEASURE,
  LOAD_VOICE,
  LOAD_NOTE,
  SELECT_NOTE,
  SELECT_MEASURE,
  CHANGE_KEY,
  CHANGE_DURATION,
  REMOVE_MEASURE,
  UPDATE_MEASURE,
  noteID,
} from '../actions/score';

// TODO: Put this somewhere else.
export const durationToRatio = {
  w: 1,
  h: 0.5,
  q: 0.25,
  '8': 0.125,
  '16': 0.0625,
  '32': 0.03125,
};

const initialState = {
  sheets: {},
  staves: {},
  measures: {},
  voices: {},
  notes: {},
};

const reducer = (state = initialState, { type, data }) => {
  switch (type) {
    case LOAD_MEASURE:
      return { ...state, measures: { ...state.measures, ...data } };
    case LOAD_VOICE:
      return { ...state, voices: { ...state.voices, ...data } };
    case LOAD_NOTE:
      return { ...state, notes: { ...state.notes, ...data } };
    case SELECT_NOTE:
      return {
        ...state,
        notes: {
          ...Object.keys(state.notes).reduce(
            (a, e) => ({ ...a, [e]: { ...state.notes[e], selected: false } }),
            {}
          ),
          [data.id]: { ...state.notes[data.id], selected: true },
        },
      };
    case SELECT_MEASURE:
      return {
        ...state,
        measures: {
          ...Object.keys(state.measures).reduce(
            (a, e) => ({
              ...a,
              [e]: { ...state.measures[e], selected: false },
            }),
            {}
          ),
          [data.id]: { ...state.measures[data.id], selected: true },
        },
      };
    case CHANGE_KEY:
      return {
        ...state,
        notes: {
          ...state.notes,
          [data.id]: { ...state.notes[data.id], keys: [data.key] },
        },
      };
    case CHANGE_DURATION: {
      const { notes, voices } = state;
      const { id, duration } = data;
      const note = notes[id];
      const voice = voices[note.voiceID];
      const toDuration = durationToRatio[duration];
      const fromDuration = durationToRatio[note.duration];
      const voiceNotes = values(notes)
        .filter(({ voiceID }) => voiceID === voice.id)
        .sort((a, b) => a.index - b.index);

      if (toDuration > fromDuration) {
        let total = 0;
        const toDelete = takeWhile(voiceNotes.slice(note.index + 1), n => {
          total += durationToRatio[n.duration];
          return total < toDuration;
        });

        const updatedNotes = omit(notes, toDelete.map(n => n.id));
        updatedNotes[id] = { ...updatedNotes[id], duration };

        // If total duration doesn't add up to 1, it's invalid.
        const totalDuration = values(updatedNotes)
          .filter(n => n.voiceID === voice.id)
          .reduce((a, e) => (a += durationToRatio[e.duration]), 0);
        if (totalDuration !== 1) {
          return state;
        }

        const updatedVoiceNotes = values(updatedNotes)
          .filter(n => n.voiceID === voice.id)
          .sort((a, b) => a.index - b.index)
          .reduce((a, e, i) => {
            a[noteID(voice.id, i)] = {
              ...e,
              id: noteID(voice.id, i),
              index: i,
            };
            return a;
          }, {});

        const other = values(updatedNotes)
          .filter(n => n.voiceID !== voice.id)
          .reduce((a, e) => {
            a[e.id] = e;
            return a;
          }, {});

        return {
          ...state,
          notes: { ...updatedVoiceNotes, ...other },
        };
      }
      const addCount = fromDuration / toDuration;
      const toCreate = [];
      for (let i = 1; i < addCount; i += 1) {
        toCreate.push({
          ...note,
          index: note.index + i,
          id: noteID(voice.id, note.index + i),
          selected: false,
          duration,
        });
      }
      voiceNotes.slice(note.index + 1).forEach(n => {
        const newIndex = n.index + addCount - 1;
        const newID = noteID(voice.id, newIndex);
        notes[newID] = { ...n, index: newIndex, id: newID };
      });
      return {
        ...state,
        notes: {
          ...notes,
          ...toCreate.reduce((a, e) => {
            a[e.id] = e;
            return a;
          }, {}),
          [data.id]: { ...state.notes[id], duration },
        },
      };
    }
    case REMOVE_MEASURE: {
      //const measure = state.measures[data.id];
      // const voices = measure.voices;
      return {
        ...state,
        measures: {
          ...omit(state.measures, data.id),
        },
        voices: {
          ...omit(
            state.voices,
            values(state.voices)
              .filter(({ measureID }) => measureID === data.id)
              .map(({ id }) => id)
          ),
        },
        notes: {
          ...omit(
            state.notes,
            values(state.notes)
              .filter(({ measureID }) => measureID === data.id)
              .map(({ id }) => id)
          ),
        },
      };
    }
    case UPDATE_MEASURE: {
      return {
        ...state,
        measures: {
          ...state.measures,
          [data.id]: { ...state.measures[data.id], ...data },
        },
      };
    }
    default:
      return state;
  }
};

export default reducer;
