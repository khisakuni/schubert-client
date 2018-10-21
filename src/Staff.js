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

    let rowWidth = 0;
    const measureHeight = 80;
    let staffCount = 1;
    return measures.map((measure, measureIndex) => {
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
