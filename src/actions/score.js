export const LOAD_SCORE = 'LOAD_SCORE';
export const LOAD_SHEET = 'LOAD_SHEET';
export const LOAD_STAVE = 'LOAD_STAVE';
export const LOAD_MEASURE = 'LOAD_MEASURE';
export const LOAD_VOICE = 'LOAD_VOICE';
export const LOAD_NOTE = 'LOAD_NOTE';
export const SELECT_NOTE = 'SELECT_NOTE';
export const CHANGE_KEY = 'CHANGE_KEY';
export const CHANGE_DURATION = 'CHANGE_DURATION';

export const sheetID = index => `sheet${index}`;
export const staffID = (sheetid, index) => `${sheetid}-staff${index}`;
export const measureID = (staffid, index) => `${staffid}-measure${index}`;
export const voiceID = (measureid, index) => `${measureid}-voice${index}`;
export const noteID = (voiceid, index) => `${voiceid}-note${index}`;

export const selectNote = id => ({ type: SELECT_NOTE, data: { id } });

export const changeKey = (id, key) => ({ type: CHANGE_KEY, data: { id, key } });

export const changeDuration = (id, duration) => ({
  type: CHANGE_DURATION,
  data: { id, duration }
});

export const load = ({ sheets }) => dispatch =>
  // Load sheets
  sheets.map((sheet, sheetIndex) => {
    const sheetid = sheetID(sheetIndex);
    dispatch({
      type: LOAD_SHEET,
      data: { [sheetid]: { ...sheet, id: sheetid, index: sheetIndex } }
    });

    // Load staves
    return sheet.staves.map((staff, staffIndex) => {
      const staffid = staffID(sheetid, staffIndex);
      dispatch({
        type: LOAD_STAVE,
        data: {
          [staffid]: {
            ...staff,
            id: staffid,
            sheetID: sheetid,
            index: staffIndex
          }
        }
      });

      // Load measures
      return staff.measures.map((measure, measureIndex) => {
        const measureid = measureID(staffid, measureIndex);
        dispatch({
          type: LOAD_MEASURE,
          data: {
            [measureid]: {
              ...measure,
              id: measureid,
              staffID: staffid,
              index: measureIndex
            }
          }
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
                index: voiceIndex
              }
            }
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
                  voiceID: voiceid,
                  index: noteIndex
                }
              }
            });
          });
        });
      });
    });
  });
