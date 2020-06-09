import {
  Config,
  Update,
  Store,
  Upgrade,
  Listener,
  RootState,
  CreateStore,
  UpdateState,
  Middleware,
  INITER_FORME,
  INITER_ACTION
} from '@statirjs/core';
import { persistForme, PERSIST_FORME } from '../formes/persist';
import { wrapStorage, createExtractor } from '../storage/creator';
import * as S from '../typing/internal';

const NAME = 'STATIRJS_PERSIST';

export function createListner(
  name: string,
  storage: S.ConfigStorage,
  extractor: S.Extractor
): Listener {
  return function (rootState: RootState) {
    const item = extractor(rootState);
    storage.setItem(name, item);
  };
}

export async function initPersist(
  name: string,
  storage: S.ConfigStorage,
  next: UpdateState,
  update: Update
) {
  const persistedState = await storage.getItem(name);

  const nextRootState = {
    ...update.rootState,
    ...persistedState
  };

  const nextUpdate = {
    ...update,
    rootState: nextRootState
  };

  next(nextUpdate);
}

export function createPersistMiddleware(
  name: string,
  storage: S.ConfigStorage
): Middleware {
  const actionName = `${INITER_FORME}/${INITER_ACTION}`;

  return function (next: UpdateState): UpdateState {
    return function (update: Update) {
      if (update.actionName === actionName) {
        initPersist(name, storage, next, update);
      }

      next(update);
    };
  };
}

export function mergeConfig(config: Config, middleware: Middleware): Config {
  const middlewares = config.middlewares || [];

  return {
    ...config,
    middlewares: [...middlewares, middleware],
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
  const middleware = createPersistMiddleware(name, wrappedStorage);

  return function (next: CreateStore): CreateStore {
    return function (config: Config): Store {
      const nextConfig = mergeConfig(config, middleware);
      const store = next(nextConfig);
      store.subscribe(listner);
      return store;
    };
  };
}
