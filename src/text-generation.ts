import { GoogleGenAI } from '@google/genai';
import { env } from './env.js';

const {
  GOOGLE_CLOUD_PROJECT,
  GOOGLE_CLOUD_LOCATION,
  GOOGLE_GENAI_USE_VERTEXAI,
} = env;

async function generateText(
  projectId = GOOGLE_CLOUD_PROJECT,
  location = GOOGLE_CLOUD_LOCATION
) {
  const client = new GoogleGenAI({
    vertexai: GOOGLE_GENAI_USE_VERTEXAI,
    project: projectId,
    location: location,
  });

  const response = await client.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'How does AI work?',
  });

  console.log(response.text);

  return response.text;
}

async function run() {
  await generateText();
}

run();
