/**
 * workspace list actions
 * Build actions to be dispatched to the hworkspace list reducer.
 */

import { asyncGetJson } from "../../../infra/redux/async";
import {
  FiltersEnum,
  IEntityArray, IFiltersParameters
} from "../../types/entity";

// TYPE -------------------------------------------------------------------------------------------

export type IBackendFolder = {
  _id: string;
  created: string;
  modified: string;
  owner: string;
  ownerName: string;
  name: string;
  application: string;
  shared: [];
  ancestors: [];
  deleted: boolean;
  eParent: string | null;
  eType: string;
  inheritedShares: [];
  parents: [];
};

export type IBackendFolderArray = Array<IBackendFolder>;

// ADAPTER ----------------------------------------------------------------------------------------

const backendFoldersAdapter: (data: IBackendFolderArray) => IEntityArray = data => {
  const result = {} as any;
  if (!data) return result;
  for (const item of data) {
    result[item._id] = {
      date: Date.now(),
      id: item._id,
      isFolder: true,
      name: item.name,
      number: 1,
      owner: item.owner,
      ownerName: item.ownerName,
    };
  }
  return result;
};

// THUNKS -----------------------------------------------------------------------------------------

export function getFilteredFolders(filter: FiltersEnum) {
  return getFolders({ filter });
}

export function getSubFolders(parentId: string) {
  return getFolders({ filter: FiltersEnum.owner, parentId });
}

export async function getFolders(parameters: IFiltersParameters) {
  const formatParameters = (parameters = {}) => {
    let result = "?";
    for (let key in parameters)
    {
      if (parameters[key] == undefined)
        continue
      result = result.concat(`${key}=${parameters[key]}&`);
    }
    return result.slice(0, -1);
  };

  return await asyncGetJson(`/workspace/folders/list${formatParameters(parameters)}`, backendFoldersAdapter);
}