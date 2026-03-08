import { env } from '@/env.js';
import { writeFile } from '@/util/write-file.js';
import { GoogleGenAI } from '@google/genai';

const {
  GOOGLE_CLOUD_PROJECT,
  GOOGLE_CLOUD_LOCATION,
  GOOGLE_GENAI_USE_VERTEXAI,
} = env;

const OUTPUT_FILE_PATH = '/assets/get-token-count-output.md';

export async function getTokenCount() {
  const client = new GoogleGenAI({
    vertexai: GOOGLE_GENAI_USE_VERTEXAI,
    project: GOOGLE_CLOUD_PROJECT,
    location: GOOGLE_CLOUD_LOCATION,
  });

  const model = 'gemini-2.5-flash';
  const contents =
    'What Platform Engineering courses are available on the Linux Foundation Training Portal?';

  const listContentReponse = await client.models.computeTokens({
    model,
    contents,
  });

  if (listContentReponse.tokensInfo) {
    await writeFile(
      OUTPUT_FILE_PATH,
      JSON.stringify(listContentReponse.tokensInfo, null, 2)
    );
  }

  const countTokenResponse = await client.models.generateContent({
    model,
    contents,
  });

  if (countTokenResponse.usageMetadata) {
    await writeFile(
      OUTPUT_FILE_PATH,
      JSON.stringify(countTokenResponse.usageMetadata, null, 2),
      { append: true }
    );
  }
}
