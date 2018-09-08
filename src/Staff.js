import React, { PureComponent } from 'react';
import Vex from 'vexflow';
import { connect } from 'react-redux';

import Measure from './Measure';
import { measureID } from './actions/score';
import { makeGetMeasuresForStaff } from './selectors/score';

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
      const measureWidth = width / measures.length;
      const x = measureIndex * measureWidth;
      const y = height * index;
      return (
        <Measure
          key={measureIndex}
          width={measureWidth}
          x={x}
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
  return (state, props) => {
    return {
      measures: getMeasuresForStaff(state, props),
    };
  };
};

export default connect(makeMapStateToProps)(Staff);
