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
          isPersisting: true
        };
      },
      done(state) {
        return {
          ...state,
          status: S.PERSIST_STATUS.PERSISTED,
          isPersisting: false
        };
      },
      fail(state) {
        return {
          ...state,
          status: S.PERSIST_STATUS.ERROR,
          isPersisting: false
        };
      }
    }
  }
}));
