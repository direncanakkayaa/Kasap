import { Worker } from 'bullmq';
import { redis } from '../lib/redis';

// Note: In a production environment, you would use a real SMS provider API here.
// Example providers: Netgsm (common in Turkey), Twilio, AWS SNS.

export const smsWorker = new Worker(
  'sms-notifications',
  async (job) => {
    const { phone, message } = job.data;
    
    console.log(`[SMS Worker] Sending SMS to ${phone}: "${message}"`);

    try {
      // TODO: Implement actual SMS API call here
      // const response = await smsProvider.send({ to: phone, message });
      
      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log(`[SMS Worker] SMS sent successfully to ${phone}`);
    } catch (error) {
      console.error(`[SMS Worker] Error sending SMS to ${phone}:`, error);
      throw error; // Let BullMQ handle retries
    }
  },
  { connection: redis }
);

smsWorker.on('completed', (job) => {
  console.log(`[SMS Worker] Job ${job.id} completed`);
});

smsWorker.on('failed', (job, err) => {
  console.error(`[SMS Worker] Job ${job?.id} failed with error ${err.message}`);
});
