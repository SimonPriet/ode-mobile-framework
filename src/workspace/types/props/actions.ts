import { IFiltersParameters } from "../filters";
import { ContentUri } from "..";

export interface IActionProps {
  listAction: (params: IFiltersParameters) => void;
  selectAction: (id: string) => void;
  uploadAction: (fileUri: ContentUri) => void;
}
