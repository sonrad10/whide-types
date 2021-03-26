import { BinaryTree } from "@whide/hwhile-wrapper";
import { CustomDict } from "@whide/hwhile-wrapper/lib/types/CustomDict";
import { Transform } from "stream";

/**
 * Controller for the "run" panel.
 */
export interface RunPanelController {
	/**
	 * Add a new output area
	 * @param name	The name to use in the tab
	 */
	addOutputStream(name?: string) : Promise<RunPanelInstanceController>;

	/**
	 * Remove an instance controller
	 * @param controller	The controller instance to remove
	 */
	removeOutputStream(controller: RunPanelInstanceController) : Promise<void>;

	/**
	 * Get a controller by its name
	 * @param name	The name of the controller
	 */
	getByName(name: string) : Promise<RunPanelInstanceController | undefined>;

	/**
	 * The tabs controlled by the controller
	 * TODO: better description here
	 */
	readonly controllers: RunPanelInstanceController[];
}

/**
 * Handle debug controls being pressed
 */
export interface DebuggerControllerInterface {
	/**
	 * Run to program completion, or until the next breakpoint
	 */
	run() : void;
	/**
	 * Execute the next line of the program, then pause
	 */
	step() : void;
	/**
	 * Stop executing the program
	 */
	stop() : void;
}

/**
 * Controller for a single output region of the "run" panel
 */
export interface RunPanelInstanceController {
	readonly stream: Transform;
	readonly output: string;
	variables: CustomDict<BinaryTree>;
	debuggerCallbackHandler?: DebuggerControllerInterface;
	name: string;
}
