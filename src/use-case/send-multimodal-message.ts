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

  const model = 'gemini-3-flash-preview';

  const textData =
    'Transcribe the interview in the format of timecode, speaker, and caption. Use speaker A, speaker B, etc., to identify different speakers.';

  const fileData: FileData = {
    fileUri:
      'gs://cloud-samples-data/generative-ai/audio/Chirp-3-Docs-Dive.mp3',
    mimeType: 'audio/mp3',
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
