/**
 * Pour information: on a regroupé dans un meme wrapper withNavigationWrapper et withMenuWrapper
 * afin de pouvoir recupérer la bonne valeur de:
 * navigation.getParam({filter}) suite à un navigation.push('Workspace', { filter, parentId, title })
 * Le fait que navigation.push() soit fait dans un composant et navigation.getParam dans un autre composant posent problème
 */
import * as React from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { HeaderAction, HeaderIcon } from '../../ui/headers/NewHeader';
import { standardNavScreenOptions } from '../../navigation/helpers/navScreenOptions';
import I18n from 'i18n-js';
import config from '../config';
import { View, ViewStyle } from 'react-native';
import { EVENT_TYPE, IEvent } from '../../types/ievents';
import { IItem } from '../types/states';
import { FilterId } from '../types/filters';
import { selectAction } from '../actions/select';
import { connect } from 'react-redux';
import { IMenuItem } from '../../ui/types';
import { FloatingAction } from '../../ui/FloatingButton';
import { ToolbarAction } from '../../ui/Toolbar';

export interface IProps {
  navigation: any;
  selected: IItem[];
  selectAction: Function;
}

const HeaderBackAction = ({ navigation, style }: { navigation: NavigationScreenProp<{}>; style?: ViewStyle }) => {
  return <HeaderAction onPress={() => navigation.pop()} name={'back'} style={style} />;
};

function withMenuAndNavigationWrapper<T extends IProps>(
  WrappedComponent: React.ComponentType<T>,
): React.ComponentType<T> {
  return class extends React.Component<T> {
    static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{}> }) => {
      return standardNavScreenOptions(
        {
          title: navigation.getParam('title') || I18n.t(config.displayName),
          headerLeft: <HeaderBackAction navigation={navigation} />,
          headerRight: <HeaderIcon name={null} hidden={true} />,
        },
        navigation,
      );
    };
    childRoute: any = null;
    childParams: any = null;

    public componentDidUpdate(): void {
      const { navigation } = this.props;
      const childRoute: any = navigation.getParam('childRoute');
      const childParams: any = navigation.getParam('childParams');

      if (childRoute && childParams) {
        if (childRoute !== this.childRoute || childParams !== this.childParams) {
          this.childRoute = childRoute;
          this.childParams = childParams;
          navigation.setParams({ childRoute: undefined });
          navigation.setParams({ childParams: undefined });
          navigation.push(childRoute, childParams);
        }
      }
    }

    getMenuItems(): IMenuItem[] {
      const { navigation } = this.props;
      const popupItems = navigation ? navigation.getParam('popupItems') : [];
      const filter = navigation ? navigation.getParam('filter') : 'root';

      return popupItems.reduce(
        (acc: any, items: any) => (items.filter === filter || items.filter === 'root' ? items.items : acc),
        [],
      );
    }

    getToolbarItems(): IMenuItem[] {
      const { navigation } = this.props;
      let toolbarItems = navigation ? navigation.getParam('toolbarItems') : [];
      const filter = navigation ? navigation.getParam('filter') : 'root';

      return toolbarItems.reduce(
        (acc: any, items: any) => (items.filter === filter || items.filter === 'root' ? items.items : acc),
        [],
      );
    }

    public handleEvent(event: any) {
      const { type, ...item } = event as IEvent & IItem;

      switch (type) {
        case EVENT_TYPE.SELECT:
          const { id: parentId, name: title, isFolder } = item;
          const filterId = this.props.navigation.getParam('filter');
          const filter = filterId === FilterId.root ? parentId : filterId;

          this.props.selectAction(null); // deselect items

          isFolder
            ? this.props.navigation.push('Workspace', { filter, parentId, title })
            : this.props.navigation.push('WorkspaceDetails', { item, title });
          return;

        case EVENT_TYPE.LONG_SELECT:
          const { id } = item;

          this.props.selectAction(id);
          return;

        case EVENT_TYPE.MENU_SELECT:
          const { selected } = this.props;

          event.onEvent({ ...event, selected });
          return;
      }
    }

    render() {
      const { selected } = this.props;
      const nbSelected = Object.keys(selected).length;
      const menuItems = this.getMenuItems();
      const toolbarItems = this.getToolbarItems();

      return (
        <View style={{ flex: 1 }}>
          <WrappedComponent {...this.props as T} onEvent={this.handleEvent.bind(this)} />
          <FloatingAction menuItems={menuItems} onEvent={this.handleEvent.bind(this)} nbSelected={nbSelected} />
          <ToolbarAction menuItems={toolbarItems} onEvent={this.handleEvent.bind(this)} nbSelected={nbSelected} />
        </View>
      );
    }
  };
}

const mapStateToProps = (state: any) => {
  return { selected: state.workspace.selected }; // dependency with workspace, not good
};

export default (wrappedComponent: React.ComponentType<any>): React.ComponentType<any> =>
  connect(
    mapStateToProps,
    { selectAction },
  )(withMenuAndNavigationWrapper(wrappedComponent));
