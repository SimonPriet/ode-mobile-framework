import { connect } from "react-redux";
import {
  HomeworkTaskPage,
  IHomeworkTaskPageProps
} from "../components/pages/HomeworkTaskPage";

const mapStateToProps: (state: any) => IHomeworkTaskPageProps = state => {
  // Extract data from state
  const localState = state.homework.selectedTask;
  const { homeworkId, date, taskId } = localState;
  // Get homework, then day, then task content
  const homeworkDays = state.homework.tasks[homeworkId];
  if (!homeworkDays) return {}; // this case shouldn't occur.
  const dateId = date.format("YYYY-MM-DD");
  const homeworkTasksThisDay = homeworkDays.data.byId[dateId];
  if (!homeworkTasksThisDay) return {}; // this case shouldn't occur.
  const taskInfos = homeworkTasksThisDay.tasks.byId[taskId];
  if (!taskInfos) return {}; // this case shouldn't occur.

  // Format props
  return {
    date,
    homeworkId,
    taskContent: taskInfos.content,
    taskId,
    taskTitle: taskInfos.title
  };
};

export default connect(mapStateToProps)(HomeworkTaskPage);
