import {
  Config,
  Store,
  Upgrade,
  Listener,
  RootState,
  CreateStore,
  ReFormeBuilder
} from '@statirjs/core';
import { wrapStorage, createExtractor } from '../storage/creator';
import { createPersistForme, PERSIST_FORME } from '../forme/persist';
import { persistMiddleware } from '../middleware/creator';
import { warning } from '../utils/warning';
import * as S from '../typing/internal';

const NAME = 'STATIRJS_PERSIST';

export function createListner(
  name: string,
  storage: S.WrappedStorage,
  extractor: S.Extractor
): Listener {
  return async function (rootState: RootState) {
    const item = extractor(rootState);
    await storage.setItem(name, item);
  };
}

export function mergeConfig(config: Config, forme: ReFormeBuilder): Config {
  const middlewares = [...(config.middlewares || []), persistMiddleware];

  const formes = {
    ...config.formes,
    [PERSIST_FORME]: forme
  };

  return {
    ...config,
    formes,
    middlewares
  };
}

export function createPersistUpgrade(config: S.Config): Upgrade {
  const { name = NAME, storage, whitelist = [], blacklist = [] } = config;

  warning([[typeof storage !== 'object', 'Storage must be a object']]);

  const wrappedStorage = wrapStorage(storage);
  const extractor = createExtractor(whitelist, blacklist);
  const listner = createListner(name, wrappedStorage, extractor);
  const forme = createPersistForme(name, wrappedStorage);

  return function (next: CreateStore): CreateStore {
    return function (config: Config): Store {
      const nextConfig = mergeConfig(config, forme);
      const store = next(nextConfig);
      store.subscribe(listner);
      return store;
    };
  };
}
