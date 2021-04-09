import { Menu, PluginFunction, SettingsItem } from "../";

/**
 * The type exported from a plugin's default file
 */
export type PluginModule = {
	menus?: Menu[],
	settings?: SettingsItem[],
	default: PluginFunction|PluginFunction[],
};