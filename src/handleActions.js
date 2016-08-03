import _ from 'lodash';
import originHandleActions from 'redux-actions/lib/handleActions';

const handleActions = (handlers, initialState) => {
  const finalHandlers = _.mapValues(handlers,
    (handler) => (state, { payload, meta }) => handler(state, payload, meta)
  );

  return originHandleActions(finalHandlers, initialState);
};

export default handleActions;
