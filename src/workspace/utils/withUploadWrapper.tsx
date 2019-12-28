import * as React from 'react';
import { bindActionCreators } from 'redux';
import { uploadAction } from '../actions/upload';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

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
      const { navigation, uploadAction } = this.props;
      const contentUri: any = navigation.getParam('contentUri');

      if (contentUri && contentUri[0].uri !== this.contentUri[0].uri) {
        this.contentUri = contentUri;
        navigation.setParams({ contentUri: undefined });
        uploadAction(contentUri);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ uploadAction }, dispatch);
};

export default (wrappedComponent: React.ComponentType<any>): React.ComponentType<any> => {
  return compose(
    connect(mapDispatchToProps),
    withUploadWrapper,
  )(wrappedComponent);
};
