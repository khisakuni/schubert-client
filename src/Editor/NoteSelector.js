import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { getSelectedNote } from '../selectors/score';
import { changeKey } from '../actions/score';

const octaves = 7;
const notes = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
const generateKeys = () => {
  const keys = [];
  for (let i = 0; i < octaves; i += 1) {
    notes.forEach(n => keys.push({ octave: i + 1, note: n }));
  }
  return keys;
};

const styles = {
  li: {
    cursor: 'pointer',
    display: 'inline'
  }
};

const NoteSelector = props => {
  const { selectedNote } = props;
  return (
    <ul>
      {generateKeys().map(({ note, octave }) => (
        <li key={note + octave} style={styles.li}>
          <button
            onClick={() =>
              props.changeKey(selectedNote.id, `${note}/${octave}`)
            }
          >
            {`${note} ${octave}`}
          </button>
        </li>
      ))}
    </ul>
  );
};

NoteSelector.propTypes = {
  selectedNote: PropTypes.shape()
};

NoteSelector.defaultProps = {
  selectedNote: null
};

const mapStateToProps = state => ({
  selectedNote: getSelectedNote(state)
});

const mapDispatchToProps = dispatch => ({
  changeKey: (id, key) => dispatch(changeKey(id, key))
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteSelector);
