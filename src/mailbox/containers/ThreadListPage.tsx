import I18n from "i18n-js";
import * as React from "react";
import { connect } from "react-redux";
import {
  IThreadListPageDataProps,
  IThreadListPageEventProps,
  IThreadListPageProps,
  ThreadListPage
} from "../components/ThreadListPage";
import mailboxConfig from "../config";

import {
  conversationDeleteThread,
  conversationSetThreadRead,
  fetchConversationThreadList,
  fetchConversationThreadResetMessages,
  resetConversationThreadList
} from "../actions/threadList";
import { conversationThreadSelected } from "../actions/threadSelected";

import { removeAccents } from "../../utils/string";
import { findReceivers2 } from "../components/ThreadItem";
import { NavigationScreenProp, NavigationEventPayload, NavigationCompleteTransitionAction } from "react-navigation";
import { standardNavScreenOptions, alternativeNavScreenOptions } from "../../navigation/helpers/navScreenOptions";
import { HeaderAction } from "../../ui/headers/NewHeader";
import { SearchBar } from "../../ui/SearchBar";

// Search query tools

const threadToString = thread => {
  const searchtext = removeAccents(
    (thread.subject || "") +
    " " +
    findReceivers2(thread.to, thread.from, thread.cc)
      .map(r => {
        const u = thread.displayNames.find(dn => dn[0] === r);
        return u ? u[1] : I18n.t("unknown-user");
      })
      .join(", ")
  ).toLowerCase();
  return searchtext;
};

const sanifyQuery = (filter: string) => removeAccents(filter.toLowerCase());

// ------------------

const mapStateToProps: (state: any) => IThreadListPageDataProps = state => {
  // Extract data from state
  const localState = state[mailboxConfig.reducerName].threadList;
  try {
    return {
      isFetching: localState.isFetching,
      isRefreshing: localState.data.isRefreshing,
      page: localState.data.page,
      threads: localState.data.ids.map((threadId: string) => localState.data.byId[threadId])
    };
  } catch (e) {
    return {
      isFetching: false,
      isRefreshing: false,
      page: 0,
      threads: []
    };
  }
};

const mapDispatchToProps: (
  dispatch: any
) => IThreadListPageEventProps = dispatch => {
  return {
    dispatch,
    onDeleteThread: (threadId: string) => {
      dispatch(conversationDeleteThread(threadId));
    },
    onFocus: () => {
      // clearFilterConversation(dispatch)();
    },
    onOpenThread: (threadId: string) => {
      dispatch(conversationThreadSelected(threadId));
      dispatch(fetchConversationThreadResetMessages(threadId));
      dispatch(conversationSetThreadRead(threadId));
    }
  };
};

class ThreadListPageContainer extends React.PureComponent<
  IThreadListPageProps & { dispatch: any },
  {}
  > {

  // Header definition ----------------------------------------------------------------------------

  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{}> }) => {
    return !navigation.getParam('isSearching', false) ?
      standardNavScreenOptions({
        title: I18n.t("Conversation"),
        headerLeft: <HeaderAction // ToDo : Hide if data is empty
          onPress={() => { navigation.setParams({ isSearching: true }) }}
          name="search"
        />,
        headerRight: <HeaderAction
          onPress={() => { navigation.getParam('onNewThread') && navigation.getParam('onNewThread')() }}
          name="new_message"
          iconSize={24}
          primary
        />,
        headerLeftContainerStyle: {
          alignItems: "flex-start"
        },
        headerRightContainerStyle: {
          alignItems: "flex-start"
        },
        headerTitleContainerStyle: {
          alignItems: "flex-start",
          height: 55.667 // 🍔 Big (M)hack of the death of the world. The `alignItems` property doesn't seem to work here.
        }
      },
        navigation) :
      alternativeNavScreenOptions({
        headerTitle: <SearchBar
          onChange={search => { navigation.setParams({ query: search }) }}
          text={navigation.getParam('query', '')}
          autoFocus={true}
        />,
        headerLeft: <HeaderAction
          onPress={() => { return }}
          name="search"
          disabled
        />,
        headerRight: <HeaderAction
          onPress={() => { navigation.getParam('onResetSearch') && navigation.getParam('onResetSearch')() }}
          name="close"
        />,
      },
        navigation);
  }

  // ----------------------------------------------------------------------------------------------

  constructor(props: IThreadListPageProps & { dispatch: any }) {
    super(props);
    // Initial setup
    this.resetSearch();
    this.reloadList();
    // Header events setup
    this.props.navigation.setParams({
      onResetSearch: this.resetSearch.bind(this),
      onNewThread: () => { this.props.navigation.navigate("newThread"); }
    });
  }

  public resetSearch() {
    this.props.navigation.setParams({
      isSearching: false,
      query: ''
    });
  }

  public reloadList() {
    if (this.props.isFetching || !this.props.navigation.isFocused()) return;
    this.props.dispatch(resetConversationThreadList());
  }

  public fetchNextPage() {
    if (this.props.isFetching) return;
    this.props.dispatch(fetchConversationThreadList((this.props.page || 0) + 1));
  }

  // lifecycle ------------------------------------------------------------------------------------

  private blurListener: any;
  public componentDidMount() {
    this.blurListener = this.props.navigation.addListener('didBlur', this.componentDidBlur.bind(this));
  }

  public componentWillUnmount() {
    this.blurListener.remove();
  }

  public componentDidBlur(payload: NavigationEventPayload) {
    if (!(payload.action && (payload.action as NavigationCompleteTransitionAction).key === "mailbox")) { // ToDo : where to get this constant ?
      // console.log("BLUR", payload);
      this.resetSearch();
    }
  }

  public render() {
    const query = sanifyQuery(this.props.navigation.getParam('query', ''));
    let filteredThreads = this.props.threads;
    if (this.props.navigation.getParam('isSearching', false) && query) {
      filteredThreads = this.props.threads
        ? this.props.threads.filter(thread =>
          threadToString(thread).indexOf(query) !== -1)
        : []
    }
    return (
      <ThreadListPage
        {...this.props}
        threads={filteredThreads}
        onNextPage={this.fetchNextPage.bind(this)}
        onRefresh={this.reloadList.bind(this)}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThreadListPageContainer);
