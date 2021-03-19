import { ExtendedCodeEditorWrapper } from "../";
import { EventEmitter } from "events";

export interface EditorController extends EventEmitter {
	/**
	 * The code editor
	 */
	readonly editor : ExtendedCodeEditorWrapper;
	/**
	 * The currently focused file in the editor
 	 */
	readonly focusedFile? : string;
	/**
	 * The opened file tabs in the editor
 	 */
	readonly openFiles : string[];

	/**
	 * Open the file at the given path in a new tab in the editor, and focus on it.
	 * Only focuses if the file is already open.
 	 * @param filePath	The file path to open
	 */
	open(filePath: string) : Promise<void>;

	/**
	 * Close this file's editor tab
	 * @param filePath	The path to the file to close
	 */
	close(filePath: string) : Promise<void>;

	/**
	 * Save all the open files
	 */
	saveFiles() : Promise<void>;
}