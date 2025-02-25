import { RESEND_KEY } from '@/utils/constants';
import { Resend } from 'resend';

export const resend = new Resend(RESEND_KEY);
