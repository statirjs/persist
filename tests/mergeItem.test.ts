import { RootState } from '@statirjs/core';
import { mergeItem } from '../src/storage/creator';

describe('Test mergeItem', () => {
  test('empty keys', () => {
    const keys: string[] = [];
    const state: RootState = {
      key1: {}
    };

    expect(mergeItem(keys, state)).toEqual({});
  });

  test('specified keys', () => {
    const correctKeys = ['key1', 'key2'];
    const incorrectKeys = ['key1', 'key4'];
    const state: RootState = {
      key1: {},
      key2: {},
      key3: {}
    };

    expect(mergeItem(correctKeys, state)).toEqual({
      key1: {},
      key2: {}
    });

    expect(mergeItem(incorrectKeys, state)).toEqual({
      key1: {}
    });
  });
});
