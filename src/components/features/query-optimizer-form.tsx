'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  optimizeMongoDBQuery,
  type OptimizeMongoDBQueryOutput,
} from '@/ai/flows/optimize-mongodb-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CopyButton } from '@/components/copy-button';

const formSchema = z.object({
  query: z.string().min(10, 'Please provide a query to optimize.'),
  dataModel: z.string().min(10, 'Please provide details about your data model.'),
});

export function QueryOptimizerForm() {
  const [result, setResult] = useState<OptimizeMongoDBQueryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: '', dataModel: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await optimizeMongoDBQuery(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to optimize query. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Optimize Your Query</CardTitle>
          <CardDescription>
            Enter your MongoDB query and data model schema to get an optimized version with a detailed explanation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Query</FormLabel>
                    <FormControl>
                      <Textarea placeholder='db.collection.find({ "status": "active" })' className="min-h-[150px] font-code text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Model / Schema</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the schema for the collection being queried." className="min-h-[150px] text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Optimize Query
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Optimized Query</CardTitle>
                <CopyButton textToCopy={result.optimizedQuery} />
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto"><code className="font-code text-sm">{result.optimizedQuery}</code></pre>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Explanation</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{result.explanation}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="icon"><ThumbsUp className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><ThumbsDown className="h-4 w-4" /></Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
