import React, { Component } from "react"; // eslint-disable-line
import PropTypes from 'prop-types';
import { StyleSheet, Animated, TouchableOpacity, Keyboard, View, FlatList } from 'react-native';

import FloatingActionItem from './FloatingActionItem';

import { layoutSize } from '../../styles/common/layoutSize';
import { CommonStyles } from '../../styles/common/styles';
import { Icon } from '..';
import { EVENT_TYPE, IEventProps } from '../../workspace/types/props';
import { IItem, IRootItems } from '../../workspace/types/states/items';

interface IProps {
  iconWidth: number;
  iconHeight: number;
  color: string;
  visible: false;
  buttonSize: number;
  onPressItem: Function;
}

interface IState {
  active: boolean;
}

FloatingAction.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      text: PropTypes.string,
      component: PropTypes.func,
    })
  ),

};

FloatingAction.defaultProps = {
  visible: true,
  color: '#fa8810',
  buttonSize: layoutSize.LAYOUT_48,
  iconColor: '#fff',
};

class FloatingAction extends Component<IRootItems<IItem> & IEventProps & IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      active: false,
    };
  }

  getShadow = () => {
    return {
      shadowColor: '#000',
      shadowOffset: {
        width: 5,
        height: 8,
      },
      shadowOpacity: 0.45,
      shadowRadius: 3.84,
      elevation: 10,
    };
  };

  getIcon = () => {
    const { iconWidth, iconHeight } = this.props;
    const iconName = this.state.active ? 'close' : 'add';

    return <Icon style={{ color: '#ffffff', width: iconWidth, height: iconHeight }} name={iconName} />;
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

  onEvent = (type: EVENT_TYPE, menuItem: IItem) => {
    const { onEvent } = this.props;

    if (onEvent) {
      onEvent(EVENT_TYPE.MENU_SELECT, menuItem);
    }

    this.reset();
  };

  renderMainButton() {
    const { buttonSize, color } = this.props;
    const propStyles = {
      backgroundColor: color,
    };

    const sizeStyle = {
      width: buttonSize,
      height: buttonSize,
      borderRadius: buttonSize / 2,
    };

    return (
      <Animated.View style={[styles.buttonContainer, sizeStyle, propStyles, this.getShadow()]}>
        <TouchableOpacity style={[styles.button, sizeStyle]} activeOpacity={0.85} onPress={this.animateButton}>
          <Animated.View style={[styles.buttonTextContainer, sizeStyle]}>{this.getIcon()}</Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  renderActions() {
    const { actions } = this.props;
    const { active } = this.state;

    if (!active || !actions || actions.length === 0) {
      return undefined;
    }

    return (
      <Animated.View style={styles.actions} pointerEvents="box-none">
        <FlatList
          data={actions}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item: IItem) => item.name}
          renderItem={({ item }) => <FloatingActionItem {...item} onEvent={this.onEvent.bind(this)} />}
        />
      </Animated.View>
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

const styles = StyleSheet.create({
  actions: {
    position: 'absolute',
    right: layoutSize.LAYOUT_10,
    top: layoutSize.LAYOUT_36,
    width: layoutSize.LAYOUT_200,
    borderRadius: 10,
    backgroundColor: '#ff8000',
  },
  separator: {
    borderBottomColor: CommonStyles.borderColorVeryLighter,
    borderBottomWidth: 1,
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonContainer: {
    position: 'absolute',
    right: layoutSize.LAYOUT_10,
    top: -layoutSize.LAYOUT_26,
    zIndex: 20,
    elevation: 20,
  },
  button: {
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff8000',
  },
  buttonTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FloatingAction;
