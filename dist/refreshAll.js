#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const fs = tslib_1.__importStar(require("fs"));
const utils_1 = require("./utils");
const shell = require('shelljs');
const commandLineArgs = require('command-line-args');
async function main(options) {
    if (!options['swagger-repo'] || !fs.existsSync(options['swagger-repo'])) {
        throw new Error(`please input valid swagger-repo`);
    }
    const sdkRepo = String(shell.pwd());
    for (const rp of fs.readdirSync(path.join(sdkRepo, 'sdk'))) {
        if (fs.lstatSync(path.join(sdkRepo, 'sdk', rp)).isDirectory()) {
            for (const p of fs.readdirSync(path.join(sdkRepo, 'sdk', rp))) {
                if (fs.lstatSync(path.join(sdkRepo, 'sdk', rp, p)).isDirectory() && p.startsWith('arm-')) {
                    const metaFilePath = path.join(sdkRepo, 'sdk', rp, p, '_meta.json');
                    const packageJsonPath = path.join(sdkRepo, 'sdk', rp, p, 'package.json');
                    if (!fs.existsSync(metaFilePath)) {
                        throw new Error(`Cannot find _meta.json in ${metaFilePath}`);
                    }
                    if (!fs.existsSync(packageJsonPath)) {
                        throw new Error(`Cannot find _meta.json in ${packageJsonPath}`);
                    }
                    const meta = JSON.parse(fs.readFileSync(metaFilePath, 'utf-8'));
                    const readme = meta['readme'];
                    if (!readme) {
                        throw new Error(`cannot find readme in ${path.join(sdkRepo, 'sdk', rp, p, '_meta.json')}`);
                    }
                    const commitId = meta['commit'];
                    if (!commitId) {
                        throw new Error(`cannot find commit in ${path.join(sdkRepo, 'sdk', rp, p, '_meta.json')}`);
                    }
                    utils_1.checkOutSwaggerRepo(options['swagger-repo'], commitId);
                    utils_1.generateCodes(options, readme);
                    utils_1.commit(options['swagger-repo'], (JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')))['name']);
                }
            }
        }
    }
}
const optionDefinitions = [
    { name: 'swagger-repo', type: String },
    { name: 'use', type: String },
    { name: 'tag', type: String },
    { name: 'additional-args', type: String },
];
const options = commandLineArgs(optionDefinitions);
main(options).catch(e => {
    console.log(e);
});
//# sourceMappingURL=refreshAll.js.map