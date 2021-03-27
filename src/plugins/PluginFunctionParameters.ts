import { EditorController, IOController, RunPanelController } from "../";
import { IFS } from "unionfs/lib/fs";

/**
 * Hold the parameters to pass to the function when it's called.
 */
export interface PluginFunctionParameters {
	/**
	 * The argument values as `name: value` pairs
	 */
	args: {[key: string]: string},
	/**
	 * The code editor object
	 */
	editorController: EditorController,
	/**
	 * Object allowing user input/output
	 */
	ioController: IOController,
	/**
	 * Object allowing output to the run panel
	 */
	runPanelController : RunPanelController,
	/**
	 * The filesystem object to use;
	 * will be `node/fs` for the local system, or an emulator when in-browser
	 */
	fs: IFS,
	/**
	 * The settings' values, as configured by the user.
	 * This is a key-value map where keys are the setting `id`s, and values are the string input values ({@link SettingsItem.id}).
	 * Values may be undefined if no default value was set.
	 */
	config: {
		[key: string]: string|undefined,
	}
}
