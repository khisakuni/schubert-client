import React from 'react';
import { connect } from 'react-redux';

import { load, removeMeasure, updateMeasure } from '../actions/score';
import { getSelectedMeasure } from '../selectors/score';
import { durationToRatio } from '../reducers/score';

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
    // TODO: Get this from selected measure.
    clef: 'treble',
    timeSignature: {
      numBeats: 4,
      beatValue: 'q',
    },
    voices: [
      {
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

  const timeSignature = (selectedMeasure || {}).timeSignature || {};
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

          <div>
            <label>
              Beats
              {/* TODO: This should grab value of measure before it. */}
              <input
                type="number"
                value={timeSignature.numBeats || 4}
                onChange={e =>
                  update({
                    ...selectedMeasure,
                    timeSignature: {
                      ...timeSignature,
                      numBeats: e.target.value,
                    },
                  })
                }
              />
            </label>

            <label>
              Beat value
              {/* TODO: This should grab value of measure before it. */}
              <select
                value={timeSignature.beatValue}
                onChange={e =>
                  update({
                    ...selectedMeasure,
                    timeSignature: {
                      ...timeSignature,
                      beatValue: e.target.value,
                    },
                  })
                }
              >
                {Object.keys(durationToRatio).map(duration => (
                  <option key={duration} value={duration}>
                    {1 / durationToRatio[duration]}
                  </option>
                ))}
              </select>
            </label>
          </div>
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
