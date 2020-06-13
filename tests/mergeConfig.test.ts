import { Config } from '@statirjs/core';
import { mergeConfig } from '../src/upgrade/creator';
import { createPersistForme, PERSIST_FORME } from '../src/forme/persist';
import { wrapStorage } from '../src/storage/creator';
import { persistMiddleware } from '../src/middleware/creator';
import * as S from '../src/typing/internal';

describe('Test mergeConfig', () => {
  test('imvalid data', () => {
    expect(() => mergeConfig(null as any, null as any)).toThrow();

    expect(() => mergeConfig({} as any, null as any)).not.toThrow();
  });

  test('empty config', () => {
    const name = 'persist';

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

    const config: Config = {
      formes: {}
    };

    expect(mergeConfig(config, forme)).toEqual({
      formes: {
        [PERSIST_FORME]: forme
      },
      middlewares: [persistMiddleware]
    });
  });

  test('fulled config', () => {
    const name = 'persist';

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

    const config: Config = {
      formes: {
        forme
      },
      middlewares: [persistMiddleware]
    };

    expect(mergeConfig(config, forme)).toEqual({
      formes: {
        forme,
        [PERSIST_FORME]: forme
      },
      middlewares: [persistMiddleware, persistMiddleware]
    });
  });
});
