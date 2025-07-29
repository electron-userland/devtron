// const path = require('node:path');
// const Mocha = require('mocha');
// const { ipcRenderer } = require('electron');

const { ipcRenderer } = require('electron');

// require('ts-node').register({
//   compilerOptions: {
//     module: 'commonjs',
//   },
// });

// console.log('Inside spec/preload.js');

// globalThis.mochaErrors = [];

// const mocha = new Mocha({
//   timeout: 10000,
// });

// console.log(__dirname);

// window.addEventListener('message', (event) => {
//   console.log('[PRELOAD] Received message from Devtron Panel:', event.data);

//   if (event.data?.source === 'devtron-tester') {
//     console.log('[PRELOAD] Got message from Devtron Panel:', event.data.message);
//   }
// });

// const sendTestResult = (type, payload) => {
//   ipcRenderer.send('test-result', { type, payload });
// };

// async function runTests() {
//   const testFiles = [path.join(__dirname, '..', 'renderer-tracker-spec.ts')];

//   if (testFiles.length === 0) {
//     console.error('No test files found.');
//     return;
//   }

//   testFiles.sort().forEach((file) => {
//     mocha.addFile(file);
//   });

//   const runner = mocha.run((failures) => {
//     if (failures > 0) {
//       console.error(`${failures} test(s) failed.`);
//       sendTestResult('done', { failures });
//       process.exitCode = 1;
//     } else {
//       console.log('All tests passed.');
//       sendTestResult('done', { failures: 0 });
//     }
//   });

//   // Hook into runner events
//   runner.on('pass', (test) => {
//     sendTestResult('pass', {
//       title: test.fullTitle(),
//       duration: test.duration,
//     });
//   });

//   runner.on('fail', (test, err) => {
//     sendTestResult('fail', {
//       title: test.fullTitle(),
//       error: {
//         message: err.message,
//         stack: err.stack,
//       },
//     });
//   });

//   //   runner.on('test', (test) => {
//   //     sendTestResult('test-start', { title: test.fullTitle() });
//   //   });

//   console.log(`Found ${testFiles.length} test files.`);
//   console.log(testFiles);
// }

// runTests().catch((err) => {
//   console.error('Error running tests:', err);
//   sendTestResult('error', {
//     message: err.message,
//     stack: err.stack,
//   });
// });

/* ------------------------------------------------------ */
/* ------------------------------------------------------ */
/* ------------------------------------------------------ */

ipcRenderer.on('test-renderer-on', () => {
  ipcRenderer.send('test-main-on', 'arg1', 'arg2');
});
