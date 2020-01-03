/**
 * Workspace selection state reducer
 * Holds a list of selected item in a simple Array
 */
import { Reducer } from 'redux';

import { SELECT_ACTION_TYPE, SelectAction } from '../actions/select';

export interface ISelectState {
  [key: string]: boolean | null;
}

const stateDefault: ISelectState = {};

const selectReducer: Reducer<ISelectState, SelectAction> = (
  state: ISelectState = stateDefault,
  action: SelectAction,
) => {
  switch (action.type) {
    case SELECT_ACTION_TYPE:
      return {
        ...state,
        [action.id]: state[action.id] ? null : true,
      };
    default:
      return state;
  }
};

export default selectReducer;
