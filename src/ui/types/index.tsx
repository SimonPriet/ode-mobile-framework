import { EVENT_TYPE, IId } from '../../types';
import { IEventProps } from '../../types';

export type IMenuItem = IId &
  IEventProps & {
    icon: string;
    text: string;
    type: EVENT_TYPE.MENU_SELECT;
  };

export type IFloatingProps = {
  menuItems: IMenuItem[];
  onEvent: (event: IMenuItem) => void;
};
