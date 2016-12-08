import * as _ from "lodash";

import {
  createAction,
  ActionMeta,
} from "redux-actions";

export {
  createAction,
  ActionMeta,
};

export type TTypeWrapper = (type: string) => string;

export interface IActionStatusTypes {
  [key: string]: TTypeWrapper;
}

export const createMultiTypeGetter = <TInner, TOutter>(actionCreator: TInner, actionStatusTypes: IActionStatusTypes) =>
  (type: string): TInner & TOutter =>
    _.reduce(actionStatusTypes, (typeGetter, typeWrapper: TTypeWrapper, status: string) => {
      return _.assign(typeGetter, {
        [status]: {
          toString: () => typeWrapper(type),
        },
      });
    }, _.assign(actionCreator, {
      toString: () => type,
    }) as TInner & TOutter);

function buildCreateAction<StatusTypes, Payload, Meta>(actionStatusWrappers: IActionStatusTypes) {
  return (actionType: string,
          payloadCreator?: (...args: any[]) => Payload,
          metaCreator?: (...args: any[]) => Meta) => {

    const actionCreator = createAction<Payload, Meta>(actionType, payloadCreator, metaCreator);

    return createMultiTypeGetter<typeof actionCreator, StatusTypes>(actionCreator, actionStatusWrappers)(actionType);
  };
}

export default buildCreateAction;
