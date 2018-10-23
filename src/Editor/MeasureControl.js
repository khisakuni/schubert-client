import React from 'react';
import { connect } from 'react-redux';

import { load } from '../actions/score';

/*
 * TODO:
 * - Add measure
 * - Delete measure
 *
 */
const MeasureControl = () => (
  <div>
    <button>Add Measure</button>
  </div>
);

const mapDispatchToProps = dispatch => ({
  load: measure => dispatch(load({ measures: [measure] })),
});

export default connect(
  null,
  mapDispatchToProps
)(MeasureControl);
