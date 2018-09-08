import thunk from 'redux-thunk';
import { applyMiddleware, createStore, compose } from 'redux';
import reducer from '../reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [thunk];

export default () => {
  const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middleware))
  );
  return store;
};
