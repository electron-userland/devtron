const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const Mocha = require('mocha');
require('colors');
const fs = require('node:fs/promises');
// app.commandLine.appendSwitch('enable-logging');

const pass = '[PASS]'.green;
const fail = '[FAIL]'.red;

let rendererTestDone = true; // should be false if running tests inside renderer
let mainTestDone = false;
let mainFailures = 0;
let rendererFailures = 0;
const cleanupTestSessions = async () => {
  const sessionsPath = path.join(app.getPath('userData'), 'Partitions');

  let sessions;

  try {
    sessions = await fs.readdir(sessionsPath);
  } catch (err) {
    console.error(`Error reading sessions directory: ${err.message}`);
    return;
  }

  sessions = sessions.filter((session) => session.startsWith('devtron-test-'));
  if (sessions.length === 0) return;

  for (const session of sessions) {
    const sessionPath = path.join(sessionsPath, session);
    console.log(`Deleting session: ${sessionPath}`.cyan);
    await fs.rm(sessionPath, { recursive: true, force: true });
  }
};
/* Exit the app after both test suites complete */
function maybeExit() {
  if (mainTestDone && rendererTestDone) {
    const totalFailures = mainFailures + rendererFailures;

    console.log('\n/* ==================== TEST SUMMARY ==================== */'.cyan);
    if (mainFailures || rendererFailures) {
      console.log(`Main process failures: ${mainFailures}`);
      console.log(`Renderer process failures: ${rendererFailures}`);
      console.log(`${fail} Test suite finished with ${totalFailures} failure(s).`);
    } else {
      console.log(`${pass} All tests passed.`);
    }
    app.exit(totalFailures > 0 ? 1 : 0);
  }
}

/* Create test browser window */
let mainWindow;
function createTestWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
    },
  });

  // mainWindow.webContents.openDevTools();
  mainWindow.loadURL(pathToFileURL(path.join(__dirname, 'index.html')).toString());
}

/* Setup IPC listener for renderer test results */
function setupIPCHandlers() {
  ipcMain.on('test-result', (event, { type, payload }) => {
    if (type === 'fail') {
      console.error(`${fail} ${payload.title}`);
      console.error(payload.error);
    } else if (type === 'pass') {
      // console.log(`${pass} ${payload.title} (${payload.duration}ms)`);
    } else if (type === 'done') {
      rendererFailures = payload.failures;
      rendererTestDone = true;
      if (payload.failures > 0) {
        console.log(`${fail} Renderer tests failed. Failures: ${payload.failures}`);
      } else {
        console.log(`${pass} All renderer tests passed.`);
      }
      maybeExit();
    } else if (type === 'error') {
      console.error('Fatal test error in renderer:', payload);
      rendererFailures = 1;
      rendererTestDone = true;
      maybeExit();
    }
  });
}

/* Run Mocha tests in the main process */
async function runMainProcessTests() {
  require('ts-node').register({
    compilerOptions: {
      module: 'commonjs',
    },
  });

  const mocha = new Mocha({
    timeout: 10000,
    ui: 'bdd',
    color: true,
  });

  const testFiles = [path.join(__dirname, '..', 'devtron-install-spec.ts')];

  if (testFiles.length === 0) {
    console.error('No test files found.');
    mainTestDone = true;
    maybeExit();
    return;
  }

  testFiles.sort().forEach((file) => {
    mocha.addFile(file);
  });

  mocha.run((failures) => {
    mainFailures = failures;
    if (failures > 0) {
      console.error(`${fail} ${failures} main process test(s) failed.`);
    } else {
      console.log(`${pass} All main process tests passed.`);
    }

    mainTestDone = true;
    maybeExit();
  });
}

/* Start the Electron app */
app.whenReady().then(async () => {
  await cleanupTestSessions();
  setupIPCHandlers();
  createTestWindow();
  await runMainProcessTests();
});
