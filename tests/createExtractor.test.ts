import { RootState } from '@statirjs/core';
import { createExtractor } from '../src/storage/creator';

describe('Test createExtractor', () => {
  test('incorrect data', () => {
    const incorrectWhitelist = null as any;
    const incorrectBlacklist = null as any;

    expect(() =>
      createExtractor(incorrectWhitelist, incorrectBlacklist)
    ).not.toThrow();

    expect(() =>
      createExtractor(incorrectWhitelist, incorrectBlacklist)({})
    ).toThrow();
  });

  test('specified whitelist', () => {
    const correctWhitelist = ['key1', 'key2'];
    const incorrectWhitelist = ['key4'];
    const blacklist: string[] = [];
    const state: RootState = {
      key1: {},
      key2: {},
      key3: {}
    };

    expect(createExtractor(correctWhitelist, blacklist)(state)).toEqual({
      key1: {},
      key2: {}
    });

    expect(createExtractor(incorrectWhitelist, blacklist)(state)).toEqual({
      key1: {},
      key2: {},
      key3: {}
    });
  });

  test('specified blacklist', () => {
    const whitelist: string[] = [];
    const correctBlacklist = ['key1', 'key2'];
    const incorrectBlacklist = ['key4'];
    const state: RootState = {
      key1: {},
      key2: {},
      key3: {}
    };

    expect(createExtractor(whitelist, correctBlacklist)(state)).toEqual({
      key3: {}
    });

    expect(createExtractor(whitelist, incorrectBlacklist)(state)).toEqual({
      key1: {},
      key2: {},
      key3: {}
    });
  });

  test('specified both', () => {
    const correctWhitelist = ['key1', 'key2'];
    const incorrectWhitelist = ['key4'];
    const correctBlacklist = ['key1'];
    const incorrectBlacklist = ['key4'];
    const state: RootState = {
      key1: {},
      key2: {},
      key3: {}
    };

    expect(createExtractor(correctWhitelist, correctBlacklist)(state)).toEqual({
      key2: {}
    });

    expect(
      createExtractor(correctWhitelist, incorrectBlacklist)(state)
    ).toEqual({
      key1: {},
      key2: {}
    });

    expect(
      createExtractor(incorrectWhitelist, correctBlacklist)(state)
    ).toEqual({
      key2: {},
      key3: {}
    });

    expect(
      createExtractor(incorrectWhitelist, incorrectBlacklist)(state)
    ).toEqual({
      key1: {},
      key2: {},
      key3: {}
    });
  });
});
