import * as React from 'react';
import { CenterPanel } from '../ContainerContent';
import { Icon } from '..';
import { IEventProps, EVENT_TYPE } from '../../types';
import { IMenuItem } from '../types';
import { layoutSize } from '../../styles/common/layoutSize';
import { StyleSheet, TouchableOpacity } from 'react-native';

const Item = ({ onEvent, item }: IEventProps & any) => {
  const { icon } = item as IMenuItem;

  return (
    <TouchableOpacity
      style={style.touchPanel}
      onPress={() => onEvent({ type: EVENT_TYPE.SELECT, ...item })}>
      <CenterPanel style={style.centerPanel}>
        <Icon color="#ffffff" size={layoutSize.LAYOUT_28} name={icon} />
      </CenterPanel>
    </TouchableOpacity>
  );
};

export default Item;

const style = StyleSheet.create({
  centerPanel: {
    alignItems: 'center',
    backgroundColor: '#ff8000',
    flexDirection: 'row',
    flexGrow: 3,
    justifyContent: 'flex-start',
    margin: 2,
    marginLeft: -20,
  },
  fileName: {
    color: '#ffffff',
    fontSize: layoutSize.LAYOUT_14,
  },
  touchPanel: {
    backgroundColor: '#ff8000',
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
