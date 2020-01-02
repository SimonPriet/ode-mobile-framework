import * as React from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { bindActionCreators } from 'redux';
import { NavigationEventSubscription } from 'react-navigation';
import config from '../config';
import { EVENT_TYPE, FilterId, IItem, IItemsProps, IState } from '../types';
import { Item } from '../components';
import { listAction } from '../actions/list';
import { CommonStyles } from '../../styles/common/styles';
import { layoutSize } from '../../styles/common/layoutSize';
import ConnectionTrackingBar from '../../ui/ConnectionTrackingBar';
import { getEmptyScreen } from '../utils/empty';
import { PageContainer } from '../../ui/ContainerContent';
import { Loading, ProgressBar } from '../../ui';
import { removeAccents } from '../../utils/string';
import withNavigationWrapper from '../utils/withNavigationWrapper';
import withUploadWrapper from '../utils/withUploadWrapper';
import { withMenuWrapper } from '../../infra/withMenuWrapper';
import { IEvent } from '../../types/ievents';

const styles = StyleSheet.create({
  separator: {
    borderBottomColor: CommonStyles.borderColorLighter,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: layoutSize.LAYOUT_84,
  },
});

export class Items extends React.PureComponent<IItemsProps, { isFocused: boolean }> {
  focusListener!: NavigationEventSubscription;

  public componentDidMount() {
    this.focusListener = this.props.navigation.addListener('willFocus', () => {
      this.makeRequest();
    });
  }

  public componentWillUnmount() {
    this.focusListener.remove();
  }

  public makeRequest() {
    this.props.listAction({
      filter: this.props.navigation.getParam('filter'),
      parentId: this.props.navigation.getParam('parentId'),
    });
  }

  public onEvent(event: any) {
    const { type, ...item } = event as IEvent & IItem;

    switch (type) {
      case EVENT_TYPE.SELECT:
        const { id: parentId, name: title, isFolder } = item;
        const filterId = this.props.navigation.getParam('filter');
        const filter = filterId == FilterId.root ? parentId : filterId;

        isFolder
          ? this.props.navigation.push('Workspace', { filter, parentId, title })
          : this.props.navigation.push('WorkspaceDetails', { item, title });
        return;

      case EVENT_TYPE.MENU_SELECT:
        Alert.alert(item.id);
        return;
    }
  }

  private sortItems(a: IItem, b: IItem): number {
    const sortByType = (a: IItem, b: IItem): number => {
      if (a.isFolder == b.isFolder) {
        return 0;
      } else {
        return a.isFolder ? -1 : 1;
      }
    };

    const sortByName = (a: IItem, b: IItem): number => {
      return removeAccents(a.name.toLocaleLowerCase()).localeCompare(removeAccents(b.name.toLocaleLowerCase()));
    };

    return sortByType(a, b) != 0 ? sortByType(a, b) : sortByName(a, b);
  }

  public render(): React.ReactNode {
    const { items, isFetching = false } = this.props;

    const getViewToRender = () => {
      if (items == undefined) {
        return <Loading />;
      } else {
        const values = Object.values(items);
        const parentId = this.props.navigation.getParam('parentId') || null;
        const itemsArray = parentId === FilterId.root ? values : values.sort(this.sortItems);

        return (
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={itemsArray}
            ListEmptyComponent={getEmptyScreen(parentId)}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyExtractor={(item: IItem) => item.id}
            refreshing={isFetching}
            onRefresh={() => this.makeRequest()}
            renderItem={({ item }) => <Item {...item} onEvent={this.onEvent.bind(this)} />}
          />
        );
      }
    };

    return (
      <PageContainer>
        <ConnectionTrackingBar />
        <ProgressBar />
        {getViewToRender()}
      </PageContainer>
    );
  }
}

const getProps = (stateItems: IState, props: any) => {
  const parentId = props.navigation.getParam('parentId');
  const parentIdItems = stateItems[parentId] || {};
  const isFetching = parentIdItems.isFetching || false;

  return { isFetching, items: parentIdItems.data };
};

const mapStateToProps = (state: any, props: any) => {
  return getProps(config.getLocalState(state).items, props);
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ listAction }, dispatch);
};

export default compose<IItemsProps, any>(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withNavigationWrapper,
  withMenuWrapper,
  withUploadWrapper,
)(Items);


