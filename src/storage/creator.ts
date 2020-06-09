import { RootState } from '@statirjs/core';
import * as S from '../typing/internal';

const UTILITY_ACC = {};

export function wrapStorage(storage: S.Storage): S.ConfigStorage {
  return {
    async getItem(key) {
      const data = await storage.getItem(key);
      return JSON.parse(data);
    },
    async setItem(key, item) {
      const data = JSON.stringify(item);
      await storage.setItem(key, data);
    },
    async removeItem(key) {
      return await storage.removeItem(key);
    }
  };
}

export function extractWhitekeys(whitelist: string[], keys: string[]) {
  return whitelist.length
    ? keys.filter((key) => whitelist.includes(key))
    : keys;
}

export function extractBlackkeys(blacklist: string[], keys: string[]) {
  return blacklist.length
    ? keys.filter((key) => !blacklist.includes(key))
    : keys;
}

export function mergeItem(keys: string[], rootState: RootState): S.Item {
  return keys
    .map((key) => rootState[key])
    .reduce(
      (acc, next) => ({
        ...acc,
        ...next
      }),
      UTILITY_ACC
    );
}

export function createExtractor(whitelist: string[], blacklist: string[]) {
  return function (rootState: RootState): S.Item {
    const keys = Object.keys(rootState);
    const whitefull = extractWhitekeys(whitelist, keys);
    const blackfull = extractBlackkeys(blacklist, whitefull);
    return mergeItem(blackfull, rootState);
  };
}
