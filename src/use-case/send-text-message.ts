import { env } from '@/env.js';
import { writeFile } from '@/util/write-file.js';
import { GoogleGenAI } from '@google/genai';

const {
  GOOGLE_CLOUD_PROJECT,
  GOOGLE_CLOUD_LOCATION,
  GOOGLE_GENAI_USE_VERTEXAI,
} = env;

const OUTPUT_FILE_PATH = '/assets/send-text-message-output.md';

export async function sendTextMessage() {
  const client = new GoogleGenAI({
    vertexai: GOOGLE_GENAI_USE_VERTEXAI,
    project: GOOGLE_CLOUD_PROJECT,
    location: GOOGLE_CLOUD_LOCATION,
  });

  const model = 'gemini-3-flash-preview';
  const contents = 'What is Platform Engineering?';

  const response = await client.models.generateContent({
    model,
    contents,
  });

  if (response.text) {
    await writeFile(OUTPUT_FILE_PATH, response.text);
  }

  return response.text;
}
