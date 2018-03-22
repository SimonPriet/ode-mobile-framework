import style from "glamorous-native"
import * as React from "react"
import { Row, RowProperties } from "./index"
import { CommonStyles } from "../styles/common/styles"
import { Icon } from "./icons/Icon";
import { connect } from "react-redux";
import { View } from "react-native";
import styles from "../styles";

export interface ValidTextIconProps {
	disabled?: boolean
	fontSize?: number
	leftName?: string
	onPress?: any
	rightName?: string
	style?: any
	synced?: boolean[]
	title?: string
	whiteSpace?: string
	keyboardShow?: boolean
}

export interface State {
	marginTop: any
}

const Disable = () => <View style={styles.Disable} />

const ValidTextIcon = ({
	disabled = false,
	leftName = "",
	keyboardShow,
	onPress,
	rightName = "",
	synced = [],
	title = "",
	whiteSpace = " ",
}: ValidTextIconProps) => {
	const disable = !isSynced(synced) || disabled

	return (
		<ValidStyle
			onPress={() => onPress()}
			disabled={disabled}
		>
			<ButtonStyle disabled={disable}>
				<TextStyle disabled={disable}>
					{leftName.length > 0 && <Icon name={leftName} />}
					{whiteSpace}
					{title}
					{whiteSpace}
					{rightName.length > 0 && <Icon name={rightName} />}
				</TextStyle>
			</ButtonStyle>
			{disable && <Disable />}
		</ValidStyle>
	)
}

const ValidStyle = (props: RowProperties) => (
	<Row
		alignItems="center"
		justifyContent="center"
		height={38}
		marginTop={0}
		{...props}
	/>
)

const ButtonStyle = style.view(
	{
		borderRadius: 38 * 0.5,
		paddingHorizontal: 36,
		paddingVertical: 9,
	},
	({ disabled }) => ({
		backgroundColor: disabled ? 'transparent' : CommonStyles.actionColor,
		borderColor: disabled ? CommonStyles.actionColor : CommonStyles.lightGrey,
		borderWidth: disabled ? 1 : 0,
	})
)

const TextStyle = style.text(
	{
		fontFamily: CommonStyles.primaryFontFamilySemibold,
		fontSize: 14,
		textAlignVertical: "center",
	},
	({ disabled }) => ({
		color: disabled ? CommonStyles.actionColor : CommonStyles.inverseColor,
	})
)

const isSynced = (synced: boolean[]) => {
	if (synced === undefined) {
		return true
	}
	return synced.reduce((acc, elemIsSync) => acc || elemIsSync, false)
}

const mapStateToProps = state => ({
	synced: [state.auth.synced],
})

export default connect<{}, {}, ValidTextIconProps>(mapStateToProps)(ValidTextIcon)