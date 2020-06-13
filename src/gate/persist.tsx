import { useEffect } from 'react';
import { Dispatch } from '@statirjs/core';
import { useDispatch } from '@statirjs/react';
import { PERSIST_FORME, PERSIST_ACTION } from '../formes/persist';
import * as S from '../typing/internal';

export function PersistGate(props: S.PersistGateProps) {
  const { children = null } = props;

  const init = useDispatch(
    (dispatch: Dispatch) => dispatch[PERSIST_FORME][PERSIST_ACTION]
  );

  useEffect(() => {
    init();
  }, []);

  return children;
}
