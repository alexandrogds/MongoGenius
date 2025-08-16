'use server';

/**
 * @fileOverview Suggests optimal indexing strategies for MongoDB to enhance query performance.
 *
 * - suggestMongoDBIndexes - A function that handles the suggestion of MongoDB indexes.
 * - SuggestMongoDBIndexesInput - The input type for the suggestMongoDBIndexes function.
 * - SuggestMongoDBIndexesOutput - The return type for the suggestMongoDBIndexes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMongoDBIndexesInputSchema = z.object({
  dataModelDescription: z
    .string()
    .describe('A detailed description of the MongoDB data model, including collections and fields.'),
  queryPatterns: z
    .string()
    .describe('A description of common query patterns and operations performed on the database.'),
});
export type SuggestMongoDBIndexesInput = z.infer<typeof SuggestMongoDBIndexesInputSchema>;

const SuggestMongoDBIndexesOutputSchema = z.object({
  suggestedIndexes: z
    .string()
    .describe('A list of suggested MongoDB indexes with justifications for each suggestion.'),
});
export type SuggestMongoDBIndexesOutput = z.infer<typeof SuggestMongoDBIndexesOutputSchema>;

export async function suggestMongoDBIndexes(input: SuggestMongoDBIndexesInput): Promise<SuggestMongoDBIndexesOutput> {
  return suggestMongoDBIndexesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMongoDBIndexesPrompt',
  input: {schema: SuggestMongoDBIndexesInputSchema},
  output: {schema: SuggestMongoDBIndexesOutputSchema},
  prompt: `You are an expert MongoDB database administrator. Based on the provided data model description and query patterns, suggest optimal indexing strategies to improve query performance.

Data Model Description:
{{{dataModelDescription}}}

Query Patterns:
{{{queryPatterns}}}

Provide a list of suggested indexes with a brief explanation of why each index is recommended.
`,
});

const suggestMongoDBIndexesFlow = ai.defineFlow(
  {
    name: 'suggestMongoDBIndexesFlow',
    inputSchema: SuggestMongoDBIndexesInputSchema,
    outputSchema: SuggestMongoDBIndexesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
