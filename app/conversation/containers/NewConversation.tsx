import style from "glamorous-native";
import * as React from "react";
import { connect } from "react-redux";
import { Header, Title, HeaderAction } from "../../ui/headers/Header";
import { Back } from "../../ui/headers/Back";
import { User } from "../../model/Auth";
import { PageContainer } from "../../ui/ContainerContent";
import SearchUser from "../../ui/SearchUser";
import { loadVisibles } from "../actions/loadVisibles";
import I18n from 'react-native-i18n';
import { unpickUser, pickUser } from "../actions/pickUser";
import { createConversation } from "../actions/createConversation";
import { openThread } from '../actions/thread';
import { Thread } from "../interfaces";

class NewThreadHeader extends React.Component<{ 
    navigation: any, 
    createConversation: (pickedUsers: any) => any, 
    pickedUsers: any[],
    openThread: (thread: string) => void
}, undefined> {

    createConversation(){
        const newConversation = this.props.createConversation(this.props.pickedUsers);
        this.props.navigation.replace("thread", newConversation.id);
    }

    render(){
        return <Header>
        <Back navigation={ this.props.navigation } />
        <Title>{ I18n.t('conversation-newMessage') }</Title>
        <HeaderAction onPress={ () => this.createConversation() }>{ I18n.t('next') }</HeaderAction>
    </Header>
    }
}

export const NewConversationHeader = connect(
	(state: any) => ({
        pickedUsers: state.conversation.pickedUsers
	}), 
	dispatch => ({
        createConversation: (pickedUsers) => createConversation(dispatch)(pickedUsers),
        openThread: (thread: string) => openThread(dispatch)(thread)
	})
)(NewThreadHeader)

interface NewConversationProps{
    remainingUsers: User[];
    loadVisibles: () => Promise<void>;
    pickedUsers: User[];
    pickUser: (user: User) => void;
    unpickUser: (user: User) => void;
}

class NewConversation extends React.Component<NewConversationProps, undefined> {
    
    componentDidMount(){
        this.props.loadVisibles();
    }

    render(){
        return <PageContainer>
            <SearchUser 
                remaining={ this.props.remainingUsers } 
                picked={ this.props.pickedUsers } 
                onPickUser={ (user) => this.props.pickUser(user) } 
                onUnpickUser={ (user) => this.props.unpickUser(user) }></SearchUser>
        </PageContainer>
    }
}

export default connect(
	(state: any) => { console.log(state); return ({
        pickedUsers: state.conversation.pickedUsers,
        remainingUsers: state.conversation.remainingUsers
	}) }, 
	dispatch => ({
        loadVisibles: () => loadVisibles(dispatch)(),
        pickUser: (user) => pickUser(dispatch)(user),
        unpickUser: (user) => unpickUser(dispatch)(user)
	})
)(NewConversation)