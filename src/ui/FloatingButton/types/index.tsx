import { IId } from '../../../types';
import { IEventProps } from '../../../types';

export type IMenuItem = IId & {
  icon: string;
  onSelect: Function;
  text: string;
};

export type IFloatingProps = IEventProps & {
  actions: IMenuItem[];
};
