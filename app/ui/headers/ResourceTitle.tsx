import * as React from "react"
import { View, Text } from "react-native";
import { ContainerTopBar, Title, SubTitle } from '../ContainerBar';
import { Back } from "./Back";

export const ResourceTitle = ({ title, subTitle, navigation }) => (
	<ContainerTopBar>
		<Back navigation={ navigation } />
		<View style={{ justifyContent: 'center', flex: 1, height: 60 }}>
			<Title>{ title }</Title>
			<SubTitle>{ subTitle }</SubTitle>
		</View>
	</ContainerTopBar>
)