import { IFile } from "../types";
import { IAction } from "../../infra/redux/async";

export const SELECT_ACTION_TYPE = "SELECT_ACTION";
export const SELECT_CLEAR_ACTION_TYPE = "SELECT_CLEAR_ACTION";

export function selectAction(item: IFile): IAction<IFile> {
  return { type: SELECT_ACTION_TYPE, id: item.id, data: item };
}
