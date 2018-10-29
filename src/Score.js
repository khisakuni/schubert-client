import React, { PureComponent } from 'react';
import Vex from 'vexflow';
import { connect } from 'react-redux';
import { takeWhile } from 'lodash';

import Measure from './Measure';
import { measureID } from './actions/score';
import { makeGetVoicesForMeasure } from './selectors/score';
import { durationToRatio } from './reducers/score';

const voicesFromMeasure = measure => {
  const voiceIDToVFVoice = {};
  const timeSignature = measure.timeSignature || {
    numBeats: 4,
    beatValue: 'q',
  };
  const vfVoices = measure.voices.map(voice => {
    const v = new Vex.Flow.Voice({
      clef: 'treble',
      num_beats: timeSignature.numBeats,
      beat_value: 1 / durationToRatio[timeSignature.beatValue],
    });
    voiceIDToVFVoice[voice.id] = v;

    let total = 0;
    const allowed =
      timeSignature.numBeats * durationToRatio[timeSignature.beatValue];
    const vfNotes = takeWhile(
      voice.notes.sort((a, b) => a.index - b.index),
      n => (total += durationToRatio[n.duration]) <= allowed
    ).map(note => {
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
  return voiceIDToVFVoice;
};

const vfMeasure = (measure, x, y, width) => {
  const m = new Vex.Flow.Stave(x, y, width);

  if (measure.clef) {
    m.addClef(measure.clef);
  }

  const timeSignature = measure.timeSignature || {};
  if (timeSignature.numBeats && timeSignature.beatValue) {
    m.addTimeSignature(
      `${timeSignature.numBeats}/${1 /
        durationToRatio[timeSignature.beatValue]}`
    );
  }
  return m;
};

class Score extends PureComponent {
  render() {
    const {
      context,
      measures,
      width,
      onNoteClick,
      onMeasureClick,
    } = this.props;

    let rowWidth = 0;
    const measureHeight = 80;
    let staffCount = 1;
    return (
      <div>
        {measures.map((measure, measureIndex) => {
          let measureWidth = width / measures.length;
          let x = rowWidth;
          let y = measureHeight * staffCount;
          let m = vfMeasure(measure, x, y, measureWidth);

          let voiceIDToVFVoice = voicesFromMeasure(measure);
          let vfVoices = Object.values(voiceIDToVFVoice);

          vfVoices.forEach(v => v.setStave(m));

          const formatter = new Vex.Flow.Formatter()
            .joinVoices(vfVoices)
            .format(vfVoices, measureWidth - (m.getNoteStartX() - x));
          let minWidth = Math.max(formatter.getMinTotalWidth() + 100, 200);

          if (minWidth > measureWidth) {
            measureWidth = minWidth;
            voiceIDToVFVoice = voicesFromMeasure(measure);
            vfVoices = Object.values(voiceIDToVFVoice);
            m = vfMeasure(measure, x, y, measureWidth);
            vfVoices.forEach(v => v.setStave(m));
            new Vex.Flow.Formatter()
              .joinVoices(vfVoices)
              .format(vfVoices, measureWidth - (m.getNoteStartX() - x));
          }

          rowWidth += measureWidth;

          if (rowWidth > width) {
            staffCount++;
            y = measureHeight * staffCount;
            x = 0;
            m = vfMeasure(measure, x, y, measureWidth);
            vfVoices.forEach(v => v.setStave(m));
            new Vex.Flow.Formatter()
              .joinVoices(vfVoices)
              .format(vfVoices, measureWidth - (m.getNoteStartX() - x));
            rowWidth = measureWidth;
          }

          return (
            <Measure
              key={measureIndex}
              context={context}
              id={measureID(measureIndex)}
              onNoteClick={onNoteClick}
              onMeasureClick={onMeasureClick}
              m={m}
              vfVoices={voiceIDToVFVoice}
            />
          );
        })}
      </div>
    );
  }
}

//const mapStateToProps = ({ score: {measures} }) => ;
const makeMapStateToProps = () => {
  const getVoicesForMeasure = makeGetVoicesForMeasure();
  return (state, props) => {
    return {
      measures: Object.values(state.score.measures).map(measure => ({
        ...measure,
        voices: getVoicesForMeasure(state, measure), // This is here so we can get updated values.
      })),
    };
  };
};

export default connect(makeMapStateToProps)(Score);
