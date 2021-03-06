import { ReactNode } from 'react';
import { RootState } from '@statirjs/core';

export type Item = any;

export interface Storage {
  getItem(key: string): Promise<string>;
  setItem(key: string, item: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export interface WrappedStorage {
  getItem(key: string): Promise<Item>;
  setItem(key: string, item: Item): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export interface PersistGateProps {
  children?: ReactNode;
}

export interface Config {
  name?: string;
  storage: Storage;
  whitelist?: string[];
  blacklist?: string[];
}

export type Extractor = (rootState: RootState) => Item;

export enum PERSIST_STATUS {
  PERSISTED = 'PERSISTED',
  UNPERSISTED = 'UNPERSISTED',
  ERROR = 'ERROR'
}

export interface PersistDoneState {
  isPersisting: boolean;
  status: PERSIST_STATUS;
  data: Item;
}

export interface PersistState {
  isPersisting: boolean;
  status: PERSIST_STATUS;
}
