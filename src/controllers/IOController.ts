/**
 * Accepted input prompt types
 * {@code "string"} - Prompt the user for a string
 * {@code "number"} - Prompt the user for a number
 * {@code "path"} - Prompt the user for a valid (existing) file path
 * {@code "file"} - Same as {@code "path"}, but the path is to an existing file
 * {@code "folder"} - Same as {@code "path"}, but the path is to an existing folder
 */
export type InputPromptTypes = "string" | "number" | "path" | "file" | "folder";

/**
 * Parameter object for {@link IOController.getInput} method
 */
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

/**
 * Parameter object for {@link IOController.showOutput} method
 */
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
 * Parameter object for {@link IOController.prompt} method
 */
export interface PromptParams {
	/**
	 * @param title		Prompt title string
	 */
	title?: string,
	/**
	 * @param message	Message/description to show to the user
	 */
	message: string,
	/**
	 * Text to display in each button prompt
	 */
	options?: string[],
}

/**
 * Controller interface to allow user input/output
 */
export interface IOController {
	/**
	 * Function to get user input
	 * @return	The result of the input prompt, or undefined if the user cancelled
	 */
	getInput(params: InputPromptParams) : Promise<string|undefined>;

	/**
	 * Function to show output to the user
	 */
	showOutput(params: OutputPromptParams) : Promise<void>;

	/**
	 * Function to display a message to the user with button prompts
	 * @return	The name of the button pressed
	 */
	prompt(params: PromptParams): Promise<string>;
}