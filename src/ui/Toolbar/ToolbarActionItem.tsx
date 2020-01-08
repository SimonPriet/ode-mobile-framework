import * as React from 'react';
import { Icon } from '..';
import { EVENT_TYPE } from '../../types';
import { IMenuItem } from '../types';
import { layoutSize } from '../../styles/common/layoutSize';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { INbSelected } from './Toolbar';
import { Text } from '../text';

const Item = ({ onEvent, ...item }: IMenuItem & INbSelected) => {
  const { icon, nbSelected, id } = item;

  if (id === 'separator') {
    return <View style={style.touchPanel} />;
  }

  if (id === 'nbSelected') {
    return (
      <View style={style.touchPanel}>
        <Text numberOfLines={1} style={style.text}>
          {nbSelected}
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={style.touchPanel} onPress={() => onEvent({ type: EVENT_TYPE.SELECT, ...item })}>
      <Icon color="#ffffff" size={layoutSize.LAYOUT_24} name={icon} />
    </TouchableOpacity>
  );
};

export default Item;

const style = StyleSheet.create({
  touchPanel: {
    backgroundColor: '#ff8000',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: layoutSize.LAYOUT_58,
    height: layoutSize.LAYOUT_58,
  },
  text: {
    color: '#ffffff',
    fontSize: layoutSize.LAYOUT_18,
    fontWeight: 'bold',
  },
});
