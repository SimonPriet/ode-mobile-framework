/**
 * Manage the current selected diary id. It's state is just a string.
 */

import { actionTypeDiarySelected } from "../actions/selectedDiary";

// TODO : by default, state is `undefined`. That's cool, the app will force the user to select a homework diary to display. Therefore, we must keep the info in a local storage or something like this.
export default function selectedDiary(state: string = null, action) {
  switch (action.type) {
    case actionTypeDiarySelected:
      return action.diaryId;
    default:
      return state;
  }
}
