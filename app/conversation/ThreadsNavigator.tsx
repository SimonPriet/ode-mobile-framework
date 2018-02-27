import * as React from "react"
import Threads from "./Threads"
import { TabNavigator } from "react-navigation"
import ThreadsFooterBar from "../conversation/ThreadsFooterBar"

export const ThreadsNavigator = TabNavigator(
	{
		Threads: {
			screen: Threads,
		},
	},
	{
		tabBarComponent: ThreadsFooterBar,
		tabBarPosition: "bottom",
	}
)