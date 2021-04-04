import { InputPromptTypes } from "../";

/**
 * Describes an individual item in settings.
 * Can be an object describing an input prompt, or a string showing text to the user.
 */
export type SettingsItem = {
	/**
	 * Name of the input to show the user.
	 * @example "Full Name"
	 * @example "Path to executable"
	 */
	name: string,
	/**
	 * The type of data to get from the user
	 */
	type: InputPromptTypes,
	/**
	 * ID value used to identify the setting.
	 */
	id: string,
	/**
	 * Description of what the setting is for
	 * @default ''
	 */
	description?: string,
	/**
	 * Placeholder data to prompt the user with (if applicable).
	 * @default ''
	 */
	placeholder?: string,
	/**
	 * Default value to use.
	 * @default {@code undefined}
	 */
	default?: string,
	/**
	 * Validator function to check the input is valid.
	 * @param arg0	The value entered by the user
	 * @return 	{@code true} if the value is acceptable, {@code false} if it should be rejected
	 * @default {@code () => true}
	 */
	validator?: (arg0: string) => Promise<boolean>,
}|string;
