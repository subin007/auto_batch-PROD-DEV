const express = require('express');
const router = express.Router();
const inputspath = '../../../inputs'
const path = require("path");
const inputsFolder = path.join(__dirname, inputspath);
const cmd = require('node-cmd');
var fs = require('fs');

router.get("/create/seqexecfile", (req, res, next) => {
    cmd.get(
        `call listcreator.bat`,
        (err, data, stderr) => {
            if (data) {
                res.json({msg : 'Checked inside'});
            }
        }
    );
});

router.get("/inputlist", (req, res, next) => {
    var exec_info = JSON.parse(fs.readFileSync("./datastore/execution_info.json"));
    res.json({ inputFiles: exec_info.inputFiles});
});

router.get("/start/execution",(req, res, next)=>{
    cmd.get(
        `call start_start_seq_execution_v2.bat`,
        (err, data, stderr) => {
            if (data) {
                res.json({ msg: 'Hopefully started sequential_execution.bat'});
            }
        }
    )
});
module.exports = router;