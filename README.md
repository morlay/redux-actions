# redux actions

Enhancement for `redux-actions`

[![Build Status](https://img.shields.io/travis/morlay/redux-actions.svg?style=flat-square)](https://travis-ci.org/morlay/redux-actions)
[![NPM](https://img.shields.io/npm/v/@morlay/redux-actions.svg?style=flat-square)](https://npmjs.org/package/@morlay/redux-actions)
[![Dependencies](https://img.shields.io/david/morlay/redux-actions.svg?style=flat-square)](https://david-dm.org/morlay/redux-actions)

## APIs

### `createAction(type, payloadCreator = Identity, ?metaCreator)`

Usage like [`redux-actions#createAction`](https://github.com/acdlite/redux-actions#createactiontype-payloadcreator--identity-metacreator)
but will overwrite `.toString()` to the actionCreator, 
`toString()` will return actionType

### `handleActions(reducerMap, ?defaultState)`

Usage like [`redux-actions#handleActions`](https://github.com/acdlite/redux-actions#handleactionsreducermap-defaultstate),
but callback of handler will be `(state, payload, meta) => ()` instead of `(state, action)`

### `buildCreateAction(actionStatusTypes): createAction`

for build multiple status action creator


## Examples

```js
import {
  buildCreateAction,
  createAction,
  handleActions,
} from '@morlay/redux-actions';

const createMultiAction = buildCreateAction({
    success: (type) => `${type}_SUCCESS`,
    failed: (type) => `${type}_FAILED`,
});

const syncAction = createAction('syncAction');
const asyncAction = createMultiAction('asyncAction');

const reducer = handleActions({
    [syncAction]: ({ counter }, payload) => ({
        counter: payload,
    }),
    [asyncAction.success]: ({ counter }, payload) => ({
        counter: counter + payload,
    }),
});
```
