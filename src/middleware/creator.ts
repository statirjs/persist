import { Update, UpdateState } from '@statirjs/core';
import { PERSIST_FORME, PERSIST_ACTION } from '../forme/persist';
import * as S from '../typing/internal';

const STEP = 'done';

const UPDATE_IDENTIFICATOR = `${PERSIST_FORME}/${PERSIST_ACTION}:${STEP}`;

export function nextPersist(
  update: Update<S.PersistDoneState>,
  next: UpdateState<S.PersistState>
) {
  const { rootState, state } = update;
  const persistData = state?.data || {};

  const nextUpdate: Update<S.PersistState> = {
    ...update,
    state: {
      isPersisting: state.isPersisting,
      status: state.status
    },
    rootState: {
      ...rootState,
      ...persistData
    }
  };

  next(nextUpdate);
}

export function persistMiddleware(next: UpdateState): UpdateState {
  return function (update: Update) {
    const { formeName, actionName } = update;
    const identificator = `${formeName}/${actionName}`;

    UPDATE_IDENTIFICATOR === identificator
      ? nextPersist(update, next)
      : next(update);
  };
}
