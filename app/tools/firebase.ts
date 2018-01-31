import firebase from "react-native-firebase"

const analytics = firebase.app().analytics();
analytics.logEvent('Analytics_configuration_done');

// Issue with Typescript and react-native-firebase
// https://github.com/invertase/react-native-firebase/issues/774
// const crashlytics = firebase.fabric.crashlytics()
const crashlytics = firebase.app().fabric.crashlytics()
crashlytics.log("Crashlytics configuration done.")

const perfMonitoring = firebase.app().perf();
const trace = perfMonitoring.newTrace(`PerformanceMonitoring_configuration_done`);
trace.start();
trace.incrementCounter(`PerformanceMonitoring__increment`);
trace.stop();
