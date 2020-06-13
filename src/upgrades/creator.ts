import {
  Config,
  Store,
  Upgrade,
  Listener,
  RootState,
  CreateStore
} from '@statirjs/core';
import { wrapStorage, createExtractor } from '../storage/creator';
import { persistForme, PERSIST_FORME } from '../formes/persist';
import * as S from '../typing/internal';

const NAME = 'STATIRJS_PERSIST';

export function createListner(
  name: string,
  storage: S.ConfigStorage,
  extractor: S.Extractor
): Listener {
  return async function (rootState: RootState) {
    const item = extractor(rootState);
    await storage.setItem(name, item);
  };
}

export function mergeForme(config: Config): Config {
  return {
    ...config,
    formes: {
      ...config.formes,
      [PERSIST_FORME]: persistForme
    }
  };
}

export function createPersistUpgrade(config: S.Config): Upgrade {
  const { name = NAME, storage, whitelist = [], blacklist = [] } = config;

  const wrappedStorage = wrapStorage(storage);
  const extractor = createExtractor(whitelist, blacklist);
  const listner = createListner(name, wrappedStorage, extractor);

  return function (next: CreateStore): CreateStore {
    return function (config: Config): Store {
      const nextConfig = mergeForme(config);
      const store = next(nextConfig);
      store.subscribe(listner);
      return store;
    };
  };
}
