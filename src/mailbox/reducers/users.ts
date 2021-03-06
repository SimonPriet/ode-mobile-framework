import { actionTypeLoadVisibles } from "../actions/createThread";
import { actionTypeUserPick, actionTypeUserUnpick, actionTypeUserClearPicks } from "../actions/pickUser";

/**
 * Manage the selected users in mailbox.
 */

export interface IMailBoxUsersState {
  picked: any[];
  remaining: any[];
  visibles: any[];
}

const defaultState: IMailBoxUsersState = {
  picked: [],
  remaining: [],
  visibles: []
};

// TODO : by default, state is `undefined`. That's cool, the app will force the user to select a homework diary to display. Therefore, we must keep the info in a local storage or something like this.
export default function selectedThread(
  state: IMailBoxUsersState = defaultState,
  action
) {
  switch (action.type) {
    case actionTypeLoadVisibles:
      return {
        ...state,
        remaining: [...action.visibles],
        visibles: [...action.visibles]
      };
    case actionTypeUserPick:
      return {
        ...state,
        picked: [{ ...action.user, checked: true }, ...state.picked],
        remaining: state.remaining.filter(u => u.id !== action.user.id)
      };
    case actionTypeUserUnpick:
      return {
        ...state,
        picked: state.picked.filter(u => u.id !== action.user.id),
        remaining: [{ ...action.user, checked: false }, ...state.remaining]
      };
    case actionTypeUserClearPicks:
      return {
        ...state,
        picked: [],
        remaining: state.visibles
      };
    default:
      return state;
  }
}
