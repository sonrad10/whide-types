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

	controllers: RunPanelInstanceController[];
}

/**
 * Controller for a single output region of the "run" panel
 */
export interface RunPanelInstanceController {
	readonly stream: Transform;
	readonly output: string;
	name: string;
}
