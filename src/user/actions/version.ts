import userConfig from "../config";
import { userService } from "../service";
import { Action } from "redux";
import { login } from "./login";
import { navigate } from "../../navigation/helpers/navHelper";
import { getAuthState } from "../selectors";

export interface IVersionContext {
    redirectOnError?: boolean,
    credentials?: { username: string; password: string }
    version: { canContinue: boolean, hasNewVersion: boolean, newVersion: string }
}

// ACTION INTERFACES --------------------------------------------------------------------------------

export interface INewVersionAction extends Action, IVersionContext {

}
// ACTION TYPES --------------------------------------------------------------------------------------
export const actionTypeRequestVersion = userConfig.createActionType("REQUEST_VERSION");
export const actionTypeNewVersion = userConfig.createActionType("NEW_VERSION");
export const actionTypeSkipVersion = userConfig.createActionType("SKIP_VERSION");

// ACTION CREATORS --------------------------------------------------------------------------------------

function checkVersionRequest(): Action {
    return { type: actionTypeRequestVersion };
}

function checkNewVersionFounded(version: { canContinue: boolean, hasNewVersion: boolean, newVersion: string },
    redirectOnError: boolean,
    credentials: { username: string; password: string }): INewVersionAction {
    return { type: actionTypeNewVersion, version, redirectOnError, credentials }
}
function skipVersion(): Action {
    return { type: actionTypeSkipVersion }
}

// THUNKS -----------------------------------------------------------------------------------------

export function checkVersionThenLogin(
    redirectOnError: boolean = false,
    credentials?: { username: string; password: string }) {
    return async (dispatch, getState) => {
        // === 0 if the user already skip ... login
        const state = getAuthState(getState());
        if (state.skipVersion) {
            dispatch(login(redirectOnError, credentials));
        }
        // === 1 check whether a new version exists (if not already checked)
        let version:{ canContinue: boolean, hasNewVersion: boolean, newVersion: string } = null;
        if (state.versionContext == null) {
            dispatch(checkVersionRequest());
            version = await userService.checkVersion();
        } else {
            version = state.versionContext.version;
        }
        if (version.hasNewVersion) {
            // === 2 if we have not yet redirected to login...
            if (redirectOnError) navigate("LoginHome");
            // === 3 if any new version display to the user
            dispatch(checkNewVersionFounded(version, redirectOnError, credentials));
        } else {
            //no new version so login...
            dispatch(login(redirectOnError, credentials));
        }
    }
}

export function updateVersionIfWanted(context: IVersionContext, update: boolean) {
    return async (dispatch, getState) => {
        const { version } = context;
        if (update) {
            // === Redirect to the store
            userService.redirectToTheStore();
        } else if (version.canContinue) {
            //user dont want to update (and he can) so login
            dispatch(skipVersion())
            dispatch(login(context.redirectOnError, context.credentials));
        } else {
            //user cant continue. stay in login page
        }
    }
}
