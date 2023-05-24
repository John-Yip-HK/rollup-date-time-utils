import fs from "fs";

export const getFolders = (entry) => {
	const dirs = fs.readdirSync(entry);
	const dirsWithoutIndex = dirs.filter((name) => name !== "index.ts");
	return dirsWithoutIndex;
};
