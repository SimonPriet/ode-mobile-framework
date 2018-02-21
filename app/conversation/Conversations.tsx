import style from "glamorous-native"
import * as React from "react"
import { FlatList } from "react-native"
import Swipeable from "react-native-swipeable"
import { layoutSize } from "../constants/layoutSize"
import { IThreadModel, IThreadState } from '../model/Thread';
import styles from "../styles/index"
import { Icon } from "../ui/icons/Icon"
import { Conversation } from "./Conversation"
import { readConversation, readNextConversation } from "../actions/conversation"
import { IAuthModel } from "../model/Auth"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

export interface IConversationsProps {
	conversations: IThreadModel[]
	pageNumber: number
	navigation?: any
	readConversation
	readNextConversation
	synced: boolean
	userId: string
}

export class Conversations extends React.Component<IConversationsProps, any> {
	public onPress(item) {
		item.conversationId = item.id;
		item.userId = this.props.userId;

		this.props.navigation.navigate("Threads", item)
	}

	private nextPage() {
		console.log('loading next page')
		const { pageNumber } = this.props;
		if (this.props.synced) {
			this.props.readNextConversation(pageNumber + 1);
		}
	}

	public render() {
		const { conversations, userId } = this.props;
		return (
			<FlatList
				data={conversations}
				keyExtractor={item => item.id}
				removeClippedSubviews
				disableVirtualization
				legacyImplementation={true}
				onEndReached={() => this.nextPage()}
				renderItem={({ item }) => this.renderItem(item, userId)}
				style={styles.grid}
				keyboardShouldPersistTaps={ 'always' }
			/>
		)
	}

	private renderItem(item: IThreadModel, userId) {
		return (
			<Swipeable rightButtons={swipeoutBtns}>
				<Conversation {...item} onPress={e => this.onPress(item)} userId={userId} />
			</Swipeable>
		)
	}
}

const RightButton = style.touchableOpacity({
	backgroundColor: "#EC5D61",
	flex: 1,
	justifyContent: "center",
	paddingLeft: layoutSize.LAYOUT_34,
})

const swipeoutBtns = [
	<RightButton>
		<Icon size={layoutSize.LAYOUT_18} color="#ffffff" name="trash" />
	</RightButton>,
]

function getTitle(displayNames) {
	return displayNames.reduce((acc, elem) => `${acc}, ${elem[1]}`, "")
}

/**
 * Select the set of conversations with the filtering criteria
 */

const mapStateToProps = state => ({
	conversations: state.threads.payload.filter(t => !state.threads.filterCriteria || (t.subject && t.subject.indexOf(state.threads.filterCriteria) !== -1)),
	userId: state.auth.userId,
})

const dispatchAndMapActions = dispatch =>
	bindActionCreators({ readConversation, readNextConversation }, dispatch)

export default connect(mapStateToProps, dispatchAndMapActions)(Conversations)