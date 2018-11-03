import React, { PureComponent } from 'react';
import Vex from 'vexflow';
import { connect } from 'react-redux';
import { takeWhile } from 'lodash';

import Measure from './Measure';
import { measureID, loadNote, noteID, removeNote } from './actions/score';
import { makeGetVoicesForMeasure } from './selectors/score';
import { durationToRatio } from './reducers/score';

const voicesFromMeasure = (measure, loadNote, removeNote) => {
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

    const allowed =
      timeSignature.numBeats * durationToRatio[timeSignature.beatValue || 'q'];
    const notes = voice.notes.sort((a, b) => a.index - b.index);
    //console.log('notes >>', notes)
    const total = notes.reduce((total, note) => {
      return (total += durationToRatio[note.duration]);
    }, 0);

    //console.log('allowed >>', total, allowed)

    let vfNotes = [];
    let t = 0;
    // vfNotes = takeWhile(
    //   notes,
    //   n => (t += durationToRatio[n.duration]) <= allowed
    // )
    vfNotes = notes.map(note => {
      const n = new Vex.Flow.StaveNote({
        clef: measure.clef || 'treble', // TODO: Should be based on something else.
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

    //console.log('>>>>>>>>')
    // TODO: Delete old ones.
    // notes.slice(vfNotes.length).forEach(n => removeNote(n))

    // Need to add more notes.
    // if (total < allowed) {
    //   const blankNotesCount = (allowed - total) / durationToRatio[timeSignature.beatValue]
    //   for (let i = 0; i < blankNotesCount; i++) {
    //     // Load notes
    //     loadNote({
    //       duration: timeSignature.beatValue,
    //       keys: ['c/4'],
    //       id: noteID(voice.id, vfNotes.length),
    //       measureID: measure.id,
    //       voiceID: voice.id,
    //       index: vfNotes.length,
    //     });
    //   }
    // }

    v.addTickables(vfNotes);
    return v;
  });
  return voiceIDToVFVoice;
};

const vfMeasure = (measure, x, y, width, showClef, showTimeSignature) => {
  const m = new Vex.Flow.Stave(x, y, width);

  // if (showClef) {
  //   console.log('CLEF >>>>>', measure.clef)
  //   m.addClef(measure.clef);
  // }

  if (showTimeSignature) {
    const timeSignature = measure.timeSignature || {};
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
      loadNote,
      removeNote,
    } = this.props;

    let rowWidth = 0;
    const measureHeight = 80;
    let staffCount = 1;
    return (
      <div>
        {measures.map((measure, mindex) => {
          console.log('mindex >>', mindex);
          let measureWidth = width / measures.length;
          let x = rowWidth;
          let y = measureHeight * staffCount;
          const prev = measures[mindex - 1];
          if (mindex === 0) {
            console.log('>>>', showClef);
          }
          let m = vfMeasure(
            measure,
            x,
            y,
            measureWidth,
            showClef,
            showTimeSignature
          );

          // Shouldn't be loadNote or removeNote in render function.
          let voiceIDToVFVoice = voicesFromMeasure(
            measure,
            loadNote,
            removeNote
          );

          let vfVoices = Object.values(voiceIDToVFVoice);

          // vfVoices.forEach(v => v.setStave(m));

          const formatter = new Vex.Flow.Formatter()
            .joinVoices(vfVoices)
            .format(vfVoices, measureWidth - (m.getNoteStartX() - x));
          let minWidth = Math.max(formatter.getMinTotalWidth() + 100, 200);

          if (minWidth > measureWidth) {
            measureWidth = minWidth;
            m = vfMeasure(measure, x, y, measureWidth);
            // vfVoices.forEach(v => v.setStave(m));
            // new Vex.Flow.Formatter()
            //   .joinVoices(vfVoices)
            //   .format(vfVoices, measureWidth - (m.getNoteStartX() - x));
          }

          rowWidth += measureWidth;

          if (rowWidth > width) {
            staffCount++;
            y = measureHeight * staffCount;
            x = 0;
            m = vfMeasure(measure, x, y, measureWidth);
            // vfVoices.forEach(v => v.setStave(m));
            // new Vex.Flow.Formatter()
            //   .joinVoices(vfVoices)
            //   .format(vfVoices, measureWidth - (m.getNoteStartX() - x));
            rowWidth = measureWidth;
          }

          const showClef = x === 0 || prev.clef !== measure.clef;
          const showTimeSignature =
            x === 0 ||
            (prev.timeSignature.beatValue !== measure.timeSignature.beatValue &&
              prev.timeSignature.numBeats !== measure.timeSignature.numBeats);
          return (
            <Measure
              key={mindex}
              context={context}
              id={measureID(mindex)}
              onNoteClick={onNoteClick}
              onMeasureClick={onMeasureClick}
              m={m}
              vfVoices={voiceIDToVFVoice}
              clef={showClef}
              timeSignature={showTimeSignature}
              measure={measure}
              width={measureWidth}
              x={x}
              y={y}
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

const mapDispatchToProps = dispatch => ({
  loadNote: note => dispatch(loadNote(note)),
  removeNote: ({ id }) => dispatch(removeNote({ id })),
});

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Score);
