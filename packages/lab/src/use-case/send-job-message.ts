import { env } from '@/env.js';
import { GoogleGenAI, JobState } from '@google/genai';

const {
  GOOGLE_CLOUD_PROJECT,
  GOOGLE_CLOUD_LOCATION,
  GOOGLE_GENAI_USE_VERTEXAI,
  GOOGLE_CLOUD_BUCKET_STORAGE,
} = env;

export async function sendJobMessage() {
  const client = new GoogleGenAI({
    vertexai: GOOGLE_GENAI_USE_VERTEXAI,
    project: GOOGLE_CLOUD_PROJECT,
    location: GOOGLE_CLOUD_LOCATION,
  });

  const model = 'gemini-2.5-flash';

  let job = await client.batches.create({
    model,
    src: 'gs://cloud-samples-data/generative-ai/batch/batch_requests_for_multimodal_input.jsonl',
    config: {
      dest: GOOGLE_CLOUD_BUCKET_STORAGE,
    },
  });

  await new Promise<void>((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        job = await client.batches.get({ name: job.name! });
        console.log(`waiting... job state is ${job.state}`);

        if (
          job.state === JobState['JOB_STATE_SUCCEEDED'] ||
          job.state === JobState['JOB_STATE_FAILED'] ||
          job.state === JobState['JOB_STATE_CANCELLED'] ||
          job.state === JobState['JOB_STATE_PARTIALLY_SUCCEEDED']
        ) {
          console.log(job.name + ' ' + job.state + '\n');
          console.log(job);
          clearInterval(timer);
          resolve();
        }
      } catch (err) {
        clearInterval(timer);
        reject(err);
      }
    }, 10000);
  });
}
