import { sendMultimodalMessage } from '@/use-case/send-multimodal-message.js';
import { sendTextMessage } from './use-case/send-text-message.js';
import { sendSystemInstructionMessage } from '@/use-case/send-system-instruction-message.js';
import { sendContentGenerationParametersMessage } from '@/use-case/send-content-generation-parameters-message.js';
import { sendSafetyAndContentFiltersMessage } from '@/use-case/send-safety-and-content-filters-message.js';
import { sendChatMessage } from '@/use-case/send-chat-message.js';
import { sendStreamMessage } from '@/use-case/send-stream-message.js';
import { sendJobMessage } from '@/use-case/send-job-message.js';
import { getTokenCount } from '@/use-case/get-token-count.js';
import { createAndUseCacheContext } from '@/use-case/create-and-use-cache-context.js';
import { runFunctionCallingUseCase } from '@/use-case/function-calling.js';

async function run() {
  // await sendTextMessage();
  // await sendMultimodalMessage();
  // await sendSystemInstructionMessage();
  // await sendContentGenerationParametersMessage();
  // await sendSafetyAndContentFiltersMessage();
  // await sendChatMessage();
  // await sendStreamMessage();
  // await sendJobMessage();
  // await getTokenCount();
  // await createAndUseCacheContext();
  await runFunctionCallingUseCase();
}

run();
