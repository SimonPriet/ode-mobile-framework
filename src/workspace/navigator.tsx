import { createStackNavigator } from 'react-navigation';
import ContainerItems from './containers/Items';
import { Details } from './containers/Details';

function alert(item: IItem)

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
          name: 'addDocument',
          position: 1,
          onEvent: (item: IItem)
        },
        {
          text: 'Créer dossier',
          icon: 'folder11',
          name: 'AddFolder',
          position: 2,
        },
      ],
    },
  },
  WorkspaceDetails: {
    screen: Details,
  },
});
