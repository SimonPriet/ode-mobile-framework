/**
 * Pour information: on a regroupé dans un meme wrapper withNavigationWrapper et withMenuWrapper
 * afin de pouvoir recupérer la bonne valeur de:
 * navigation.getParam({filter}) suite à un navigation.push('Workspace', { filter, parentId, title })
 * Le fait que navigation.push() soit fait dans un composant et navigation.getParam dans un autre composant posent problème
 */
import * as React from "react";
import { View } from "react-native";
import { EVENT_TYPE, IEvent, IEventProps } from "../../types/ievents";
import { IItem } from "../types/states";
import { FilterId } from "../types/filters";
import { selectAction } from "../actions/select";
import { connect } from "react-redux";
import { IMenuItem } from "../../ui/types";
import { FloatingAction } from "../../ui/FloatingButton";
import { ToolbarAction } from "../../ui/Toolbar";
import { ISelectState } from "../reducers/select";

export interface IProps {
  navigation: any;
  selected: ISelectState;
  selectAction: Function;
}

function withMenuWrapper<T extends IProps>(WrappedComponent: React.ComponentType<T>): React.ComponentType<T> {
  return class extends React.Component<T> {
    getMenuItems(idMenu: string): IMenuItem[] {
      const { navigation } = this.props;
      const popupItems = navigation.getParam(idMenu) || [];
      const filter = navigation ? navigation.getParam("filter") : "root";

      return popupItems.reduce(
        (acc: any, items: any) => (items.filter === filter || items.filter === "root" ? items.items : acc),
        []
      );
    }

    public handleEvent({ type, onEvent, ...item }: IEvent & IEventProps & IItem) {
      switch (type) {
        case EVENT_TYPE.SELECT:
          const { id: parentId, name: title, isFolder } = item;
          const filterId = this.props.navigation.getParam("filter");
          const filter = filterId === FilterId.root ? parentId : filterId;

          this.props.selectAction(null); // deselect items

          isFolder
            ? this.props.navigation.push("Workspace", { filter, parentId, title })
            : this.props.navigation.push("WorkspaceDetails", { item, title });
          return;

        case EVENT_TYPE.LONG_SELECT:
          this.props.selectAction(item);
          return;

        case EVENT_TYPE.MENU_SELECT:
          const { navigation, selected } = this.props;

          if (item.id === "back") {
            this.props.selectAction(null);
          } // deselect items

          onEvent({ ...item, navigation, selected });
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
    { selectAction }
  )(withMenuWrapper(wrappedComponent));
