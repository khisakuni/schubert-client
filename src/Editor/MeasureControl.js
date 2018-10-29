import React from 'react';
import { connect } from 'react-redux';

import { load, removeMeasure, updateMeasure } from '../actions/score';
import { getSelectedMeasure } from '../selectors/score';

const clefOptions = [
  'treble',
  'bass',
  'tenor',
  'alto',
  'soprano',
  'percussion',
  'mezzo-soprano',
  'baritone-c',
  'baritone-f',
  'subbass',
  'french',
];

const MeasureControl = ({ load, selectedMeasure, remove, update }) => {
  const measure = {
    voices: [
      {
        numBeats: 4,
        beatValue: 4,
        notes: [
          {
            keys: ['c/4'],
            duration: 'q',
          },
          {
            keys: ['c/4'],
            duration: 'q',
          },
          {
            keys: ['c/4'],
            duration: 'q',
          },
          {
            keys: ['c/4'],
            duration: 'q',
          },
        ],
      },
    ],
  };
  return (
    <div>
      <button onClick={() => load(measure)}>Add Measure</button>
      {selectedMeasure && (
        <div>
          <button onClick={() => remove(selectedMeasure)}>
            Delete Measure
          </button>
          <select
            value={selectedMeasure.clef || ''}
            onChange={e => update({ ...selectedMeasure, clef: e.target.value })}
          >
            <option value="">Select a clef</option>
            {clefOptions.map(clef => (
              <option key={clef} value={clef}>
                {clef}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  selectedMeasure: getSelectedMeasure(state),
});

const mapDispatchToProps = dispatch => ({
  load: measure => dispatch(load({ measures: [measure] })),
  remove: ({ id }) => dispatch(removeMeasure({ id })),
  update: measure => dispatch(updateMeasure(measure)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeasureControl);
