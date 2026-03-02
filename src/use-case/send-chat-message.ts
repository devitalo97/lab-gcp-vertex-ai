import { env } from '@/env.js';
import { writeFile } from '@/util/write-file.js';
import { GoogleGenAI, type HttpOptions } from '@google/genai';

const {
  GOOGLE_CLOUD_PROJECT,
  GOOGLE_CLOUD_LOCATION,
  GOOGLE_GENAI_USE_VERTEXAI,
} = env;

const OUTPUT_FILE_PATH = '/assets/send-chat-message-output.md';

export async function sendChatMessage() {
  const httpOptions: HttpOptions = {
    apiVersion: 'v1',
  };

  const client = new GoogleGenAI({
    vertexai: GOOGLE_GENAI_USE_VERTEXAI,
    project: GOOGLE_CLOUD_PROJECT,
    location: GOOGLE_CLOUD_LOCATION,
    httpOptions,
  });

  const model = 'gemini-2.5-flash';

  const firstMessage = 'What is Platform Engineering?';

  const chat = client.chats.create({
    model,
  });

  const firstResponse = await chat.sendMessage({
    message: firstMessage,
  });

  if (firstResponse.text) {
    await writeFile(OUTPUT_FILE_PATH, firstResponse.text);
  }

  const secondMessage =
    'What is the difference between Platform Engineering and DevOps?';

  const secondResponse = await chat.sendMessage({
    message: secondMessage,
  });

  if (secondResponse.text) {
    await writeFile(OUTPUT_FILE_PATH, '\n\n---\n\n' + secondResponse.text, {
      append: true,
    });
  }
}
