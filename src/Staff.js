import React, { PureComponent } from 'react';
import Vex from 'vexflow';
import { connect } from 'react-redux';

import Measure from './Measure';
import { measureID } from './actions/score';
import {
  makeGetMeasuresForStaff,
  makeGetVoicesForMeasure,
} from './selectors/score';

class Staff extends PureComponent {
  render() {
    const {
      context,
      measures,
      height,
      index,
      width,
      onNoteClick,
      id,
    } = this.props;

    if (!context) {
      return <div />;
    }

    let lastWidth = 0;

    return measures.map((measure, measureIndex) => {
      const measureWidth = width / measures.length;

      const voiceIDToVFVoice = {};

      const vfVoices = measure.voices.map(voice => {
        const v = new Vex.Flow.Voice({
          clef: 'treble',
          num_beats: voice.numBeats,
          beat_value: voice.beatValue,
        });
        voiceIDToVFVoice[voice.id] = v;

        const vfNotes = voice.notes
          .sort((a, b) => a.index - b.index)
          .map(note => {
            const n = new Vex.Flow.StaveNote({
              clef: 'treble',
              keys: note.keys,
              duration: note.duration,
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

      const formatter = new Vex.Flow.Formatter()
        .joinVoices(vfVoices)
        .format(vfVoices, width - 20);

      const minWidth = formatter.getMinTotalWidth();
      const w = minWidth > measureWidth ? minWidth : measureWidth;

      const lastX = lastWidth;
      lastWidth = w;
      const y = height * index;

      return (
        <Measure
          key={measureIndex}
          width={w}
          x={lastX}
          y={y}
          context={context}
          id={measureID(id, measureIndex)}
          onNoteClick={onNoteClick}
        />
      );
    });
  }
}

const makeMapStateToProps = () => {
  const getMeasuresForStaff = makeGetMeasuresForStaff();
  const getVoicesForMeasure = makeGetVoicesForMeasure();
  return (state, props) => {
    return {
      measures: getMeasuresForStaff(state, props).map(measure => ({
        ...measure,
        voices: getVoicesForMeasure(state, measure), // This is here so we can get updated values.
      })),
    };
  };
};

export default connect(makeMapStateToProps)(Staff);
