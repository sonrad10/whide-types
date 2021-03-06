import { FilerPathInterface, FileSystemInterface } from "filer";
import nodeFs from "fs";
import nodePath from "path";

export type CustomFs = FileSystemInterface | typeof nodeFs;
export type CustomPath = FilerPathInterface | typeof nodePath;