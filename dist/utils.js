"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCodes = exports.commit = exports.checkOutSwaggerRepo = void 0;
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const path = tslib_1.__importStar(require("path"));
function checkOutSwaggerRepo(swaggerRepo, commitId) {
    child_process_1.execSync(`git checkout ${commitId}`, { cwd: swaggerRepo, stdio: 'inherit' });
}
exports.checkOutSwaggerRepo = checkOutSwaggerRepo;
function commit(swaggerRepo, packageName) {
    child_process_1.execSync(`git add .`, { stdio: 'inherit' });
    child_process_1.execSync(`git commit -m "refresh ${packageName}"`, { stdio: 'inherit' });
}
exports.commit = commit;
function generateCodes(options, readme) {
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
    child_process_1.execSync(command, { stdio: 'inherit' });
}
exports.generateCodes = generateCodes;
//# sourceMappingURL=utils.js.map