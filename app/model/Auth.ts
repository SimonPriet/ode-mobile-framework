import { CREATE_SUCCESS } from "../constants/docs"
import {
	matchs,
	PATH_LOGIN,
	PATH_LOGOUT,
	PATH_SIGNUP,
} from "../constants/paths"
import { crudReducer } from "./docs"

export interface IAuthModel {
	email: string
	password: string
	loggedIn: boolean,
	synced: boolean,
	userId: string
}

export interface IAuthState extends IAuthModel {}

export const initialState: IAuthState = {
	email: "",
	password: "",
	loggedIn: false,
	synced: true,
	userId: null,
}

export function Auth(state: IAuthState = initialState, action): IAuthState {
	if (matchs([PATH_LOGOUT], action.path)) {
		return {
			email: action.payload.email,
			loggedIn: false,
			password: "",
			synced: true,
			userId: null,
		}
	}

	if (matchs([PATH_LOGIN, PATH_SIGNUP], action.path) && action.type === CREATE_SUCCESS)
		return crudReducer(state, [PATH_LOGIN, PATH_SIGNUP], action, "-1")

	return state
}
