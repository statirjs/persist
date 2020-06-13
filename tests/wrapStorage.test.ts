import { wrapStorage } from '../src/storage/creator';
import * as S from '../src/typing/internal';

describe('Test wrapStorage', () => {
  test('incorrect data', () => {
    const storage = {} as S.Storage;

    expect(() => wrapStorage(storage)).not.toThrow();
  });

  test('getter function', async () => {
    const database: Record<string, string> = {
      key1: '{"value1":1}',
      key2: '{"value2":2}'
    };

    const storage = {
      async getItem(key: string) {
        return database[key];
      }
    } as S.Storage;

    const wrapperStorage = wrapStorage(storage);

    const value1 = await wrapperStorage.getItem('key1');

    const value2 = await wrapperStorage.getItem('key2');

    expect(value1).toEqual({ value1: 1 });

    expect(value2).toEqual({ value2: 2 });
  });

  test('setter function', async () => {
    const database: Record<string, string> = {};

    const storage = {
      async setItem(key: string, value: string) {
        database[key] = value;
      }
    } as S.Storage;

    const wrapperStorage = wrapStorage(storage);

    await wrapperStorage.setItem('key1', { value1: 1 });

    await wrapperStorage.setItem('key2', '{"value2":2}');

    expect(database).toEqual({
      key1: '{"value1":1}',
      key2: JSON.stringify('{"value2":2}')
    });
  });

  test('remover function', async () => {
    const database: Record<string, string> = {
      key1: 'value1',
      key2: 'value2'
    };

    const storage = {
      async removeItem(key: string) {
        delete database[key];
      }
    } as S.Storage;

    const wrapperStorage = wrapStorage(storage);

    await wrapperStorage.removeItem('key2');

    expect(database).toEqual({
      key1: 'value1'
    });
  });
});
