import React from 'react';
import { connect } from 'react-redux';

import { load } from '../actions/score';

/*
 * TODO:
 * - Add measure
 * - Delete measure
 *
 */
const MeasureControl = ({ load }) => {
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
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  load: measure => dispatch(load({ measures: [measure] })),
});

export default connect(
  null,
  mapDispatchToProps
)(MeasureControl);
