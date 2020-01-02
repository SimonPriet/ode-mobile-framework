/**
 * Workspace selection state reducer
 * Holds a list of selected item in a simple Array
 */
import { Reducer } from 'redux';

import { FilterId } from '../types';
import { SELECT_ACTION_TYPE, SelectAction } from '../actions/select';

export interface ISelectState {
  [key: string]: boolean;
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
        [action.id || FilterId.root]: action.value,
      };
    default:
      return state;
  }
};

export default selectReducer;
