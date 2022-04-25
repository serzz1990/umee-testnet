const { exec } = require("child_process");
import { promisify } from "util";
const sleep = promisify(setTimeout);

console.log('Job:all started');

(async function JobTransfer () {
  runJob('npm run job:transfer');
  await sleep(3*60*60*1000); //3h
  JobTransfer();
})();

(async function JobSupply () {
  runJob('npm run job:supply');
  await sleep(1*60*60*1000); //1h
  JobSupply();
})();

(async function JobBorrow () {
  runJob('npm run job:borrow');
  await sleep(1*60*60*1000); //1h
  JobBorrow();
})();

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
