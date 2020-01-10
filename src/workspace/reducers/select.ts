/**
 * Workspace selection state reducer
 * Holds a list of selected item in a simple Array
 */
import { Reducer } from "redux";

import { SELECT_ACTION_TYPE, SELECT_CLEAR_ACTION_TYPE, SelectAction } from "../actions/select";
import { IFile } from "../types";

export interface ISelectState {
  [key: string]: IFile;
}

const stateDefault: ISelectState = {};

const selectReducer: Reducer<ISelectState, SelectAction> = (
  state: ISelectState = stateDefault,
  action: SelectAction
) => {
  switch (action.type) {
    case SELECT_CLEAR_ACTION_TYPE:
      return {};
    case SELECT_ACTION_TYPE:
      if (action.id === null) {
        return {};
      }
      if (state[action.id]) {
        delete state[action.id];
        return { ...state };
      }
      return {
        ...state,
        [action.id]: state[action.id] ? undefined : action, // le undefined ne marche pas!!!!!
      };
    default:
      return state;
  }
};

export default selectReducer;
