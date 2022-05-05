import { sendMessage } from "./telegram";
import { promisify } from "util";
import { exec } from 'child_process';

const sleep = promisify(setTimeout);

sendMessage('💫 Script started');
runJob('npm run job:tgbot');

(async function JobsTransfers () {
  await runJob('npm run job:transfer');
  await runJob('npm run job:transfer:eth');

  const min = 6*60*60*1000; //6h
  const max = 7*60*60*1000; //7h
  await sleep(getRandomArbitrary(min, max));

  JobsTransfers();
})();

(async function JobsSupplyAndBorrow (delay = 0) {
  await sleep(delay);

  await runJob('npm run job:supply');
  await runJob('npm run job:supply:eth');
  await runJob('npm run job:borrow');
  await runJob('npm run job:borrow:eth');

  const min = 30*60*1000; // 30min
  const max = 50*60*1000; // 50min
  await sleep(getRandomArbitrary(min, max));

  JobsSupplyAndBorrow(0);
})(10*60*1000); // 10min

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function runJob (command) {
  console.log(command);
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      setTimeout(resolve, 0);
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
  })
}
