import { extractWhitekeys } from '../src/storage/creator';

describe('Test extractWhitekeys', () => {
  test('empty whitelist', () => {
    const whitelist: string[] = [];
    const emptyKeys: string[] = [];
    const fulledKeys: string[] = ['key1', 'key2'];

    expect(extractWhitekeys(whitelist, emptyKeys)).toEqual([]);

    expect(extractWhitekeys(whitelist, fulledKeys)).toEqual(fulledKeys);
  });

  test('specified whitelist', () => {
    const correctWhitelist: string[] = ['key1', 'key2'];
    const incorrectWhitelist: string[] = ['key1', 'key4'];
    const keys: string[] = ['key1', 'key2', 'key3'];

    expect(extractWhitekeys(correctWhitelist, keys)).toEqual(correctWhitelist);

    expect(extractWhitekeys(incorrectWhitelist, keys)).toEqual(['key1']);
  });
});
