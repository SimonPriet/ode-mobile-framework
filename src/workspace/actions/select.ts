import { IFile, IItem } from "../types";

export const SELECT_ACTION_TYPE = "SELECT_ACTION";
export const SELECT_CLEAR_ACTION_TYPE = "SELECT_CLEAR_ACTION";
export type SelectAction = IFile & {
  type: string;
};

export function selectAction(item: IFile): SelectAction {
  if (!item) {
    return { type: SELECT_CLEAR_ACTION_TYPE, id: "", name: "", filename: "", size: 0, url: "" };
  }

  return { type: SELECT_ACTION_TYPE, ...item };
}
