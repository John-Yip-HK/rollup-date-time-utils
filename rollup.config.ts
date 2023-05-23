import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript, {
	type RollupTypescriptOptions,
} from "@rollup/plugin-typescript";
// import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";

import type { RollupOptions } from "rollup";

import packageJson from "./package.json" assert { type: "json" };

const commonBundleConfigs = {
	input: ["src/index.ts", "src/libs/index.ts"],
	plugins: [
		resolve(),
		commonjs(),
		// terser()
	],
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
			dir: packageJson.main.split("/").slice(0, -1).join("/"),
			format: "cjs",
			sourcemap: true,
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
			dir: packageJson.module.split("/").slice(0, -1).join("/"),
			format: "esm",
			sourcemap: true,
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
