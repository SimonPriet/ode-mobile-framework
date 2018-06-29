/**
 * Homework
 *
 * Display page for all homework in a calendar-like way.
 */

// imports ----------------------------------------------------------------------------------------

import style from "glamorous-native";
import * as React from "react";
import { RefreshControl } from "react-native";
const { View, Text, FlatList, TouchableOpacity } = style;
import { connect } from "react-redux";

import { CommonStyles } from "../../styles/common/styles";
import { PageContainer } from "../../ui/ContainerContent";
import { AppTitle, Header } from "../../ui/headers/Header";

import moment from "moment";
// tslint:disable-next-line:no-submodule-imports
import "moment/locale/fr";
moment.locale("fr");

import { fetchDiaryListIfNeeded } from "../actions/diaries";
import { diaryTaskSelected } from "../actions/selectedDiaryTask";

import { extractShortTask, IDiaryDayTasks } from "../reducers/diaries";

// Header component -------------------------------------------------------------------------------

// tslint:disable-next-line:max-classes-per-file
export class HomeworkPageHeader extends React.Component<
  { navigation?: any },
  undefined
> {
  public render() {
    return (
      <Header>
        <AppTitle>Homework</AppTitle>
      </Header>
    );
  }
}

// Main component ---------------------------------------------------------------------------------

interface IHomeworkPageProps {
  navigation?: any;
  didInvalidate?: boolean;
  dispatch?: any; // given by connect()
  isFetching?: boolean;
  lastUpdated?: Date;
  diaryId?: string;
  diaryTasksByDay?: IDiaryDayTasks[];
}

/**
 * HomeworkPage
 *
 * The main component.
 */
// tslint:disable-next-line:max-classes-per-file
class HomeworkPage_Unconnected extends React.Component<IHomeworkPageProps, {}> {
  private flatList: FlatList<IDiaryDayTasks>; // react-native FlatList component ref // typescript error. Why ?
  private setFlatListRef: any; // FlatList setter, executed when this component is mounted.

  constructor(props) {
    super(props);

    // Refs
    this.flatList = null;
    this.setFlatListRef = element => {
      this.flatList = element;
    };
  }

  // render & lifecycle

  public render() {
    return (
      <PageContainer>
        <HomeworkTimeLine />
        <FlatList
          innerRef={this.setFlatListRef}
          data={this.props.diaryTasksByDay}
          renderItem={({ item }) => (
            <HomeworkDayTasks data={item} navigation={this.props.navigation} />
          )}
          keyExtractor={item => item.moment.format("YYYY-MM-DD")}
          ListHeaderComponent={() => <View height={15} />}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isFetching}
              onRefresh={() => this.fetchTasks()}
            />
          }
        />
      </PageContainer>
    );
  }

  public componentDidMount() {
    this.fetchTasks();
  }

  public fetchTasks() {
    this.props.dispatch(fetchDiaryListIfNeeded());
  }
}

export const HomeworkPage = connect((state: any) => {
  const {
    didInvalidate,
    isFetching,
    lastUpdated
  } = state.diary.availableDiaries;
  const diaries = state.diary.availableDiaries.items;
  const selectedDiaryId = state.diary.selectedDiary;
  const currentDiary = diaries[selectedDiaryId];
  let diaryId = null;
  let diaryTasksByDay = [] as IDiaryDayTasks[];

  if (!!currentDiary) {
    diaryId = currentDiary.id;
    diaryTasksByDay = currentDiary.tasksByDay;
  }

  return { diaryId, diaryTasksByDay, didInvalidate, isFetching, lastUpdated };
})(HomeworkPage_Unconnected);

// Functional components --------------------------------------------------------------------------

/**
 * HomeworkDayTasks
 *
 * Display the task list of a day (with day number and name).
 * Props:
 *     data: HomeworkDay - information of the day (number and name) and list of the tasks.
 */
interface IHomeworkDayTasksProps {
  data: IDiaryDayTasks;
  navigation?: any;
  dispatch?: any;
  selectedDiary?: string;
}
// tslint:disable-next-line:max-classes-per-file
class HomeworkDayTasks_Unconnected extends React.Component<
  IHomeworkDayTasksProps,
  any
> {
  constructor(props: IHomeworkDayTasksProps) {
    super(props);
  }

  public render() {
    const tasksAsArray = Object.values(this.props.data.tasks);
    return (
      <View>
        <HomeworkDayCheckpoint
          nb={this.props.data.moment.date()}
          text={this.props.data.moment.format("dddd")}
          active={this.props.data.moment.isSame(moment(), "day")}
        />
        {tasksAsArray.map(item => (
          <HomeworkCard
            title={item.title}
            description={item.description}
            key={item.id}
            onPress={() => {
              this.props.dispatch(
                diaryTaskSelected(
                  this.props.selectedDiary,
                  this.props.data.moment,
                  item.id
                )
              );
              const navigation = this.props.navigation;
              navigation.navigate("HomeworkTask");
            }}
          />
        ))}
      </View>
    );
  }
}

export const HomeworkDayTasks = connect((state: any) => {
  const ret: {
    selectedDiary: string;
  } = {
    selectedDiary: state.diary.selectedDiary
  };
  return ret;
})(HomeworkDayTasks_Unconnected); // FIXME : it works but what the fuck with typescript ???

// Pure display components ------------------------------------------------------------------------

/**
 * Just display a grey vertical line at the left tall as the screen is.
 */
const HomeworkTimeLine = style.view({
  backgroundColor: CommonStyles.entryfieldBorder, // TODO: Use the linear gradient instead of a plain grey
  height: "100%",
  left: 29,
  position: "absolute",
  width: 1
});

/**
 * HomeworkDayCheckpoint
 *
 * Just a wrapper for the heading of a day tasks. Displays a day number in a circle and a day name
 * TODO?: May took a Date object as a parameter instead of a number and a string ?
 * Props:
 *     `style`: `any` - Glamorous style to add.
 * 	   `nb`: `number`- Day number to be displayed in a `HomeworkDayCircleNumber`.
 *     `text`: `string` - Day name to be displayed.
 *     `active`: `boolean` - An active `HomeworkDayCheckpoint` will be highlighted. Default `false`.
 *
 * An unstyled version on this component is available as `HomeworkDayCheckpoint_Unstyled`.
 */

// tslint:disable-next-line:variable-name
const HomeworkDayCheckpoint_Unstyled = ({
  style,
  nb,
  text = "",
  active = false
}: {
  style?: any;
  nb?: number;
  text?: string;
  active?: boolean;
}) => (
  <View style={[style]}>
    <HomeworkDayCircleNumber nb={nb} active={active} />
    <Text color={CommonStyles.lightTextColor} fontSize={12}>
      {text.toUpperCase()}
    </Text>
  </View>
);

const HomeworkDayCheckpoint = style(HomeworkDayCheckpoint_Unstyled)({
  alignItems: "center",
  flexDirection: "row"
});

/**
 * HomeworkDayCircleNumber
 *
 * Display a number in a circle elegantly. Mostly used to show a day number.
 * Props:
 *     `style`: `any` - Glamorous style to add.
 * 	   `nb`: `number` - Just as simple as the number to be displayed.
 *     `active`: `boolean` - An active `HomeworkDayCircleNumber` will be highlighted.
 * FIXME: style.Text component gives Invariant Violation, must use `const {Text} = style`. Why ?
 * TODO: When active, the blue background should be a gradient, according to the mockup.
 *
 * An unstyled version on this component is available as `HomeworkDayCircleNumber_Unstyled`.
 */
// tslint:disable-next-line:variable-name
const HomeworkDayCircleNumber_Unstyled = ({
  style,
  nb,
  active = false
}: {
  style?: any;
  nb?: number;
  active?: boolean;
}) => (
  <View style={[style]}>
    <Text
      color={active ? CommonStyles.tabBottomColor : CommonStyles.lightTextColor}
      fontSize={12}
    >
      {nb}
    </Text>
  </View>
);

const HomeworkDayCircleNumber = style(HomeworkDayCircleNumber_Unstyled)(
  {
    alignItems: "center",
    borderColor: CommonStyles.tabBottomColor,
    borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 1,
    height: 30,
    justifyContent: "center",
    marginHorizontal: 14,
    shadowColor: "#6B7C93",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 30
  },
  ({ active }) => ({
    backgroundColor: active
      ? CommonStyles.actionColor
      : CommonStyles.tabBottomColor
  })
);

/**
 * HomeworkCard
 *
 * Like `Card`, but some margin and padding, custom shadow and rounded.
 *
 * An unstyled version on this component is available as `HomeworkCard_Unstyled`.
 */

// tslint:disable-next-line:variable-name
const HomeworkCard_Unstyled = ({
  style,
  title,
  description,
  onPress
}: {
  style?: any;
  title?: string;
  description?: string;
  onPress?: any; // custom event
}) => (
  <TouchableOpacity
    style={[style]}
    onPress={() => {
      onPress();
    }}
  >
    <Text fontSize={14} color={CommonStyles.textColor} lineHeight={20}>
      {extractShortTask(description)}
    </Text>
    <Text fontSize={12} color={CommonStyles.lightTextColor} marginTop={5}>
      {title}
    </Text>
  </TouchableOpacity>
);

const HomeworkCard = style(HomeworkCard_Unstyled)({
  backgroundColor: "#FFF",
  borderRadius: 5,
  marginBottom: 15,
  marginLeft: 60,
  marginRight: 20,
  paddingHorizontal: 15,
  paddingVertical: 20,
  shadowColor: "#6B7C93",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2
});
