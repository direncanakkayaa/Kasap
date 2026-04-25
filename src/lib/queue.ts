import { Queue } from 'bullmq';
import { redis } from './redis';

import { SmsTemplates, SmsTemplateId } from './sms-templates';

let _smsQueue: Queue | null = null;

export function getSmsQueue(): Queue {
  if (!_smsQueue) {
    _smsQueue = new Queue('sms-notifications', {
      connection: redis,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
      },
    });
  }
  return _smsQueue;
}

export async function addSmsJob(templateId: SmsTemplateId, phone: string, data: any) {
  try {
    const template = SmsTemplates[templateId];
    if (!template) throw new Error(`Template ${templateId} not found`);
    
    const message = template(data);
    await getSmsQueue().add('send-sms', { phone, message });
    console.log(`[Queue] SMS job added for ${phone} using template ${templateId}`);
  } catch (error) {
    console.error(`[Queue] Failed to add SMS job:`, error);
  }
}
