declare module "filer" {
	import nodePath from "path";
	import ErrnoException = NodeJS.ErrnoException;
	import { MakeDirectoryOptions, NoParamCallback, PathLike, Stats } from "fs";

	export declare const FileSystem: Interface.FileSystem;
	export declare const Buffer: Buffer;
	export declare const Path: Path.FilerPathInterface;
	export declare const path: Path.FilerPathInterface;
	export declare const Errors: Errors.ErrorObject;
	export declare const Shell: ShellNS.ShellInterface;
	export declare const fs : Interface.FileSystem;

	export type FileSystemInterface = Interface.FileSystem;
	export type FilerPathInterface = Path.FilerPathInterface;
	export type ShellInterface = ShellNS.ShellInterface;

	/**
	 * From src/path.js
	 */
	namespace Path {
		export type FilerPathInterface = (typeof nodePath) & {
			/**
			 * Add new utility method isNull() to path: check for null paths.
			 */
			isNull(path: string) : boolean;

			/**
			 * Add new utility method addTrailing() to add trailing / without doubling to //.
			 */
			addTrailing(path: string) : string;
		}
	}

	/**
	 * From src/errors.js
	 */
	namespace Errors {
		export type ErrorObject = { [key: (string | number)]: FilerError };

		export class FilerError extends Error {
			constructor(msg : string|null, path : string);
			toString() : string;
		}
	}

	/**
	 * From src/environment.js
	 */
	namespace EnvironmentNS {
		export type EnvironmentOptions = { TMP?: string, PATH?: string };

		export class Environment {
			env: {[key: string]: string};

			constructor(env : EnvironmentOptions);

			get(name) {
				return env[name];
			}

			set(name, value) {
				env[name] = value;
			}
	}
	}

	/*
	 * From src/shell.js
	 */
	namespace ShellNS {
		export interface ShellOptions {
			env: any;
		}

		export interface TouchOptions {
			date?: Date;
			updateOnly?: boolean,
		}

		export interface LsOptions {
			recursive: true;
		}

		export interface RmOptions {
			recursive: true;
		}

		export interface FindOptions {
			exec?: (path: string, next: (err?: Error) => void) => void;
			regex?: RegExp,
			name?: string,
			path?: string,
		}

		export type RecursiveStats = Stats & {
			contents?: RecursiveStats[]
		};

		export interface ShellInterface {
			/**
			 * The bound FileSystem (cannot be changed)
			 */
			readonly fs: FileSystemInterface;

			/**
			 * The shell's environment (e.g., for things like
			 * path, tmp, and other env vars). Use env.get()
			 * and env.set() to work with variables.
			 */
			readonly env: EnvironmentNS.Environment;
			cwd: string;
			promises: { [key: string]: Promise<any> | ((...args: any[]) => Promise<any>) };

			constructor(fs: FileSystemInterface, options?: ShellOptions);

			/**
			 * Change the current working directory. We
			 * include `cd` on the `this` vs. proto so that
			 * we can access cwd without exposing it externally.
			 */
			cd(path: string, callback: (err?: Error | null) => void): void;

			/**
			 * Get the current working directory (changed with `cd()`)
			 */
			pwd(): string;

			/**
			 * Execute the .js command located at `path`. Such commands
			 * should assume the existence of 3 arguments, which will be
			 * defined at runtime:
			 *
			 *   * fs - the current shell's bound filesystem object
			 *   * args - a list of arguments for the command, or an empty list if none
			 *   * callback - a callback function(error, result) to call when done.
			 *
			 * The .js command's contents should be the body of a function
			 * that looks like this:
			 *
			 * function(fs, args, callback) {
			 *   // .js code here
			 * }
			 */
			exec(path: string, callback?: (err?: ErrnoException | null, result: any) => void);
			exec(path: string, args?: any[], callback?: (err?: ErrnoException | null, result: any) => void);

			/**
			 * Create a file if it does not exist, or update access and
			 * modified times if it does. Valid options include:
			 *
			 *  * updateOnly - whether to create the file if missing (defaults to false)
			 *  * date - use the provided Date value instead of current date/time
			 */
			touch(path: string, callback: (err: Error) => void);
			touch(path: string, options: TouchOptions = {}, callback: (err: Error) => void);

			/**
			 * Concatenate multiple files into a single String, with each
			 * file separated by a newline. The `files` argument should
			 * be a String (path to single file) or an Array of Strings
			 * (multiple file paths).
			 */
			cat(files: string | string[], callback: (err?: Error | null, data?: string) => void);

			/**
			 * Get the listing of a directory, returning an array of
			 * file entries in the following form:
			 *
			 * {
			 *   path: <String> the basename of the directory entry
			 *   links: <Number> the number of links to the entry
			 *   size: <Number> the size in bytes of the entry
			 *   modified: <Number> the last modified date/time
			 *   type: <String> the type of the entry
			 *   contents: <Array> an optional array of child entries
			 * }
			 *
			 * By default ls() gives a shallow listing. If you want
			 * to follow directories as they are encountered, use
			 * the `recursive=true` option.
			 */
			ls(dir: string, callback?: (err: Error | null, res: RecursiveStats[]) => void);
			ls(dir: string, options?: LsOptions = {}, callback?: (err: Error | null, res: RecursiveStats[]) => void);

			/**
			 * Removes the file or directory at `path`. If `path` is a file
			 * it will be removed. If `path` is a directory, it will be
			 * removed if it is empty, otherwise the callback will receive
			 * an error. In order to remove non-empty directories, use the
			 * `recursive=true` option.
			 */
			rm(path: string, callback?: (err: Error | null) => void);
			rm(path: string, options?: RmOptions = {}, callback?: (err: Error | null) => void);

			/**
			 * Gets the path to the temporary directory, creating it if not
			 * present. The directory used is the one specified in
			 * env.TMP. The callback receives (error, tempDirName).
			 */
			tempDir(callback?: (err: null, tmp: string) => void);

			/**
			 * Recursively creates the directory at `path`. If the parent
			 * of `path` does not exist, it will be created.
			 * Based off EnsureDir by Sam X. Xu
			 * https://www.npmjs.org/package/ensureDir
			 * MIT License
			 */
			mkdirp(path: string, callback?: (err: Error | null) => {});

			/**
			 * Recursively walk a directory tree, reporting back all paths
			 * that were found along the way. The `path` must be a dir.
			 * Valid options include a `regex` for pattern matching paths
			 * and an `exec` function of the form `function(path, next)` where
			 * `path` is the current path that was found (dir paths have an '/'
			 * appended) and `next` is a callback to call when done processing
			 * the current path, passing any error object back as the first argument.
			 * `find` returns a flat array of absolute paths for all matching/found
			 * paths as the final argument to the callback.
			 */
			find(path: string, callback?: (err: Error | null, res?: string[]) => void);
			find(path: string, options?: FindOptions, callback?: (err: Error | null, res?: string[]) => void);
		}
	}

	/**
	 * From src/providers/index.js
	 */
	namespace Providers {
		export interface Providers {
			IndexedDB: IndexedDB,
			Default: IndexedDB,
			Memory: Memory
		}

		export interface BaseProviderType {
			open(callback : (err?: Error) => void) : void;
			getReadOnlyContext() : BaseContextType;
			getReadWriteContext() : BaseContextType;
		}

		export interface BaseContextType {
			name: string;
			flags: string;
			changes: { event: string; path: any; }[];
			guid: (callback: (err?: Error|string|null, id?: string) => void) => void;
			close();
			clear(callback: (err?: Error|null) => void);
		}

		/*
		 * From ./providers/indexeddb.js
		 */

		export class IndexedDB implements BaseProviderType {
			name: string;
			db: any|null;

			constructor (name: string);

			isSupported() : boolean;

			open(callback : (err?: Error) => void) : void;

			getReadOnlyContext() : IndexedDBContext;

			getReadWriteContext() : IndexedDBContext;
		}

		export class IndexedDBContext implements BaseContextType{
			db: any;
			mode: any;
			objectStore?: IDBObjectStore;

			constructor(db : any, mode : any);

			_getObjectStore() : IDBObjectStore;

			clear(callback: (err?: Error|null) => void) : void;

			_get(key: IDBValidKey|IDBKeyRange, callback: (err?: Error|null, res?: any) => void) : void;

			getObject(key: IDBValidKey|IDBKeyRange, callback: (err?: Error|null, res?: any) => void) : void;

			getBuffer(key: IDBValidKey|IDBKeyRange, callback: (err?: Error|null, res?: Buffer) => void) : void;

			_put(key: IDBValidKey|IDBKeyRange, value: any, callback: (err?: Error|null, result?: any) => void) : void;

			putObject(key: IDBValidKey|IDBKeyRange, value: any, callback: (err?: Error|null, result?: any) => void) : void;

			putBuffer(key: IDBValidKey|IDBKeyRange, uint8BackedBuffer: Buffer, callback: (err?: Error|null) => void) : void;

			delete(key: IDBValidKey|IDBKeyRange, callback: (err?: Error|null, res?: any) => void) : void;
		}

		/*
		 * From ./providers/memory.js
		 */

		export class Memory implements BaseProviderType {
			constructor(name?: string);

			isSupported() : true;

			open(callback : (err?: Error) => void) : void;

			getReadOnlyContext() : MemoryContext;

			getReadWriteContext() : MemoryContext;
		}

		export class MemoryContext implements BaseContextType {
			readOnly: boolean;
			objectStore: {[key: any]: any};

			constructor(db: any, readOnly: boolean);

			clear(callback : (err?: Error|string|null) => void) : void;

			getObject(key: any, callback: (err: null|any) => void) : void;

			getBuffer(key: any, callback: (err: null|any) => void) : void;

			putObject(key: any, value: any, callback: (err: null|any) => void) : void;

			putBuffer(key: any, value: any, callback: (err: null|any) => void) : void;

			delete(key: any, callback: (err?: Error|string) => void) : void;
		}
	}

	/**
	 * From src/interface.js
	 */
	namespace Interface {
		export interface FileSystemOptions {
			flags?: string[];
			guid?: string;
			name?: string;
			provider?: Providers.BaseProviderType;
		}

		/**
		 * FileSystem
		 *
		 * A FileSystem takes an `options` object, which can specify a number of,
		 * options.  All options are optional, and include:
		 *
		 * name: the name of the file system, defaults to "local"
		 *
		 * flags: one or more flags to use when creating/opening the file system.
		 *        For example: "FORMAT" will cause the file system to be formatted.
		 *        No explicit flags are set by default.
		 *
		 * provider: an explicit storage provider to use for the file
		 *           system's database context provider.  A number of context
		 *           providers are included (see /src/providers), and users
		 *           can write one of their own and pass it in to be used.
		 *           By default an IndexedDB provider is used.
		 *
		 * guid: a function for generating unique IDs for nodes in the filesystem.
		 *       Use this to override the built-in UUID generation. (Used mainly for tests).
		 *
		 * callback: a callback function to be executed when the file system becomes
		 *           ready for use. Depending on the context provider used, this might
		 *           be right away, or could take some time. The callback should expect
		 *           an `error` argument, which will be null if everything worked.  Also
		 *           users should check the file system's `readyState` and `error`
		 *           properties to make sure it is usable.
		 */
		export class FileSystem {
			//Types taken from the relevant definitions of `node/fs`
			constructor(options?: FileSystemOptions, callback?: (err?: Error|null, fs?: FileSystemInterface) => void);

			/**
			 * Asynchronous mkdir(2) - create a directory.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param options Either the file mode, or an object optionally specifying the file mode and whether parent folders
			 * should be created. If a string is passed, it is parsed as an octal integer. If not specified, defaults to `0o777`.
			 * @param callback
			 */
			mkdir(path: PathLike, options: MakeDirectoryOptions & { recursive: true }, callback: (err: NodeJS.ErrnoException | null, path: string) => void): void;

			/**
			 * Asynchronous mkdir(2) - create a directory.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param options Either the file mode, or an object optionally specifying the file mode and whether parent folders
			 * should be created. If a string is passed, it is parsed as an octal integer. If not specified, defaults to `0o777`.
			 * @param callback
			 */
			mkdir(path: PathLike, options: Mode | (MakeDirectoryOptions & { recursive?: false; }) | null | undefined, callback: NoParamCallback): void;

			/**
			 * Asynchronous mkdir(2) - create a directory.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param options Either the file mode, or an object optionally specifying the file mode and whether parent folders
			 * should be created. If a string is passed, it is parsed as an octal integer. If not specified, defaults to `0o777`.
			 * @param callback
			 */
			mkdir(path: PathLike, options: Mode | MakeDirectoryOptions | null | undefined, callback: (err: NodeJS.ErrnoException | null, path: string | undefined) => void): void;

			/**
			 * Asynchronous mkdir(2) - create a directory with a mode of `0o777`.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param callback
			 */
			mkdir(path: PathLike, callback: NoParamCallback): void;

			RmDirOptions: {
				/**
				 * If an `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY`, or
				 * `EPERM` error is encountered, Node.js will retry the operation with a linear
				 * backoff wait of `retryDelay` ms longer on each try. This option represents the
				 * number of retries. This option is ignored if the `recursive` option is not
				 * `true`.
				 * @default 0
				 */
				maxRetries?: number;
				/**
				 * @deprecated since v14.14.0 In future versions of Node.js,
				 * `fs.rmdir(path, { recursive: true })` will throw on nonexistent
				 * paths, or when given a file as a target.
				 * Use `fs.rm(path, { recursive: true, force: true })` instead.
				 *
				 * If `true`, perform a recursive directory removal. In
				 * recursive mode, errors are not reported if `path` does not exist, and
				 * operations are retried on failure.
				 * @default false
				 */
				recursive?: boolean;
				/**
				 * The amount of time in milliseconds to wait between retries.
				 * This option is ignored if the `recursive` option is not `true`.
				 * @default 100
				 */
				retryDelay?: number;
			}

			/**
			 * Asynchronous rmdir(2) - delete a directory.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param callback
			 */
			rmdir(path: PathLike, callback: NoParamCallback): void;
			rmdir(path: PathLike, options: RmDirOptions, callback: NoParamCallback): void;


			/**
			 * Asynchronous readdir(3) - read a directory.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
			 * @param callback
			 */
			readdir(
				path: PathLike,
				options: { encoding: BufferEncoding | null; withFileTypes?: false } | BufferEncoding | undefined | null,
				callback: (err: NodeJS.ErrnoException | null, files: string[]) => void,
			): void;

			/**
			 * Asynchronous readdir(3) - read a directory.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
			 * @param callback
			 */
			readdir(path: PathLike, options: { encoding: "buffer"; withFileTypes?: false } | "buffer", callback: (err: NodeJS.ErrnoException | null, files: Buffer[]) => void): void;

			/**
			 * Asynchronous readdir(3) - read a directory.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
			 * @param callback
			 */
			readdir(
				path: PathLike,
				options: BaseEncodingOptions & { withFileTypes?: false } | BufferEncoding | undefined | null,
				callback: (err: NodeJS.ErrnoException | null, files: string[] | Buffer[]) => void,
			): void;

			/**
			 * Asynchronous readdir(3) - read a directory.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param callback
			 */
			readdir(path: PathLike, callback: (err: NodeJS.ErrnoException | null, files: string[]) => void): void;

			/**
			 * Asynchronous readdir(3) - read a directory.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param options If called with `withFileTypes: true` the result data will be an array of Dirent.
			 * @param callback
			 */
			readdir(path: PathLike, options: BaseEncodingOptions & { withFileTypes: true }, callback: (err: NodeJS.ErrnoException | null, files: Dirent[]) => void): void;

			/**
			 * Asynchronous stat(2) - Get file status.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param options
			 * @param callback
			 */
			stat(path: PathLike, options: BigIntOptions, callback: (err: NodeJS.ErrnoException | null, stats: BigIntStats) => void): void;
			stat(path: PathLike, options: StatOptions, callback: (err: NodeJS.ErrnoException | null, stats: Stats | BigIntStats) => void): void;
			stat(path: PathLike, callback: (err: NodeJS.ErrnoException | null, stats: Stats) => void): void;

			/**
			 * Asynchronous fstat(2) - Get file status.
			 * @param fd A file descriptor.
			 * @param callback
			 */
			fstat(fd: number, callback: (err: NodeJS.ErrnoException | null, stats: Stats) => void): void;

			/**
			 * Asynchronous lstat(2) - Get file status. Does not dereference symbolic links.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param callback
			 */
			lstat(path: PathLike, callback: (err: NodeJS.ErrnoException | null, stats: Stats) => void): void;

			/**
			 * Asynchronously tests whether or not the given path exists by checking with the file system.
			 * @deprecated since v1.0.0 Use `fs.stat()` or `fs.access()` instead
			 * @param path A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * @param callback
			 */
			exists(path: PathLike, callback: (exists: boolean) => void): void;

			/**
			 * Asynchronous chmod(2) - Change permissions of a file.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param mode A file mode. If a string is passed, it is parsed as an octal integer.
			 * @param callback
			 */
			chmod(path: PathLike, mode: Mode, callback: NoParamCallback): void;

			/**
			 * Asynchronous fchmod(2) - Change permissions of a file.
			 * @param fd A file descriptor.
			 * @param mode A file mode. If a string is passed, it is parsed as an octal integer.
			 * @param callback
			 */
			fchmod(fd: number, mode: Mode, callback: NoParamCallback): void;

			/**
			 * Asynchronous lchmod(2) - Change permissions of a file. Does not dereference symbolic links.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param mode A file mode. If a string is passed, it is parsed as an octal integer.
			 * @param callback
			 */
			lchmod(path: PathLike, mode: Mode, callback: NoParamCallback): void;

			/**
			 * Asynchronous chown(2) - Change ownership of a file.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param uid
			 * @param gid
			 * @param callback
			 */
			chown(path: PathLike, uid: number, gid: number, callback: NoParamCallback): void;

			/**
			 * Asynchronous fchown(2) - Change ownership of a file.
			 * @param fd A file descriptor.
			 * @param uid
			 * @param gid
			 * @param callback
			 */
			fchown(fd: number, uid: number, gid: number, callback: NoParamCallback): void;

			/**
			 * Asynchronous lchown(2) - Change ownership of a file. Does not dereference symbolic links.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param uid
			 * @param gid
			 * @param callback
			 */
			lchown(path: PathLike, uid: number, gid: number, callback: NoParamCallback): void;

			/**
			 * Asynchronously change file timestamps of the file referenced by the supplied path.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param atime The last access time. If a string is provided, it will be coerced to number.
			 * @param mtime The last modified time. If a string is provided, it will be coerced to number.
			 * @param callback
			 */
			utimes(path: PathLike, atime: string | number | Date, mtime: string | number | Date, callback: NoParamCallback): void;

			/**
			 * Asynchronous rename(2) - Change the name or location of a file or directory.
			 * @param oldPath A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * @param newPath A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * @param callback
			 */
			rename(oldPath: PathLike, newPath: PathLike, callback: NoParamCallback): void;

			/**
			 * Asynchronous realpath(3) - return the canonicalized absolute pathname.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
			 * @param callback
			 */
			realpath(
				path: PathLike,
				options: BaseEncodingOptions | BufferEncoding | undefined | null,
				callback: (err: NodeJS.ErrnoException | null, resolvedPath: string) => void
			): void;

			/**
			 * Asynchronous realpath(3) - return the canonicalized absolute pathname.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
			 * @param callback
			 */
			realpath(path: PathLike, options: BufferEncodingOption, callback: (err: NodeJS.ErrnoException | null, resolvedPath: Buffer) => void): void;

			/**
			 * Asynchronous realpath(3) - return the canonicalized absolute pathname.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
			 * @param callback
			 */
			realpath(path: PathLike, options: BaseEncodingOptions | string | undefined | null, callback: (err: NodeJS.ErrnoException | null, resolvedPath: string | Buffer) => void): void;

			/**
			 * Asynchronous realpath(3) - return the canonicalized absolute pathname.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param callback
			 */
			realpath(path: PathLike, callback: (err: NodeJS.ErrnoException | null, resolvedPath: string) => void): void;

			/**
			 * Asynchronously writes data to a file, replacing the file if it already exists.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
			 * @param data The data to write. If something other than a Buffer or Uint8Array is provided, the value is coerced to a string.
			 * @param options Either the encoding for the file, or an object optionally specifying the encoding, file mode, and flag.
			 * If `encoding` is not supplied, the default of `'utf8'` is used.
			 * If `mode` is not supplied, the default of `0o666` is used.
			 * If `mode` is a string, it is parsed as an octal integer.
			 * If `flag` is not supplied, the default of `'w'` is used.
			 * @param callback
			 */
			writeFile(path: PathLike | number, data: string | NodeJS.ArrayBufferView, options: WriteFileOptions, callback: NoParamCallback): void;

			/**
			 * Asynchronously writes data to a file, replacing the file if it already exists.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
			 * @param data The data to write. If something other than a Buffer or Uint8Array is provided, the value is coerced to a string.
			 * @param callback
			 */
			writeFile(path: PathLike | number, data: string | NodeJS.ArrayBufferView, callback: NoParamCallback): void;


			/**
			 * Asynchronously append data to a file, creating the file if it does not exist.
			 * @param file A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
			 * @param data The data to write. If something other than a Buffer or Uint8Array is provided, the value is coerced to a string.
			 * @param options Either the encoding for the file, or an object optionally specifying the encoding, file mode, and flag.
			 * If `encoding` is not supplied, the default of `'utf8'` is used.
			 * If `mode` is not supplied, the default of `0o666` is used.
			 * If `mode` is a string, it is parsed as an octal integer.
			 * If `flag` is not supplied, the default of `'a'` is used.
			 * @param callback
			 */
			appendFile(file: PathLike | number, data: string | Uint8Array, options: WriteFileOptions, callback: NoParamCallback): void;

			/**
			 * Asynchronously append data to a file, creating the file if it does not exist.
			 * @param file A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
			 * @param data The data to write. If something other than a Buffer or Uint8Array is provided, the value is coerced to a string.
			 * @param callback
			 */
			appendFile(file: PathLike | number, data: string | Uint8Array, callback: NoParamCallback): void;

			/**
			 * Asynchronous unlink(2) - delete a name and possibly the file it refers to.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param callback
			 */
			unlink(path: PathLike, callback: NoParamCallback): void;

			/**
			 * Asynchronously reads the entire contents of a file.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
			 * @param options An object that may contain an optional flag.
			 * If a flag is not provided, it defaults to `'r'`.
			 * @param callback
			 */
			readFile(path: PathLike | number, options: { encoding?: null; flag?: string; } | undefined | null, callback: (err: NodeJS.ErrnoException | null, data: Buffer) => void): void;

			/**
			 * Asynchronously reads the entire contents of a file.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
			 * @param options Either the encoding for the result, or an object that contains the encoding and an optional flag.
			 * If a flag is not provided, it defaults to `'r'`.
			 * @param callback
			 */
			readFile(path: PathLike | number, options: { encoding: BufferEncoding; flag?: string; } | string, callback: (err: NodeJS.ErrnoException | null, data: string) => void): void;

			/**
			 * Asynchronously reads the entire contents of a file.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
			 * @param options Either the encoding for the result, or an object that contains the encoding and an optional flag.
			 * If a flag is not provided, it defaults to `'r'`.
			 * @param callback
			 */
			readFile(
				path: PathLike | number,
				options: BaseEncodingOptions & { flag?: string; } | string | undefined | null,
				callback: (err: NodeJS.ErrnoException | null, data: string | Buffer) => void,
			): void;

			/**
			 * Asynchronously reads the entire contents of a file.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
			 * @param callback
			 */
			readFile(path: PathLike | number, callback: (err: NodeJS.ErrnoException | null, data: Buffer) => void): void;

			/**
			 * Returns a new `ReadStream` object.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * @param options
			 */
			createReadStream(path: PathLike, options?: string | {
				flags?: string;
				encoding?: BufferEncoding;
				fd?: number;
				mode?: number;
				autoClose?: boolean;
				/**
				 * @default false
				 */
				emitClose?: boolean;
				start?: number;
				end?: number;
				highWaterMark?: number;
			}): ReadStream;

			/**
			 * Returns a new `WriteStream` object.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * @param options
			 */
			createWriteStream(path: PathLike, options?: string | {
				flags?: string;
				encoding?: BufferEncoding;
				fd?: number;
				mode?: number;
				autoClose?: boolean;
				emitClose?: boolean;
				start?: number;
				highWaterMark?: number;
			}): WriteStream;

			/**
			 * Asynchronous truncate(2) - Truncate a file to a specified length.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param len If not specified, defaults to `0`.
			 * @param callback
			 */
			truncate(path: PathLike, len: number | undefined | null, callback: NoParamCallback): void;

			/**
			 * Asynchronous truncate(2) - Truncate a file to a specified length.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * @param callback
			 */
			truncate(path: PathLike, callback: NoParamCallback): void;

			/**
			 * Asynchronous ftruncate(2) - Truncate a file to a specified length.
			 * @param fd A file descriptor.
			 * @param len If not specified, defaults to `0`.
			 * @param callback
			 */
			ftruncate(fd: number, len: number | undefined | null, callback: NoParamCallback): void;

			/**
			 * Asynchronous ftruncate(2) - Truncate a file to a specified length.
			 * @param fd A file descriptor.
			 * @param callback
			 */
			ftruncate(fd: number, callback: NoParamCallback): void;

			/**
			 * Watch for changes on `filename`. The callback `listener` will be called each time the file is accessed.
			 */
			watchFile(filename: PathLike, options: { persistent?: boolean; interval?: number; } | undefined, listener: (curr: Stats, prev: Stats) => void): void;

			/**
			 * Watch for changes on `filename`. The callback `listener` will be called each time the file is accessed.
			 * @param filename A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * @param listener
			 */
			watchFile(filename: PathLike, listener: (curr: Stats, prev: Stats) => void): void;

			/**
			 * Stop watching for changes on `filename`.
			 * @param filename A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * @param listener
			 */
			unwatchFile(filename: PathLike, listener?: (curr: Stats, prev: Stats) => void): void;

			/**
			 * Watch for changes on `filename`, where `filename` is either a file or a directory, returning an `FSWatcher`.
			 * @param filename A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * @param options Either the encoding for the filename provided to the listener, or an object optionally specifying encoding, persistent, and recursive options.
			 * If `encoding` is not supplied, the default of `'utf8'` is used.
			 * If `persistent` is not supplied, the default of `true` is used.
			 * If `recursive` is not supplied, the default of `false` is used.
			 * @param listener
			 */
			watch(
				filename: PathLike,
				options: { encoding?: BufferEncoding | null, persistent?: boolean, recursive?: boolean } | BufferEncoding | undefined | null,
				listener?: (event: string, filename: string) => void,
			): FSWatcher;

			/**
			 * Watch for changes on `filename`, where `filename` is either a file or a directory, returning an `FSWatcher`.
			 * @param filename A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * @param options Either the encoding for the filename provided to the listener, or an object optionally specifying encoding, persistent, and recursive options.
			 * If `encoding` is not supplied, the default of `'utf8'` is used.
			 * If `persistent` is not supplied, the default of `true` is used.
			 * If `recursive` is not supplied, the default of `false` is used.
			 * @param listener
			 */
			watch(filename: PathLike, options: { encoding: "buffer", persistent?: boolean, recursive?: boolean } | "buffer", listener?: (event: string, filename: Buffer) => void): FSWatcher;

			/**
			 * Watch for changes on `filename`, where `filename` is either a file or a directory, returning an `FSWatcher`.
			 * @param filename A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * @param options Either the encoding for the filename provided to the listener, or an object optionally specifying encoding, persistent, and recursive options.
			 * If `encoding` is not supplied, the default of `'utf8'` is used.
			 * If `persistent` is not supplied, the default of `true` is used.
			 * If `recursive` is not supplied, the default of `false` is used.
			 * @param listener
			 */
			watch(
				filename: PathLike,
				options: { encoding?: BufferEncoding | null, persistent?: boolean, recursive?: boolean } | string | null,
				listener?: (event: string, filename: string | Buffer) => void,
			): FSWatcher;

			/**
			 * Watch for changes on `filename`, where `filename` is either a file or a directory, returning an `FSWatcher`.
			 * @param filename A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
			 * URL support is _experimental_.
			 * @param listener
			 */
			watch(filename: PathLike, listener?: (event: string, filename: string) => any): FSWatcher;

			/**
			 * Asynchronous open(2) - open and possibly create a file.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param flags
			 * @param mode A file mode. If a string is passed, it is parsed as an octal integer. If not supplied, defaults to `0o666`.
			 * @param callback
			 */
			open(path: PathLike, flags: OpenMode, mode: Mode | undefined | null, callback: (err: NodeJS.ErrnoException | null, fd: number) => void): void;

			/**
			 * Asynchronous open(2) - open and possibly create a file. If the file is created, its mode will be `0o666`.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param flags
			 * @param callback
			 */
			open(path: PathLike, flags: OpenMode, callback: (err: NodeJS.ErrnoException | null, fd: number) => void): void;

			/**
			 * Asynchronous close(2) - close a file descriptor.
			 * @param fd A file descriptor.
			 * @param callback
			 */
			close(fd: number, callback: NoParamCallback): void;

			/**
			 * Asynchronously writes `buffer` to the file referenced by the supplied file descriptor.
			 * @param fd A file descriptor.
			 * @param buffer
			 * @param offset The part of the buffer to be written. If not supplied, defaults to `0`.
			 * @param length The number of bytes to write. If not supplied, defaults to `buffer.length - offset`.
			 * @param position The offset from the beginning of the file where this data should be written. If not supplied, defaults to the current position.
			 * @param callback
			 */
			write<TBuffer extends NodeJS.ArrayBufferView>(
				fd: number,
				buffer: TBuffer,
				offset: number | undefined | null,
				length: number | undefined | null,
				position: number | undefined | null,
				callback: (err: NodeJS.ErrnoException | null, written: number, buffer: TBuffer) => void,
			): void;

			/**
			 * Asynchronously writes `buffer` to the file referenced by the supplied file descriptor.
			 * @param fd A file descriptor.
			 * @param buffer
			 * @param offset The part of the buffer to be written. If not supplied, defaults to `0`.
			 * @param length The number of bytes to write. If not supplied, defaults to `buffer.length - offset`.
			 * @param callback
			 */
			write<TBuffer extends NodeJS.ArrayBufferView>(
				fd: number,
				buffer: TBuffer,
				offset: number | undefined | null,
				length: number | undefined | null,
				callback: (err: NodeJS.ErrnoException | null, written: number, buffer: TBuffer) => void,
			): void;

			/**
			 * Asynchronously writes `buffer` to the file referenced by the supplied file descriptor.
			 * @param fd A file descriptor.
			 * @param buffer
			 * @param offset The part of the buffer to be written. If not supplied, defaults to `0`.
			 * @param callback
			 */
			write<TBuffer extends NodeJS.ArrayBufferView>(
				fd: number,
				buffer: TBuffer,
				offset: number | undefined | null,
				callback: (err: NodeJS.ErrnoException | null, written: number, buffer: TBuffer) => void
			): void;

			/**
			 * Asynchronously writes `buffer` to the file referenced by the supplied file descriptor.
			 * @param fd A file descriptor.
			 * @param buffer
			 * @param callback
			 */
			write<TBuffer extends NodeJS.ArrayBufferView>(fd: number, buffer: TBuffer, callback: (err: NodeJS.ErrnoException | null, written: number, buffer: TBuffer) => void): void;

			/**
			 * Asynchronously writes `string` to the file referenced by the supplied file descriptor.
			 * @param fd A file descriptor.
			 * @param string A string to write.
			 * @param position The offset from the beginning of the file where this data should be written. If not supplied, defaults to the current position.
			 * @param encoding The expected string encoding.
			 * @param callback
			 */
			write(
				fd: number,
				string: string,
				position: number | undefined | null,
				encoding: BufferEncoding | undefined | null,
				callback: (err: NodeJS.ErrnoException | null, written: number, str: string) => void,
			): void;

			/**
			 * Asynchronously writes `string` to the file referenced by the supplied file descriptor.
			 * @param fd A file descriptor.
			 * @param string A string to write.
			 * @param position The offset from the beginning of the file where this data should be written. If not supplied, defaults to the current position.
			 * @param callback
			 */
			write(fd: number, string: string, position: number | undefined | null, callback: (err: NodeJS.ErrnoException | null, written: number, str: string) => void): void;

			/**
			 * Asynchronously writes `string` to the file referenced by the supplied file descriptor.
			 * @param fd A file descriptor.
			 * @param string A string to write.
			 * @param callback
			 */
			write(fd: number, string: string, callback: (err: NodeJS.ErrnoException | null, written: number, str: string) => void): void;

			/**
			 * Asynchronously reads data from the file referenced by the supplied file descriptor.
			 * @param fd A file descriptor.
			 * @param buffer The buffer that the data will be written to.
			 * @param offset The offset in the buffer at which to start writing.
			 * @param length The number of bytes to read.
			 * @param position The offset from the beginning of the file from which data should be read. If `null`, data will be read from the current position.
			 * @param callback
			 */
			read<TBuffer extends NodeJS.ArrayBufferView>(
				fd: number,
				buffer: TBuffer,
				offset: number,
				length: number,
				position: number | null,
				callback: (err: NodeJS.ErrnoException | null, bytesRead: number, buffer: TBuffer) => void,
			): void;

			/**
			 * Asynchronous fsync(2) - synchronize a file's in-core state with the underlying storage device.
			 * @param fd A file descriptor.
			 * @param callback
			 */
			fsync(fd: number, callback: NoParamCallback): void;

			/**
			 * Asynchronous fchmod(2) - Change permissions of a file.
			 * @param fd A file descriptor.
			 * @param mode A file mode. If a string is passed, it is parsed as an octal integer.
			 * @param callback
			 */
			fchmod(fd: number, mode: Mode, callback: NoParamCallback): void;

			/**
			 * Asynchronously change file timestamps of the file referenced by the supplied file descriptor.
			 * @param fd A file descriptor.
			 * @param atime The last access time. If a string is provided, it will be coerced to number.
			 * @param mtime The last modified time. If a string is provided, it will be coerced to number.
			 * @param callback
			 */
			futimes(fd: number, atime: string | number | Date, mtime: string | number | Date, callback: NoParamCallback): void;


			/**
			 * Asynchronous symlink(2) - Create a new symbolic link to an existing file.
			 * @param target A path to an existing file. If a URL is provided, it must use the `file:` protocol.
			 * @param path A path to the new symlink. If a URL is provided, it must use the `file:` protocol.
			 * @param type May be set to `'dir'`, `'file'`, or `'junction'` (default is `'file'`) and is only available on Windows (ignored on other platforms).
			 * When using `'junction'`, the `target` argument will automatically be normalized to an absolute path.
			 * @param callback
			 */
			symlink(target: PathLike, path: PathLike, type: symlink.Type | undefined | null, callback: NoParamCallback): void;

			/**
			 * Asynchronous symlink(2) - Create a new symbolic link to an existing file.
			 * @param target A path to an existing file. If a URL is provided, it must use the `file:` protocol.
			 * @param path A path to the new symlink. If a URL is provided, it must use the `file:` protocol.
			 * @param callback
			 */
			symlink(target: PathLike, path: PathLike, callback: NoParamCallback): void;

			/**
			 * Asynchronous readlink(2) - read value of a symbolic link.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
			 * @param callback
			 */
			readlink(
				path: PathLike,
				options: BaseEncodingOptions | BufferEncoding | undefined | null,
				callback: (err: NodeJS.ErrnoException | null, linkString: string) => void
			): void;

			/**
			 * Asynchronous readlink(2) - read value of a symbolic link.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
			 * @param callback
			 */
			readlink(path: PathLike, options: BufferEncodingOption, callback: (err: NodeJS.ErrnoException | null, linkString: Buffer) => void): void;

			/**
			 * Asynchronous readlink(2) - read value of a symbolic link.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
			 * @param callback
			 */
			readlink(path: PathLike, options: BaseEncodingOptions | string | undefined | null, callback: (err: NodeJS.ErrnoException | null, linkString: string | Buffer) => void): void;

			/**
			 * Asynchronous readlink(2) - read value of a symbolic link.
			 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param callback
			 */
			readlink(path: PathLike, callback: (err: NodeJS.ErrnoException | null, linkString: string) => void): void;

			/**
			 * Asynchronous link(2) - Create a new link (also known as a hard link) to an existing file.
			 * @param existingPath A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param newPath A path to a file. If a URL is provided, it must use the `file:` protocol.
			 * @param callback
			 */
			link(existingPath: PathLike, newPath: PathLike, callback: NoParamCallback): void;
		}
	}
}