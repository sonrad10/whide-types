/**
 * Accepted input prompt types
 * {@code "string"} - Prompt the user for a string
 * {@code "number"} - Prompt the user for a number
 * {@code "path"} - Prompt the user for a valid (existing) file path
 * {@code "file"} - Same as {@code "path"}, but the path is to an existing file
 * {@code "folder"} - Same as {@code "path"}, but the path is to an existing folder
 */
export type InputPromptTypes = "string" | "number" | "path" | "file" | "folder";

export interface InputPromptParams {
	/**
	 * The prompt message
	 */
	message: string;
	/**
	 * Title to show in the input
	 */
	title?: string;
	/**
	 * Input validator function; should returns `true` if the string is an acceptable input, `false` otherwise
	 */
	validator?: ((val: string) => boolean|Promise<boolean>);
	/**
	 * The type of input to expect.
	 * Default: {@code "string"}
	 * See {@link InputPromptTypes} for a description.
	 */
	type?: InputPromptTypes;
}

export interface OutputPromptParams {
	/**
	 * @param message	The output message
	 */
	message: string;
	/**
	 * @param title		Output message title
 	 */
	title?: string;
}

/**
 * Controller interface to allow user input/output
 */
export interface IOController {
	/**
	 * Function to get user input
	 */
	getInput(params: InputPromptParams) : Promise<string|undefined>;

	/**
	 * Function to show output to the user
	 */
	showOutput(params: OutputPromptParams) : Promise<void>;
}