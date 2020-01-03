export const SELECT_ACTION_TYPE = 'SELECT_ACTION';
export type SelectAction = {
  type: string;
  id: string;
  receivedAt: number;
};

export function selectAction(id: string): SelectAction {
  return { type: SELECT_ACTION_TYPE, id, receivedAt: Date.now() };
}
