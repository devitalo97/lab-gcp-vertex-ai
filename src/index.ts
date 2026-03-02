import { sendTextMessage } from './use-case/send-text-message.js';

async function run() {
  const model = 'gemini-3-flash-preview';
  const contents = 'How does AI work?';

  await sendTextMessage(model, contents);
}

run();
