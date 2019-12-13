import { IItem } from '../../../workspace/types/states';

export type IMenuItem = IItem & {
  onEvent: Function;
  icon?: string;
  text?: string;
};
