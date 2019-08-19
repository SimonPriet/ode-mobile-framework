import * as React from "react";
import I18n from "i18n-js";
import { connect } from "react-redux";
import {
  ContainerView,
  ContainerLabel,
  ContainerTextInput
} from "../../ui/ButtonLine";
import ConnectionTrackingBar from "../../ui/ConnectionTrackingBar";
import { PageContainer } from "../../ui/ContainerContent";

import { View, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, KeyboardTypeOptions, Alert } from "react-native";
import { IUserInfoState } from "../reducers/info";
import { IUserAuthState } from "../reducers/auth";
import { Label } from "../../ui/Typography";
import { UserCard } from "../components/UserCard";
import { standardNavScreenOptions } from "../../navigation/helpers/navHelper";
import { NavigationScreenProp, NavigationState, NavigationParams } from "react-navigation";
import { HeaderAction, HeaderBackAction } from "../../ui/headers/NewHeader";
import { CommonStyles } from "../../styles/common/styles";
import { IUpdatableProfileValues, profileUpdateAction } from "../actions/profile";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

export interface IProfilePageDataProps {
  userauth: IUserAuthState;
  userinfo: IUserInfoState;
}

export interface IProfilePageEventProps {
  onSave: (updatedProfileValues: IUpdatableProfileValues) => void;
}

export interface IProfilePageOtherProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export type IProfilePageProps = IProfilePageDataProps & IProfilePageEventProps & IProfilePageOtherProps;

export type IProfilePageState = IUpdatableProfileValues & {
  emailValid?: boolean,
  homePhoneValid?: boolean,
  mobileValid?: boolean
}

// tslint:disable-next-line:max-classes-per-file
export class ProfilePage extends React.PureComponent<
  IProfilePageProps,
  IProfilePageState
  > {

  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{}> }) => {
    const isEditMode = navigation.getParam("edit", false);
    if (isEditMode) {
      return standardNavScreenOptions(
        {
          title: I18n.t("MyProfile"),
          headerLeft: <HeaderAction
            onPress={() => {
              navigation.setParams(
                { "edit": false }
              );
              navigation.getParam("onCancel")();
            }}
            title={I18n.t("Cancel")}
          />,
          headerRight: <HeaderAction
            onPress={() => {
              const values = navigation.getParam("updatedProfileValues") as IProfilePageState;
              if (values) {
                if (values.emailValid && values.homePhoneValid && values.mobileValid) {
                  navigation.setParams(
                    { "edit": false }
                  );
                  navigation.getParam("onSave")(navigation.getParam("updatedProfileValues"));
                } else {
                  Alert.alert(I18n.t("ProfileInvalidInformation"));
                }
              } else {
                navigation.setParams(
                  { "edit": false }
                );
              }
            }}
            title={I18n.t("Save")}
          />,
        },
        navigation
      );
    } else {
      return standardNavScreenOptions(
        {
          title: I18n.t("MyProfile"),
          headerLeft: <HeaderBackAction navigation={navigation} />,
          headerRight: <HeaderAction
            onPress={() => navigation.setParams(
              { "edit": true }
            )}
            title={I18n.t("Edit")}
          />,
        },
        navigation
      );
    }
  };

  defaultState: () => IProfilePageState = () => ({
    displayName: this.props.userinfo.displayName,
    email: this.props.userinfo.email,
    homePhone: this.props.userinfo.homePhone,
    mobile: this.props.userinfo.mobile,
    emailValid: true,
    homePhoneValid: true,
    mobileValid: true
  })

  state = this.defaultState();

  componentDidMount() {
    this.props.navigation.setParams({
      onSave: this.props.onSave,
      onCancel: () => this.setState(this.defaultState())
    });
  }

  setState(newState: IProfilePageState) {
    super.setState(newState);
    setTimeout(() => {
      this.props.navigation.setParams({
        updatedProfileValues: this.state
      });
    });
  }

  public render() {
    return (
      <PageContainer>
        <ConnectionTrackingBar />
        <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={Platform.select({ ios: 100, android: undefined })}>
          <ScrollView alwaysBounceVertical={false}>
            <SafeAreaView>

              <UserCard
                id={this.props.userinfo.id!}
                displayName={this.props.userinfo.displayName!}
                type={this.props.userinfo.type! as "Student" | "Relative" | "Teacher" | "Personnel" | ("Student" | "Relative" | "Teacher" | "Personnel")[]}
              />

              {this.renderItem({
                title: I18n.t("Login"),
                getter: () => this.props.userauth.login
              })}

              {/*<ContainerLabel>{I18n.t("Password")}</ContainerLabel>
          <ButtonLine title="PasswordChange" onPress={() => false}/>*/}

              {this.renderItem({
                title: I18n.t("Firstname"),
                getter: () => this.props.userinfo.firstName
              })}

              {this.renderItem({
                title: I18n.t("Lastname"),
                getter: () => this.props.userinfo.lastName
              })}

              {this.renderItem({
                title: I18n.t("DisplayName"),
                getter: () => this.state.displayName,
                editable: true,
                setter: (displayName) => this.setState({ displayName })
              })}

              {this.renderItem({
                title: I18n.t("EmailAddress"),
                getter: () => this.state.email,
                editable: true,
                setter: (email) => this.setState({ email }),
                keyboardType: "email-address",
                validator: { key: "emailValid", regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ }
              })}

              {this.renderItem({
                title: I18n.t("Phone"),
                getter: () => this.state.homePhone,
                editable: true,
                setter: (homePhone) => this.setState({ homePhone }),
                keyboardType: "phone-pad",
                validator: { key: "homePhoneValid", regex: /^(00|\+)?(?:[0-9] ?-?\.?){6,15}$/ }
              })}

              {this.renderItem({
                title: I18n.t("CellPhone"),
                getter: () => this.state.mobile,
                editable: true,
                setter: (mobile) => this.setState({ mobile }),
                keyboardType: "phone-pad",
                validator: { key: "mobileValid", regex: /^(00|\+)?(?:[0-9] ?-?\.?){6,15}$/ }
              })}

              {this.renderItem({
                title: I18n.t("Birthdate"),
                getter: () => this.props.userinfo.birthDate!.format('L')
              })}

            </SafeAreaView>

          </ScrollView>
        </KeyboardAvoidingView>
      </PageContainer>
    );
  }

  private renderItem({ title, getter, editable = false, setter, keyboardType, validator }: {
    title: string,
    getter: () => string | undefined,
    editable?: boolean,
    setter?: (val: any) => void,
    keyboardType?: KeyboardTypeOptions,
    validator?: { key: keyof IProfilePageState, regex: RegExp }
  }) {
    const isEditMode = this.props.navigation.getParam("edit", false);
    const label = <ContainerLabel>{title}</ContainerLabel>;
    let box: JSX.Element | null = null;

    if (editable && !setter) {
      console.warn(`rendering editable Profil page item "${title}", but no specified setter.`);
    }

    if (isEditMode) {
      box = editable ?
        <ContainerTextInput
          onChangeText={(text) => {
            validator && this.setState({ [validator.key]: validator.regex.test(text) })
            setter!(text);
          }}
          {...(keyboardType ? { keyboardType } : {})}
        >
          <Label style={{
            color: validator ? this.state[validator.key] ? CommonStyles.textColor : CommonStyles.errorColor : CommonStyles.textColor
          }}
          >{getter()}</Label>
        </ContainerTextInput>
        :
        <ContainerView><Label>{getter()}</Label></ContainerView>;
    } else {
      box = <ContainerView><Label>{getter()}</Label></ContainerView>;
    }

    return <View {...(isEditMode && !editable ? { style: { opacity: 0.33 } } : {})}>{label}{box}</View>
  }
}

export default connect(
  (state: any) => {
    const ret = {
      userauth: state.user.auth,
      userinfo: state.user.info
    }
    return ret;
  },
  (dispatch: ThunkDispatch<any, void, AnyAction>) => ({
    onSave(updatedProfileValues: IUpdatableProfileValues) {
      dispatch(profileUpdateAction(updatedProfileValues));
    }
  })
)(ProfilePage);
