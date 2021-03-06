import { BinaryTree, ExtendedBinaryTree } from "../";

export type TreeConverter = {
	name: string,
	convert: (tree: BinaryTree) => ExtendedBinaryTree;
};