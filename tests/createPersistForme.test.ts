import { initStore, RootState } from '@statirjs/core';
import { createPersistForme } from '../src/forme/persist';
import { wrapStorage } from '../src/storage/creator';
import * as S from '../src/typing/internal';

describe('Test createPersistForme', () => {
  test('listners call', async () => {
    const name = 'persist';

    const next = jest.fn<void, RootState[]>();

    const database: Record<string, string> = {
      [name]: JSON.stringify({
        key1: {},
        key2: {}
      })
    };

    const storage = {
      async getItem(key: string) {
        return database[key];
      }
    } as S.Storage;

    const wrapperStorage = wrapStorage(storage);

    const forme = createPersistForme(name, wrapperStorage);

    const store = initStore({
      formes: {
        forme
      }
    });

    store.subscribe(next);

    await store.dispatch.forme.init();

    expect(next.mock.calls.length).toEqual(2);
  });

  test('state change', async () => {
    const name = 'persist';

    const next = jest.fn<void, RootState[]>();

    const database: Record<string, string> = {
      [name]: JSON.stringify({
        key1: {},
        key2: {}
      })
    };

    const storage = {
      async getItem(key: string) {
        return database[key];
      }
    } as S.Storage;

    const wrapperStorage = wrapStorage(storage);

    const forme = createPersistForme(name, wrapperStorage);

    const store = initStore({
      formes: {
        forme
      }
    });

    store.subscribe(next);

    await store.dispatch.forme.init();

    expect(next.mock.calls[0][0]).toEqual({
      forme: {
        isPersisting: true,
        status: S.PERSIST_STATUS.UNPERSISTED
      }
    });

    expect(next.mock.calls[1][0]).toEqual({
      forme: {
        isPersisting: false,
        status: S.PERSIST_STATUS.PERSISTED,
        data: {
          key1: {},
          key2: {}
        }
      }
    });
  });
});
