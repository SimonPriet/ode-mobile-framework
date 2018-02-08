import style from "glamorous-native"
import * as React from "react"
import { CenterPanel, ContainerFooterBar, TouchableBarPanel, TouchableEndBarPanel } from "../ui/ContainerBar"
import { layoutSize } from "../constants/layoutSize"
import { Icon, IconOnOff } from "../ui/index"
import { tr } from "../i18n/t"

export interface IThreadsFooterBarProps {
	createConversation: (object) => void
	navigation?: any
}

interface ThreadsFooterBarState {
	selected: Selected
	textMessage: string
}

export class ThreadsFooterBar extends React.Component<IThreadsFooterBarProps, ThreadsFooterBarState> {
	public state = {
		selected: Selected.none,
		textMessage: "",
	}

	private onPress(e: Selected) {
		const { selected } = this.state

		this.setState({ selected: e === selected ? Selected.none : e })
	}

	private onValid() {
		const { conversationId, displayNames, subject, userId } = this.props.navigation.state.params
		const { textMessage } = this.state
		this.setState({ selected: Selected.none })

		this.props.createConversation({
			subject: subject,
			body: `<br><br><div class="signature new-signature">${textMessage}</div>`,
			to: ["e4d5cd13-d44c-4bd8-8f8e-a3e8ad3d2ca5"],
			conversation: conversationId,
		})
	}

	public render() {
		const { selected, textMessage } = this.state

		return (
			<ContainerFooterBar>
				{selected === Selected.keyboard && (
					<ContainerInput>
						<TextInput
							autoFocus={true}
							enablesReturnKeyAutomatically={true}
							multiline
							onChangeText={(textMessage: string) => this.setState({ textMessage })}
							placeholder={tr.Write_a_message}
							underlineColorAndroid={"transparent"}
							value={textMessage}
						/>
					</ContainerInput>
				)}
				<TouchableBarPanel onPress={() => this.onPress(Selected.keyboard)}>
					<IconOnOff focused={selected === Selected.keyboard} name={"keyboard"} />
				</TouchableBarPanel>
				<TouchableBarPanel onPress={() => this.onPress(Selected.camera)}>
					<IconOnOff focused={selected === Selected.camera} name={"camera"} />
				</TouchableBarPanel>
				<TouchableBarPanel onPress={() => this.onPress(Selected.other)}>
					<Icon size={layoutSize.LAYOUT_22} name={"more"} />
				</TouchableBarPanel>
				<CenterPanel />
				<TouchableEndBarPanel onPress={() => this.onValid()}>
					<Icon size={layoutSize.LAYOUT_22} name={"send_icon"} />
				</TouchableEndBarPanel>
			</ContainerFooterBar>
		)
	}
}

export enum Selected {
	camera,
	keyboard,
	none,
	other,
}

export const ContainerInput = style.view({
	alignSelf: "flex-end",
	height: layoutSize.LAYOUT_56,
	justifyContent: "center",
	paddingLeft: layoutSize.LAYOUT_20,
	paddingRight: layoutSize.LAYOUT_10,
	width: layoutSize.LAYOUT_375,
})

const TextInput = style.textInput({})
