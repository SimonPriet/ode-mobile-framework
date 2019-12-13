import * as React from 'react';
import { FloatingAction } from './index';
import { Alert, View } from 'react-native';
import { IMenuProps } from '../../workspace/utils/menuNavigatorWrapper';
import { EVENT_TYPE, IItem } from '../../workspace/types';

export interface INotifyProps {
  navigation: any;
  uploadAction: any;
}

export function floatingActionWrapper(WrappedComponent: React.Component): React.Component {
  class HOC extends React.Component<IMenuProps> {
    public onPressItem(type: EVENT_TYPE, menuItem: IItem) {

    }

    render() {
      const { navigation } = this.props;
      const actions = navigation && navigation.getParam('actions');

      return (
        <View style={{ flex: 1 }}>
          <WrappedComponent {...this.props} />
          {actions && <FloatingAction actions={actions} position="topRight" onEvent={this.onPressItem.bind(this)} />}
        </View>
      );
    }
  }
  HOC.navigationOptions = WrappedComponent.navigationOptions;
  return HOC;
}
