import { env } from '@/env.js';
import { writeFile } from '@/util/write-file.js';
import {
  GoogleGenAI,
  type ContentListUnion,
  type FileData,
  type PartUnion,
} from '@google/genai';

const {
  GOOGLE_CLOUD_PROJECT,
  GOOGLE_CLOUD_LOCATION,
  GOOGLE_GENAI_USE_VERTEXAI,
} = env;

const OUTPUT_FILE_PATH = '/assets/send-system-instruction-message-output.md';

export async function sendSystemInstructionMessage() {
  const client = new GoogleGenAI({
    vertexai: GOOGLE_GENAI_USE_VERTEXAI,
    project: GOOGLE_CLOUD_PROJECT,
    location: GOOGLE_CLOUD_LOCATION,
  });

  const model = 'gemini-3-flash-preview';

  const prompt = `
  User input: I like bagels.
  Answer:
  `;

  const systemInstruction = [
    'You are a language translator.',
    'Your mission is to translate text in English to French.',
  ];

  const contents = prompt;

  const response = await client.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction,
    },
  });

  if (response.text) {
    await writeFile(OUTPUT_FILE_PATH, response.text);
  }

  return response.text;
}
