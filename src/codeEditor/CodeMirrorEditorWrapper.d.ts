import CodeMirror from "codemirror";

/**
 * Interface describing the wrapper around {@link CodeMirror.Editor} objects.
 */
export interface CodeMirrorEditorWrapper {
	/** Used to find the target position for horizontal cursor motion.start is a { line , ch } object,
        amount an integer(may be negative), and unit one of the string "char", "column", or "word".
        Will return a position that is produced by moving amount times the distance specified by unit.
        When visually is true , motion in right - to - left text will be visual rather than logical.
        When the motion was clipped by hitting the end or start of the document, the returned value will have a hitSide property set to true. */
	findPosH(
		start: CodeMirror.Position,
		amount: number,
		unit: string,
		visually: boolean,
	): Promise<{ line: number; ch: number; hitSide?: boolean }>;

	/** Similar to findPosH , but used for vertical motion.unit may be "line" or "page".
        The other arguments and the returned value have the same interpretation as they have in findPosH. */
	findPosV(
		start: CodeMirror.Position,
		amount: number,
		unit: string,
	): Promise<{ line: number; ch: number; hitSide?: boolean }>;

	/** Returns the start and end of the 'word' (the stretch of letters, whitespace, or punctuation) at the given position. */
	findWordAt(pos: CodeMirror.Position): Promise<CodeMirror.Range>;

	/** Change the configuration of the editor. option should the name of an option, and value should be a valid value for that option. */
	setOption<K extends keyof CodeMirror.EditorConfiguration>(option: K, value: CodeMirror.EditorConfiguration[K]): Promise<void>;

	/** Retrieves the current value of the given option for this editor instance. */
	getOption<K extends keyof CodeMirror.EditorConfiguration>(option: K): Promise<CodeMirror.EditorConfiguration[K]>;

	/** Attach an additional keymap to the editor.
        This is mostly useful for add - ons that need to register some key handlers without trampling on the extraKeys option.
        Maps added in this way have a higher precedence than the extraKeys and keyMap options, and between them,
        the maps added earlier have a lower precedence than those added later, unless the bottom argument was passed,
        in which case they end up below other keymaps added with this method. */
	addKeyMap(map: string | CodeMirror.KeyMap, bottom?: boolean): Promise<void>;

	/** Disable a keymap added with addKeyMap.Either pass in the keymap object itself , or a string,
        which will be compared against the name property of the active keymaps. */
	removeKeyMap(map: string | CodeMirror.KeyMap): Promise<void>;

	/** Enable a highlighting overlay.This is a stateless mini - mode that can be used to add extra highlighting.
        For example, the search add - on uses it to highlight the term that's currently being searched.
        mode can be a mode spec or a mode object (an object with a token method). The options parameter is optional. If given, it should be an object.
        Currently, only the opaque option is recognized. This defaults to off, but can be given to allow the overlay styling, when not null,
        to override the styling of the base mode entirely, instead of the two being applied together. */
	addOverlay(mode: any, options?: any): Promise<void>;

	/** Pass this the exact argument passed for the mode parameter to addOverlay to remove an overlay again. */
	removeOverlay(mode: any): Promise<void>;

	/** Retrieve the currently active document from an editor. */
	getDoc(): Promise<CodeMirror.Doc>;

	/** Attach a new document to the editor. Returns the old document, which is now no longer associated with an editor. */
	swapDoc(doc: CodeMirror.Doc): Promise<CodeMirror.Doc>;

	/** Get the content of the current editor document. You can pass it an optional argument to specify the string to be used to separate lines (defaults to "\n"). */
	getValue(seperator?: string): Promise<string>;

	/** Set the content of the current editor document. */
	setValue(content: string): Promise<void>;

	/** start is a an optional string indicating which end of the selection to return.
        It may be "from", "to", "head" (the side of the selection that moves when you press shift+arrow),
        or "anchor" (the fixed side of the selection).Omitting the argument is the same as passing "head". A {line, ch} object will be returned. **/
	getCursor(start?: string): Promise<CodeMirror.Position>;

	/** Set the cursor position. You can either pass a single {line, ch} object, or the line and the character as two separate parameters.
        Will replace all selections with a single, empty selection at the given position.
        The supported options are the same as for setSelection */
	setCursor(
		pos: CodeMirror.Position | number,
		ch?: number,
		options?: { bias?: number; origin?: string; scroll?: boolean },
	): Promise<void>;

	/** Sets the gutter marker for the given gutter (identified by its CSS class, see the gutters option) to the given value.
        Value can be either null, to clear the marker, or a DOM element, to set it. The DOM element will be shown in the specified gutter next to the specified line. */
	setGutterMarker(line: any, gutterID: string, value: HTMLElement | null): Promise<CodeMirror.LineHandle>;

	/** Remove all gutter markers in the gutter with the given ID. */
	clearGutter(gutterID: string): Promise<void>;

	/** Set a CSS class name for the given line.line can be a number or a line handle.
        where determines to which element this class should be applied, can can be one of "text" (the text element, which lies in front of the selection),
        "background"(a background element that will be behind the selection),
        or "wrap" (the wrapper node that wraps all of the line's elements, including gutter elements).
        class should be the name of the class to apply. */
	addLineClass(line: any, where: string, _class_: string): Promise<CodeMirror.LineHandle>;

	/** Remove a CSS class from a line.line can be a line handle or number.
        where should be one of "text", "background", or "wrap"(see addLineClass).
        class can be left off to remove all classes for the specified node, or be a string to remove only a specific class. */
	removeLineClass(line: any, where: string, class_?: string): Promise<CodeMirror.LineHandle>;

	/** Compute the line at the given pixel height. mode is the relative element
        to use to compute this line, it may be "window", "page" (the default), or "local" */
	lineAtHeight(height: number, mode?: CodeMirror.CoordsMode): Promise<number>;

	/** Computes the height of the top of a line, in the coordinate system specified by mode, it may be "window",
        "page" (the default), or "local". When a line below the bottom of the document is specified, the returned value
        is the bottom of the last line in the document. By default, the position of the actual text is returned.
        If includeWidgets is true and the line has line widgets, the position above the first line widget is returned. */
	heightAtLine(line: any, mode?: CodeMirror.CoordsMode, includeWidgets?: boolean): Promise<number>;

	/** Returns the line number, text content, and marker status of the given line, which can be either a number or a line handle. */
	lineInfo(
		line: any,
	): Promise<{
		line: any;
		handle: any;
		text: string;
		/** Object mapping gutter IDs to marker elements. */
		gutterMarkers: any;
		textClass: string;
		bgClass: string;
		wrapClass: string;
		/** Array of line widgets attached to this line. */
		widgets: any;
	}>;

	/** Puts node, which should be an absolutely positioned DOM node, into the editor, positioned right below the given { line , ch } position.
        When scrollIntoView is true, the editor will ensure that the entire node is visible (if possible).
        To remove the widget again, simply use DOM methods (move it somewhere else, or call removeChild on its parent). */
	addWidget(pos: CodeMirror.Position, node: HTMLElement, scrollIntoView: boolean): Promise<void>;

	/** Adds a line widget, an element shown below a line, spanning the whole of the editor's width, and moving the lines below it downwards.
        line should be either an integer or a line handle, and node should be a DOM node, which will be displayed below the given line.
        options, when given, should be an object that configures the behavior of the widget.
        Note that the widget node will become a descendant of nodes with CodeMirror-specific CSS classes, and those classes might in some cases affect it. */
	addLineWidget(line: any, node: HTMLElement, options?: CodeMirror.LineWidgetOptions): Promise<CodeMirror.LineWidget>;

	/** Programatically set the size of the editor (overriding the applicable CSS rules).
        width and height height can be either numbers(interpreted as pixels) or CSS units ("100%", for example).
        You can pass null for either of them to indicate that that dimension should not be changed. */
	setSize(width: any, height: any): Promise<void>;

	/** Scroll the editor to a given(pixel) position.Both arguments may be left as null or undefined to have no effect. */
	scrollTo(x?: number | null, y?: number | null): Promise<void>;

	/** Get an { left , top , width , height , clientWidth , clientHeight } object that represents the current scroll position, the size of the scrollable area,
        and the size of the visible area(minus scrollbars). */
	getScrollInfo(): Promise<CodeMirror.ScrollInfo>;

	/** Scrolls the given element into view. pos is a { line , ch } position, referring to a given character, null, to refer to the cursor.
        The margin parameter is optional. When given, it indicates the amount of pixels around the given area that should be made visible as well. */
	scrollIntoView(pos: CodeMirror.Position | null, margin?: number): Promise<void>;

	/** Scrolls the given element into view. pos is a { left , top , right , bottom } object, in editor-local coordinates.
        The margin parameter is optional. When given, it indicates the amount of pixels around the given area that should be made visible as well. */
	scrollIntoView(pos: { left: number; top: number; right: number; bottom: number }, margin?: number): Promise<void>;

	/** Scrolls the given element into view. pos is a { line, ch } object, in editor-local coordinates.
        The margin parameter is optional. When given, it indicates the amount of pixels around the given area that should be made visible as well. */
	scrollIntoView(pos: { line: number; ch: number }, margin?: number): Promise<void>;

	/** Scrolls the given element into view. pos is a { from, to } object, in editor-local coordinates.
        The margin parameter is optional. When given, it indicates the amount of pixels around the given area that should be made visible as well. */
	scrollIntoView(pos: { from: CodeMirror.Position; to: CodeMirror.Position }, margin?: number): Promise<void>;

	/** Returns an { left , top , bottom } object containing the coordinates of the cursor position.
        If mode is "local", they will be relative to the top-left corner of the editable document.
        If it is "page" or not given, they are relative to the top-left corner of the page.
        where is a boolean indicating whether you want the start(true) or the end(false) of the selection. */
	cursorCoords(where?: boolean, mode?: CodeMirror.CoordsMode): Promise<{ left: number; top: number; bottom: number }>;

	/** Returns an { left , top , bottom } object containing the coordinates of the cursor position.
        If mode is "local", they will be relative to the top-left corner of the editable document.
        If it is "page" or not given, they are relative to the top-left corner of the page.
        where specifies the precise position at which you want to measure. */
	cursorCoords(
		where?: CodeMirror.Position | null,
		mode?: CodeMirror.CoordsMode,
	): Promise<{ left: number; top: number; bottom: number }>;

	/** Returns the position and dimensions of an arbitrary character. pos should be a { line , ch } object.
        If mode is "local", they will be relative to the top-left corner of the editable document.
        If it is "page" or not given, they are relative to the top-left corner of the page.
        This differs from cursorCoords in that it'll give the size of the whole character,
        rather than just the position that the cursor would have when it would sit at that position. */
	charCoords(
		pos: CodeMirror.Position,
		mode?: CodeMirror.CoordsMode,
	): Promise<{ left: number; right: number; top: number; bottom: number }>;

	/** Given an { left , top } object , returns the { line , ch } position that corresponds to it.
        The optional mode parameter determines relative to what the coordinates are interpreted.
        It may be "window", "page" (the default), or "local". */
	coordsChar(object: { left: number; top: number }, mode?: CodeMirror.CoordsMode): Promise<CodeMirror.Position>;

	/** Returns the line height of the default font for the editor. */
	defaultTextHeight(): Promise<number>;

	/** Returns the pixel width of an 'x' in the default font for the editor.
        (Note that for non - monospace fonts , this is mostly useless, and even for monospace fonts, non - ascii characters might have a different width). */
	defaultCharWidth(): Promise<number>;

	/** Returns a { from , to } object indicating the start (inclusive) and end (exclusive) of the currently rendered part of the document.
        In big documents, when most content is scrolled out of view, CodeMirror will only render the visible part, and a margin around it.
        See also the viewportChange event. */
	getViewport(): Promise<{ from: number; to: number }>;

	/** If your code does something to change the size of the editor element (window resizes are already listened for), or unhides it,
        you should probably follow up by calling this method to ensure CodeMirror is still looking as intended. */
	refresh(): Promise<void>;

	/** Gets the inner mode at a given position. This will return the same as getMode for simple modes, but will return an inner mode for nesting modes (such as htmlmixed). */
	getModeAt(pos: CodeMirror.Position): Promise<any>;

	/** Retrieves information about the token the current mode found before the given position (a {line, ch} object). */
	getTokenAt(pos: CodeMirror.Position, precise?: boolean): Promise<CodeMirror.Token>;

	/** This is a (much) cheaper version of getTokenAt useful for when you just need the type of the token at a given position,
        and no other information. Will return null for unstyled tokens, and a string, potentially containing multiple
        space-separated style names, otherwise. */
	getTokenTypeAt(pos: CodeMirror.Position): Promise<string>;

	/** This is similar to getTokenAt, but collects all tokens for a given line into an array. */
	getLineTokens(line: number, precise?: boolean): Promise<CodeMirror.Token[]>;

	/** Returns the mode's parser state, if any, at the end of the given line number.
        If no line number is given, the state at the end of the document is returned.
        This can be useful for storing parsing errors in the state, or getting other kinds of contextual information for a line. */
	getStateAfter(line?: number): Promise<any>;

	/** CodeMirror internally buffers changes and only updates its DOM structure after it has finished performing some operation.
        If you need to perform a lot of operations on a CodeMirror instance, you can call this method with a function argument.
        It will call the function, buffering up all changes, and only doing the expensive update after the function returns.
        This can be a lot faster. The return value from this method will be the return value of your function. */
	operation<T>(fn: () => T): Promise<T>;

	/** In normal circumstances, use the above operation method. But if you want to buffer operations happening asynchronously, or that can't all be wrapped in a callback
        function, you can call startOperation to tell CodeMirror to start buffering changes, and endOperation to actually render all the updates. Be careful: if you use this
        API and forget to call endOperation, the editor will just never update. */
	startOperation(): Promise<void>;

	endOperation(): Promise<void>;

	/** Adjust the indentation of the given line.
        The second argument (which defaults to "smart") may be one of:
        "prev" Base indentation on the indentation of the previous line.
        "smart" Use the mode's smart indentation if available, behave like "prev" otherwise.
        "add" Increase the indentation of the line by one indent unit.
        "subtract" Reduce the indentation of the line. */
	indentLine(line: number, dir?: string): Promise<void>;

	/** Indent a selection */
	indentSelection(how: string): Promise<void>;

	/** Tells you whether the editor's content can be edited by the user. */
	isReadOnly(): Promise<boolean>;

	/** Switches between overwrite and normal insert mode (when not given an argument),
        or sets the overwrite mode to a specific state (when given an argument). */
	toggleOverwrite(value?: boolean): Promise<void>;

	/** Runs the command with the given name on the editor. */
	execCommand(name: string): Promise<void>;

	/** Give the editor focus. */
	focus(): Promise<void>;

	/** Returns the hidden textarea used to read input. */
	getInputField(): Promise<HTMLTextAreaElement>;

	/** Returns the DOM node that represents the editor, and controls its size. Remove this from your tree to delete an editor instance. */
	getWrapperElement(): Promise<HTMLElement>;

	/** Returns the DOM node that is responsible for the scrolling of the editor. */
	getScrollerElement(): Promise<HTMLElement>;

	/** Fetches the DOM node that contains the editor gutters. */
	getGutterElement(): Promise<HTMLElement>;

	/** Fires every time the content of the editor is changed. */
	on(
		eventName: 'change',
		handler: (instance: CodeMirror.Editor, changeObj: CodeMirror.EditorChangeLinkedList) => void,
	): Promise<void>;

	off(
		eventName: 'change',
		handler: (instance: CodeMirror.Editor, changeObj: CodeMirror.EditorChangeLinkedList) => void,
	): Promise<void>;

	/** Like the "change" event, but batched per operation, passing an
	 * array containing all the changes that happened in the operation.
	 * This event is fired after the operation finished, and display
	 * changes it makes will trigger a new operation. */
	on(
		eventName: 'changes',
		handler: (instance: CodeMirror.Editor, changes: CodeMirror.EditorChangeLinkedList[]) => void,
	): Promise<void>;

	off(
		eventName: 'changes',
		handler: (instance: CodeMirror.Editor, changes: CodeMirror.EditorChangeLinkedList[]) => void,
	): Promise<void>;

	/** This event is fired before a change is applied, and its handler may choose to modify or cancel the change.
        The changeObj never has a next property, since this is fired for each individual change, and not batched per operation.
        Note: you may not do anything from a "beforeChange" handler that would cause changes to the document or its visualization.
        Doing so will, since this handler is called directly from the bowels of the CodeMirror implementation,
        probably cause the editor to become corrupted. */
	on(
		eventName: 'beforeChange',
		handler: (instance: CodeMirror.Editor, changeObj: CodeMirror.EditorChangeCancellable) => void,
	): Promise<void>;

	off(
		eventName: 'beforeChange',
		handler: (instance: CodeMirror.Editor, changeObj: CodeMirror.EditorChangeCancellable) => void,
	): Promise<void>;

	/** Will be fired when the cursor or selection moves, or any change is made to the editor content. */
	on(eventName: 'cursorActivity', handler: (instance: CodeMirror.Editor) => void): Promise<void>;

	off(eventName: 'cursorActivity', handler: (instance: CodeMirror.Editor) => void): Promise<void>;

	/** Fired after a key is handled through a key map. name is the name of the handled key (for example "Ctrl-X" or "'q'"), and event is the DOM keydown or keypress event. */
	on(
		eventName: 'keyHandled',
		handler: (instance: CodeMirror.Editor, name: string, event: KeyboardEvent) => void,
	): Promise<void>;

	off(
		eventName: 'keyHandled',
		handler: (instance: CodeMirror.Editor, name: string, event: KeyboardEvent) => void,
	): Promise<void>;

	/** Fired whenever new input is read from the hidden textarea (typed or pasted by the user). */
	on(eventName: 'inputRead', handler: (instance: CodeMirror.Editor, changeObj: CodeMirror.EditorChange) => void): Promise<void>;

	off(eventName: 'inputRead', handler: (instance: CodeMirror.Editor, changeObj: CodeMirror.EditorChange) => void): Promise<void>;

	/** Fired if text input matched the mode's electric patterns, and this caused the line's indentation to change. */
	on(eventName: 'electricInput', handler: (instance: CodeMirror.Editor, line: number) => void): Promise<void>;

	off(eventName: 'electricInput', handler: (instance: CodeMirror.Editor, line: number) => void): Promise<void>;

	/** This event is fired before the selection is moved. Its handler may modify the resulting selection head and anchor.
        Handlers for this event have the same restriction as "beforeChange" handlers they should not do anything to directly update the state of the editor. */
	on(
		eventName: 'beforeSelectionChange',
		handler: (instance: CodeMirror.Editor, obj: CodeMirror.EditorSelectionChange) => void,
	): Promise<void>;

	off(
		eventName: 'beforeSelectionChange',
		handler: (instance: CodeMirror.Editor, obj: CodeMirror.EditorSelectionChange) => void,
	): Promise<void>;

	/** Fires whenever the view port of the editor changes (due to scrolling, editing, or any other factor).
        The from and to arguments give the new start and end of the viewport. */
	on(eventName: 'viewportChange', handler: (instance: CodeMirror.Editor, from: number, to: number) => void): Promise<void>;

	off(
		eventName: 'viewportChange',
		handler: (instance: CodeMirror.Editor, from: number, to: number) => void,
	): Promise<void>;

	/** This is signalled when the editor's document is replaced using the swapDoc method. */
	on(eventName: 'swapDoc', handler: (instance: CodeMirror.Editor, oldDoc: CodeMirror.Doc) => void): Promise<void>;

	off(eventName: 'swapDoc', handler: (instance: CodeMirror.Editor, oldDoc: CodeMirror.Doc) => void): Promise<void>;

	/** Fires when the editor gutter (the line-number area) is clicked. Will pass the editor instance as first argument,
        the (zero-based) number of the line that was clicked as second argument, the CSS class of the gutter that was clicked as third argument,
        and the raw mousedown event object as fourth argument. */
	on(
		eventName: 'gutterClick',
		handler: (instance: CodeMirror.Editor, line: number, gutter: string, clickEvent: MouseEvent) => void,
	): Promise<void>;

	off(
		eventName: 'gutterClick',
		handler: (instance: CodeMirror.Editor, line: number, gutter: string, clickEvent: MouseEvent) => void,
	): Promise<void>;

	/** Fires when the editor gutter (the line-number area) receives a contextmenu event. Will pass the editor instance as first argument,
        the (zero-based) number of the line that was clicked as second argument, the CSS class of the gutter that was clicked as third argument,
        and the raw contextmenu mouse event object as fourth argument. You can preventDefault the event, to signal that CodeMirror should do no
        further handling. */
	on(
		eventName: 'gutterContextMenu',
		handler: (instance: CodeMirror.Editor, line: number, gutter: string, contextMenu: MouseEvent) => void,
	): Promise<void>;

	off(
		eventName: 'gutterContextMenu',
		handler: (instance: CodeMirror.Editor, line: number, gutter: string, contextMenu: MouseEvent) => void,
	): Promise<void>;

	/** Fires whenever the editor is focused. */
	on(eventName: 'focus', handler: (instance: CodeMirror.Editor, event: FocusEvent) => void): Promise<void>;

	off(eventName: 'focus', handler: (instance: CodeMirror.Editor, event: FocusEvent) => void): Promise<void>;

	/** Fires whenever the editor is unfocused. */
	on(eventName: 'blur', handler: (instance: CodeMirror.Editor, event: FocusEvent) => void): Promise<void>;

	off(eventName: 'blur', handler: (instance: CodeMirror.Editor, event: FocusEvent) => void): Promise<void>;

	/** Fires when the editor is scrolled. */
	on(eventName: 'scroll', handler: (instance: CodeMirror.Editor) => void): Promise<void>;

	off(eventName: 'scroll', handler: (instance: CodeMirror.Editor) => void): Promise<void>;

	/** Fires when the editor is refreshed or resized. Mostly useful to invalidate cached values that depend on the editor or character size. */
	on(eventName: 'refresh', handler: (instance: CodeMirror.Editor) => void): Promise<void>;

	off(eventName: 'refresh', handler: (instance: CodeMirror.Editor) => void): Promise<void>;

	/** Dispatched every time an option is changed with setOption. */
	on(eventName: 'optionChange', handler: (instance: CodeMirror.Editor, option: string) => void): Promise<void>;

	off(eventName: 'optionChange', handler: (instance: CodeMirror.Editor, option: string) => void): Promise<void>;

	/** Fires when the editor tries to scroll its cursor into view. Can be hooked into to take care of additional scrollable containers around the editor. When the event object has its preventDefault method called, CodeMirror will not itself try to scroll the window. */
	on(eventName: 'scrollCursorIntoView', handler: (instance: CodeMirror.Editor, event: Event) => void): Promise<void>;

	off(eventName: 'scrollCursorIntoView', handler: (instance: CodeMirror.Editor, event: Event) => void): Promise<void>;

	/** Will be fired whenever CodeMirror updates its DOM display. */
	on(eventName: 'update', handler: (instance: CodeMirror.Editor) => void): Promise<void>;

	off(eventName: 'update', handler: (instance: CodeMirror.Editor) => void): Promise<void>;

	/** Fired whenever a line is (re-)rendered to the DOM. Fired right after the DOM element is built, before it is added to the document.
        The handler may mess with the style of the resulting element, or add event handlers, but should not try to change the state of the editor. */
	on(
		eventName: 'renderLine',
		handler: (instance: CodeMirror.Editor, line: CodeMirror.LineHandle, element: HTMLElement) => void,
	): Promise<void>;

	off(
		eventName: 'renderLine',
		handler: (instance: CodeMirror.Editor, line: CodeMirror.LineHandle, element: HTMLElement) => void,
	): Promise<void>;

	/** Fires when one of the global DOM events fires. */
	on<K extends CodeMirror.DOMEvent & keyof GlobalEventHandlersEventMap>(
		eventName: K,
		handler: (instance: CodeMirror.Editor, event: GlobalEventHandlersEventMap[K]) => void,
	): Promise<void>;

	off<K extends CodeMirror.DOMEvent & keyof GlobalEventHandlersEventMap>(
		eventName: K,
		handler: (instance: CodeMirror.Editor, event: GlobalEventHandlersEventMap[K]) => void,
	): Promise<void>;

	/** Fires when one of the clipboard DOM events fires. */
	on<K extends CodeMirror.DOMEvent & keyof DocumentAndElementEventHandlersEventMap>(
		eventName: K,
		handler: (instance: CodeMirror.Editor, event: DocumentAndElementEventHandlersEventMap[K]) => void,
	): Promise<void>;

	off<K extends CodeMirror.DOMEvent & keyof DocumentAndElementEventHandlersEventMap>(
		eventName: K,
		handler: (instance: CodeMirror.Editor, event: DocumentAndElementEventHandlersEventMap[K]) => void,
	): Promise<void>;

	/** Fires when the overwrite flag is flipped. */
	on(eventName: 'overwriteToggle', handler: (instance: CodeMirror.Editor, overwrite: boolean) => void): Promise<void>;

	/** Events are registered with the on method (and removed with the off method).
        These are the events that fire on the instance object. The name of the event is followed by the arguments that will be passed to the handler.
        The instance argument always refers to the editor instance. */
	on(eventName: string, handler: (instance: CodeMirror.Editor) => void): Promise<void>;

	off(eventName: string, handler: (instance: CodeMirror.Editor) => void): Promise<void>;

	/** Expose the state object, so that the Editor.state.completionActive property is reachable*/
	state: any;
}