import React, { Component } from 'react';
import { StyleSheet, Animated, Keyboard, View, FlatList } from 'react-native';
import FloatingActionItem from './FloatingActionItem';
import { layoutSize } from '../../styles/common/layoutSize';
import { CommonStyles } from '../../styles/common/styles';
import { Icon } from '..';
import { EVENT_TYPE, IItem } from '../../types';
import { IFloatingProps, IMenuItem } from './types';
import { ButtonIconText } from '..';

class FloatingAction extends Component<IFloatingProps, IState> {
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

  reset = () => {
    this.setState({
      active: false,
    });
  };

  animateButton = () => {
    const { active } = this.state;

    Keyboard.dismiss();

    if (!active) {
      this.setState({
        active: true,
      });
    } else {
      this.reset();
    }
  };

  handleEvent = (type: EVENT_TYPE, item: IItem): void => {
    const { onEvent } = this.props;

    if (onEvent) {
      onEvent(EVENT_TYPE.MENU_SELECT, item);
    }

    this.reset();
  };

  renderMainButton() {
    const iconName = this.state.active ? 'close' : 'add';

    return (
      <ButtonIconText style={styles.button} name={iconName} onPress={this.animateButton} size={layoutSize.LAYOUT_20} />
    );
  }

  renderActions() {
    const { actions } = this.props;
    const { active } = this.state;

    if (!active || !actions || actions.length === 0) {
      return undefined;
    }

    return (
      <FlatList
        contentContainerStyle={styles.actions}
        data={actions}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item: IMenuItem) => item.name}
        renderItem={({ item }) => <FloatingActionItem {...item} onEvent={this.handleEvent.bind(this)} />}
      />
    );
  }

  render() {
    return (
      <View style={styles.overlay}>
        {this.renderMainButton()}
        {this.renderActions()}
      </View>
    );
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
  button: {
    elevation: 10,
    position: 'absolute',
    right: layoutSize.LAYOUT_10,
    top: -layoutSize.LAYOUT_26,
    zIndex: 10,
  },
  overlay: {
    bottom: 0,
    left: 0,
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

export default FloatingAction;
