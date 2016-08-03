import _ from 'lodash';
import createAction from 'redux-actions/lib/createAction';

const defaultActionStatusTypes = {
  default: (type) => type,
};

export const createMultiTypeGetter = (actionStatusTypes = defaultActionStatusTypes) =>
  (type) =>
    _.reduce(actionStatusTypes, (typeGetter, typeWrapper, status) => {
      if (status === 'default') {
        return _.assign(typeGetter, {
          toString: () => typeWrapper(type),
        });
      }
      return _.assign(typeGetter, {
        [status]: {
          toString: () => typeWrapper(type),
        },
      });
    }, {});

const createActionCreator = (actionStatusWrappers) =>
  (actionType, payloadCreator, metaCreator) =>
    _.assign(
      createAction(actionType, payloadCreator, metaCreator),
      createMultiTypeGetter(actionStatusWrappers)(actionType)
    );

export default createActionCreator;
