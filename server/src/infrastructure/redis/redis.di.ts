export const REDIS_SERVICE = Symbol("REDIS_SERVICE");

export interface redisServiceAuthInterface {
  setValue(
    prefix: string,
    key: string,
    value: any,
    ttl?: number,
  ): Promise<void>;
  valueIsExist(prefix: string, key: string): Promise<any>;
}

export interface redisServiceInviteInterface {
  setHashCounterValue(
    prefix: string,
    key: string,
    payloadName: string,
    payloadValue: any,
    counterName: string,
    counterValue: number,
    ttl?: number,
  ): Promise<boolean>;
  getHashValueWithDecrementing(
    prefix: string,
    key: string,
    counterName: string,
    payloadName: string,
  ): Promise<any>;
}
