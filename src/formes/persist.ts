import { createForme } from '@statirjs/core';
import * as S from '../typing/internal';

export const PERSIST_FORME = 'persist';

export const PERSIST_ACTION = 'init';

const state: S.PersistState = {
  isPersisting: false,
  status: S.PERSIST_STATUS.UNPERSISTED
};

export const persistForme = createForme(state, () => ({
  pipes: {
    init: {
      push(state) {
        return {
          ...state,
          isPersisting: true,
          status: S.PERSIST_STATUS.UNPERSISTED
        };
      },
      done(state) {
        return {
          ...state,
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
