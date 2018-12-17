import I18n from "i18n-js";
import * as React from "react";
import { View } from "react-native";
import firebase from "react-native-firebase";
import { createSwitchNavigator, NavigationContainer } from "react-navigation";
import { connect } from "react-redux";
import moduleDefinitions from "../AppModules";
import { getRoutesFromModuleDefinitions } from "../infra/moduleTool";
import pushNotifications from "../pushNotifications";
import TimelineNavigator from "../timeline/TimelineNavigator";
import Tracking from "../tracking/TrackingManager";
import LoginPage from "../user/containers/LoginPage";
import {
  createMainTabNavigator,
  createMainTabNavOption
} from "./helpers/mainTabNavigator";

// MAIN NAVIGATOR -------------------------------------------------------------------------

function getMainRoutes(apps: string[]) {
  // moduleDefinitions, filtered by apps.
  const definitionsIntersection = moduleDefinitions.filter(mod =>
    apps.includes(mod.config.apiName)
  );
  return {
    // TODO : make Timeline a regular module ant put it in moduleDefinitions.
    timeline: {
      screen: TimelineNavigator,

      navigationOptions: () =>
        createMainTabNavOption(I18n.t("News"), "nouveautes")
    },

    ...getRoutesFromModuleDefinitions(definitionsIntersection)
  };
}

function getMainNavigator(apps) {
  return createMainTabNavigator(getMainRoutes(apps));
}

export let currentNavigatorRef = null;

class MainNavigatorHOC extends React.Component<
  { apps: object; dispatch: any},
  {}
> {
  public shouldComponentUpdate(nextProps) {
    return !compareArrays(this.props.apps, nextProps.apps);
  }

  public static CurrentNavigator = null;
  public static notifAlreadyRouted = false;

  public async componentDidUpdate() {
    await this.componentDidMount();
  }

  public async componentDidMount() {
    if (!MainNavigatorHOC.notifAlreadyRouted) {
      (firebase.messaging() as any).requestPermission();

      const notificationOpen = await firebase
        .notifications()
        .getInitialNotification();
      if (notificationOpen) {
        const notification = notificationOpen.notification;
        const data = JSON.parse(notification.data.params);
        Tracking.logEvent("openNotificationPush");
        pushNotifications(this.props.dispatch)(data, this.props.apps);
        MainNavigatorHOC.notifAlreadyRouted = true;
      }
    }
  }

  public render() {
    // console.log("render new navigator", Math.random());
    const { apps, ...forwardProps } = this.props;
    MainNavigatorHOC.CurrentNavigator = getMainNavigator(apps);

    return (
      <MainNavigatorHOC.CurrentNavigator
        {...forwardProps}
        ref={nav => {
          currentNavigatorRef = nav;
        }}
        onNavigationStateChange={(prevState, currentState, action) => {
          // console.log("main nav state change :", prevState, currentState, action);
          // Track if tab has changed
          if (action.type !== "Navigation/NAVIGATE") return;
          const prevIndex = prevState.index;
          const currentIndex = currentState.index;
          if (prevIndex === currentIndex) return;
          const currentTabRouteName =
            currentState.routes[currentIndex].routeName;
          if (currentTabRouteName)
            Tracking.logEvent("menuTab", {
              tab: currentTabRouteName
            });
        }}
      />
    );
    /* CAUTION :
       React Navigation doen't support dynamic routes.
       Here we emulate this by regenerate a runtime a new router and NavigationContainer each time `apps` props is modified.
       React-Redux is used to update the MainNavigatorHOC when `apps` are loaded.

       In this situation React Navigation raises a Warning that says :
       "You should only render one navigator explicitly in your app, and other navigators should by rendered by including them in that navigator."
       The help page show how to solve this issue by set the router of MainNavigatorHOC with the one contained innrendered <Navigator />.
       But this solution is incompatible with dynamic routing, because there are no <Navigator /> at compile time.

       So, until React Navigation doest support dynamic routes, don't mind of this warning.
    */
  }
}

const mapStateToProps = ({ user }) => ({
  apps: ["user", ...user.auth.apps]
});

export const MainNavigator = connect(mapStateToProps)(MainNavigatorHOC);

// ROOT NAVIGATOR -------------------------------------------------------------------------

export const RootNavigator: NavigationContainer = createSwitchNavigator({
  Bootstrap: () => <View />,
  Login: { screen: LoginPage },
  Main: { screen: () => <MainNavigator /> }
});

// NAV TOOLS -------------------------------------------------------------------------

function compareArrays(array1, array2) {
  if (!array2) {
    return false;
  }
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0, l = array1.length; i < l; i++) {
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      if (!array1[i].compare(array2[i])) {
        return false;
      }
    } else if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}
