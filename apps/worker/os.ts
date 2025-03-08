import { mkdir } from "fs/promises";

const BASE_WORKER_DIR = "/tmp/mobby-worker";

// Create directory instead of file
async function ensureDirectoryExists() {
  try {
    await mkdir(BASE_WORKER_DIR, { recursive: true });
    console.log(`Directory created: ${BASE_WORKER_DIR}`);
  } catch (error: any) {
    console.error(`Failed to create directory: ${error.message}`);
  }
}

ensureDirectoryExists();

export async function onFileUpdate(filepath: string, fileContent: string) {
  console.log(`writing file:${filepath}`);
  await Bun.write(`${BASE_WORKER_DIR}/${filepath}`, fileContent);
}

export async function onShellCommand(shellCommand: string) {
  const commands = shellCommand.split("&&");
  for (const command of commands) {
    console.log(`Running command: ${command.trim()}`);
    const result = Bun.spawnSync({
      cmd: command.trim().split(" "),
      cwd: BASE_WORKER_DIR,
    });
    console.log(result.stdout.toString());
    console.log(result.stderr.toString());
  }
}
