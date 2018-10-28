import React from 'react';
import { connect } from 'react-redux';

import { load, removeMeasure } from '../actions/score';
import { getSelectedMeasure } from '../selectors/score';

/*
 * TODO:
 * - Add measure
 * - Delete measure
 *
 */
const MeasureControl = ({ load, selectedMeasure, remove }) => {
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
        <button onClick={() => remove(selectedMeasure)}>Delete Measure</button>
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeasureControl);
