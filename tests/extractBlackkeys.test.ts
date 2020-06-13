import { extractBlackkeys } from '../src/storage/creator';

describe('Test extractBlackkeys', () => {
  test('empty blacklist', () => {
    const blacklist: string[] = [];
    const emptyKeys: string[] = [];
    const fulledKeys: string[] = ['key1', 'key2'];

    expect(extractBlackkeys(blacklist, emptyKeys)).toEqual([]);

    expect(extractBlackkeys(blacklist, fulledKeys)).toEqual(fulledKeys);
  });

  test('specified blacklist', () => {
    const correctBlacklist: string[] = ['key1', 'key2'];
    const incorrectBlacklist: string[] = ['key1', 'key4'];
    const keys: string[] = ['key1', 'key2', 'key3'];

    expect(extractBlackkeys(correctBlacklist, keys)).toEqual(['key3']);

    expect(extractBlackkeys(incorrectBlacklist, keys)).toEqual([
      'key2',
      'key3'
    ]);
  });
});
