import { ExtendedCodeEditorWrapper } from "../";
import { EventEmitter } from "events";

export interface EditorController extends EventEmitter {
	readonly editor : ExtendedCodeEditorWrapper;
}