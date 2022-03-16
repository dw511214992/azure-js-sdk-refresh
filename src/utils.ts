import {execSync} from "child_process";
import * as path from "path";

export function checkOutSwaggerRepo(swaggerRepo: string, commitId: any) {
    execSync(`git checkout ${commitId}`, {cwd: swaggerRepo, stdio: 'inherit'});
}

export function commit(swaggerRepo: string, packageName: string) {
    execSync(`git add .`, {stdio: 'inherit'});
    execSync(`git commit -m "refresh ${packageName}"`, {stdio: 'inherit'});
}

export function generateCodes(options: any, readme: string) {
    let command = `hlc-code-gen --readme=${path.join(options['swagger-repo'], readme)}`;
    if (options.use) {
        command += ` --use=${options.use}`;
    }
    if (options['additional-args']) {
        command += ` --additional-args=${options['additional-args']}`;
    }
    if (options['tag']) {
        command += ` --tag=${options['tag']}`;
    }

    execSync(command, {stdio: 'inherit'})
}