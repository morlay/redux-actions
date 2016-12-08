import buildCreateAction from "./buildCreateAction";

const createAction = <Payload, Meta>(actionType: string,
                                     payloadCreator?: (...args: any[]) => Payload,
                                     metaCreator?: (...args: any[]) => Meta) =>
  buildCreateAction<any, Payload, Meta>({})(actionType, payloadCreator, metaCreator);

export default createAction;
