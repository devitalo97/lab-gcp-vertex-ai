import { sendMultimodalMessage } from '@/use-case/send-multimodal-message.js';
import { sendTextMessage } from './use-case/send-text-message.js';
import { sendSystemInstructionMessage } from '@/use-case/send-system-instruction-message.js';

async function run() {
  await sendTextMessage();
  await sendMultimodalMessage();
  // await sendSystemInstructionMessage();
}

run();
