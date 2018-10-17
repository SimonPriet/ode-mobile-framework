/**
 * ThreadPage
 *
 * Display page for messages of a single thread. It's a chat user interface.
 *
 * Props :
 *    `isFetching` - is data currently fetching from the server.
 *
 *    `navigation` - React Navigation instance.
 */

// Imports ----------------------------------------------------------------------------------------

// Libraries
import style from "glamorous-native";
import * as React from "react";
import I18n from "react-native-i18n";
import Swipeable from "react-native-swipeable";
import ViewOverflow from "react-native-view-overflow";

import moment from "moment";
// tslint:disable-next-line:no-submodule-imports
import "moment/locale/fr";
moment.locale("fr");

// Components
import { KeyboardAvoidingView, Platform, RefreshControl } from "react-native";
const { View, FlatList, Text } = style;
import styles from "../../styles";

import { Loading, Row } from "../../ui";
import ConnectionTrackingBar from "../../ui/ConnectionTrackingBar";
import { PageContainer } from "../../ui/ContainerContent";
import { EmptyScreen } from "../../ui/EmptyScreen";
import ThreadMessage from "../components/ThreadMessage";

// Type definitions

import { Carousel } from "../../ui/Carousel";
import {
  IConversationMessage,
  IConversationMessageList
} from "../reducers/messages";
import { IConversationThread } from "../reducers/threadList";

// Misc

import { signImagesUrls } from "../../infra/oauth";
import today from "../../utils/today";

// Props definition -------------------------------------------------------------------------------

export interface IThreadPageDataProps {
  isFetching?: boolean; // is fetching older messages
  isRefreshing?: boolean; // is fetching newer messages
  threadInfo?: IConversationThread; // global thread information
  messages?: IConversationMessage[]; // message info & content for all given messageIds in threadInfo. Given from the most recent to the oldest one.
  headerHeight?: number; // header height, really ?
}

export interface IThreadPageEventProps {
  onGetNewer?: () => void;
  onGetOlder?: (threadId: string) => void;
}

export interface IThreadPageOtherProps {
  navigation?: any;
}

export type IThreadPageProps = IThreadPageDataProps &
  IThreadPageEventProps &
  IThreadPageOtherProps;

export interface IThreadPageState {
  showCarousel: boolean;
  images: Array<{ src: string; alt: string }>;
  imageCurrent: number;
}

export const defaultState: IThreadPageState = {
  imageCurrent: 0,
  images: [],
  showCarousel: false
};

// Main component ---------------------------------------------------------------------------------

export class ThreadPage extends React.PureComponent<
  IThreadPageProps,
  IThreadPageState
> {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  public todaySeparatorAlreadyDisplayed: boolean = false;

  // Render

  public render() {
    const { isFetching, threadInfo } = this.props;
    const messages = threadInfo.messages;
    const isEmpty = messages.length === 0;

    const pageContent = isEmpty
      ? isFetching
        ? this.renderLoading()
        : this.renderEmptyScreen()
      : this.renderMessageList();

    return (
      <PageContainer>
        <ConnectionTrackingBar />
        {pageContent}
      </PageContainer>
    );
  }

  public renderLoading() {
    return <Loading />;
  }

  public renderEmptyScreen() {
    return (
      <EmptyScreen
        imageSrc={require("../../../assets/images/empty-screen/conversations.png")}
        imgWidth={571}
        imgHeight={261}
        text={I18n.t("conversation-emptyScreenText")}
        title={I18n.t("conversation-emptyScreenTitle")}
        scale={0.76}
      />
    );
  }

  public renderMessageList() {
    const {
      isFetching,
      isRefreshing,
      onGetNewer,
      onGetOlder,
      threadInfo,
      messages,
      headerHeight
    } = this.props;

    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={headerHeight}
      >
        <ConnectionTrackingBar />

        <Carousel
          startIndex={this.state.imageCurrent}
          visible={this.state.showCarousel}
          onClose={() => this.setState({ showCarousel: false })}
          images={signImagesUrls(this.state.images)}
        />

        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => onGetNewer()}
              style={{ transform: [{ scaleY: -1 }] }}
            />
          }
          data={messages}
          renderItem={({ item }) => this.renderMessageItem(item)}
          style={styles.grid}
          inverted={true}
          keyExtractor={(item: IConversationMessage) => item.id}
          onEndReached={() => onGetOlder(threadInfo.id)}
        />
        {/*<MediaInput />*/}
      </KeyboardAvoidingView>
    );
  }

  public renderMessageItem(message: IConversationMessage) {
    return (
      <View>
        {/*!this.todaySeparatorAlreadyDisplayed &&
          message.date.isSameOrAfter(today(), "day") &&
        this.renderTodaySeparator()*/
        /* TODO: This block is buggy (shows onyl for the last message if it's today)
          But it's never used in the old version of conversation module.
        */}
        <ThreadMessage
          {...message}
          onOpenImage={(
            imageIndex: number,
            images: Array<{ alt: string; src: string }>
          ) => this.handleOpenImage(imageIndex, images)}
        />
      </View>
    );
  }
  /*
  TODO : Dead code in old `conversation` module. So what to do this time ?

  public renderTodaySeparator() {
    this.todaySeparatorAlreadyDisplayed = true;
    return (
      <Row>
        <Border />
        <Text>{I18n.t("today")}</Text>
        <Border />
      </Row>
    );
  }
  */
  public handleOpenImage(
    imageIndex: number,
    images: Array<{ src: string; alt: string }>
  ) {
    this.setState({
      imageCurrent: imageIndex,
      images,
      showCarousel: true
    });
  }

  // Lifecycle

  // Event Handlers
}

const Border = style.view({
  backgroundColor: "#DCDDE0",
  flex: 1,
  height: 1,
  marginHorizontal: 10
});

export default ThreadPage;
