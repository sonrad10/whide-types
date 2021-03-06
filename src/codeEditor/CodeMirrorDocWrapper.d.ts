import CodeMirror from "codemirror";

/**
 * Interface describing the wrapper around {@link CodeMirror.Doc} objects.
 */
export interface CodeMirrorDocWrapper {
	/** Get the mode option **/
	modeOption: any;

	/** Expose the state object, so that the Doc.state.completionActive property is reachable*/
	state: any;

	/** Adds a line widget, an element shown below a line, spanning the whole of the editor's width, and moving the lines below it downwards.
    line should be either an integer or a line handle, and node should be a DOM node, which will be displayed below the given line.
    options, when given, should be an object that configures the behavior of the widget.
    Note that the widget node will become a descendant of nodes with CodeMirror-specific CSS classes, and those classes might in some cases affect it. */
	addLineWidget(line: number|CodeMirror.LineHandle, node: HTMLElement, options?: CodeMirror.LineWidgetOptions): Promise<CodeMirror.LineWidget>;

	/** Returns a number that can later be passed to isClean to test whether any edits were made (and not undone) in the
    meantime. If closeEvent is true, the current history event will be ‘closed’, meaning it can't be combined with further
    changes (rapid typing or deleting events are typically combined).*/
	changeGeneration(closeEvent?: boolean): Promise<number>;

	/** Clears the editor's undo history. */
	clearHistory(): Promise<void>;

	/** Create an identical copy of the given doc. When copyHistory is true , the history will also be copied.Can not be called directly on an editor. */
	copy(copyHistory: boolean): Promise<CodeMirrorDocWrapper>;

	/** Iterate over the whole document, and call f for each line, passing the line handle.
    This is a faster way to visit a range of line handlers than calling getLineHandle for each of them.
    Note that line handles have a text property containing the line's content (as a string). */
	eachLine(f: ((line: CodeMirror.LineHandle) => void)): Promise<void>;

	/** Iterate over the range from start up to (not including) end, and call f for each line, passing the line handle.
    This is a faster way to visit a range of line handlers than calling getLineHandle for each of them.
    Note that line handles have a text property containing the line's content (as a string). */
	eachLine(f: ((line: CodeMirror.LineHandle) => void), end?: number, f1?: (line: CodeMirror.LineHandle) => void): Promise<void>;

	/** Similar to setSelection , but will, if shift is held or the extending flag is set,
    move the head of the selection while leaving the anchor at its current place.
    pos2 is optional , and can be passed to ensure a region (for example a word or paragraph) will end up selected
    (in addition to whatever lies between that region and the current anchor). */
	extendSelection(from: CodeMirror.Position, to?: CodeMirror.Position): Promise<void>;

	/** Returns an array of all the bookmarks and marked ranges found between the given positions. */
	findMarks(from: CodeMirror.Position, to: CodeMirror.Position): Promise<CodeMirror.TextMarker[]>;

	/** Returns an array of all the bookmarks and marked ranges present at the given position. */
	findMarksAt(pos: CodeMirror.Position): Promise<CodeMirror.TextMarker[]>;

	/** Get the first line of the editor. This will usually be zero but for linked sub-views,
    or documents instantiated with a non-zero first line, it might return other values. */
	firstLine(): Promise<number>;

	/** Returns an array containing all marked ranges in the document. */
	getAllMarks(): Promise<CodeMirror.TextMarker[]>;

	/** start is a an optional string indicating which end of the selection to return.
    It may be "from", "to", "head" (the side of the selection that moves when you press shift+arrow),
    or "anchor" (the fixed side of the selection).Omitting the argument is the same as passing "head". A {line, ch} object will be returned. **/
	getCursor(start?: string): Promise<CodeMirror.Position>;

	/** Retrieve the editor associated with a document. May return null. */
	getEditor(): Promise<CodeMirror.Editor | null>;

	/** Get a(JSON - serializeable) representation of the undo history. */
	getHistory(): Promise<any>;

	/** Get the content of line n. */
	getLine(n: number): Promise<string>;

	/** Fetches the line handle for the given line number. */
	getLineHandle(num: number): Promise<CodeMirror.LineHandle>;

	/** Given a line handle, returns the current position of that line (or null when it is no longer in the document). */
	getLineNumber(handle: CodeMirror.LineHandle): Promise<number | null>;

	/** Gets the mode object for the editor. Note that this is distinct from getOption("mode"), which gives you the mode specification,
    rather than the resolved, instantiated mode object. */
	getMode(): Promise<any>;

	/** Get the text between the given points in the editor, which should be {line, ch} objects.
    An optional third argument can be given to indicate the line separator string to use (defaults to "\n"). */
	getRange(from: CodeMirror.Position, to: CodeMirror.Position, seperator?: string): Promise<string>;

	/** Get the currently selected code. */
	getSelection(): Promise<string>;

	/** Returns an array containing a string for each selection, representing the content of the selections. */
	getSelections(lineSep?: string): Promise<Array<string>>;

	/** Get the current editor content. You can pass it an optional argument to specify the string to be used to separate lines (defaults to "\n"). */
	getValue(separator?: string): Promise<string>;

	/** Returns an object with {undo, redo } properties , both of which hold integers , indicating the amount of stored undo and redo operations. */
	historySize(): Promise<{ undo: number; redo: number }>;

	/** The reverse of posFromIndex. */
	indexFromPos(object: CodeMirror.Position): Promise<number>;

	/** Returns whether the document is currently clean — not modified since initialization or the last call to markClean if
    no argument is passed, or since the matching call to changeGeneration if a generation value is given. */
	isClean(generation?: number): Promise<boolean>;

	/** Will call the given function for all documents linked to the target document. It will be passed two arguments,
    the linked document and a boolean indicating whether that document shares history with the target. */
	iterLinkedDocs(fn: (doc: CodeMirrorDocWrapper, sharedHist: boolean) => void): Promise<void>;

	/** Get the last line of the editor. This will usually be lineCount() - 1, but for linked sub-views, it might return other values. */
	lastLine(): Promise<number>;

	/** Get the number of lines in the editor. */
	lineCount(): Promise<number>;

	/** Returns the preferred line separator string for this document, as per the option by the same name. When that option is null, the string "\n" is returned. */
	lineSeparator(): Promise<string>;

	/** Create a new document that's linked to the target document. Linked documents will stay in sync (changes to one are also applied to the other) until unlinked. */
	linkedDoc(options: {
		/** When turned on, the linked copy will share an undo history with the original.
        Thus, something done in one of the two can be undone in the other, and vice versa. */
		sharedHist?: boolean;
		from?: number;
		/** Can be given to make the new document a subview of the original. Subviews only show a given range of lines.
        Note that line coordinates inside the subview will be consistent with those of the parent,
        so that for example a subview starting at line 10 will refer to its first line as line 10, not 0. */
		to?: number;
		/** By default, the new document inherits the mode of the parent. This option can be set to a mode spec to give it a different mode. */
		mode: any;
	}): Promise<CodeMirrorDocWrapper>;

	/** Retrieves a list of all current selections. These will always be sorted, and never overlap (overlapping selections are merged).
    Each object in the array contains anchor and head properties referring to {line, ch} objects. */
	listSelections(): Promise<CodeMirror.Range[]>;

	/** Set the editor content as 'clean', a flag that it will retain until it is edited, and which will be set again
    when such an edit is undone again. Useful to track whether the content needs to be saved. This function is deprecated
    in favor of changeGeneration, which allows multiple subsystems to track different notions of cleanness without interfering.*/
	markClean(): Promise<void>;

	/** Can be used to mark a range of text with a specific CSS class name. from and to should be { line , ch } objects. */
	markText(from: CodeMirror.Position, to: CodeMirror.Position, options?: CodeMirror.TextMarkerOptions): Promise<CodeMirror.TextMarker>;

	/** Calculates and returns a { line , ch } object for a zero-based index whose value is relative to the start of the editor's text.
    If the index is out of range of the text then the returned object is clipped to start or end of the text respectively. */
	posFromIndex(index: number): Promise<CodeMirror.Position>;

	/** Redo one undone edit. */
	redo(): Promise<void>;

	/** Remove the given line from the document. */
	removeLine(n: number): Promise<void>;

	/** Remove the line widget */
	removeLineWidget(widget: CodeMirror.LineWidget): Promise<void>;

	/** Replace the part of the document between from and to with the given string.
    from and to must be {line, ch} objects. to can be left off to simply insert the string at position from. */
	replaceRange(replacement: string | string[], from: CodeMirror.Position, to?: CodeMirror.Position, origin?: string): Promise<void>;

	/** Replace the selection with the given string. By default, the new selection will span the inserted text.
    The optional collapse argument can be used to change this -- passing "start" or "end" will collapse the selection to the start or end of the inserted text. */
	replaceSelection(replacement: string, collapse?: string): Promise<void>;

	/** Replaces the content of the selections with the strings in the array.
    The length of the given array should be the same as the number of active selections.
    The collapse argument works the same as in replaceSelection. */
	replaceSelections(replacements: Array<string>, collapse?: string): Promise<void>;

	/** Inserts a bookmark, a handle that follows the text around it as it is being edited, at the given position.
    A bookmark has two methods find() and clear(). The first returns the current position of the bookmark, if it is still in the document,
    and the second explicitly removes the bookmark. */
	setBookmark(
		pos: CodeMirror.Position,
		options?: {
			/** Can be used to display a DOM node at the current location of the bookmark (analogous to the replacedWith option to markText). */
			widget?: HTMLElement;

			/** By default, text typed when the cursor is on top of the bookmark will end up to the right of the bookmark.
        Set this option to true to make it go to the left instead. */
			insertLeft?: boolean;

			/** When the target document is linked to other documents, you can set shared to true to make the marker appear in all documents. By default, a marker appears only in its target document. */
			shared?: boolean;

			/** As with markText, this determines whether mouse events on the widget inserted for this bookmark are handled by CodeMirror. The default is false. */
			handleMouseEvents?: boolean;
		},
	): Promise<CodeMirror.TextMarker>;

	/** Set the cursor position. You can either pass a single {line, ch} object, or the line and the character as two separate parameters.
    Will replace all selections with a single, empty selection at the given position.
    The supported options are the same as for setSelection */
	setCursor(pos: CodeMirror.Position | number, ch?: number, options?: { bias?: number; origin?: string; scroll?: boolean }): Promise<void>;

	/** Sets or clears the 'extending' flag , which acts similar to the shift key,
    in that it will cause cursor movement and calls to extendSelection to leave the selection anchor in place. */
	setExtending(value: boolean): Promise<void>;

	/** Replace the editor's undo history with the one provided, which must be a value as returned by getHistory.
    Note that this will have entirely undefined results if the editor content isn't also the same as it was when getHistory was called. */
	setHistory(history: any): Promise<void>;

	/** Set the content of line n. */
	setLine(n: number, text: string): Promise<void>;

	/** Set a single selection range. anchor and head should be {line, ch} objects. head defaults to anchor when not given. */
	setSelection(anchor: CodeMirror.Position, head?: CodeMirror.Position, options?: { bias?: number; origin?: string; scroll?: boolean }): Promise<void>;

	/** Sets a new set of selections. There must be at least one selection in the given array. When primary is a
    number, it determines which selection is the primary one. When it is not given, the primary index is taken from
    the previous selection, or set to the last range if the previous selection had less ranges than the new one.
    Supports the same options as setSelection. */
	setSelections(ranges: Array<{ anchor: CodeMirror.Position; head: CodeMirror.Position }>, primary?: number, options?: { bias?: number; origin?: string; scroll?: boolean }): Promise<void>;

	/** Set the editor content. */
	setValue(content: string): Promise<void>;

	/** Return true if any text is selected. */
	somethingSelected(): Promise<boolean>;

	/** Undo one edit (if any undo events are stored). */
	undo(): Promise<void>;

	/** Break the link between two documents. After calling this , changes will no longer propagate between the documents,
    and, if they had a shared history, the history will become separate. */
	unlinkDoc(doc: CodeMirrorDocWrapper): Promise<void>;
}