export const REDIS_SERVICE = Symbol("REDIS_SERVICE");

export interface redisServiceInterface {
  setValue(
    prefix: string,
    key: string,
    value: any,
    ttl?: number,
  ): Promise<void>;
  getValue(prefix: string, key: string): Promise<any>;
  valueIsExist(prefix: string, key: string): Promise<any>;
}
