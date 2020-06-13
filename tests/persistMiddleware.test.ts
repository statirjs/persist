import { Update } from '@statirjs/core';
import { persistMiddleware } from '../src/middleware/creator';
import * as S from '../src/typing/internal';

describe('Test persistMiddleware.test', () => {
  test('non target forme', () => {
    const next = jest.fn<void, Update[]>();

    const update: Update = {
      actionName: 'increment',
      formeName: 'counter',
      state: {
        count: 2
      },
      rootState: {
        counter: {
          count: 1
        }
      }
    };

    persistMiddleware(next)(update);

    expect(next.mock.calls.length).toEqual(1);

    expect(next.mock.calls[0][0]).toEqual({
      actionName: 'increment',
      formeName: 'counter',
      state: {
        count: 2
      },
      rootState: {
        counter: {
          count: 1
        }
      }
    });
  });

  test('push pipe step', () => {
    const next = jest.fn<void, Update<S.PersistState>[]>();

    const update: Update<S.PersistState> = {
      actionName: 'init:push',
      formeName: 'persist',
      state: {
        isPersisting: false,
        status: S.PERSIST_STATUS.UNPERSISTED
      },
      rootState: {
        key1: {
          value: 0
        }
      }
    };

    persistMiddleware(next)(update);

    expect(next.mock.calls.length).toEqual(1);

    expect(next.mock.calls[0][0]).toEqual({
      actionName: 'init:push',
      formeName: 'persist',
      disable: true,
      state: {
        isPersisting: false,
        status: S.PERSIST_STATUS.UNPERSISTED
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

    persistMiddleware(next)(update);

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
