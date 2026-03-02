import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Writes content to a file at the given destination path.
 * If the directory doesn't exist, it will be created.
 *
 * @param destination The file path where the content will be written.
 * @param content The content to write (text or binary data).
 */
export async function writeFile(
  destination: string,
  content: string | Buffer | Uint8Array
): Promise<void> {
  const absoluteDestination = path.join(process.cwd(), destination);
  const dir = path.dirname(absoluteDestination);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(absoluteDestination, content);
}
