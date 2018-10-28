import { createSelector } from 'reselect';
import { values, find } from 'lodash';

const getMeasures = state =>
  (state || { score: { measures: {} } }).score.measures;
const getStaffID = (_, props = {}) => props.id;
export const makeGetMeasuresForStaff = () =>
  createSelector([getMeasures, getStaffID], (measures, id) =>
    values(measures).filter(measure => measure.staffID === id)
  );

const getVoices = state => (state || { score: { voices: {} } }).score.voices;
const getNotes = state => (state || { score: { notes: {} } }).score.notes;
const getMeasureID = (_, props = {}) => props.id;
export const makeGetVoicesForMeasure = () =>
  createSelector([getVoices, getMeasureID, getNotes], (voices, id, notes) =>
    values(voices)
      .filter(voice => voice.measureID === id)
      .map(voice => ({
        ...voice,
        notes: values(notes).filter(note => note.voiceID === voice.id),
      }))
  );

export const getSelectedNote = createSelector([getNotes], notes =>
  find(notes, note => note.selected)
);

export const getSelectedMeasure = createSelector([getMeasures], measures =>
  find(measures, measure => measure.selected)
);
