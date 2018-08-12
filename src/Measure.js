import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Vex from 'vexflow';
import { connect } from 'react-redux';

import { makeGetVoicesForMeasure } from './selectors/score';
import { noteID } from './actions/score';

class Measure extends PureComponent {
  constructor(props) {
    super(props);
    this.group = null;
  }

  render() {
    const { voices, width, x, y, context, onNoteClick, notes } = this.props;

    if (this.group) {
      context.svg.removeChild(this.group);
    }
    this.group = context.openGroup();

    const voiceIDToVFVoice = {};

    const m = new Vex.Flow.Stave(x, y, width);
    m.setContext(context).draw();

    const vfVoices = voices.map(voice => {
      const v = new Vex.Flow.Voice({
        clef: 'treble',
        num_beats: voice.numBeats,
        beat_value: voice.beatValue
      });
      voiceIDToVFVoice[voice.id] = v;

      const vfNotes = voice.notes
        .sort((a, b) => a.index - b.index)
        .map(note => {
          const n = new Vex.Flow.StaveNote({
            clef: 'treble',
            keys: note.keys,
            duration: note.duration
          });
          if (note.selected) {
            n.setStyle({ fillStyle: 'red', strokeStyle: 'red' });
          } else {
            n.setStyle({ fillStyle: 'black', strokeStyle: 'black' });
          }
          return n;
        });

      v.addTickables(vfNotes);
      return v;
    });

    new Vex.Flow.Formatter().joinVoices(vfVoices).format(vfVoices, width - 20);

    Object.keys(voiceIDToVFVoice).forEach(id => {
      const voice = voiceIDToVFVoice[id];
      voice.draw(context, m);

      voice.tickables.forEach((t, i) => {
        t.attrs.el.onclick = () => {
          console.log('click >>>', noteID(id, i));
          console.log('click >>>>>>', notes);
          onNoteClick(notes[noteID(id, i)]);
        };
      });
    });

    context.closeGroup();

    return <div />;
  }
}

Measure.propTypes = {
  voices: PropTypes.shape(),
  width: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  context: PropTypes.shape(),
  onNoteClick: PropTypes.func,
  notes: PropTypes.arrayOf(PropTypes.shape())
};

const makeMapStateToProps = () => {
  const getVoicesForMeasure = makeGetVoicesForMeasure();
  return (state, props) => ({
    voices: getVoicesForMeasure(state, props),
    notes: state.score.notes
  });
};

export default connect(makeMapStateToProps)(Measure);
