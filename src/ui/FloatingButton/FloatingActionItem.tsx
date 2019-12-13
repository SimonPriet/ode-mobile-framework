import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { IEventProps, IItem, EVENT_TYPE } from '../../workspace/types';

import { Text } from '../../ui/text';
import { CenterPanel, LeftIconPanel } from '../../ui/ContainerContent';
import { layoutSize } from '../../styles/common/layoutSize';
import { Icon } from '..';

const style = StyleSheet.create({
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
  leftPanel: {
    backgroundColor: '#ff8000',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: layoutSize.LAYOUT_58,
    flexGrow: 0,
    margin: 2,
    padding: 2,
  },
  centerPanel: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexGrow: 3,
    margin: 2,
    marginLeft: -20,
  },
});

const Item = ({ onEvent, ...item }: IItem & IEventProps) => {
  const { icon, text } = item;

  return (
    <TouchableOpacity style={style.touchPanel} onPress={() => onEvent(EVENT_TYPE.SELECT, item)}>
      <LeftIconPanel style={style.leftPanel}>
        <Icon color="#ffffff" size={layoutSize.LAYOUT_28} name={icon} />
      </LeftIconPanel>
      <CenterPanel style={style.centerPanel}>
        <Text numberOfLines={1} style={style.fileName}>
          {text}
        </Text>
      </CenterPanel>
    </TouchableOpacity>
  );
};

export default Item;
