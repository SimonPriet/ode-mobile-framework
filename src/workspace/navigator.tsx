import { createStackNavigator } from "react-navigation-stack";
import ContainerItems from "./containers/Items";
import { Details } from "./containers/Details";
import { ISelectedProps } from "../types/ievents";
import { Alert } from "react-native";
import { uploadAction } from "./actions/upload";
import pickFile from "../infra/actions/pickFile";
import { connect } from "react-redux";
import { NavigationScreenProp } from "react-navigation";
import I18n from "i18n-js";
import config from "./config";
import { HeaderAction, HeaderIcon } from "../ui/headers/NewHeader";
import * as React from "react";
import { standardNavScreenOptions } from "../navigation/helpers/navScreenOptions";
import t from "tcomb-form-native";

const mapStateToProps = (state: any) => {
  return { selected: state.selected };
};

export default connect(
  mapStateToProps,
  { uploadAction }
)(
  createStackNavigator(
    {
      Workspace: {
        screen: ContainerItems,
        params: {
          popupItems: [
            {
              filter: "owner",
              items: [
                {
                  text: "Ajouter Document",
                  icon: "file-plus",
                  id: "addDocument",
                  onEvent: () => {
                    pickFile().then(contentUri => uploadAction(contentUri));
                  },
                },
                {
                  text: "Créer dossier",
                  icon: "added_files",
                  id: "AddFolder",
                  dialog: {
                    title: "Créer dossier:",
                    output: "name",
                    ok: "Créer",
                  },
                  onEvent: () => Alert.alert("Creer dossier"),
                },
              ],
            },
          ],
          toolbarItems: [
            {
              filter: "root",
              items: [
                {
                  text: "Back",
                  icon: "chevron-left1",
                  id: "back",
                  onEvent: () => null,
                },
                {
                  id: "nbSelected",
                },
                {
                  id: "separator",
                },
                {
                  text: "Copier",
                  icon: "content-copy",
                  id: "copy",
                  dialog: {
                    title: "Copier dans Documents personnel",
                  },
                  onEvent: ({ selected }: ISelectedProps) =>
                    Alert.alert("Elements selected" + JSON.stringify(selected)),
                },
                {
                  text: "Download",
                  icon: "download",
                  id: "download",
                  onEvent: ({ selected }: ISelectedProps) =>
                    Alert.alert("Elements selected" + JSON.stringify(selected)),
                },
              ],
            },
            {
              filter: "owner",
              items: [
                {
                  text: "Back",
                  icon: "chevron-left1",
                  id: "back",
                  onEvent: () => null,
                },
                {
                  id: "nbSelected",
                },
                {
                  id: "separator",
                },
                {
                  text: "Editer",
                  icon: "pencil",
                  id: "edit",
                  monoselect: true,
                  dialog: {
                    title: "Renommer:",
                    input: "filename",
                    ok: "Modifier",
                  },
                  onEvent: ({ selected }: ISelectedProps) =>
                    Alert.alert("Elements selected" + JSON.stringify(selected)),
                },
                {
                  text: "Delete",
                  icon: "delete",
                  id: "delete",
                  dialog: {
                    title: "Vous etes sur le point de supprimer:",
                    ok: "Supprimer",
                  },
                  onEvent: ({ selected }: ISelectedProps) =>
                    Alert.alert("Elements selected" + JSON.stringify(selected)),
                },
                {
                  text: "Copier",
                  icon: "content-copy",
                  id: "copy",
                  dialog: {
                    title: "Copier dans Documents personnel",
                  },
                  onEvent: ({ selected }: ISelectedProps) =>
                    Alert.alert("Elements selected" + JSON.stringify(selected)),
                },
                {
                  text: "Move",
                  icon: "package-up",
                  id: "move",
                  onEvent: ({ selected }: ISelectedProps) =>
                    Alert.alert("Elements selected" + JSON.stringify(selected)),
                },
                {
                  text: "Download",
                  icon: "download",
                  id: "download",
                  onEvent: ({ selected }: ISelectedProps) =>
                    Alert.alert("Elements selected" + JSON.stringify(selected)),
                },
              ],
            },
          ],
        },
      },
      WorkspaceDetails: {
        screen: Details,
      },
    },
    {
      initialRouteParams: {
        filter: "root",
        parentId: "root",
      },
      defaultNavigationOptions: ({ navigation }: { navigation: NavigationScreenProp<{}> }) =>
        standardNavScreenOptions(
          {
            title: navigation.getParam("title") || I18n.t(config.displayName),
            headerLeft: <HeaderAction onPress={() => navigation.pop()} name={"back"} />,
            headerRight: <HeaderIcon name={null} hidden={true} />,
          },
          navigation
        ),
    }
  )
);
