import { InputPromptTypes, PluginFunctionParameters } from "../";

/**
 * Describe an argument to prompt the user for
 */
export type Argument = {
	name: string,
	description?: string,
	type?: InputPromptTypes,
	optional?: boolean,
	default?: string,
	validator?: (v: string) => boolean|Promise<boolean>,
};

/**
 * A callable function exported from a plugin
 */
export type PluginFunction = {
	/**
	 * The name of the function used to link it to the interface.
	 */
	name: string,
	/**
	 * Arguments to be passed to the function when called.
	 */
	args?: [Argument];
	/**
	 * The function to run
	 * @param params	All parameters passed to the function. See {@link PluginFunctionParameters}
	 */
	run: (params : PluginFunctionParameters) => void | Promise<void>;
}