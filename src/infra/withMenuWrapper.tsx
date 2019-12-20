import * as React from 'react';
import { FloatingAction } from '../ui/FloatingButton';
import { IEventProps, INavigationProps } from '../types';
import { View } from 'react-native';

export type IMenuProps = IEventProps &
  INavigationProps & {
    actions: any;
    dispatch: Function;
  };

export function withMenuWrapper(WrappedComponent: React.Component): React.Component {
  class HOC extends React.Component<IMenuProps> {
    handleEvent(event: any) {
      event.onSelect(this.props.dispatch, event);
    }

    render() {
      const { navigation } = this.props;
      const actions = navigation ? navigation.getParam('actions') : null;

      return (
        <View style={{ flex: 1 }}>
          <WrappedComponent {...this.props} />
          <FloatingAction actions={actions} onEvent={this.handleEvent.bind(this)} />
        </View>
      );
    }
  }

  HOC.navigationOptions = WrappedComponent.navigationOptions;
  return HOC;
}
