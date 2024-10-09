/*
 * Copyright (c) 2024 by frostime. All Rights Reserved.
 * @Author       : frostime
 * @Date         : 2024-10-09 21:09:16
 * @FilePath     : /rollup.config.js
 * @LastEditTime : 2024-10-09 21:09:23
 * @Description  : 
 */
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs'
        },
        {
            file: 'dist/index.esm.js',
            format: 'es'
        }
    ],
    external: ['solid-js'],
    plugins: [
        resolve(),
        typescript()
    ]
};