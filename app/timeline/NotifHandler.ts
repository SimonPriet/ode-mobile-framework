import { nainNavNavigate } from "../navigation/helpers/navHelper";
import Tracking from "../tracking/TrackingManager";
import { listTimeline } from "./actions/list";
import { storedFilters, timelineApps } from "./actions/storedFilters";
import { loadSchoolbooks } from "./actions/dataTypes";

const openNotif = {
  "/schoolbook": async (data, latestNews) => {
    // console.log("notif schoolbook", data, latestNews);
    if (!data.resourceUri || data.resourceUri.indexOf("word") === -1) {
      nainNavNavigate("notifications");
      return;
    }
    const wordId = data.resourceUri.split("word/")[1];
    // console.log("GOT WORD", wordId);
    return latestNews.find(
      n => n.resourceUri === data.resourceUri && n.application === "schoolbook"
    );
  },

  "/actualites": async (data, latestNews) => {
    if (data.resourceUri.indexOf("/info") === -1) {
      nainNavNavigate("notifications");
      return;
    }

    const split = data.resourceUri.split("/");
    const infoId = split[split.length - 1];
    return latestNews.find(
      n => n.resourceUri === data.resourceUri && n.application === "news"
    );
  },

  "/blog": async (data, latestNews) => {
    if (!data.postUri) {
      return;
    }

    const split = data.postUri.split("/");
    const postId = split[split.length - 1];
    return latestNews.find(
      n => n.resourceId === postId && n.application === "blog"
    );
  }
};

export default dispatch => async (notificationData, legalapps) => {
  for (const path in openNotif) {
    if (notificationData.resourceUri.startsWith(path)) {
      const availableApps = await storedFilters(legalapps);
      const latestNews = await listTimeline(dispatch)(
        0,
        availableApps,
        legalapps
      );
      await loadSchoolbooks();
      const item = await openNotif[path](notificationData, latestNews);
      if (item) {
        Tracking.logEvent("readNews", {
          application: item.application,
          articleName: item.title,
          authorName: item.senderName,
          published: item.date,
          articleId: item.id
        });
        nainNavNavigate("newsContent", { news: item, expend: true });
      } else {
        nainNavNavigate("notifications");
      }
    }
  }
};
