import { IId } from './iid';

export enum EVENT_TYPE {
  DOWNLOAD,
  MENU_SELECT,
  PREVIEW,
  SELECT,
  SHARE,
}

export type IEvent = IId & {
  type: EVENT_TYPE;
};

export interface IEventProps {
  onEvent: (event: IEvent) => void;
}
