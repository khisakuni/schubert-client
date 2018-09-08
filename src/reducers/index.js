import { combineReducers } from 'redux';
import api from './api';
import score from './score';

const rootReducer = combineReducers({
  api,
  score,
});

export default rootReducer;
