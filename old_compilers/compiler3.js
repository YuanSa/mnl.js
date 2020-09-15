/*
// MNL.js v0.3.0 (Not finished)
//
// by 杨子涵 <yang.zihan@columbia.edu>
//
// bugs: 1. 不能分辨字符串和函数名
*/

const fs = require("fs");
const { start } = require("repl");
const MNL_PATTERN = /(\([\w\,\s'"`\(\)\.]*?\)\w+)+(\([\w\,\s'"`\(\)\.]*?\))?/gm;
const STOP_WORDS = ["'", '"', "`"];
const STOP_WORDS_SET = new Set(["'", '"', "`"]);

// Run the following cmds for demo
//     node compiler3.js sample/source.mnl sample/target.js
//     node sample/target.js
mnl2js();

function mnl2js() {
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
    function mnlToJs(mnl) {
        let name = [];
        let record = false;
        let paras = [];
        let paraBuffer = [];
        let count = 0;
        let stopWord = -1;
        for (let i = 0; i < mnl.length; i++) {
            if (stopWord === -1) {
                if (mnl[i] === "(") {
                    if (count === 0) {
                        name.push("__x__");
                    }
                    record = true;
                    count++;
                } else if (mnl[i] === ")") {
                    count--;
                    if (count === 0) {
                        record = false;
                        paras.push(paraBuffer.join(""));
                        paraBuffer = [];
                    }
                }
                stopWord = STOP_WORDS.indexOf(mnl[i]);
            } else {
                if (mnl[i] === STOP_WORDS[stopWord]) {
                    stopWord = -1;
                }
            }
            if (record) {
                if (!(mnl[i] === "(" && count === 1)) {
                    paraBuffer.push(mnl[i]);
                }
            } else {
                if (!(mnl[i] === ")" && count === 0)) {
                    name.push(mnl[i]);
                }
            }
        }
        let functionNameAfterCompiled = (
            name
                .join("")
                .trim()
                .replace(/__x__$/, "") +
            "(" +
            paras.join(",") +
            ")"
        ).replace(/__x__$/, "");
        return functionNameAfterCompiled;
    }
    return sourceCode.replace(MNL_PATTERN, mnlToJs);
}

function writeCompiledCodesInto(directory, compiledCodes) {
    return fs.writeFileSync(directory, compiledCodes);
}
