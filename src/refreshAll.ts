#!/usr/bin/env node

import * as path from "path";
import * as fs from "fs";
import {checkOutSwaggerRepo, commit, generateCodes} from "./utils";

const shell = require('shelljs');
const commandLineArgs = require('command-line-args');


async function main(options: any) {
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
                    checkOutSwaggerRepo(options['swagger-repo'], commitId);
                    generateCodes(options, readme);
                    commit(options['swagger-repo'], (JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')))['name']);
                }
            }
        }
    }
}

const optionDefinitions = [
    {name: 'swagger-repo', type: String},
    { name: 'use',  type: String },
    { name: 'tag', type: String },
    { name: 'additional-args', type: String },
];
const options = commandLineArgs(optionDefinitions);

main(options).catch(e => {
    console.log(e);
});