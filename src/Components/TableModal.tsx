import React from 'react';
import Popup from 'reactjs-popup';

export default () => (
    <Popup trigger={<input type="button" value="Open"/>} modal>
    <span style={{backgroundColor: 'black'}}> Modal content </span>
  </Popup>
);