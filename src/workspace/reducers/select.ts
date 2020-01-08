/**
 * Workspace selection state reducer
 * Holds a list of selected item in a simple Array
 */
import { Reducer } from 'redux';

import { SELECT_ACTION_TYPE, SelectAction } from '../actions/select';

export interface ISelectState {
  [key: string]: boolean | undefined;
}

const stateDefault: ISelectState = {};

const selectReducer: Reducer<ISelectState, SelectAction> = (
  state: ISelectState = stateDefault,
  action: SelectAction,
) => {
  switch (action.type) {
    case SELECT_ACTION_TYPE:
      if (action.id === null) {
        return {};
      }
      return {
        ...state,
        [action.id]: state[action.id] ? undefined : true,
      };
    default:
      return state;
  }
};

export default selectReducer;
