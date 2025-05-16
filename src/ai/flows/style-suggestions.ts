// Use server directive is required for all Genkit flows.
'use server';

/**
 * @fileOverview Provides AI-powered style suggestions of complementary items
 * based on the product a user is viewing.
 *
 * - getStyleSuggestions - A function that returns style suggestions.
 * - StyleSuggestionsInput - The input type for the getStyleSuggestions function.
 * - StyleSuggestionsOutput - The return type for the getStyleSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StyleSuggestionsInputSchema = z.object({
  productDescription: z
    .string()
    .describe('The description of the product the user is viewing.'),
  userPreferences: z
    .string()
    .optional()
    .describe('Optional: The user\u2019s style preferences.'),
});
export type StyleSuggestionsInput = z.infer<typeof StyleSuggestionsInputSchema>;

const StyleSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of complementary items based on the selected product.'),
});
export type StyleSuggestionsOutput = z.infer<typeof StyleSuggestionsOutputSchema>;

export async function getStyleSuggestions(input: StyleSuggestionsInput): Promise<StyleSuggestionsOutput> {
  return styleSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'styleSuggestionsPrompt',
  input: {schema: StyleSuggestionsInputSchema},
  output: {schema: StyleSuggestionsOutputSchema},
  prompt: `You are an interior design assistant. A user is viewing a product with the following description: {{{productDescription}}}.\n\nSuggest complementary items that would create a cohesive look in the user's home. Return a list of items.\n\n{{#if userPreferences}}The user has the following style preferences: {{{userPreferences}}}.\nConsider these preferences when making your suggestions.\n{{/if}}`,
});

const styleSuggestionsFlow = ai.defineFlow(
  {
    name: 'styleSuggestionsFlow',
    inputSchema: StyleSuggestionsInputSchema,
    outputSchema: StyleSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
