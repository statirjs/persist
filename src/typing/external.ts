import { ReactNode } from 'react';
import { Upgrade } from '@statirjs/core';
import * as S from './internal';

export declare function createPersistUpgrade(config: S.Config): Upgrade;

export declare function PersistGate(props: S.PersistGateProps): ReactNode;

export declare const PERSIST_FORME: string;

export declare const PERSIST_ACTION: string;
