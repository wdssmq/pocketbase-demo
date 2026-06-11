// import pkg from "./package.json" assert {type: 'json'};
import { readFileSync } from 'node:fs';

import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import dotenv from 'dotenv';
import livereload from 'rollup-plugin-livereload';
import mv from 'rollup-plugin-mv';

// import copy from "rollup-plugin-copy";
// import html from "rollup-plugin-html-string";
// import md from "rollup-plugin-md";

import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';

const pkg = JSON.parse(readFileSync('./package.json'));

// 加载 .env.dev（如果存在），并将其合并到 process.env
const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev';
dotenv.config({ path: envFile });

const defConfig = {
    input: `src/test.ts`,
    output: {
        file: `dist-test/test.js`,
        format: 'umd',
        banner: '/* eslint-disable */\n',
        sourcemap: true,
    },
    external: ['pocketbase'],
    plugins: [
        // 先用 typescript 插件把 TS 转为 JS
        typescript({ tsconfig: './tsconfig.json' }),
        postcss({
            extract: 'test.css',
        }),
        replace({
            'preventAssignment': true,
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.DEMO_VAR': JSON.stringify(process.env.DEMO_VAR),
            'process.env.PB_URL': JSON.stringify(process.env.PB_URL),
            'process.env.PB_EMAIL': JSON.stringify(process.env.PB_EMAIL),
            'process.env.PB_PASSWORD': JSON.stringify(process.env.PB_PASSWORD),
        }),
        resolve(),
        // md(),
        // html({
        //     include: "src/**/*.html",
        // }),
    ],
};

// 单独为 lib-core/core.ts 创建一个独立的构建配置
const coreConfig = {
    input: 'src/lib-core/core.ts',
    output: {
        file: pkg.main,
        // format: 'umd',
        name: 'libPocketBase',
        banner: '/* eslint-disable */\n',
        sourcemap: true,
    },
    external: ['pocketbase'],
    plugins: [
        typescript({ tsconfig: './tsconfig.core.json' }),
        mv({
            src: 'dist/core.d.ts',
            dest: pkg.types,
            overwrite: true,
        }),
    ],
};

if (process.env.NODE_ENV !== 'prod') {
    defConfig.plugins.push(
        serve(),
        livereload({
            watch: ['src'],
        }),
    );
}

export default [defConfig, coreConfig];
