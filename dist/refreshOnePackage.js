#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const fs = tslib_1.__importStar(require("fs"));
const utils_1 = require("./utils");
const commandLineArgs = require('command-line-args');
async function main(options) {
    if (!options['swagger-repo'] || !fs.existsSync(options['swagger-repo'])) {
        throw new Error(`please input valid swagger-repo`);
    }
    if (!options['package-path']) {
        throw new Error(`please input valid package-path`);
    }
    const metaFilePath = path.join(options['package-path'], '_meta.json');
    if (!fs.existsSync(metaFilePath)) {
        throw new Error(`Cannot find _meta.json in ${path.join(options['package-path'], '_meta.json')}`);
    }
    const meta = JSON.parse(fs.readFileSync(metaFilePath, 'utf-8'));
    const readme = meta['readme'];
    if (!readme) {
        throw new Error(`cannot find readme in ${path.join(options['package-path'], '_meta.json')}`);
    }
    const commitId = meta['commit'];
    if (!commitId) {
        throw new Error(`cannot find commit in ${path.join(options['package-path'], '_meta.json')}`);
    }
    utils_1.checkOutSwaggerRepo(options['swagger-repo'], commitId);
    utils_1.generateCodes(options, readme);
}
const optionDefinitions = [
    { name: 'swagger-repo', type: String },
    { name: 'use', type: String },
    { name: 'tag', type: String },
    { name: 'additional-args', type: String },
    { name: 'package-path', type: String },
];
const options = commandLineArgs(optionDefinitions);
main(options).catch(e => {
    console.log(e);
});
//# sourceMappingURL=refreshOnePackage.js.map