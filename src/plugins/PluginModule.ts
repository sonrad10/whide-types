import { Menu, PluginFunction, TreeConverter } from "../";

/**
 * The type exported from a plugin's default file
 */
export type PluginModule = {
	menus?: Menu[],
	converters?: TreeConverter[],
	default: PluginFunction|PluginFunction[]
};