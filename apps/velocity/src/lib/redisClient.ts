import { UPSTASH_REDIS_TOKEN, UPSTASH_REDIS_URL } from '@/utils/constants';
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: UPSTASH_REDIS_URL,
    token: UPSTASH_REDIS_TOKEN,
});

export default redis;
