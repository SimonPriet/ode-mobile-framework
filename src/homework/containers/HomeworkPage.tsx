import * as React from "react";
import { AsyncStorage } from "react-native";
import { connect } from "react-redux";
import {
  HomeworkPage,
  IHomeworkPageDataProps,
  IHomeworkPageEventProps,
  IHomeworkPageProps
} from "../components/HomeworkPage";
import I18n from "i18n-js";

import {
  fetchHomeworkDiaryList
} from "../actions/diaryList";
import { homeworkTaskSelected } from "../actions/selectedTask";
import { fetchHomeworkTasks } from "../actions/tasks";

import Tracking from "../../tracking/TrackingManager";
import homeworkDiarySelected from "../actions/selectedDiary";
import { NavigationScreenProp } from "react-navigation";
import { standardNavScreenOptions } from "../../navigation/helpers/navScreenOptions";
import { HeaderAction, HeaderBackAction } from "../../ui/headers/NewHeader";

const mapStateToProps: (state: any) => IHomeworkPageDataProps = state => {
  // Extract data from state
  const localState = state.homework;
  const selectedDiaryId = localState.selectedDiary;
  const currentDiaryTasks = localState.tasks[selectedDiaryId];
  const diaryInformation = localState.diaryList.data[selectedDiaryId];
  if (!selectedDiaryId || !currentDiaryTasks)
    if (localState.diaryList.didInvalidate)
      return {
        /* Initial props if there is not initialisation yet.
        For the hack, we consider app is already fetching to avoid a screen blinking. */
        diaryId: undefined,
        didInvalidate: true,
        isFetching: true,
        lastUpdated: undefined,
        tasksByDay: undefined
      };
    else {
      return {
        /* Here is an mepty screen displayer */
        diaryId: undefined,
        didInvalidate: true,
        isFetching: false,
        lastUpdated: undefined,
        tasksByDay: undefined
      };
    }
  const { didInvalidate, isFetching, lastUpdated } = currentDiaryTasks;

  // Flatten two-dimensional IOrderedArrayById
  const tasksByDay = currentDiaryTasks.data.ids.map(diaryId => ({
    date: currentDiaryTasks.data.byId[diaryId].date,
    id: diaryId,
    tasks: currentDiaryTasks.data.byId[diaryId].tasks.ids.map(
      taskId => currentDiaryTasks.data.byId[diaryId].tasks.byId[taskId]
    )
  }));

  // Format props
  return {
    diaryId: selectedDiaryId,
    didInvalidate,
    isFetching,
    lastUpdated,
    tasksByDay,
    diaryInformation,
  };
};

const mapDispatchToProps: (
  dispatch: any
) => IHomeworkPageEventProps = dispatch => {
  return {
    dispatch,
    onRefresh: diaryId => {
      Tracking.logEvent("refreshNotebook");
      dispatch(fetchHomeworkTasks(diaryId));
    },
    onScrollBeginDrag: () => {
      Tracking.logEvent("scrollNotebook");
    },
    onSelect: (diaryId, date, itemId) => {
      Tracking.logEvent("readHomework");
      dispatch(homeworkTaskSelected(diaryId, date, itemId));
    }
  };
};

class HomeworkPageContainer extends React.PureComponent<
  IHomeworkPageProps & { dispatch: any },
  {}
> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{}> }) => {
    const diaryTitle = navigation.getParam("diaryTitle")

    return standardNavScreenOptions(
      {
        title: diaryTitle || I18n.t("Homework"),
        headerLeft: <HeaderBackAction navigation={navigation} />,
        headerRight: <HeaderAction
          name="filter"
          onPress={() => navigation.navigate("HomeworkFilter")}
        />
      },
      navigation
    );
  }

  constructor(props) {
    super(props);
  }

  public render() {
    return <HomeworkPage {...this.props} />;
  }

  public async componentDidMount() {
    await this.loadSelectedDiary();
    this.props.dispatch(fetchHomeworkDiaryList());
  }

  public componentDidUpdate() {
    const { diaryInformation, navigation } = this.props
    if (diaryInformation && navigation && diaryInformation.title && diaryInformation.title !== navigation.getParam("diaryTitle")) {
      navigation.setParams({diaryTitle: diaryInformation.title })
    }
  }

  private async loadSelectedDiary() {
    const selectedId = await AsyncStorage.getItem("diary-selected");
    if (selectedId) this.props.dispatch(homeworkDiarySelected(selectedId));
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeworkPageContainer);
