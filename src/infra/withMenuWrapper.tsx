import * as React from 'react';
import { FloatingAction } from '../ui/FloatingButton';
import { View } from 'react-native';
import { IMenuItem } from '../ui/FloatingButton/types';

export type IProps = {
  navigation: any;
  dispatch: Function;
};

export function withMenuWrapper<T extends IProps>(WrappedComponent: React.ComponentType<T>): React.ComponentType<T> {
  return class extends React.Component<T> {
    handleEvent(event: IMenuItem) {
      event.onEvent(event);
    }

    render() {
      const { navigation } = this.props;
      const menuItems = navigation ? navigation.getParam('menuItems') : null;

      return (
        <View style={{ flex: 1 }}>
          <WrappedComponent {...this.props as T} />
          <FloatingAction menuItems={menuItems} onEvent={this.handleEvent.bind(this)} />
        </View>
      );
    }
  };
}
