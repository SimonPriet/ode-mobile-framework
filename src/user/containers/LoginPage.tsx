// Libraries
import style from "glamorous-native";
import I18n from "i18n-js";
import * as React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  Linking
} from "react-native";
import { connect } from "react-redux";

// Components
import { FlatButton } from "../../ui";
import ConnectionTrackingBar from "../../ui/ConnectionTrackingBar";
import { TextInputLine } from "../../ui/forms/TextInputLine";
import { ErrorMessage } from "../../ui/Typography";

// Type definitions
import { IUserAuthState } from "../reducers/auth";

import Conf from "../../../ode-framework-conf";
import { navigate } from "../../navigation/helpers/navHelper";
import { CommonStyles } from "../../styles/common/styles";
import BottomSwitcher from "../../ui/BottomSwitcher";
import { PasswordInputLine } from "../../ui/forms/PasswordInputLine";
import { Text, TextColor, TextBold } from "../../ui/text";
import {
  checkVersionThenLogin,
  IVersionContext,
  updateVersionIfWanted
} from "../actions/version";
import VersionModal from "../components/VersionModal";
import { getAuthState } from "../selectors";

// Props definition -------------------------------------------------------------------------------

export interface ILoginPageDataProps {
  auth: IUserAuthState;
  headerHeight: number;
  // version
  versionContext: IVersionContext;
  versionModal: boolean;
  version: string;
  versionMandatory: boolean;
}

export interface ILoginPageEventProps {
  onSkipVersion(versionContext: IVersionContext);
  onUpdateVersion(versionContext: IVersionContext);
  onLogin(userlogin: string, password: string);
}

export interface ILoginPageOtherProps {
  navigation?: any;
}

export type ILoginPageProps = ILoginPageDataProps &
  ILoginPageEventProps &
  ILoginPageOtherProps;

// State definition -------------------------------------------------------------------------------

export interface ILoginPageState {
  login: string;
  password: string;
  typing: boolean;
}

const initialState: ILoginPageState = {
  login: undefined,
  password: undefined,
  typing: false
};

// Main component ---------------------------------------------------------------------------------

const FormContainer = style.view({
  alignItems: "center",
  flex: 1,
  flexDirection: "column",
  justifyContent: "center",
  padding: 40,
  paddingTop: 80
});

export class LoginPage extends React.Component<
  ILoginPageProps,
  ILoginPageState
  > {
  // Refs
  private inputLogin: TextInput = null;
  private setInputLoginRef = el => (this.inputLogin = el);

  private inputPassword: TextInput = null;
  private setInputPasswordRef = el => (this.inputPassword = el);

  // Set default state
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  // Computed properties
  get isSubmitDisabled() {
    return !(this.state.login && this.state.password);
  }

  // Render

  public render() {
    const {
      versionContext,
      versionMandatory,
      versionModal,
      version,
      onSkipVersion,
      onUpdateVersion
    } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: "#ffffff" }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ConnectionTrackingBar style={{ position: "absolute" }} />
          <VersionModal
            mandatory={versionMandatory}
            version={version}
            visibility={versionModal}
            onCancel={() => onSkipVersion(versionContext)}
            onSubmit={() => onUpdateVersion(versionContext)}
          />
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => this.unfocus()}
          >
            {this.renderForm()}
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  protected renderLogo = () => {
    const logoStyle = { height: 50, width: 200 };
    if (Conf.currentPlatform.logoStyle) {
      Object.assign(logoStyle, Conf.currentPlatform.logoStyle!);
    }
    return <View
      style={{ flexGrow: 2, alignItems: "center", justifyContent: "center" }}
    >
      <Image
        resizeMode="contain"
        style={logoStyle}
        source={Conf.currentPlatform.logo}
      />
    </View>;
  }; // TS-ISSUE

  protected renderForm() {
    const { loggingIn, loggedIn, error } = this.props.auth;

    const FederationTextComponent = error ? TextBold : Text;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView alwaysBounceVertical={false} contentContainerStyle={{ flexGrow: 1 }}>
          <FormContainer>
            {this.renderLogo()}
            <TextInputLine
              inputRef={this.setInputLoginRef}
              placeholder={I18n.t("Login")}
              onChangeText={(login: string) =>
                this.setState({ login: login.trim(), typing: true })
              }
              value={this.state.login}
              hasError={error && !this.state.typing}
              keyboardType="email-address"
            />
            <PasswordInputLine
              inputRef={this.setInputPasswordRef}
              placeholder={I18n.t("Password")}
              onChangeText={(password: string) =>
                this.setState({ password, typing: true })
              }
              value={this.state.password}
              hasError={error && !this.state.typing}
            />
            <ErrorMessage>
              {this.state.typing ? "" : error && I18n.t(error)}
            </ErrorMessage>

            <View
              style={{
                alignItems: "center",
                flexGrow: 2,
                justifyContent: "flex-start",
                marginTop: error && !this.state.typing ? 10 : 30
              }}
            >
              {error === "auth-notPremium" && !this.state.typing ?
              <FlatButton
                onPress={() => this.handleGoToWeb()}
                disabled={false}
                title={I18n.t("LoginWeb")}
                loading={false}
              /> : <FlatButton
                onPress={() => this.handleLogin()}
                disabled={this.isSubmitDisabled}
                title={I18n.t("Connect")}
                loading={loggingIn || loggedIn}
              />}

              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text
                  color={TextColor.Light}
                  style={{ textDecorationLine: "underline", marginTop: 48 }}
                  onPress={() => {
                    navigate("LoginForgot");
                  }}
                >
                  {I18n.t("forgot-password")}
                </Text>
                {Conf.currentPlatform.federation && <FederationTextComponent
                  style={{
                    textDecorationLine: "underline",
                    marginTop: 48,
                    textAlign: "center",
                    color: error ? CommonStyles.profileTypes.Student : TextColor.Light
                  }}
                  onPress={() => {
                    navigate("FederatedAccount");
                  }}
                >
                  {I18n.t("federatedAccount-link")}
                </FederationTextComponent>}
              </View>
            </View>
          </FormContainer>
        </ScrollView>
        {Conf.platforms && Object.keys(Conf.platforms).length > 1 ?
        <BottomSwitcher onPress={() => this.handleBackToPlatformSelector()}>
          {Conf.currentPlatform.displayName}{" "}
        </BottomSwitcher> : null}
      </View>
    );
  }

  // Event handlers

  protected async handleLogin() {
    await this.props.onLogin(
      this.state.login || this.props.auth.login,
      this.state.password
    );
    this.setState({ typing: false });
  }

  protected handleGoToWeb() {
    Linking.openURL((Conf.currentPlatform as any).url);
  }

  protected handleBackToPlatformSelector() {
    navigate("PlatformSelect");
  }

  // Other public methods

  public unfocus() {
    this.inputLogin.blur();
    this.inputPassword.blur();
  }
}

export default connect(
  (state: any, props: any): ILoginPageDataProps => {
    const auth: IUserAuthState = getAuthState(state);
    let version = "",
      versionModal = false,
      versionMandatory = false,
      versionContext: IVersionContext = null;
    if (auth.versionContext && auth.versionContext.version) {
      versionContext = auth.versionContext;
      version = versionContext.version.newVersion;
      versionModal = true;
      versionMandatory = !versionContext.version.canContinue;
    }
    return {
      auth,
      headerHeight: state.ui.headerHeight,
      versionMandatory,
      version,
      versionModal,
      versionContext
    };
  },
  (dispatch): ILoginPageEventProps => ({
    onSkipVersion: version => {
      dispatch<any>(updateVersionIfWanted(version, false));
    },
    onUpdateVersion: version => {
      dispatch<any>(updateVersionIfWanted(version, true));
    },
    onLogin: (userlogin, password) => {
      dispatch<any>(
        checkVersionThenLogin(false, { username: userlogin, password })
      );
    }
  })
)(LoginPage);
