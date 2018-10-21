import React, { PureComponent } from 'react';
import Vex from 'vexflow';
import { connect } from 'react-redux';

import Measure from './Measure';
import { measureID } from './actions/score';
import { makeGetVoicesForMeasure } from './selectors/score';

const voicesFromMeasure = measure => {
  const voiceIDToVFVoice = {};
  const vfVoices = measure.voices.map(voice => {
    const v = new Vex.Flow.Voice({
      clef: 'treble',
      num_beats: voice.numBeats,
      beat_value: voice.beatValue,
    });
    voiceIDToVFVoice[voice.id] = v;

    const vfNotes = voice.notes.sort((a, b) => a.index - b.index).map(note => {
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

class Score extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = { context: null };
  }

  componentDidMount() {
    const { height, width } = this.props;

    console.log('>>>', this.ref.current);

    const renderer = new Vex.Flow.Renderer(
      this.ref.current,
      Vex.Flow.Renderer.Backends.SVG
    );
    renderer.resize(width, height);
    const context = renderer.getContext();
    const { svg } = context;
    svg.style.pointerEvents = 'bounding-box';
    /* eslint-disable */
    this.setState({ context });
    /* eslint-enable */
  }

  render() {
    const { measures, height, index, width, onNoteClick, id } = this.props;
    const { context } = this.state;

    if (!context) {
      return <div />;
    }

    let rowWidth = 0;
    const measureHeight = 80;
    let staffCount = 1;
    console.log('measures >>>>', measures);
    return (
      <div ref={this.ref}>
        {measures.map((measure, measureIndex) => {
          let measureWidth = width / measures.length;
          let x = rowWidth;
          let y = measureHeight * staffCount;
          let m = new Vex.Flow.Stave(x, y, measureWidth);

          const startX = m.getNoteStartX();

          let voiceIDToVFVoice = voicesFromMeasure(measure);
          let vfVoices = Object.values(voiceIDToVFVoice);

          const formatter = new Vex.Flow.Formatter()
            .joinVoices(vfVoices)
            .formatToStave(vfVoices, m);
          const minWidth = formatter.getMinTotalWidth();

          if (minWidth > measureWidth) {
            measureWidth = minWidth;
            voiceIDToVFVoice = voicesFromMeasure(measure);
            vfVoices = Object.values(voiceIDToVFVoice);
            m = new Vex.Flow.Stave(x, y, measureWidth);
            new Vex.Flow.Formatter()
              .joinVoices(vfVoices)
              .formatToStave(vfVoices, m);
          }

          rowWidth += measureWidth;

          if (rowWidth > width) {
            staffCount++;
            y = measureHeight * staffCount;
            x = 0;

            m = new Vex.Flow.Stave(x, y, measureWidth);
            formatter.formatToStave(vfVoices, m);
            rowWidth = measureWidth;
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
        })}
      </div>
    );
  }
}

//const mapStateToProps = ({ score: {measures} }) => ;
const makeMapStateToProps = () => {
  const getVoicesForMeasure = makeGetVoicesForMeasure();
  return (state, props) => {
    console.log('state ..', Object.values(state.score.measures));
    return {
      measures: Object.values(state.score.measures).map(measure => ({
        ...measure,
        voices: getVoicesForMeasure(state, measure), // This is here so we can get updated values.
      })),
    };
  };
};

export default connect(makeMapStateToProps)(Score);
