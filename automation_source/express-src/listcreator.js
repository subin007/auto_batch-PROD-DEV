var fs = require("fs");
var path = require('path');
const Walker = require('walker');
const destination = path.join(__dirname, '../../inputs');
var fisrtLine = `set list=`;
var secondLine = `\n(for %%a in (%list%) do (`;
var thirdLine = `\nprotractor conf.js --params.filename=%%a`;
var fourthLine = `\n))`;
var executionObj = {
    inputFiles: []
};
const megaThrowObj = {
    metadata: {
        startedAt: null,
        finishedAt: null,
        running: false
    },
    initials: {
        loginOne: null,
        loginTwo: null,
        saidClaimed: null,
        deviceOnline: null
    },
    specSprint: []
}

//Below paths are tailored for public folder
// fs.readdir(path.join(__dirname,'../../inputs'),(err,files)=>{
//     files.forEach((file,i)=>{
//         if (file.includes('.json')){
//             let newVal = `"${file}" `;
//             let res = fisrtLine.concat(newVal);
//             fisrtLine = res;
//             executionObj.inputFiles.push(file);
//             fs.writeFileSync(`./public/assets/core/outputs/${file}`, JSON.stringify(megaThrowObj));
//         }
//     })
//         fs.writeFileSync("./public/assets/core/start_sequential_execution.bat", fisrtLine);
//         fs.appendFileSync("./public/assets/core/start_sequential_execution.bat",secondLine);
//         fs.appendFileSync("./public/assets/core/start_sequential_execution.bat", thirdLine);
//         fs.appendFileSync("./public/assets/core/start_sequential_execution.bat", fourthLine);
//         fs.writeFileSync("./datastore/execution_info.json",JSON.stringify(executionObj));
// });

//Below paths are tailored for angular folder
// fs.readdir(path.join(__dirname, '../../inputs'), (err, files) => {
//     files.forEach((file, i) => {
//         if (file.includes('.json')) {
//             let newVal = `"${file}" `;
//             let res = fisrtLine.concat(newVal);
//             fisrtLine = res;
//             executionObj.inputFiles.push(file);
//             fs.writeFileSync(`../angular-src/src/assets/core/outputs/${file}`, JSON.stringify(megaThrowObj));
//         }
//     })
//     fs.writeFileSync("../angular-src/src/assets/core/start_sequential_execution.bat", fisrtLine);
//     fs.appendFileSync("../angular-src/src/assets/core/start_sequential_execution.bat", secondLine);
//     fs.appendFileSync("../angular-src/src/assets/core/start_sequential_execution.bat", thirdLine);
//     fs.appendFileSync("../angular-src/src/assets/core/start_sequential_execution.bat", fourthLine);
//     fs.writeFileSync("./datastore/execution_info.json", JSON.stringify(executionObj));
// });

Walker(destination)
    .filterDir(function (dir, stat) {
        if (fs.lstatSync(dir).isDirectory() && /credential/.test(dir)) {
            console.warn(`Skipping ${dir} and children`)
            return false
        }
        return true
    })
    .on('entry', function (entry, stat) {
        // console.log('Got entry: ' + entry)
    })
    .on('dir', function (dir, stat) {
        console.log('Got directory: ' + path.relative(destination, dir))
    })
    .on('file', function (file, stat) {
        if (/\.json$/.test(path.basename(path.relative(destination, file)))) {
            let directoryFilePath = path.relative(destination, file);
            let directoryFilePathBasename = path.basename(path.relative(destination, file));

            let newVal = `"${directoryFilePath}" `;
            let res = fisrtLine.concat(newVal);
            fisrtLine = res;
            executionObj.inputFiles.push(directoryFilePathBasename);
            fs.writeFileSync(`../angular-src/src/assets/core/outputs/${directoryFilePathBasename}`, JSON.stringify(megaThrowObj));
        }
        console.log('Got file: ' + path.relative(destination, file) + 'and basename is ' + path.basename(path.relative(destination, file)))
    })
    .on('end', function () {
        console.log('All files traversed.')
        fs.writeFileSync("../angular-src/src/assets/core/start_sequential_execution.bat", fisrtLine);
        fs.appendFileSync("../angular-src/src/assets/core/start_sequential_execution.bat", secondLine);
        fs.appendFileSync("../angular-src/src/assets/core/start_sequential_execution.bat", thirdLine);
        fs.appendFileSync("../angular-src/src/assets/core/start_sequential_execution.bat", fourthLine);
        fs.writeFileSync("./datastore/execution_info.json", JSON.stringify(executionObj));
    })