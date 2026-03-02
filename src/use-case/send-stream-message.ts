import { env } from '@/env.js';
import { writeFile } from '@/util/write-file.js';
import { GoogleGenAI, type HttpOptions } from '@google/genai';

const {
  GOOGLE_CLOUD_PROJECT,
  GOOGLE_CLOUD_LOCATION,
  GOOGLE_GENAI_USE_VERTEXAI,
} = env;

const OUTPUT_FILE_PATH = '/assets/send-stream-message-output.md';

export async function sendStreamMessage() {
  const httpOptions: HttpOptions = {
    apiVersion: 'v1',
  };

  const client = new GoogleGenAI({
    vertexai: GOOGLE_GENAI_USE_VERTEXAI,
    project: GOOGLE_CLOUD_PROJECT,
    location: GOOGLE_CLOUD_LOCATION,
    httpOptions,
  });

  const model = 'gemini-3-flash-preview';

  const contentMessage = 'What is WebAssembly?';

  const contentResponse = await client.models.generateContentStream({
    model,
    contents: contentMessage,
  });

  for await (const chunk of contentResponse) {
    await writeFile(OUTPUT_FILE_PATH, chunk.text ?? '', { append: true });
  }

  const chatMessage = 'Which is the role of WebAssembly in the cloud?';

  const chat = client.chats.create({
    model,
  });

  const chatResponse = await chat.sendMessageStream({
    message: chatMessage,
  });

  for await (const chunk of chatResponse) {
    await writeFile(OUTPUT_FILE_PATH, chunk.text ?? '', { append: true });
  }
}
