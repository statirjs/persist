import { createForme } from '@statirjs/core';
import * as S from '../typing/internal';

export const PERSIST_FORME = 'persist';

export const PERSIST_ACTION = 'init';

const state: S.PersistState = {
  isPersisting: false,
  status: S.PERSIST_STATUS.UNPERSISTED
};

export function createPersistForme(name: string, storage: S.WrappedStorage) {
  return createForme(state, () => ({
    pipes: {
      [PERSIST_ACTION]: {
        push(state) {
          return {
            ...state,
            isPersisting: true,
            status: S.PERSIST_STATUS.UNPERSISTED
          };
        },
        async core(): Promise<S.Item> {
          const data = await storage.getItem(name);
          return data || {};
        },
        done(state, _: never, data: S.Item): S.PersistDoneState {
          return {
            ...state,
            data,
            isPersisting: false,
            status: S.PERSIST_STATUS.PERSISTED
          };
        },
        fail(state) {
          return {
            ...state,
            isPersisting: false,
            status: S.PERSIST_STATUS.ERROR
          };
        }
      }
    }
  }));
}
