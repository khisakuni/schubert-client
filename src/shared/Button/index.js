import React from 'react';

const Button = ({ submit = false, onClick, value }) =>
  submit ? (
    <input type="submit" value={value} />
  ) : (
    <button onClick={onClick}>{value}</button>
  );

export default Button;
