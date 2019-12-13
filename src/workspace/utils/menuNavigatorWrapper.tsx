
import * as React from "react"
import {FloatingAction} from "../../ui/FloatingButton";
import {View} from "react-native";

export interface IMenuProps {
  navigation: any,
  actions: any,
}

export function menuNavigatorWrapper(WrappedComponent: React.Component): React.Component {
  class HOC extends React.Component<IMenuProps> {
    render() {
      const { navigation } = this.props;
      const actions = navigation ? navigation.getParam('actions') : null;

      return (
        <View>
          <FloatingAction
            actions={actions}
            position='topRight'
          />
          <WrappedComponent {...this.props} />;
        </View>
      );
      }
    }
  return HOC;
}
