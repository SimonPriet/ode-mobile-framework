import * as React from 'react';
import { FloatingAction } from '../ui/FloatingButton';
import { IEventProps, INavigationProps } from '../types';
import { View } from 'react-native';

export type IMenuProps = IEventProps &
  INavigationProps & {
    actions: any;
  };

interface IState {
  event: any;
}

export function withMenuWrapper(WrappedComponent: React.Component): React.Component {
  class HOC extends React.Component<IMenuProps, IState> {
    state = {
      event: null,
    };

    handleEvent(event: any) {
      this.setState({ ...event });
    }

    render() {
      const { navigation } = this.props;
      const actions = navigation ? navigation.getParam('actions') : null;

      return (
        <View style={{ flex: 1 }}>
          <WrappedComponent {...this.props} onEvent={this.state.event} />
          <FloatingAction actions={actions} onEvent={this.handleEvent.bind(this)} />
        </View>
      );
    }
  }

  HOC.navigationOptions = WrappedComponent.navigationOptions;
  return HOC;
}
