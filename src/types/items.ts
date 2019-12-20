import { IRight } from './right';

export type IItem = IRight & {
  contentType?: string;
  date?: number;
  id: string;
  name: string;
  isFolder?: boolean;
};

