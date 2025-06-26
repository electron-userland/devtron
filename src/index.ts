import type { Extension } from 'electron';
import { session } from 'electron';
import path from 'node:path';

async function install(): Promise<void> {
  const extensionName = 'devtron';
  const extensions = session.defaultSession.extensions.getAllExtensions();
  const isInstalled = extensions.some((ext: Extension) => ext.name === extensionName);

  if (isInstalled) {
    return;
  }

  try {
    const devtronPath = path.resolve('node_modules', '@electron', 'devtron');
    const distPath = path.join(devtronPath, 'dist', 'extension');
    const ext = await session.defaultSession.extensions.loadExtension(distPath, {
      allowFileAccess: true,
    });
    console.log(`Successfully Installed extension: ${ext.name}`);
  } catch (e) {
    console.error('Failed to load devtron: ', e);
    if (e instanceof Error) {
      throw new Error(`Failed to load devtron extension: ${e.message}`);
    } else {
      throw new Error('Failed to load devtron extension: Unknown error');
    }
  }
}

export const devtron = {
  install,
};
