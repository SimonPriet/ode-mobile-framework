/**
 * Pour information: on a regroupé dans un meme wrapper withNavigationWrapper et withMenuWrapper
 * afin de pouvoir recupérer la bonne valeur de:
 * navigation.getParam({filter}) suite à un navigation.push('Workspace', { filter, parentId, title })
 * Le fait que navigation.push() soit fait dans un composant et navigation.getParam dans un autre composant posent problème
 */
import * as React from "react";
import { View } from "react-native";
import { EVENT_TYPE, IEvent } from "../../types/ievents";
import { FilterId } from "../types/filters";
import { selectAction } from "../actions/select";
import { connect } from "react-redux";
import { IMenuItem } from "../../ui/types";
import { FloatingAction } from "../../ui/FloatingButton";
import { ToolbarAction } from "../../ui/Toolbar";
import { ISelectState } from "../reducers/select";
import { ConfigDialog } from "../../ui/ConfigDialog";

export interface IProps {
  navigation: any;
  selected: ISelectState<any>;
  selectAction: Function;
}

function withMenuWrapper<T extends IProps>(WrappedComponent: React.ComponentType<T>): React.ComponentType<T> {
  return class extends React.Component<T> {
    configDialog = null;
    state = {
      refresh: false,
    };

    getMenuItems(idMenu: string): IMenuItem[] {
      const { navigation } = this.props;
      const popupItems = navigation.getParam(idMenu) || [];
      const filter = navigation ? navigation.getParam("filter") : "root";

      return popupItems.reduce(
        (acc: any, items: any) => (items.filter === filter || items.filter === "root" ? items.items : acc),
        []
      );
    }

    public handleEvent({ type, item }: IEvent) {
      const { navigation, selectAction, selected } = this.props;

      switch (type) {
        case EVENT_TYPE.SELECT:
          if (Object.keys(selected).length) {
            selectAction(item);
          } else {
            const { id: parentId, name: title, isFolder } = item;
            const filterId = this.props.navigation.getParam("filter");
            const filter = filterId === FilterId.root ? parentId : filterId;

            isFolder
              ? navigation.push("Workspace", { filter, parentId, title })
              : navigation.push("WorkspaceDetails", { item, title });
          }
          return;

        case EVENT_TYPE.LONG_SELECT:
          selectAction(item);
          return;

        case EVENT_TYPE.MENU_SELECT:
          const menuItem = item;

          if (menuItem.id === "back") {
            selectAction(null);
            return;
          } // deselect items

          // check to see if dialog
          if (menuItem.dialog) {
            // this.configDialog = new ConfigDialog({ item, selected, navigation });
            this.configDialog = React.createElement(ConfigDialog, { item, selected, navigation }, null);
            this.setState({ refresh: !this.state.refresh });
          } else {
            menuItem.onEvent({ navigation, selected });
          }
          return;
      }
    }

    render() {
      const { selected } = this.props;
      const nbSelected = Object.keys(selected).length;
      const menuItems = this.getMenuItems("popupItems");
      const toolbarItems = this.getMenuItems("toolbarItems");

      return (
        <View style={{ flex: 1 }}>
          <WrappedComponent {...this.props as T} onEvent={this.handleEvent.bind(this)} />
          <FloatingAction menuItems={menuItems} onEvent={this.handleEvent.bind(this)} nbSelected={nbSelected} />
          <ToolbarAction menuItems={toolbarItems} onEvent={this.handleEvent.bind(this)} nbSelected={nbSelected} />
          {this.configDialog}
        </View>
      );
    }
  };
}

const mapStateToProps = (state: any) => {
  return { selected: state.workspace.selected };
};

export default (wrappedComponent: React.ComponentType<any>): React.ComponentType<any> =>
  connect(
    mapStateToProps,
    { selectAction }
  )(withMenuWrapper(wrappedComponent));
