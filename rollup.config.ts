import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript, {
	type RollupTypescriptOptions,
} from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

import type { RollupOptions } from "rollup";

import packageJson from "./package.json" assert { type: "json" };

const commonBundleConfigs = {
	input: ["src/index.ts", "src/libs/index.ts"],
	output: {
		sourcemap: true,
		entryFileNames({ facadeModuleId }) {
			const splitModuleId = facadeModuleId?.split("\\") ?? [""];
			const idxOfSrcString = splitModuleId.indexOf("src");

			if (
				splitModuleId.length === 1 ||
				idxOfSrcString === -1 ||
				idxOfSrcString === splitModuleId.length - 2
			) {
				return "[name].js";
			}

			return `${splitModuleId
				.slice(idxOfSrcString + 1, splitModuleId.length - 1)
				.join("/")}/index.js`;
		},
	},
	plugins: [resolve(), commonjs()],
} satisfies RollupOptions;

const commonTsConfig = {
	tsconfig: "./tsconfig.json",
	exclude: ["rollup.config.ts"],
	rootDir: "src",
} satisfies RollupTypescriptOptions;

export default [
	{
		...commonBundleConfigs,
		output: {
			...commonBundleConfigs.output,
			dir: packageJson.main.split("/").slice(0, -1).join("/"),
			format: "cjs",
		},
		plugins: commonBundleConfigs.plugins.concat([
			typescript({
				...commonTsConfig,
				declarationDir: "dist/cjs/types/",
			}),
		]),
	},
	{
		...commonBundleConfigs,
		output: {
			...commonBundleConfigs.output,
			dir: packageJson.module.split("/").slice(0, -1).join("/"),
			format: "esm",
		},
		plugins: commonBundleConfigs.plugins.concat([
			typescript({
				...commonTsConfig,
				declarationDir: "dist/esm/types/",
			}),
		]),
	},
	{
		input: "dist/esm/types/index.d.ts",
		output: [{ file: "dist/index.d.ts", format: "es" }],
		plugins: [dts()],
	},
] satisfies RollupOptions[];
