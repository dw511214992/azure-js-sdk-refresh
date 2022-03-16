#!/usr/bin/env node

import * as path from "path";
import * as fs from "fs";
import {checkOutSwaggerRepo, generateCodes} from "./utils";

const commandLineArgs = require('command-line-args');

async function main(options: any) {
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
    checkOutSwaggerRepo(options['swagger-repo'], commitId);
    generateCodes(options, readme);

}

const optionDefinitions = [
    {name: 'swagger-repo', type: String},
    {name: 'use', type: String},
    {name: 'tag', type: String},
    {name: 'additional-args', type: String},
    {name: 'package-path', type: String},
];
const options = commandLineArgs(optionDefinitions);

main(options).catch(e => {
    console.log(e);
});