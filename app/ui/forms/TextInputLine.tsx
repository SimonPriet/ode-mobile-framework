import * as React from "react";
import style from "glamorous-native";
import { CommonStyles } from "../../styles/common/styles";
import { TextInput, TextInputProps } from "react-native";

const TextInputContainer = style.view(
  {
    paddingTop: 4,
    width: "100%",
    height: 40
  },
  ({ hasError, focus }) => ({
    borderBottomColor: hasError
      ? CommonStyles.errorColor
      : focus
      ? CommonStyles.iconColorOn
      : CommonStyles.entryfieldBorder,
    borderBottomWidth: focus || hasError ? 2 : 1
  })
);

const Input = style.textInput({
  color: CommonStyles.textInputColor,
  height: 40,
  fontSize: 14,
  fontFamily: CommonStyles.primaryFontFamily
});

export class TextInputLine extends React.Component<
  {
    onChangeText: (text: string) => void;
    hasError: boolean;
    value: string;
    onFocus?: () => void;
    onBlur?: () => void;
    placeholder: string;
    inputRef: (ref: TextInput) => void;
    secureTextEntry?: boolean;
  } & TextInputProps,
  { isFocused: boolean }
> {
  state = {
    isFocused: false
  };

  onBlur() {
    this.setState({
      isFocused: false
    });
    this.props.onBlur && this.props.onBlur();
  }

  onFocus() {
    this.setState({
      isFocused: true
    });
    this.props.onFocus && this.props.onFocus();
  }

  public render() {
    const {
      onChangeText,
      hasError,
      value,
      onFocus,
      onBlur,
      placeholder,
      secureTextEntry
    } = this.props;

    return (
      <TextInputContainer hasError={hasError} focus={this.state.isFocused}>
        <Input
          innerRef={r => this.props.inputRef(r)}
          onChangeText={value => onChangeText(value)}
          onBlur={() => this.onBlur()}
          onFocus={() => this.onFocus()}
          placeholder={placeholder}
          placeholderTextColor={CommonStyles.placeholderColor}
          secureTextEntry={secureTextEntry}
          underlineColorAndroid={"transparent"}
          autoCapitalize="none"
          value={value}
          {...this.props}
        />
      </TextInputContainer>
    );
  }
}
