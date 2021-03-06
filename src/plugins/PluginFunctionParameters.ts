import {
	CustomFs,
	CustomPath,
	EditorController,
	IOController,
	RunPanelController
} from "../";

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
	fs: CustomFs,
	/**
	 * The path filesystem object to use;
	 * will be `node/path` for the local system, or an emulator when in-browser
	 */
	path: CustomPath,
}
