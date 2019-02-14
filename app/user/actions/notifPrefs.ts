import { fetchJSONWithCache } from "../../infra/fetchWithCache";
import { preference, savePreference } from "../../infra/Me";
import userConfig from "../config";

export const actionTypeSetNotifPrefs = userConfig.createActionType(
  "NOTIFICATIONS_PREFS_SET"
);

export function loadNotificationPrefs() {
  return async (dispatch, getState) => {
    // console.log("load timeline default notif prefs");
    const defaultNotifs = await fetchJSONWithCache(
      "/timeline/notifications-defaults"
    );
    // console.log("load preference timeline prefs");
    // console.log("default notif prefs", defaultNotifs);
    const defaultNotifsPrefsConfig = defaultNotifs.reduce((acc, el) => {
      // console.log("el:", el);
      acc[el.key] = el;
      // By default, all notif types seem to be activated, even if the backend say that only mailbow is activated.
      // Uncomment the two lines below to force to show all notif prefs ON.
      // acc[el.key].defaultFrequency = "IMMEDIATE";
      // acc[el.key]["push-notif"] = true;
      return acc;
    }, {});
    // console.log("defaultNotifsPrefsConfig", defaultNotifsPrefsConfig);
    const timelinePrefs = (await preference("timeline")) || {
      config: defaultNotifsPrefsConfig,
      page: 0,
      type: []
    };
    // console.log("timeline prefs:", timelinePrefs);
    const newNotifs = defaultNotifs.map(notif => ({
      ...notif,
      defaultFrequency:
        timelinePrefs.config && timelinePrefs.config[notif.key]
          ? timelinePrefs.config[notif.key].defaultFrequency
          : notif.defaultFrequency,
      "push-notif":
        timelinePrefs.config &&
        timelinePrefs.config[notif.key] &&
        timelinePrefs.config[notif.key].defaultFrequency === "IMMEDIATE"
          ? timelinePrefs.config[notif.key]["push-notif"]
          : false
    }));

    dispatch({
      notificationPrefs: newNotifs,
      type: actionTypeSetNotifPrefs
    });
  };
}

export const excludeNotifTypes = [
  "blog.publish-comment",
  "blog.share",
  "blog.submit-post",
  "messagerie.storage",
  "news.news-comment",
  "news.news-published",
  "news.news-submitted",
  "news.news-update",
  "news.news-unpublished",
  "news.news-unsubmitted",
  "news.thread-shared",
  "schoolbook.acknowledge",
  "schoolbook.modifyresponse",
  "schoolbook.response",
  "schoolbook.word-resend",
  "schoolbook.word-shared"
];

export function setNotificationPref(notif, value, notificationPrefs) {
  return async (dispatch, getState) => {
    const newPrefs = notificationPrefs.reduce((acc, cur, i) => {
      acc[cur.key] = {
        ...cur,
        defaultFrequency:
          notif.key === cur.key && value ? "IMMEDIATE" : cur.defaultFrequency,
        "push-notif": notif.key === cur.key ? value : cur["push-notif"] === true
      };
      return acc;
    }, {});

    dispatch({
      notificationPrefs: Object.keys(newPrefs).map(p => ({
        ...newPrefs[p],
        key: p
      })),
      type: actionTypeSetNotifPrefs
    });

    savePreference("timeline", {
      config: newPrefs
    });
  };
}
