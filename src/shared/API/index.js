import React from 'react';
import { connect } from 'react-redux';

const APIContent = ({ data, component: Component, loading, ...props }) => {
  if (loading) {
    return <div>Loading...</div>;
  }
  return <Component data={data} {...props} />;
};

const mapStateToProps = ({ api }, { endpoint }) => api[endpoint] || {};

const APIContainer = connect(mapStateToProps)(APIContent);

const API = props => <APIContainer {...props} />;

export default API;
