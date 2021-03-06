import { CodeMirrorDocWrapper, CodeMirrorEditorWrapper } from "./";

/**
 * The type of the CodeMirror editor wrapper.
 * This is because {@link CodeMirror.Editor} extends {@link CodeMirror.Doc}.
 */
export type CodeEditorWrapper = CodeMirrorDocWrapper & CodeMirrorEditorWrapper;