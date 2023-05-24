import fs from "fs";

export const getFolders = (entry: string) => {
	const dirs = fs.readdirSync(entry);
	const dirsWithoutIndex = dirs.filter(
		(name) => name !== "index.ts" && name !== "utils"
	);
	return dirsWithoutIndex;
};
