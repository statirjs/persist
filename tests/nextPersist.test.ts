import { Update } from '@statirjs/core';
import { nextPersist } from '../src/middleware/creator';
import * as S from '../src/typing/internal';

describe('Test nextPersist', () => {
  test('empty data', () => {
    const next = jest.fn<void, Update<S.PersistState>[]>();

    const update: Update<S.PersistDoneState> = {
      actionName: 'init:done',
      formeName: 'persist',
      state: {
        isPersisting: false,
        status: S.PERSIST_STATUS.PERSISTED,
        data: {}
      },
      rootState: {
        key1: {
          value: 0
        }
      }
    };

    nextPersist(update, next);

    expect(next.mock.calls.length).toEqual(1);

    expect(next.mock.calls[0][0]).toEqual({
      actionName: 'init:done',
      formeName: 'persist',
      state: {
        isPersisting: false,
        status: S.PERSIST_STATUS.PERSISTED
      },
      rootState: {
        key1: {
          value: 0
        }
      }
    });
  });

  test('done pipe step', () => {
    const next = jest.fn<void, Update<S.PersistState>[]>();

    const update: Update<S.PersistDoneState> = {
      actionName: 'init:done',
      formeName: 'persist',
      state: {
        isPersisting: false,
        status: S.PERSIST_STATUS.PERSISTED,
        data: {
          key1: {
            value: 1
          },
          key2: {
            value: 2
          }
        }
      },
      rootState: {
        key1: {
          value: 0
        },
        key2: {
          value: 0
        },
        key3: {
          value: 0
        }
      }
    };

    nextPersist(update, next);

    expect(next.mock.calls.length).toEqual(1);

    expect(next.mock.calls[0][0]).toEqual({
      actionName: 'init:done',
      formeName: 'persist',
      state: {
        isPersisting: false,
        status: S.PERSIST_STATUS.PERSISTED
      },
      rootState: {
        key1: {
          value: 1
        },
        key2: {
          value: 2
        },
        key3: {
          value: 0
        }
      }
    });
  });
});
