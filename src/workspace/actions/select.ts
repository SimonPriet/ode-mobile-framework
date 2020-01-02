export const SELECT_ACTION_TYPE = 'SELECT_ACTION';
export type SelectAction = {
  type: string;
  id: string;
  value: boolean;
  receivedAt: number;
};

export function selectAction(id: string, value: boolean): SelectAction {
  return { type: SELECT_ACTION_TYPE, id, value, receivedAt: Date.now() };
}
