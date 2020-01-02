import { createStackNavigator } from 'react-navigation';
import ContainerItems from './containers/Items';
import { Details } from './containers/Details';
import { IEvent } from '../types/ievents';
import { Alert } from 'react-native';
import { uploadAction } from './actions/upload';
import pickFile from '../infra/actions/pickFile';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ClipboardWorkspace } from './utils/copyPast';

const mapStateToProps = (state: any) => {
  return { select: state.select };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ uploadAction }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  createStackNavigator({
    Workspace: {
      screen: ContainerItems,
      params: {
        parentId: 'root',
        filter: 'root',
        popupItems: [
          {
            parentId: 'owner',
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
        onSelectItems: [
          {
            parentId: 'owner',
            items: [
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
          {
            parentId: 'root',
            items: [
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
        ],
      },
    },
    WorkspaceDetails: {
      screen: Details,
    },
  }),
);
