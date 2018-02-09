import style from "glamorous-native"
import { layoutSize } from "../constants/layoutSize"
import { CommonStyles } from "../styles/common/styles"
import { trunc } from "../utils/html"

export const Item = style.touchableOpacity(
	{
		backgroundColor: CommonStyles.itemBackgroundColor,
		borderBottomColor: CommonStyles.borderBottomItem,
		borderBottomWidth: 1,
		flexDirection: "row",
		paddingHorizontal: layoutSize.LAYOUT_16,
		paddingVertical: layoutSize.LAYOUT_12,
	},
	({ nb }) => ({
		backgroundColor: nb > 0 ? CommonStyles.nonLue : CommonStyles.itemBackgroundColor,
	})
)

export const LeftPanel = style.view({
	height: layoutSize.LAYOUT_50,
	width: layoutSize.LAYOUT_50,
})

export const CenterPanel = style.view({
	alignItems: "flex-start",
	flex: 1,
	justifyContent: "center",
	marginHorizontal: layoutSize.LAYOUT_6,
	padding: layoutSize.LAYOUT_2,
})

export const RightPanel = style.view({
	alignItems: "center",
	height: layoutSize.LAYOUT_50,
	justifyContent: "flex-end",
	width: layoutSize.LAYOUT_50,
})

export const Content = style.text(
	{
		color: CommonStyles.iconColorOff,
		fontFamily: CommonStyles.primaryFontFamilyLight,
		fontSize: layoutSize.LAYOUT_12,
		marginTop: layoutSize.LAYOUT_10,
	},
	({ nb }) => ({
		color: nb > 0 ? CommonStyles.textColor : CommonStyles.iconColorOff,
		fontFamily: nb > 0 ? CommonStyles.primaryFontFamily : CommonStyles.primaryFontFamilyLight,
	})
)