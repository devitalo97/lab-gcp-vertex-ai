import { env } from '@/env.js';
import { writeFile } from '@/util/write-file.js';
import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai';

const {
  GOOGLE_CLOUD_PROJECT,
  GOOGLE_CLOUD_LOCATION,
  GOOGLE_GENAI_USE_VERTEXAI,
} = env;

const OUTPUT_FILE_PATH =
  '/assets/send-safety-and-content-filters-message-output.md';

export async function sendSafetyAndContentFiltersMessage() {
  const client = new GoogleGenAI({
    vertexai: GOOGLE_GENAI_USE_VERTEXAI,
    project: GOOGLE_CLOUD_PROJECT,
    location: GOOGLE_CLOUD_LOCATION,
  });

  const model = 'gemini-3-flash-preview';

  const systemInstruction = 'Be as mean as possible.';

  const prompt =
    'Write a list of 5 disrespectful things that I might say to the platform engineering team of my company.';

  const safetySettings = [
    {
      category: HarmCategory['HARM_CATEGORY_DANGEROUS_CONTENT'],
      threshold: HarmBlockThreshold['BLOCK_LOW_AND_ABOVE'],
    },
    {
      category: HarmCategory['HARM_CATEGORY_HARASSMENT'],
      threshold: HarmBlockThreshold['BLOCK_LOW_AND_ABOVE'],
    },
    {
      category: HarmCategory['HARM_CATEGORY_HATE_SPEECH'],
      threshold: HarmBlockThreshold['BLOCK_LOW_AND_ABOVE'],
    },
    {
      category: HarmCategory['HARM_CATEGORY_SEXUALLY_EXPLICIT'],
      threshold: HarmBlockThreshold['BLOCK_LOW_AND_ABOVE'],
    },
  ];

  const response = await client.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      safetySettings,
    },
  });

  let text = `RESPONSE\n${response.text}\n\n--- \n\nSAFETY RATINGS\n` || '';

  for (const each of response.candidates?.[0]?.safetyRatings ?? []) {
    text += `\nCategory: ${String(each.category)}`;
    text += `\nIs Blocked: ${each.blocked}`;
    text += `\nProbability: ${each.probability}`;
    text += `\nProbability Score: ${each.probabilityScore}`;
    text += `\nSeverity: ${each.severity}`;
    text += `\nSeverity Score: ${each.severityScore}\n`;
  }

  if (response.candidates?.length) {
    await writeFile(OUTPUT_FILE_PATH, text);
  }

  return text;
}
