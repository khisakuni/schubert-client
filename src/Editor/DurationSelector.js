import React from 'react';
import { connect } from 'react-redux';

import { changeDuration } from '../actions/score';
import { getSelectedNote } from '../selectors/score';

const durations = [
  { name: 'whole', value: 'w' },
  { name: 'half', value: 'h' },
  { name: 'quarter', value: 'q' },
  { name: 'eigth', value: '8' },
  { name: 'sixteenth', value: '16' },
  { name: '32nth', value: '32' }
];

const DurationSelector = props => (
  <ul>
    {durations.map(({ name, value }) => (
      <li key={name}>
        <button
          onClick={() => props.changeDuration(props.selectedNote.id, value)}
        >
          {name}
        </button>
      </li>
    ))}
  </ul>
);

const mapStateToProps = state => ({
  selectedNote: getSelectedNote(state),
  voices: state.voices
});

const mapDispatchToProps = dispatch => ({
  changeDuration: (id, duration) => dispatch(changeDuration(id, duration))
});

export default connect(mapStateToProps, mapDispatchToProps)(DurationSelector);
