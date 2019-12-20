import { createStackNavigator } from 'react-navigation';
import ContainerItems from './containers/Items';
import { Details } from './containers/Details';
import { IEvent } from '../types/ievents';
import { Alert } from 'react-native';

export default createStackNavigator({
  Workspace: {
    screen: ContainerItems,
    params: {
      parentId: 'root',
      filter: 'root',
      actions: [
        {
          text: 'Ajouter Document',
          icon: 'file-plus',
          id: 'addDocument',
          onSelect: (dispatch: Function, event: IEvent) => Alert.alert('Element selected' + event.id),
        },
        {
          text: 'Créer dossier',
          icon: 'folder11',
          id: 'AddFolder',
          onSelect: (dispatch: Function, event: IEvent) => Alert.alert('Element selected' + event.id),
        },
      ],
    },
  },
  WorkspaceDetails: {
    screen: Details,
  },
});
