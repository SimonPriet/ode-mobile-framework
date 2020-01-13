import { IItem } from "../states";

export enum EVENT_TYPE {
  DOWNLOAD,
  MENU_SELECT,
  PREVIEW,
  SELECT,
  SHARE,
}

export interface IEventProps {
  onEvent: (type: EVENT_TYPE, item: IItem) => void
}

