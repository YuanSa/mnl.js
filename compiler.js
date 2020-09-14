/*
// MNL.js v0.1.0
//
// by 杨子涵 <yang.zihan@columbia.edu>
// the 1th version updated at 2020/09/14
*/

const fs = require("fs");

// Run the following cmds for demo
//     node compiler.js sample/source.mnl sample/target.js
//     node sample/target.js
nml2js();

function nml2js() {
    let [sourceCodesPath, targetCodesPath] = getFilesDirectories();
    const sourceCodes = readSourceCodesFrom(sourceCodesPath);
    const compiledCodes = compile(sourceCodes);
    writeCompiledCodesInto(targetCodesPath, compiledCodes);
}

function getFilesDirectories() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        throw new Error("需要有两个参数：原MNL文件路径，输出JS文件路径");
    }
    return args;
}

function readSourceCodesFrom(directory) {
    return fs.readFileSync(directory).toString();
}

function compile(sourceCode) {
    // TODO: 考虑derefrence的影响 myHeart.join(', ') - 杨子涵 <yang.zihan@columbia.edu>
    // TODO: 考虑字符串的影响 - 杨子涵 <yang.zihan@columbia.edu>
    const nameInSourceCodes = /(\w*\([\w\,\s'"`\(\)\.]*?\)\w*)+/gm;
    let ans = sourceCode.replace(nameInSourceCodes, nameAfterCompiling);
    return ans;
}

function nameAfterCompiling(match) {
    match = match.trim();
    match.search(/\([\w\,\s'"`\(\)]*?\)/g);
    const solidPart = match.replace(/\([\w\,\s'"`\(\)]*?\)/g, "__x__").replace(/__x__$/g, "");
    let paraList = [];
    let start = 0;
    while (start < match.length) {
        let fromIndex = match.indexOf("(", start) + 1;
        if (fromIndex === 0) {
            break;
        }
        let toIndex = match.indexOf(")", start);
        paraList = paraList.concat(match.substring(fromIndex, toIndex).split(","));
        start = toIndex + 1;
    }
    const flexPart = "(" + paraList.join(",") + ")";
    return solidPart + flexPart;
}

function writeCompiledCodesInto(directory, compiledCodes) {
    return fs.writeFileSync(directory, compiledCodes);
}
