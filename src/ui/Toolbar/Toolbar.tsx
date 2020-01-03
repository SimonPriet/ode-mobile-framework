import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ToolbarActionItem from './ToolbarActionItem';
import { layoutSize } from '../../styles/common/layoutSize';
import { CommonStyles } from '../../styles/common/styles';
import { IFloatingProps, IMenuItem } from '../types';

class Toolbar extends Component<IFloatingProps, IState> {
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

  handleEvent = (event: any): void => {
    const { onEvent } = this.props;

    if (onEvent) {
      onEvent(event);
    }
  };

  renderActions() {
    const { menuItems } = this.props;

    if (!menuItems || menuItems.length === 0) {
      return undefined;
    }

    return (
      <FlatList
        contentContainerStyle={styles.actions}
        data={menuItems}
        horizontal={true}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item: IMenuItem) => item.id}
        renderItem={({ item }) => <ToolbarActionItem item={item} onEvent={this.handleEvent.bind(this)} />}
      />
    );
  }

  render() {
    return <View style={styles.overlay}>{this.renderActions()}</View>;
  }
}

interface IState {
  active: boolean;
}

const styles = StyleSheet.create({
  actions: {
    elevation: 10,
    borderRadius: layoutSize.LAYOUT_6,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    position: 'absolute',
    right: layoutSize.LAYOUT_10,
    top: layoutSize.LAYOUT_36,
    width: layoutSize.LAYOUT_200,
    zIndex: 10,
  },
  overlay: {
    height: layoutSize.LAYOUT_50,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  separator: {
    borderBottomColor: CommonStyles.borderColorVeryLighter,
    borderBottomWidth: 1,
    width: '100%',
  },
});

export default Toolbar;
