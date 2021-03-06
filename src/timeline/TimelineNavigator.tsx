import { createStackNavigator } from "react-navigation";
import { FilterTimelineConnect } from "./containers/FilterTimeline";
import { NewsContentRouter } from "./containers/NewsContent";
import Timeline from "./containers/Timeline";

export default createStackNavigator(
  {
    notifications: {
      screen: Timeline
    },

    filterTimeline: {
      screen: FilterTimelineConnect
    },

    newsContent: {
      screen: NewsContentRouter
    }
  }
);
