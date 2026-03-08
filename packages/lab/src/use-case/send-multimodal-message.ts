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

const OUTPUT_FILE_PATH = '/assets/send-multimodal-message-output.md';

export async function sendMultimodalMessage() {
  const client = new GoogleGenAI({
    vertexai: GOOGLE_GENAI_USE_VERTEXAI,
    project: GOOGLE_CLOUD_PROJECT,
    location: GOOGLE_CLOUD_LOCATION,
  });

  const model = 'gemini-2.5-flash';

  const textData = 'Transcribe the first 30 seconds of the video file.';

  const fileData: FileData = {
    fileUri: 'https://www.youtube.com/watch?v=an8SrFtJBdM',
    mimeType: 'video/mp4',
  };

  const audioData: PartUnion = {
    fileData,
  };

  const contents: ContentListUnion = [textData, audioData];

  const response = await client.models.generateContent({
    model,
    contents,
  });

  if (response.text) {
    await writeFile(OUTPUT_FILE_PATH, response.text);
  }

  return response.text;
}
