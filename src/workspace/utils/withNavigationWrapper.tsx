import * as React from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { HeaderAction, HeaderIcon } from '../../ui/headers/NewHeader';
import { standardNavScreenOptions } from '../../navigation/helpers/navScreenOptions';
import I18n from 'i18n-js';
import config from '../config';
import { ViewStyle } from 'react-native';

export interface IProps {
  navigation: any;
}

const HeaderBackAction = ({ navigation, style }: { navigation: NavigationScreenProp<{}>; style?: ViewStyle }) => {
  return <HeaderAction onPress={() => navigation.pop()} name={'back'} style={style} />;
};

export default function withNavigationWrapper<T extends IProps>(
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
        if (childRoute != this.childRoute || childParams != this.childParams) {
          this.childRoute = childRoute;
          this.childParams = childParams;
          navigation.setParams({ childRoute: undefined });
          navigation.setParams({ childParams: undefined });
          navigation.push(childRoute, childParams);
        }
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
