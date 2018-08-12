import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import Sheet from './Sheet';

class Score extends PureComponent {

  render() {
    const {sheets, onNoteClick, staves} = this.props;
    return (
      <div>
        {Object.keys(sheets).map((sheetID) => <Sheet {...sheets[sheetID]} key={sheetID} onNoteClick={onNoteClick} id={sheetID} />)}
      </div>
    );
  }
}

const mapStateToProps = ({score}) => score;

export default connect(mapStateToProps)(Score);
