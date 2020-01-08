import { createStackNavigator } from 'react-navigation';
import ContainerItems from './containers/Items';
import { Details } from './containers/Details';
import { IEvent } from '../types/ievents';
import { Alert } from 'react-native';
import { uploadAction } from './actions/upload';
import pickFile from '../infra/actions/pickFile';
import { connect } from 'react-redux';
import { ClipboardWorkspace } from './utils/copyPast';

const mapStateToProps = (state: any) => {
  return { selected: state.selected };
};

export default connect(
  mapStateToProps,
  { uploadAction },
)(
  createStackNavigator(
    {
      Workspace: {
        screen: ContainerItems,
        params: {
          popupItems: [
            {
              filter: 'owner',
              items: [
                {
                  text: 'Ajouter Document',
                  icon: 'file-plus',
                  id: 'addDocument',
                  onEvent: () => {
                    pickFile().then(contentUri => uploadAction(contentUri));
                  },
                },
                {
                  text: 'Créer dossier',
                  icon: 'added_files',
                  id: 'AddFolder',
                  onEvent: (type: string, event: IEvent) => Alert.alert('Element selected' + event.id),
                },
              ],
            },
          ],
          toolbarItems: [
            {
              filter: 'root',
              items: [
                {
                  text: 'Back',
                  icon: 'chevron-left1',
                  id: 'back',
                  onEvent: () => null, //navigation.pop(),
                },
                {
                  id: 'nbSelected',
                },
                {
                  id: 'separator',
                },
                {
                  text: 'Copier',
                  icon: 'content-copy',
                  id: 'copy',
                  onEvent: (type: string, event: IEvent) => Alert.alert('Element selected' + event.id),
                },
                {
                  text: 'Share',
                  icon: 'share-variant',
                  id: 'share-variant',
                  onEvent: (type: string, event: IEvent) => Alert.alert('Element selected' + event.id),
                },
                {
                  text: 'Download',
                  icon: 'download',
                  id: 'download',
                  onEvent: (type: string, event: IEvent) => Alert.alert('Element selected' + event.id),
                },
              ],
            },
            {
              filter: 'owner',
              items: [
                {
                  text: 'Back',
                  icon: 'chevron-left1',
                  id: 'back',
                  onEvent: () => null, //navigation.pop(),
                },
                {
                  id: 'nbSelected',
                },
                {
                  id: 'separator',
                },
                {
                  text: 'Copier',
                  icon: 'content-copy',
                  id: 'copy',
                  onEvent: (type: string, event: IEvent) => Alert.alert('Element selected' + event.id),
                },
                {
                  isEnabled: !ClipboardWorkspace.isEmpty(),
                  text: 'Coller',
                  icon: 'inbox',
                  id: 'past',
                  onEvent: (type: string, event: IEvent) => Alert.alert('Element selected' + event.id),
                },
                {
                  text: 'Share',
                  icon: 'share-variant',
                  id: 'share-variant',
                  onEvent: (type: string, event: IEvent) => Alert.alert('Element selected' + event.id),
                },
                {
                  text: 'Download',
                  icon: 'download',
                  id: 'download',
                  onEvent: (type: string, event: IEvent) => Alert.alert('Element selected' + event.id),
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
        filter: 'root',
        parentId: 'root',
      },
    },
  ),
);
