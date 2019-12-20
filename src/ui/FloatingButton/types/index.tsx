import { IItem } from '../../../types';
import { IEventProps } from '../../../types';

export type IMenuItem = IItem & {
  icon: string;
  name: string;
  text: string;
};

export type IFloatingProps = IEventProps & {
  actions: IMenuItem[];
};
