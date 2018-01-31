import * as React from "react"
import { Text, TouchableOpacity } from "react-native"
import { Icon } from ".."
import styles from "../styles/index"

export interface ButtonTextIconProps {
	onPress: () => any
	disabled?: boolean
	leftName?: string
	rightName?: string
	title: string
	whiteSpace?: string
}

export const ButtonTextIcon = ({
	onPress,
	disabled = false,
	title,
	leftName = "",
	rightName = "",
	whiteSpace = " ",
}: ButtonTextIconProps) => {
	return (
		<TouchableOpacity onPress={onPress} disabled={disabled}>
			<Text style={styles.buttonStyle}>
				{leftName.length > 0 && <Icon name={leftName} />}
				{whiteSpace}
				{title}
				{whiteSpace}
				{rightName.length > 0 && <Icon name={rightName} />}
			</Text>
		</TouchableOpacity>
	)
}