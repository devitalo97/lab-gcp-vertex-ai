import { env } from '@/env.js';
import { writeFile } from '@/util/write-file.js';
import { GoogleGenAI } from '@google/genai';

const {
  GOOGLE_CLOUD_PROJECT,
  GOOGLE_CLOUD_LOCATION,
  GOOGLE_GENAI_USE_VERTEXAI,
} = env;

const OUTPUT_FILE_PATH =
  '/assets/send-content-generation-parameters-message-output.md';

export async function sendContentGenerationParametersMessage() {
  const client = new GoogleGenAI({
    vertexai: GOOGLE_GENAI_USE_VERTEXAI,
    project: GOOGLE_CLOUD_PROJECT,
    location: GOOGLE_CLOUD_LOCATION,
  });

  const model = 'gemini-2.5-flash';

  const prompt = 'Why observability is important for an Platform Engineer?';

  const config = {
    temperature: 0,
    candidateCount: 1,
    responseMimeType: 'text/plain',
    topP: 0.95,
    topK: 20,
    seed: 5,
    maxOutputTokens: 500,
    stopSequences: ['STOP!'],
    presencePenalty: 0.0,
    frequencyPenalty: 0.0,
  };

  const response = await client.models.generateContent({
    model,
    contents: prompt,
    config,
  });

  if (response.text) {
    await writeFile(OUTPUT_FILE_PATH, response.text);
  }

  return response.text;
}
