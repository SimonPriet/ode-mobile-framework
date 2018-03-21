import style from "glamorous-native"
import * as React from "react";
import { Text, RefreshControl } from 'react-native';
import { FlatList, View } from 'react-native';
import Swipeable from "react-native-swipeable"
import { IThreadModel, IThreadState } from '../model/conversation';
import styles from "../styles/index"
import { Icon } from "../ui/icons/Icon"
import { Conversation } from './Conversation';
import { readNextConversation, deleteThread, fetchConversation, clearFilterConversation } from '../actions/conversation';
import { IAuthModel } from "../model/Auth"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ModalBox, ModalContent } from "../ui/Modal"
import { ButtonsOkCancel } from "../ui";
import { tr } from "../i18n/t";
import I18n from "react-native-i18n"
import { EmptyScreen } from "../ui/EmptyScreen";
import { PageContainer } from "../ui/ContainerContent";
import ConnectionTrackingBar from "../ui/ConnectionTrackingBar";

export interface IConversationsProps {
	threads: IThreadModel[];
	navigation?: any
	sync: (page: number) => Promise<void>;
	fetch: () => Promise<void>;
	deleteThread: (conversation: IThreadModel) => Promise<void>;
	nbThreads: number;
	page: number;
	refresh: boolean;
	filter: (filter: string) => void
}

export class Conversations extends React.Component<IConversationsProps, any> {

	state = {
		isFetching: false,
		deleteThread: undefined as any
	}
	
	swipeRef = undefined;

	componentWillReceiveProps(nextProps){
		if(nextProps.refresh){
			this.props.sync(0);
		}
	}

	componentDidMount(){
		this.nextPage();
	}

	public onPress(item) {
		this.props.filter('');
		this.props.navigation.navigate("Threads", item);
	}

	private nextPage() {
		this.props.sync(this.props.page);
	}

	async fetchLatest(){
		this.setState({ ...this.state, isFetching: true });
		await this.props.fetch();
		this.setState({ ...this.state, isFetching: false });
	}

	public render() {
		if (!this.props.threads || this.props.threads.length === 0){
			return <EmptyScreen 
				image={ require('../../assets/images/empty-screen/espacedoc.png') } 
				text={ I18n.t('conversation-emptyScreenText') } 
				title={ I18n.t('conversation-emptyScreenTitle') } />
		}

		return (
			<PageContainer>
				<ConnectionTrackingBar />
				<ModalBox backdropOpacity={0.5} isVisible={this.state.deleteThread !== undefined}>
					<ModalContent>
						<Text>{tr.Are_you_sure}</Text>
						<Text>{ I18n.t("conversation-deleteThread") }</Text>
						<ButtonsOkCancel
							onCancel={() => this.setState({ deleteThread: undefined })}
							onValid={() => this.deleteThread(this.state.deleteThread)}
							title={I18n.t("delete")}
						/>
					</ModalContent>
				</ModalBox>
				<FlatList
					refreshControl={ 
						<RefreshControl
							refreshing={ this.state.isFetching }
							onRefresh={ () => this.fetchLatest() }
						/> 
					}
					data={ this.props.threads }
					removeClippedSubviews
					disableVirtualization
					legacyImplementation={true}
					onEndReached={() => this.nextPage()}
					renderItem={({ item }) => this.renderItem(item)}
					style={styles.grid}
					keyboardShouldPersistTaps={ 'always' }
				/>
				
			</PageContainer>
		)
	}

	deleteThread(conversation){
		this.swipeRef.recenter();
		this.props.deleteThread(conversation);
		this.setState({ deleteThread: undefined });
	}

	swipeoutButton(conversation: IThreadModel){
		return [
			<RightButton onPress={ () => this.setState({ deleteThread: conversation }) }>
				<Icon size={ 18 } color="#ffffff" name="trash" />
			</RightButton>,
		]
	}

	private renderItem(item: IThreadModel) {
		return (
			<Swipeable rightButtons={ this.swipeoutButton(item) } onRightButtonsOpenRelease={ (e, g, r) => this.swipeRef = r }>
				<Conversation {...item} onPress={e => this.onPress(item)} />
			</Swipeable>
		)
	}
}

const RightButton = style.touchableOpacity({
	backgroundColor: "#EC5D61",
	flex: 1,
	justifyContent: "center",
	paddingLeft: 34,
});

const searchText = (thread) => ((thread.subject || '') + ' ' + thread.displayNames.reduce((acc, elem) => `${acc}, ${elem[1]}`, "")).toLowerCase().replace(/[\é\è]/g, 'e');
const searchFilter = (filter) => filter.toLowerCase().replace(/[\é\è]/g, 'e');

export default connect(
	(state: any) => ({
		page: state.conversation.page,
		threads: state.conversation.threads.filter(
			t => !state.conversation.filterCriteria || searchText(t).indexOf(searchFilter(state.conversation.filterCriteria)) !== -1
		),
		nbThreads: state.conversation.threads.length,
		refresh: state.conversation.refresh
	}), 
	dispatch => ({
		sync: (page: number) => readNextConversation(dispatch)(page),
		fetch: () => fetchConversation(dispatch)(),
		deleteThread: (conversation: IThreadModel) => deleteThread(dispatch)(conversation),
		filter: (filter) => clearFilterConversation(dispatch)()
	})
)(Conversations)