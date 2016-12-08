import * as _ from "lodash";

import {
  handleActions,
  ReducerMap,
  ActionMeta,
} from "redux-actions";

export {
  ActionMeta
}

export interface IFlattenReducer<State, Payload, Meta> {
  (state: State, payload: Payload, meta: Meta, error: boolean): State;
}

export type ActionType = string;

export interface IFlattenReducerMap<State, Payload, Meta> {
  [actionType: string]: IFlattenReducer<State, Payload, Meta>;
}

export default <State, Payload, Meta>(handlers: IFlattenReducerMap<State, Payload, Meta>,
                                      initialState?: State) => {
  const finalHandlers = _.reduce(
    handlers,
    (preHandlers, handler: IFlattenReducer<State, Payload, Meta>, actionType: ActionType) => {
      return _.assign(preHandlers, {
        [String(actionType)]: (state: State, { payload, meta, error }: ActionMeta<Payload, Meta>) => handler(state, payload, meta, error),
      });
    },
    {} as ReducerMap<State, Payload>,
  );

  return handleActions<State, Payload>(finalHandlers, initialState);
};
