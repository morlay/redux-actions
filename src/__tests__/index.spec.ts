import {
  test,
} from "ava";

import {
  buildCreateAction,
  createAction,
  handleActions,
  ActionMeta,
} from "../index";

interface ICounter {
  counter: number;
}

interface ITypeWrappers {
  success: {
    toString(): string;
  };
  failed: {
    toString(): string;
  };
  toString(): string;
}

const typeWrappers = {
  success: (type: string): string => `${type}_SUCCESS`,
  failed: (type: string): string => `${type}_FAILED`,
};

const dispatchSuccess = <Payload, Meta>(action: ActionMeta<Payload, Meta>) => ({
  ...action,
  type: `${action.type}_SUCCESS`,
});

test("reducer should change state correct", (t) => {
  const createMultiAction = buildCreateAction<ITypeWrappers, number, any>(typeWrappers);

  const syncAction = createAction("syncAction");
  const asyncAction = createMultiAction("asyncAction");

  const reducer = handleActions<ICounter, number, any>({
    [syncAction]: ({ counter }, payload) => ({
      counter: payload,
    }),
    [`${asyncAction.success}`]: ({ counter }, payload) => ({
      counter: counter + payload,
    }),
  }, { counter: 0 });

  t.deepEqual(
    reducer({ counter: 3 }, dispatchSuccess(asyncAction(3))),
    { counter: 6 },
  );

  t.deepEqual(
    reducer({ counter: 3 }, syncAction(4)),
    { counter: 4 },
  );
});
