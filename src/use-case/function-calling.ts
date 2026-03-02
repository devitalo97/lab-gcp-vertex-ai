import { env } from '@/env.js';
import { writeFile } from '@/util/write-file.js';
import {
  GoogleGenAI,
  Type,
  type FunctionDeclaration,
  type Tool,
} from '@google/genai';

const {
  GOOGLE_CLOUD_PROJECT,
  GOOGLE_CLOUD_LOCATION,
  GOOGLE_GENAI_USE_VERTEXAI,
} = env;

const OUTPUT_FILE_PATH = '/assets/function-calling-output.md';

const extractResourceInfo: FunctionDeclaration = {
  name: 'extract_resource_info',
  description:
    'Obtém o preço atual de um recurso GCP (ex: instâncias de Compute Engine).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      machineType: {
        type: Type.STRING,
        description: 'O tipo de máquina, ex: e2-standard-4',
      },
      region: {
        type: Type.STRING,
        description: 'A região do GCP, ex: us-central1',
      },
    },
    required: ['machineType', 'region'],
  },
};

const resourceInfoApiResponse = {
  price: '0.134',
  currency: 'USD',
  billingUnit: 'hour',
};

export async function runFunctionCallingUseCase() {
  const client = new GoogleGenAI({
    vertexai: GOOGLE_GENAI_USE_VERTEXAI,
    project: GOOGLE_CLOUD_PROJECT,
    location: GOOGLE_CLOUD_LOCATION,
  });

  const model = 'gemini-2.5-flash';

  const tool: Tool = {
    functionDeclarations: [extractResourceInfo],
  };

  const chat = client.chats.create({
    model,
    config: {
      tools: [tool],
    },
  });

  const prompt = 'Quanto custa uma a2-highgpu-1g em southamerica-east1?';

  const result = await chat.sendMessage({ message: prompt });

  const functionCalls = result.functionCalls;

  const functionResponses = [];
  if (functionCalls) {
    for (const functionCall of functionCalls) {
      if (!functionCall.name) continue;
      functionResponses.push({
        functionResponse: {
          name: functionCall.name,
          response: resourceInfoApiResponse,
        },
      });
    }
  }
  const finalResult = await chat.sendMessage({ message: functionResponses });

  await writeFile(
    OUTPUT_FILE_PATH,
    JSON.stringify({ functionCalls, text: finalResult.text ?? '' }, null, 2)
  );
}
