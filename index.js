'use strict';
import { session } from 'electron';
import path from 'path';

async function install() {
  const extensionName = 'devtron';
  const extensions = session.defaultSession.getAllExtensions();
  const isInstalled = Object.values(extensions).some(
    (ext) => ext.name === extensionName,
  );

  if (isInstalled) {
    return;
  }

  const devtronPath = path.resolve('node_modules', 'devtron');
  const distPath = path.join(devtronPath, 'dist');
  try {
    const ext = await session.defaultSession.loadExtension(distPath, {
      allowFileAccess: true,
    });
    console.log(`Installed extension: ${ext.name}`);
  } catch (e) {
    console.error('Failed to load devtron: ', e);
  }
}

export const devtron = {
  install,
};
