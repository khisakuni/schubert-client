import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Score from '../Score';
import DurationSelector from './DurationSelector';
import NoteSelector from './NoteSelector';
import { load, selectNote } from '../actions/score';
import { getSelectedNote } from '../selectors/score';

const data = {
  sheets: [
    {
      height: 200,
      width: 800,
      staves: [
        {
          measures: [
            {
              clefs: [],
              timeSignatures: [],
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
              clefs: [],
              timeSignatures: [],
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

        <Score onNoteClick={this.props.selectNote} />
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
