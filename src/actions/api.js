import axios from 'axios';

export const API_LOAD = 'API_LOAD';

export const post = (endpoint, body = {}) => dispatch => {
  return axios
    .post(endpoint, body)
    .then(data => dispatch(load({ endpoint, data })))
    .catch(err => dispatch(load({ endpoint, error: err })));
};

export const load = ({ endpoint, data, error }) => ({
  type: API_LOAD,
  endpoint,
  data,
  error,
});
