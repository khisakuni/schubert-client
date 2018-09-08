import { API_LOAD } from '../actions/api';

const initialState = {};
const reducer = (state = initialState, { type, data, error, endpoint }) => {
  switch (type) {
    case API_LOAD:
      return {
        ...state,
        [endpoint]:
          data || error ? { data, error, loading: false } : { loading: true },
      };
    default:
      return state;
  }
};

export default reducer;
