'use server';

/**
 * @fileOverview Optimizes MongoDB queries based on the provided query and data model.
 *
 * - optimizeMongoDBQuery - A function that optimizes a MongoDB query.
 * - OptimizeMongoDBQueryInput - The input type for the optimizeMongoDBQuery function.
 * - OptimizeMongoDBQueryOutput - The return type for the optimizeMongoDBQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeMongoDBQueryInputSchema = z.object({
  query: z.string().describe('The MongoDB query to optimize.'),
  dataModel: z.string().describe('Details about the data model (schema) of the MongoDB collection.'),
});
export type OptimizeMongoDBQueryInput = z.infer<typeof OptimizeMongoDBQueryInputSchema>;

const OptimizeMongoDBQueryOutputSchema = z.object({
  optimizedQuery: z.string().describe('The optimized MongoDB query.'),
  explanation: z.string().describe('Explanation of the optimization techniques applied.'),
});
export type OptimizeMongoDBQueryOutput = z.infer<typeof OptimizeMongoDBQueryOutputSchema>;

export async function optimizeMongoDBQuery(input: OptimizeMongoDBQueryInput): Promise<OptimizeMongoDBQueryOutput> {
  return optimizeMongoDBQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeMongoDBQueryPrompt',
  input: {schema: OptimizeMongoDBQueryInputSchema},
  output: {schema: OptimizeMongoDBQueryOutputSchema},
  prompt: `You are an expert MongoDB query optimizer.

  Based on the provided MongoDB query and data model details, generate an optimized MongoDB query and explain the optimization techniques applied.

  Original Query: {{{query}}}
  Data Model Details: {{{dataModel}}}

  Optimize the query and provide an explanation of the changes you made.
  The response must include the optimizedQuery and explanation fields.
  `,
});

const optimizeMongoDBQueryFlow = ai.defineFlow(
  {
    name: 'optimizeMongoDBQueryFlow',
    inputSchema: OptimizeMongoDBQueryInputSchema,
    outputSchema: OptimizeMongoDBQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
