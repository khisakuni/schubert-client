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

    return measures.map((measure, measureIndex) => {
      //const measureWidth = width / measures.length;

      const measureWidth = 400;
      const x = measureWidth * measureIndex;
      const y = height * index;
      const m = new Vex.Flow.Stave(x, y, measureWidth);
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
        v.setStave(m);
        return v;
      });

      const startX = m.getNoteStartX();

      const formatter = new Vex.Flow.Formatter()
        .joinVoices(vfVoices)
        .format(vfVoices, measureWidth + measureWidth * measureIndex - startX);

      return (
        <Measure
          key={measureIndex}
          context={context}
          id={measureID(id, measureIndex)}
          onNoteClick={onNoteClick}
          m={m}
          vfVoices={voiceIDToVFVoice}
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
