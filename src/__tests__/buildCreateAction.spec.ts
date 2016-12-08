import { test } from "ava";

import buildCreateAction, {
  createMultiTypeGetter,
} from "../buildCreateAction";
import ActionMeta = ReduxActions.ActionMeta;

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

test("should return multiple type getters by type wrappers", (t) => {
  const fn = () => ({});

  const typeGetter = createMultiTypeGetter<typeof fn, ITypeWrappers>(fn, typeWrappers)("ACTION_TYPE");

  t.is(typeGetter.toString(), "ACTION_TYPE");
  t.is(typeGetter.success.toString(), "ACTION_TYPE_SUCCESS");
  t.is(typeGetter.failed.toString(), "ACTION_TYPE_FAILED");
});

test("should get workable createAction ", (t) => {
  const createMultiAction = buildCreateAction<ITypeWrappers, any, any>(typeWrappers);

  const someAction = createMultiAction("ACTION_TYPE");

  t.is(someAction.toString(), "ACTION_TYPE");
  t.is(someAction.success.toString(), "ACTION_TYPE_SUCCESS");
  t.is(someAction.failed.toString(), "ACTION_TYPE_FAILED");
});

test("should get workable createAction with payload creator", (t) => {
  type TRequestCreator = (data: Object) => Object;

  const createMultiAction = buildCreateAction<ITypeWrappers, any, any>(typeWrappers);

  const createRequestAction = (actionType: string, requestCreator: TRequestCreator) =>
    createMultiAction(actionType, (data) => ({
      request: requestCreator(data),
    }));

  const someRequest = createRequestAction("ACTION_TYPE", (data) => ({ url: "/test", data }));

  t.deepEqual(
    someRequest({
      key: "key",
    }),
    {
      type: "ACTION_TYPE",
      payload: {
        request: {
          url: "/test",
          data: {
            key: "key",
          },
        },
      },
    } as ActionMeta<any, any>,
  );
});
