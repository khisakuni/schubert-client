import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Vex from 'vexflow';
import { connect } from 'react-redux';

import Staff from './Staff';
import { staffID } from './actions/score';
import { makeGetStavesForSheet } from './selectors/score';

class Sheet extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = { context: null };
  }

  componentDidMount() {
    const { height, width } = this.props;

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
    const { staves, height, width, onNoteClick, id } = this.props;

    return (
      <div ref={this.ref}>
        {Object.keys(staves).map((staff, index) => (
          <Staff
            key={staffID(id, index)}
            id={staffID(id, index)}
            context={this.state.context}
            index={index}
            height={height}
            width={width}
            onNoteClick={onNoteClick}
            {...staff}
          />
        ))}
      </div>
    );
  }
}

Sheet.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  staves: PropTypes.arrayOf(PropTypes.shape()),
  onNoteClick: PropTypes.func,
  id: PropTypes.string,
};

Sheet.defaultProps = {
  height: 0,
  width: 0,
  staves: [],
  onNoteClick: () => {},
  id: '',
};

const makeMapStateToProps = () => {
  const getStavesForSheet = makeGetStavesForSheet();
  return (state, props) => ({ staves: getStavesForSheet(state, props) });
};

export default connect(makeMapStateToProps)(Sheet);
