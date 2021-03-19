import CodeMirror, { LineHandle } from "codemirror";
import { CodeEditorWrapper } from "./";

export type LineWidgetType = { line: CodeMirror.LineHandle, widget: CodeMirror.LineWidget };

export type ExtendedCodeEditorWrapper = CodeEditorWrapper & {
	editorWrapper: CodeEditorWrapper,
	/**
	 * Show an error message in the editor
	 * @param line		The line to show on
	 * @param message	The message to show
	 */
	addError(line: any, message: string): Promise<CodeMirror.LineWidget>;
	/**
	 * Show a warning message in the editor
	 * @param line		The line to show on
	 * @param message	The message to show
	 */
	addWarning(line: any, message: string): Promise<CodeMirror.LineWidget>;
	/**
	 * Show an information message in the editor
	 * @param line		The line to show on
	 * @param message	The message to show
	 */
	addInfo(line: any, message: string): Promise<CodeMirror.LineWidget>;
	/**
	 * Remove a breakpoint  widget from the editor
	 * @param widget	The widget to remove
	 */
	removeError(widget: CodeMirror.LineWidget | CodeMirror.LineHandle): Promise<void>;
	/**
	 * Remove an error message widget from the editor
	 * @param widget	The widget to remove
	 */
	removeWarning(widget: CodeMirror.LineWidget | CodeMirror.LineHandle): Promise<void>;
	/**
	 * Remove a warning message widget from the editor
	 * @param widget	The widget to remove
	 */
	removeInfo(widget: CodeMirror.LineWidget | CodeMirror.LineHandle): Promise<void>;
	/**
	 * Add or remove a breakpoint from the editor
	 * @param line		The line to use
	 * @param enabled	`true` to enable a breakpoint, `false` to disable, `undefined` to toggle
	 */
	toggleBreakpoint(line: number|CodeMirror.LineHandle, enabled?: boolean) : Promise<void>,
	/**
	 * Get the line numbers of each line where a breakpoint is enabled
	 */
	getBreakpoints() : Promise<number[]>;
	/**
	 * The same as {@link getBreakpoints}, but returning a {@link LineHandle} instead of the line number
	 */
	getBreakpointLines() : Promise<LineHandle[]>;
};