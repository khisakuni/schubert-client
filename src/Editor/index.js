import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Context from '../Context';
import Score from '../Score';
import DurationSelector from './DurationSelector';
import MeasureControl from './MeasureControl';
import NoteSelector from './NoteSelector';
import { load, selectNote, selectMeasure } from '../actions/score';
import { getSelectedNote } from '../selectors/score';

const data = {
  height: 800,
  width: 800,
  measures: [
    {
      clef: 'treble',
      timeSignature: {
        numBeats: 4,
        beatValue: 4,
      },
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
    },
    {
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
    },
    {
      voices: [
        {
          numBeats: 4,
          beatValue: 4,
          notes: [
            {
              keys: ['c/4'],
              duration: '8',
            },
            {
              keys: ['c/4'],
              duration: '8',
            },
            {
              keys: ['c/4'],
              duration: '8',
            },
            {
              keys: ['c/4'],
              duration: '8',
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
    },
  ],
};

class Editor extends PureComponent {
  constructor(props) {
    super(props);
    props.load(data);
  }

  render() {
    const { selectedNote } = this.props;
    return (
      <div>
        <h1>Score:</h1>
        {selectedNote && (
          <div>
            <NoteSelector />
            <DurationSelector />
          </div>
        )}
        <MeasureControl />

        <Context
          component={Score}
          onNoteClick={this.props.selectNote}
          onMeasureClick={this.props.selectMeasure}
          width={800}
          height={800}
        />
      </div>
    );
  }
}

Editor.propTypes = {
  load: PropTypes.func.isRequired,
  selectNote: PropTypes.func.isRequired,
  selectedNote: PropTypes.shape(),
};

Editor.defaultProps = {
  selectedNote: null,
};

const mapStateToProps = state => ({
  ...state.score,
  selectedNote: getSelectedNote(state),
});
const mapDispatchToProps = dispatch => ({
  load: score => dispatch(load(score)),
  selectNote: ({ id }) => dispatch(selectNote(id)),
  selectMeasure: ({ id }) => dispatch(selectMeasure(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
