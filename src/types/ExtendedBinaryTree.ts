/**
 * Extended binary tree object allowing more display flexibility than the original
 */
export type ExtendedBinaryTree = {
	left: ExtendedBinaryTree,
	right: ExtendedBinaryTree,
} | string | null;