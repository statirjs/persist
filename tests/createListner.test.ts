import { RootState } from '@statirjs/core';
import { createListner } from '../src/upgrade/creator';
import { wrapStorage, createExtractor } from '../src/storage/creator';
import * as S from '../src/typing/internal';

describe('Test createListner', () => {
  test('incorrect data', () => {
    const name = 'persist';

    const storage = {} as S.WrappedStorage;

    const extractor: S.Extractor = () => {};

    expect(() => createListner(name, storage, extractor)).not.toThrow();
  });

  test('set item', async () => {
    const database: Record<string, string> = {};

    const name = 'persist';
    const whitelist = ['key1', 'key2'];
    const blacklist = ['key1'];

    const storage = {
      async setItem(key: string, value: string) {
        database[key] = value;
      }
    } as S.Storage;

    const store: RootState = {
      key1: {},
      key2: {},
      key3: {}
    };

    const wrapperStorage = wrapStorage(storage);

    const extractor = createExtractor(whitelist, blacklist);

    const listner = createListner(name, wrapperStorage, extractor);

    await listner(store);

    expect(database).toEqual({
      [name]: JSON.stringify({
        key2: {}
      })
    });
  });
});
