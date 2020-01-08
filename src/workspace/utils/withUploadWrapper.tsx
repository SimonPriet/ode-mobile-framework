import * as React from 'react';
import { uploadAction } from '../actions/upload';
import { connect } from 'react-redux';

export interface IProps {
  navigation: any;
  uploadAction: any;
}

function withUploadWrapper<T extends IProps>(WrappedComponent: React.ComponentType<T>): React.ComponentType<T> {
  return class extends React.Component<T> {
    contentUri = [
      {
        uri: '',
      },
    ];

    componentDidUpdate(): void {
      const { navigation } = this.props;
      const contentUri: any = navigation.getParam('contentUri');

      if (contentUri && contentUri[0].uri !== this.contentUri[0].uri) {
        this.contentUri = contentUri;
        navigation.setParams({ contentUri: undefined });
        this.props.uploadAction(contentUri);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default (wrappedComponent: React.ComponentType<any>): React.ComponentType<any> =>
  connect(
    null,
    { uploadAction },
  )(withUploadWrapper(wrappedComponent));
