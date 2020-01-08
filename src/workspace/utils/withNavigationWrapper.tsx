import * as React from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { HeaderAction, HeaderIcon } from '../../ui/headers/NewHeader';
import { standardNavScreenOptions } from '../../navigation/helpers/navScreenOptions';
import I18n from 'i18n-js';
import config from '../config';
import { ViewStyle } from 'react-native';
import { EVENT_TYPE, IEvent } from '../../types/ievents';
import { IItem } from '../types/states';
import { FilterId } from '../types/filters';
import { selectAction } from '../actions/select';
import { connect } from 'react-redux';

export interface IProps {
  navigation: any;
  dispatch: Function;
}

const HeaderBackAction = ({ navigation, style }: { navigation: NavigationScreenProp<{}>; style?: ViewStyle }) => {
  return <HeaderAction onPress={() => navigation.pop()} name={'back'} style={style} />;
};

function withNavigationWrapper<T extends IProps>(WrappedComponent: React.ComponentType<T>): React.ComponentType<T> {
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
        if (childRoute != this.childRoute || childParams != this.childParams) {
          this.childRoute = childRoute;
          this.childParams = childParams;
          navigation.setParams({ childRoute: undefined });
          navigation.setParams({ childParams: undefined });
          navigation.push(childRoute, childParams);
        }
      }
    }

    public handleEvent(event: any) {
      const { type, ...item } = event as IEvent & IItem;

      switch (type) {
        case EVENT_TYPE.SELECT:
          const { id: parentId, name: title, isFolder } = item;
          const filterId = this.props.navigation.getParam('filter');
          const filter = filterId === FilterId.root ? parentId : filterId;

          isFolder
            ? this.props.navigation.push('Workspace', { filter, parentId, title })
            : this.props.navigation.push('WorkspaceDetails', { item, title });
          return;

        case EVENT_TYPE.LONG_SELECT:
          const { id } = item;
          const { dispatch } = this.props;

          dispatch(selectAction(id));
          return;
      }
    }

    render() {
      return <WrappedComponent {...this.props} onEvent={this.handleEvent.bind(this)} />;
    }
  };
}

export default (wrappedComponent: React.ComponentType<any>): React.ComponentType<any> =>
  connect()(withNavigationWrapper(wrappedComponent));
