import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-mongodb-indexes.ts';
import '@/ai/flows/generate-mongodb-schema.ts';
import '@/ai/flows/optimize-mongodb-query.ts';