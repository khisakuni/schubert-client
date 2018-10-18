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

    /*
     * =========== Notes =============
     *
     * Calculating measureWidth by dividing width of sheet by measures is wrong.
     * This doesn't support stacking measures.
     *
     * Need to: 
     * - Know max-width of sheet.
     * - Keep running total of row length.
     * - If row length exceeds max-width
     *   * Start new row.
     *   * Reset row length total.
     *   * Calculate new y position.
     *
     */
    let rowWidth = 0;
    const measureHeight = 80;
    let staffCount = 1;
    return measures.map((measure, measureIndex) => {
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

      let measureWidth = width / measures.length;
      let x = rowWidth;
      let y = measureHeight * staffCount;
      let m = new Vex.Flow.Stave(x, y, measureWidth);

      const startX = m.getNoteStartX();

      const formatter = new Vex.Flow.Formatter()
        .joinVoices(vfVoices)
        .format(vfVoices, rowWidth + measureWidth - startX);
      const minWidth = formatter.getMinTotalWidth();

      if (minWidth > measureWidth) {
        measureWidth = minWidth;
        m = new Vex.Flow.Stave(x, y, measureWidth);
      }

      rowWidth += measureWidth;

      console.log('row width >>>', rowWidth, width);
      if (rowWidth > width) {
        rowWidth = 0;
        staffCount++;
        y = measureHeight * staffCount;
        x = rowWidth;

        m = new Vex.Flow.Stave(x, y, measureWidth);
      }

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
