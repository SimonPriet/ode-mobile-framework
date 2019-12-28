import { createStackNavigator } from 'react-navigation';
import ContainerItems from './containers/Items';
import { Details } from './containers/Details';
import { IEvent } from '../types/ievents';
import { Alert } from 'react-native';
import { uploadAction } from './actions/upload';
import pickFile from '../infra/actions/pickFile';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ uploadAction }, dispatch);
};

export default connect(mapDispatchToProps)(
  createStackNavigator({
    Workspace: {
      screen: ContainerItems,
      params: {
        parentId: 'root',
        filter: 'root',
        menuItems: [
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
            icon: 'folder11',
            id: 'AddFolder',
            onEvent: (type: string, event: IEvent) => Alert.alert('Element selected' + event.id),
          },
        ],
      },
    },
    WorkspaceDetails: {
      screen: Details,
    },
  }),
);
