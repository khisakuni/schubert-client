import React from 'react';
import Vex from 'vexflow';

class Context extends React.PureComponent {
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
    this.setState({ context });
  }

  render() {
    const { component: Component } = this.props;
    const { context } = this.state;
    return (
      <div ref={this.ref}>
        {context && <Component context={context} {...this.props} />}
      </div>
    );
  }
}

export default Context;
