import { env } from '@/env.js';
import { writeFile } from '@/util/write-file.js';
import { GoogleGenAI } from '@google/genai';

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

  const model = 'gemini-2.5-flash';

  const prompt = `
  Question #00: What is an Internal Developer Platform (IDP)?
  Question #01: What are the main benefits of using it?
  Question #02: Which features do you consider essential for an IDP?
  `;

  const systemInstruction = [
    'You are a Staff Platform Engineer at Google.',
    'Your mission is to answer questions about the Internal Developer Platform (IDP) topic.',
    'Answer the questions in a clear, concise, and easy-to-understand manner.',
  ];

  const response = await client.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
    },
  });

  if (response.text) {
    await writeFile(OUTPUT_FILE_PATH, response.text);
  }

  return response.text;
}
