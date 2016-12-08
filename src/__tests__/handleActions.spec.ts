import { test } from "ava";

import handleActions, {
  ActionMeta,
} from "../handleActions";

import createAction from "../createAction";
import buildCreateAction from "../buildCreateAction";

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

type TCounterPayload = number;

test("reducer should change state correct", (t) => {
  const increment = createAction<number, any>("increment");
  const DECREMENT = "DECREMENT";

  const reducer = handleActions<ICounter, TCounterPayload, any>({
    [increment]: ({ counter }, amount) => ({
      counter: counter + amount,
    }),
    [DECREMENT]: ({ counter }, amount) => ({
      counter: counter - amount,
    }),
  }, { counter: 0 });

  t.deepEqual(reducer({ counter: 3 }, increment(7)), { counter: 10 });
  t.deepEqual(reducer({ counter: 10 }, { type: DECREMENT, payload: 7 }), { counter: 3 });
});

test("reducer should change state correct", (t) => {
  const dispatchSuccess = <Payload, Meta>(action: ActionMeta<Payload, Meta>) => ({
    ...action,
    type: `${action.type}_SUCCESS`,
  });

  const createMultiAction = buildCreateAction<ITypeWrappers, number, any>(typeWrappers);

  const increment = createMultiAction("increment");

  const reducer = handleActions<ICounter, TCounterPayload, any>({
    [`${increment.success}`]: ({ counter }, amount) => ({
      counter: counter + amount,
    }),
  }, { counter: 0 });

  t.deepEqual(
    reducer({ counter: 3 }, increment(3)),
    { counter: 3 },
  );

  t.deepEqual(
    reducer({ counter: 3 }, dispatchSuccess(increment(3))),
    { counter: 6 },
  );
});
