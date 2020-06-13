import { Update, UpdateState } from '@statirjs/core';
import { PERSIST_FORME, PERSIST_ACTION } from '../forme/persist';
import * as S from '../typing/internal';

const STEP_DONE = 'done';

const STEP_PUSH = 'push';

const DONE_IDENTIFICATOR = `${PERSIST_FORME}/${PERSIST_ACTION}:${STEP_DONE}`;

const PUSH_IDENTIFICATOR = `${PERSIST_FORME}/${PERSIST_ACTION}:${STEP_PUSH}`;

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

    DONE_IDENTIFICATOR === identificator
      ? nextPersist(update, next)
      : PUSH_IDENTIFICATOR === identificator
      ? next({ ...update, disable: true })
      : next(update);
  };
}
