// import pkg from "./package.json" assert {type: 'json'};
import { readFileSync } from "fs";
const pkg = JSON.parse(readFileSync("./package.json"));

import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";
import serve from "rollup-plugin-serve";

// import copy from "rollup-plugin-copy";
// import html from "rollup-plugin-html-string";
// import md from "rollup-plugin-md";
import resolve from "@rollup/plugin-node-resolve";

import replace from "@rollup/plugin-replace";
import dotenv from "dotenv";

// 是否将 CSS 提取到单独文件
const extractCSS = pkg.extractCSS ? `${pkg.name}.css` : false;

// 加载 .env.dev（如果存在），并将其合并到 process.env
const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev';
dotenv.config({ path: envFile });

const defConfig = {
    input: `src/${pkg.name}.js`,
    output: {
        file: pkg.main,
        format: "umd",
        name: pkg.moduleName,
        banner: "/* eslint-disable */\n",
        // sourcemap: true,
    },
    plugins: [
        postcss({
            extract: extractCSS,
        }),
        replace({
            preventAssignment: true,
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            "process.env.DEMO_VAR": JSON.stringify(process.env.DEMO_VAR),
        }),
        resolve(),
        // md(),
        // html({
        //     include: "src/**/*.html",
        // }),
    ],
};

if (process.env.NODE_ENV !== "prod") {
    defConfig.plugins.push(
        serve(),
        livereload(),
    );
}

export default defConfig;
