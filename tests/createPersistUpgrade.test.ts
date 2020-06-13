import { initStore, createForme, Store } from '@statirjs/core';
import { createPersistUpgrade } from '../src/upgrade/creator';
import { createPersistForme } from '../src/forme/persist';
import { wrapStorage } from '../src/storage/creator';
import * as S from '../src/typing/internal';

describe('Test createPersistUpgrade', () => {
  test('invalid data', () => {
    const config = {} as S.Config;

    expect(() => createPersistUpgrade(config)).toThrow();

    expect(() => createPersistUpgrade(null as any)).toThrow();
  });

  test('forme inject', () => {
    const name = 'persist';

    const database: Record<string, string> = {};

    const storage = {
      async getItem(key: string) {
        return database[key];
      }
    } as S.Storage;

    const counter = createForme(
      {
        count: 0
      },
      () => ({
        actions: {
          increment(state) {
            return {
              ...state,
              count: state.count + 1
            };
          }
        }
      })
    );

    const persist = createPersistUpgrade({
      name,
      storage
    });

    const store = initStore({
      formes: {
        counter
      },
      upgrades: [persist]
    });

    expect(store.state).toEqual({
      counter: {
        count: 0
      },
      persist: {
        isPersisting: false,
        status: S.PERSIST_STATUS.UNPERSISTED
      }
    });
  });

  test('listner inject (setting to storage)', () => {
    const name = 'persist';

    const database: Record<string, string> = {};

    const storage = {
      async getItem(key: string) {
        return database[key];
      },
      async setItem(key: string, value: string) {
        database[key] = value;
      }
    } as S.Storage;

    const counter = createForme(
      {
        count: 0
      },
      () => ({
        actions: {
          increment(state) {
            return {
              ...state,
              count: state.count + 1
            };
          }
        }
      })
    );

    const persist = createPersistUpgrade({
      name,
      storage
    });

    const store = initStore({
      formes: {
        counter
      },
      upgrades: [persist]
    });

    store.dispatch.counter.increment();

    expect(store.state).toEqual({
      counter: {
        count: 1
      },
      persist: {
        isPersisting: false,
        status: S.PERSIST_STATUS.UNPERSISTED
      }
    });

    expect(database).toEqual({
      [name]: JSON.stringify({
        counter: {
          count: 1
        }
      })
    });
  });

  test('forme inject (restoring to rootState)', async () => {
    const database: Record<string, string> = {};

    const storage = {
      async getItem(key: string) {
        return database[key];
      },
      async setItem(key: string, value: string) {
        database[key] = value;
      }
    } as S.Storage;

    const counter = createForme(
      {
        count: 0
      },
      () => ({
        actions: {
          increment(state) {
            return {
              ...state,
              count: state.count + 1
            };
          }
        }
      })
    );

    const persist = createPersistUpgrade({
      storage
    });

    const wrapperStorage = wrapStorage(storage);

    const persistForme = createPersistForme('STATIRJS_PERSIST', wrapperStorage);

    const formes = {
      counter,
      persist: persistForme
    };

    type Formes = typeof formes;

    const store = initStore({
      formes: {
        counter
      },
      upgrades: [persist]
    }) as Store<Formes>;

    store.dispatch.counter.increment();

    store.dispatch.counter.increment();

    await store.dispatch.persist.init();

    expect(store.state).toEqual({
      counter: {
        count: 2
      },
      persist: {
        isPersisting: false,
        status: S.PERSIST_STATUS.PERSISTED
      }
    });

    expect(database).toEqual({
      'STATIRJS_PERSIST': JSON.stringify({
        counter: {
          count: 2
        }
      })
    });
  });

  test('persist filtring', async () => {
    const database: Record<string, string> = {};

    const storage = {
      async getItem(key: string) {
        return database[key];
      },
      async setItem(key: string, value: string) {
        database[key] = value;
      }
    } as S.Storage;

    const counter1 = createForme(
      {
        count: 0
      },
      () => ({
        actions: {
          increment(state) {
            return {
              ...state,
              count: state.count + 1
            };
          }
        }
      })
    );

    const counter2 = createForme(
      {
        count: 0
      },
      () => ({
        actions: {
          increment(state) {
            return {
              ...state,
              count: state.count + 1
            };
          }
        }
      })
    );

    const counter3 = createForme(
      {
        count: 0
      },
      () => ({
        actions: {
          increment(state) {
            return {
              ...state,
              count: state.count + 1
            };
          }
        }
      })
    );

    const persist = createPersistUpgrade({
      storage,
      whitelist: ['counter1', 'counter2'],
      blacklist: ['counter1']
    });

    const store = initStore({
      formes: {
        counter1,
        counter2,
        counter3
      },
      upgrades: [persist]
    });

    store.dispatch.counter1.increment();

    store.dispatch.counter2.increment();

    store.dispatch.counter3.increment();

    expect(store.state).toEqual({
      counter1: {
        count: 1
      },
      counter2: {
        count: 1
      },
      counter3: {
        count: 1
      },
      persist: {
        isPersisting: false,
        status: S.PERSIST_STATUS.UNPERSISTED
      }
    });

    expect(database).toEqual({
      'STATIRJS_PERSIST': JSON.stringify({
        counter2: {
          count: 1
        }
      })
    });
  });
});
