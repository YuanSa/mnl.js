/*
// MNL.js v0.2.0 (deprecated)
//
// by 杨子涵 <yang.zihan@columbia.edu>
*/

const fs = require("fs");
const { start } = require("repl");
const MNL_PATTERN = /(\([\w\,\s'"`\(\)\.]*?\)\w+)+(\([\w\,\s'"`\(\)\.]*?\))?/gm;
const STOP_WORDS = ["'", '"', "`"];
const STOP_WORDS_SET = new Set(["'", '"', "`"]);

// Run the following cmds for demo
//     node compiler2.js sample/source.mnl sample/target.js
//     node sample/target.js
mnl2js();

function mnl2js() {
    let [sourceCodesPath, targetCodesPath] = getFilesDirectories();
    const sourceCodes = readSourceCodesFrom(sourceCodesPath);
    [codeSegments, needToBeCompiled] = filterCodeSegments(sourceCodes);
    const compiledCodes = compile(codeSegments, needToBeCompiled);
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

function filterCodeSegments(sourceCodes) {
    let codeSegments = [];
    let needToBeCompiled = [];
    let startIndex = 0,
        stopIndex = 0;
    let splitFrom = 0;
    while (true) {
        // startIndex = sourceCodes.search(/[^\\]['"`]/, startIndex);
        splitFrom = startIndex;
        startIndex = indexOfNextStopWord(sourceCodes, startIndex, STOP_WORDS_SET);
        codeSegments.push(sourceCodes.slice(splitFrom, startIndex));
        needToBeCompiled.push(true);
        if (startIndex === -1) {
            break;
        } else {
            let stopWord = sourceCodes[startIndex];
            let searchStopIndexFrom = startIndex + 1;
            while (true) {
                stopIndex = sourceCodes.indexOf(stopWord, searchStopIndexFrom);
                if (stopIndex > 0 && sourceCodes[stopIndex - 1] === "\\") {
                    if ((stopIndex > 1 && sourceCodes[stopIndex - 2] !== "\\") || stopWord <= 1)
                        searchStopIndexFrom = stopIndex + 1;
                } else {
                    break;
                }
            }
            codeSegments.push(sourceCodes.slice(startIndex, stopIndex + 1));
            needToBeCompiled.push(false);
            startIndex = stopIndex + 1;
        }
    }
    return [codeSegments, needToBeCompiled];
}

function indexOfNextStopWord(string, startFrom, targetSet) {
    for (let i = startFrom; i < string.length; i++) {
        if (targetSet.has(string[i])) {
            if (i > 0 && string[i - 1] === "\\") {
                if (i > 1 && string[i - 2] === "\\") {
                    return i;
                }
            } else {
                return i;
            }
        }
    }
    return -1;
}

function compile(sourceCodes, needToBeCompiled) {
    let compiledCodesBuffer = [];
    for (let i = 0; i < sourceCodes.length; i++) {
        if (needToBeCompiled[i]) {
            compiledCodesBuffer.push(compileOnce(sourceCodes[i]));
        } else {
            compiledCodesBuffer.push(sourceCodes[i]);
        }
    }
    return compiledCodesBuffer.join("");
}

function compileOnce(sourceCode) {
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
