export type Menu = {
	name: string,
	children: (Menu|MenuItem)[],
}

export type MenuItem = {
	name: string,
	command: string,
};