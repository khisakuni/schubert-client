export const LOAD_MEASURE = 'LOAD_MEASURE';
export const LOAD_VOICE = 'LOAD_VOICE';
export const LOAD_NOTE = 'LOAD_NOTE';
export const SELECT_NOTE = 'SELECT_NOTE';
export const SELECT_MEASURE = 'SELECT_MEASURE';
export const CHANGE_KEY = 'CHANGE_KEY';
export const CHANGE_DURATION = 'CHANGE_DURATION';
export const REMOVE_MEASURE = 'REMOVE_MEASURE';
export const UPDATE_MEASURE = 'UPDATE_MEASURE';

export const measureID = index => `measure${index}`;
export const voiceID = (measureid, index) => `${measureid}-voice${index}`;
export const noteID = (voiceid, index) => `${voiceid}-note${index}`;

export const selectNote = id => ({ type: SELECT_NOTE, data: { id } });

export const selectMeasure = id => ({ type: SELECT_MEASURE, data: { id } });

export const changeKey = (id, key) => ({ type: CHANGE_KEY, data: { id, key } });

export const changeDuration = (id, duration) => ({
  type: CHANGE_DURATION,
  data: { id, duration },
});

export const load = ({ measures }) => (dispatch, getState) => {
  const index = Object.keys(getState().score.measures).length;
  // Load measures
  return measures.map((measure, measureIndex) => {
    const measureid = measureID(index + measureIndex);
    dispatch({
      type: LOAD_MEASURE,
      data: {
        [measureid]: {
          ...measure,
          id: measureid,
          index: measureIndex,
        },
      },
    });

    // Load voices
    return measure.voices.map((voice, voiceIndex) => {
      const voiceid = voiceID(measureid, voiceIndex);
      dispatch({
        type: LOAD_VOICE,
        data: {
          [voiceid]: {
            ...voice,
            id: voiceid,
            measureID: measureid,
            index: voiceIndex,
          },
        },
      });

      // Load notes
      return voice.notes.map((note, noteIndex) => {
        const noteid = noteID(voiceid, noteIndex);
        return dispatch({
          type: LOAD_NOTE,
          data: {
            [noteid]: {
              ...note,
              id: noteid,
              measureID: measureid,
              voiceID: voiceid,
              index: noteIndex,
            },
          },
        });
      });
    });
  });
};

export const removeMeasure = ({ id }) => ({
  type: REMOVE_MEASURE,
  data: {
    id,
  },
});

export const updateMeasure = measure => ({
  type: UPDATE_MEASURE,
  data: measure,
});
