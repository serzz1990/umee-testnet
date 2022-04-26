import {sendMessage} from "./telegram";

const { exec } = require("child_process");
import { promisify } from "util";
const sleep = promisify(setTimeout);

console.log('Job:all started');
sendMessage('Job:all started');

(async function JobTransfer (delay = 0) {
  await sleep(delay);
  runJob('npm run job:transfer');
  await sleep(3*60*60*1000); //3h
  JobTransfer();
})(0); // 0m

(async function JobSupply (delay = 0) {
  await sleep(delay);
  runJob('npm run job:supply');
  await sleep(30*60*1000); // 30m
  JobSupply();
})(15*60*1000); // 15m

(async function JobBorrow (delay = 0) {
  await sleep(delay);
  runJob('npm run job:borrow');
  await sleep(30*60*1000); // 30m
  JobBorrow();
})(30*60*1000); // 30m

(async function JobStat (delay = 0) {
  await sleep(delay);
  runJob('npm run job:stat');
  JobStat(delay);
})(6*60*60*1000); // 6h

function runJob (command) {
  console.log(command);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout ${command}: ${stdout}`);
  })
}
