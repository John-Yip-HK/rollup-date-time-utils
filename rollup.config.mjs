import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

import packageJson from "./package.json" assert { type: "json" };

export default [
  {
    input: "src/index.ts",
    output: {
      file: packageJson.main,
      format: "esm",
      sourcemap: true
    },
    plugins: [
      resolve(),
      typescript({ tsconfig: "./tsconfig.json" })
    ]
  }
]