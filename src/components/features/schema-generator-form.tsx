'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateMongoDBSchema,
  type GenerateMongoDBSchemaOutput,
} from '@/ai/flows/generate-mongodb-schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CopyButton } from '@/components/copy-button';

const formSchema = z.object({
  dataRequirements: z.string().min(10, 'Please provide more details about your data requirements.'),
});

export function SchemaGeneratorForm() {
  const [result, setResult] = useState<GenerateMongoDBSchemaOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataRequirements: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await generateMongoDBSchema(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate schema. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Describe Your Data</CardTitle>
          <CardDescription>
            Provide a detailed description of your application&apos;s data requirements, and our AI will generate an optimized MongoDB schema for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="dataRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Data Requirements</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="For example: 'A social media app with users, posts, likes, and comments. Users can follow each other.'"
                        className="min-h-[150px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Schema
              </Button>
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
              <div>
                <CardTitle>Generated MongoDB Schema</CardTitle>
                <CardDescription>{result.progress}</CardDescription>
              </div>
              <CopyButton textToCopy={result.mongoDBSchema} />
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto"><code className="font-code text-sm">{result.mongoDBSchema}</code></pre>
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
