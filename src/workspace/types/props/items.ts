import { IItem, IItems } from "../states";
import { IActionProps } from "./actions";
import { IEventProps } from "./events";
import { INavigationProps } from "../index";

export interface IDataItemsProps {
  items: IItems<IItem>;
  isFetching: boolean,
}

export type IItemsProps = IActionProps & IEventProps & INavigationProps & IDataItemsProps
