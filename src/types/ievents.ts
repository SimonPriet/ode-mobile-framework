import { IId } from "./iid";
import { ISelectState } from "../workspace/reducers/select";
import { IFile } from "../workspace/types";

export enum EVENT_TYPE {
  DOWNLOAD,
  MENU_SELECT,
  PREVIEW,
  SELECT,
  SHARE,
  LONG_SELECT,
}

export type IEvent = IId & {
  type: EVENT_TYPE;
  item: any;
};

export interface IEventProps {
  onEvent: (event: IEvent & any) => void;
}

export interface ISelectedProps {
  selected: ISelectState<IFile>;
}
