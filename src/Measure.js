import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { makeGetVoicesForMeasure } from './selectors/score';
import { noteID } from './actions/score';

class Measure extends PureComponent {
  constructor(props) {
    super(props);
    this.group = null;
  }

  render() {
    const { context, onNoteClick, notes, m, vfVoices } = this.props;

    if (!context) {
      return <div />;
    }

    if (this.group) {
      context.svg.removeChild(this.group);
    }
    this.group = context.openGroup();

    m.setContext(context).draw();

    Object.keys(vfVoices).forEach(id => {
      const voice = vfVoices[id];
      voice.draw(context, m);

      voice.tickables.forEach((t, i) => {
        t.attrs.el.onclick = () => {
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
  notes: PropTypes.arrayOf(PropTypes.shape()),
};

const makeMapStateToProps = () => {
  const getVoicesForMeasure = makeGetVoicesForMeasure();
  return (state, props) => ({
    voices: getVoicesForMeasure(state, props),
    notes: state.score.notes,
  });
};

export default connect(makeMapStateToProps)(Measure);
