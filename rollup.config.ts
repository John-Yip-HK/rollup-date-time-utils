import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import generatePackageJson from "rollup-plugin-generate-package-json";
import { type InputPluginOption, type RollupOptions } from "rollup";

import packageJson from "./package.json" assert { type: "json" };
import { getFolders } from "./scripts/buildUtils";

const plugins = [
	resolve(),
	commonjs(),
	typescript({
		rootDir: "src",
		tsconfig: "./tsconfig.json",
	}),
	terser(),
] satisfies InputPluginOption;

const subfolderPlugins = (folderName: string) => [
	...plugins,
	generatePackageJson({
		baseContents: {
			name: `${packageJson.name}/${folderName}`,
			private: true,
			main: "../cjs/index.js", // --> points to cjs format entry point of whole library
			module: "./index.js", // --> points to esm format entry point of individual component
			types: "./index.d.ts", // --> points to types definition file of individual component
		},
	}),
];

const folderBuilds = getFolders("./src").map((folder) => {
	return {
		input: `src/${folder}/index.ts`,
		output: {
			file: `dist/${folder}/index.js`,
			sourcemap: true,
			exports: "named",
			format: "esm",
		},
		plugins: subfolderPlugins(folder),
	} satisfies RollupOptions;
});

export default [
	{
		input: ["src/index.ts"],
		output: [
			{
				file: packageJson.module,
				format: "esm",
				sourcemap: true,
				exports: "named",
			},
			{
				file: packageJson.main,
				format: "cjs",
				sourcemap: true,
				exports: "named",
			},
		],
		plugins,
	},
	...folderBuilds,
] satisfies RollupOptions[];
