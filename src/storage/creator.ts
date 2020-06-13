import { RootState } from '@statirjs/core';
import { PERSIST_FORME } from '../forme/persist';
import * as S from '../typing/internal';

const UTILITY_ACC = {};

export function wrapStorage(storage: S.Storage): S.WrappedStorage {
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
  function mapKeys(key: string) {
    return { [key]: rootState[key] };
  }

  function reduceItem(acc: RootState, next: S.Item) {
    return { ...acc, ...next };
  }

  return keys.map(mapKeys).reduce(reduceItem, UTILITY_ACC);
}

export function createExtractor(whitelist: string[], blacklist: string[]) {
  function includes(keys: string[]) {
    return function (key: string) {
      return keys.includes(key);
    };
  }

  return function (rootState: RootState): S.Item {
    const keys = Object.keys(rootState);
    const validWhitelist = whitelist.filter(includes(keys));
    const validBlacklist = [...blacklist.filter(includes(keys)), PERSIST_FORME];
    const whitefull = extractWhitekeys(validWhitelist, keys);
    const blackfull = extractBlackkeys(validBlacklist, whitefull);
    return mergeItem(blackfull, rootState);
  };
}
