export const HOST = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user_info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update_profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add_profile_image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove_profile_image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CONTACT_ROUTES = "api/contact";
export const SEARCH_CONTACT_ROUTE = `${CONTACT_ROUTES}/search`;
export const GET_CONTACTS_FOR_DM_LIST_ROUTE = `${CONTACT_ROUTES}/get_contacts_for_dm_list`;
export const GET_ALL_CONTACTS_ROUTE = `${CONTACT_ROUTES}/get_all_contacts`;

export const MESSAGE_ROUTES = "api/message";
export const GET_MESSAGES_ROUTE = `${MESSAGE_ROUTES}/get_messages`;
export const UPLOAD_FILES_ROUTE = `${MESSAGE_ROUTES}/upload_files`;

export const CHANNEL_ROUTES = "api/channel";
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/create_channel`;
export const GET_USER_CHANNELS_ROUTE = `${CHANNEL_ROUTES}/get_user_channels`;
export const GET_CHANNEL_MESSAGES_ROUTE = `${CHANNEL_ROUTES}/get_channel_messages`;
