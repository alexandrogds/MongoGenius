'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating MongoDB schema designs based on user input.
 *
 * It includes:
 * - generateMongoDBSchema: The main function that takes data requirements as input and returns a MongoDB schema design.
 * - GenerateMongoDBSchemaInput: The input type for the generateMongoDBSchema function.
 * - GenerateMongoDBSchemaOutput: The output type for the generateMongoDBSchema function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMongoDBSchemaInputSchema = z.object({
  dataRequirements: z
    .string()
    .describe('A description of the data requirements for the MongoDB schema.'),
});
export type GenerateMongoDBSchemaInput = z.infer<typeof GenerateMongoDBSchemaInputSchema>;

const GenerateMongoDBSchemaOutputSchema = z.object({
  mongoDBSchema: z.string().describe('The generated MongoDB schema design.'),
  progress: z.string().describe('A short summary of what was generated.')
});
export type GenerateMongoDBSchemaOutput = z.infer<typeof GenerateMongoDBSchemaOutputSchema>;

export async function generateMongoDBSchema(input: GenerateMongoDBSchemaInput): Promise<GenerateMongoDBSchemaOutput> {
  return generateMongoDBSchemaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMongoDBSchemaPrompt',
  input: {schema: GenerateMongoDBSchemaInputSchema},
  output: {schema: GenerateMongoDBSchemaOutputSchema},
  prompt: `You are an expert MongoDB database architect.

  Based on the following data requirements, generate a MongoDB schema design:

  Data Requirements: {{{dataRequirements}}}

  Return only the MongoDB schema.
  Add a short, one-sentence summary of what you have generated to the 'progress' field in the output.
  `,
});

const generateMongoDBSchemaFlow = ai.defineFlow(
  {
    name: 'generateMongoDBSchemaFlow',
    inputSchema: GenerateMongoDBSchemaInputSchema,
    outputSchema: GenerateMongoDBSchemaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
