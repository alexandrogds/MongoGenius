'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  suggestMongoDBIndexes,
  type SuggestMongoDBIndexesOutput,
} from '@/ai/flows/suggest-mongodb-indexes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CopyButton } from '@/components/copy-button';

const formSchema = z.object({
  dataModelDescription: z.string().min(10, 'Please provide a data model description.'),
  queryPatterns: z.string().min(10, 'Please describe your query patterns.'),
});

export function IndexSuggesterForm() {
  const [result, setResult] = useState<SuggestMongoDBIndexesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { dataModelDescription: '', queryPatterns: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await suggestMongoDBIndexes(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to suggest indexes. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Get Indexing Suggestions</CardTitle>
          <CardDescription>
            Describe your data model and common queries to receive intelligent indexing recommendations for your MongoDB collections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dataModelDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Model Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Provide a detailed description of your MongoDB data model, including collections and fields." className="min-h-[150px] text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="queryPatterns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Query Patterns</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe common query patterns and operations performed on the database." className="min-h-[150px] text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Suggest Indexes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex items-center justify-center rounded-lg border bg-card p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {result && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Suggested Indexes</CardTitle>
              <CopyButton textToCopy={result.suggestedIndexes} />
            </div>
            <CardDescription>
                Based on your data model and query patterns, here are some recommended indexes to improve performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto"><code className="font-code text-sm whitespace-pre-wrap">{result.suggestedIndexes}</code></pre>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="icon"><ThumbsUp className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><ThumbsDown className="h-4 w-4" /></Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
