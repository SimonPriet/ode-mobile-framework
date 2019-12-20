import { IActionProps } from './actions';
import { IEventProps } from '../../../types/events';
import { INavigationProps } from '../index';

export type IDetailsProps = IActionProps & IEventProps & INavigationProps;
