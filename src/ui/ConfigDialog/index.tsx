import * as React from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import t from "tcomb-form-native";
import { IEventProps } from "../../types/ievents";
import { IItem, IRootItems } from "../../workspace/types/states/items";
import { layoutSize } from "../../styles/common/layoutSize";

var Form = t.form.Form;

// here we are: define your domain model
var Person = t.struct({
  name: t.String, // a required string
  surname: t.maybe(t.String), // an optional string
  age: t.Number, // a required number
  rememberMe: t.Boolean, // a boolean
});

export type IProps = IEventProps & {
  item: any;
  selected: IRootItems<IItem>;
  navigation: any;
};

export class ConfigDialog extends React.Component<IProps> {
  onPress() {
    // call getValue() to get the values of the form
    const { item, selected } = this.props;
    const { input, output } = item.dialog;
    const value = this.refs.form.getValue();

    if (value) {
      item.onEvent({ selected, value: value[input | output] });
    } else {
      item.onEvent({ item, selected, value: value[input | output] });
    }
  }

  renderValidation() {
    const { ok, input, output } = this.props.item.dialog;

    return (
      <View style={styles.containerValidation}>
        {(input || output) && (
          <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor="#99d9f4">
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableHighlight>
        )}
        <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor="#99d9f4">
          <Text style={styles.buttonText}>{ok ? ok : "Valider"}</Text>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    const { input, output, title } = this.props.item.dialog;
    const domainInstance = input ? t.struct({ [input]: t.String }) : output ? t.struct({ [output]: t.String }) : {};

    const options = input ? { fields: input } : {};

    return (
      <View style={styles.full}>
        <View style={styles.container}>
          <Form ref="form" type={domainInstance} options={options} />
          <Text style={styles.buttonText}>{title}</Text>
          <View style={styles.validation}>{this.renderValidation()}</View>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  full: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center" /*centers items on the line (the x-axis by default)*/,
    alignItems: "center",
    //    opacity: 0.5,
    backgroundColor: "#dddddd",
  },
  container: {
    borderRadius: layoutSize.LAYOUT_6,
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    maxWidth: layoutSize.LAYOUT_300 * 2,
    minWidth: layoutSize.LAYOUT_300,
    //    opacity: 1,
    padding: layoutSize.LAYOUT_30,
    paddingBottom: layoutSize.LAYOUT_10,
  },
  validation: {
    backgroundColor: "transparent",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
  },
  containerValidation: {
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
    height: layoutSize.LAYOUT_60,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    alignSelf: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
    alignSelf: "flex-start",
    margin: layoutSize.LAYOUT_30,
    marginTop: layoutSize.LAYOUT_60,
  },
  button: {
    height: layoutSize.LAYOUT_36,
    backgroundColor: "#ff8000",
    borderColor: "#ff8000",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: "stretch",
    justifyContent: "center",
  },
});
