import * as React from 'react';
import { FloatingAction } from '../../ui/FloatingButton';
import { ToolbarAction } from '../../ui/Toolbar';
import { View } from 'react-native';
import { IMenuItem } from '../../ui/types';
import { connect } from 'react-redux';

export type IProps = {
  navigation: any;
  dispatch: Function;
  select: any[];
};

function withMenuWrapper<T extends IProps>(WrappedComponent: React.ComponentType<T>): React.ComponentType<T> {
  return class extends React.Component<T> {
    handleEvent(event: IMenuItem) {
      event.onEvent(event);
    }

    getMenuItems(): IMenuItem[] {
      const { navigation } = this.props;
      const popupItems = navigation ? navigation.getParam('popupItems') : null;
      const filter = navigation ? navigation.getParam('filter') : 'root';

      return popupItems.reduce((acc: any, items: any) => (items.filter === filter ? items.items : acc), []);
    }

    getToolbarItems(): IMenuItem[] {
      const { select } = this.props;

      if (select && select.length > 0) {
        const { navigation } = this.props;
        const toolbarItems = navigation ? navigation.getParam('toolbarItems') : null;
        const filter = navigation ? navigation.getParam('filter') : 'root';

        return toolbarItems.reduce((acc: any, items: any) => (items.filter === filter ? items.items : acc), []);
      } else {
        return [];
      }
    }

    render() {
      return (
        <View style={{ flex: 1 }}>
          <WrappedComponent {...this.props as T} />
          <FloatingAction menuItems={this.getMenuItems()} onEvent={this.handleEvent.bind(this)} />
          <ToolbarAction menuItems={this.getToolbarItems()} onEvent={this.handleEvent.bind(this)} />
        </View>
      );
    }
  };
}

const mapStateToProps = (state: any) => {
  return { select: state.select };
};

export default (wrappedComponent: React.ComponentType<any>): React.ComponentType<any> =>
  connect(mapStateToProps)(withMenuWrapper(wrappedComponent));
