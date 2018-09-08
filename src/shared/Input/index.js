import React from 'react';

const Input = ({ name, onChange, type = 'text', value }) => {
  return (
    <React.Fragment>
      <label htmlFor={name}>{name}</label>
      <input id={name} type={type} value={value} onChange={onChange} />
    </React.Fragment>
  );
};

export default Input;
