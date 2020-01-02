import { combineReducers } from 'redux';
import items from './items';
import select from './select';

const rootReducer = combineReducers<any>({
  items,
  select,
});

export default rootReducer;
