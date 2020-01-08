import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Header } from 'react-navigation';
import ToolbarActionItem from './ToolbarActionItem';
import { DEVICE_WIDTH } from '../../styles/common/layoutSize';
import { IFloatingProps, IMenuItem } from '../types';

export type INbSelected = {
  nbSelected: number;
};

class Toolbar extends Component<IFloatingProps & INbSelected, IState> {
  state = {
    active: false,
  };

  visible = true;

  getShadow = () => {
    return {
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 5,
        height: 8,
      },
      shadowOpacity: 0.45,
      shadowRadius: 3.84,
    };
  };

  renderActions(menuItems: IMenuItem[]) {
    const { onEvent } = this.props;

    return (
      <FlatList
        contentContainerStyle={styles.actions}
        data={menuItems}
        horizontal={true}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item: IMenuItem) => item.id}
        renderItem={({ item }) => (
          <ToolbarActionItem {...item} nbSelected={this.props.nbSelected} onEvent={onEvent ? onEvent : () => null} />
        )}
      />
    );
  }

  render() {
    const { menuItems, nbSelected } = this.props;

    if (!menuItems || menuItems.length === 0 || !nbSelected) {
      return null;
    }

    return <View style={styles.overlay}>{this.renderActions(menuItems)}</View>;
  }
}

interface IState {
  active: boolean;
}

const styles = StyleSheet.create({
  actions: {
    elevation: 20,
    overflow: 'visible',
    backgroundColor: '#ff8000',
    position: 'absolute',
    top: 0,
    left: 0,
    width: DEVICE_WIDTH(),
    height: Header.HEIGHT,
    zIndex: 20,
  },
  overlay: {
    elevation: 15,
    left: 0,
    position: 'absolute',
    top: -Header.HEIGHT,
    width: DEVICE_WIDTH(),
    height: Header.HEIGHT,
    zIndex: 15,
  },
  separator: {},
});

export default Toolbar;
