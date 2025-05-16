
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { fetchStyleSuggestionsAction } from '@/app/actions'; // Server Action
import type { StyleSuggestion } from '@/types'; // Assuming a simple type for now
import { Wand2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';

interface StyleSuggestionsProps {
  productDescription: string;
  productName: string;
}

export default function StyleSuggestions({ productDescription, productName }: StyleSuggestionsProps) {
  const [userPreferences, setUserPreferences] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const result = await fetchStyleSuggestionsAction({
        productDescription: `${productName}: ${productDescription}`, // Combine name and desc for more context
        userPreferences: userPreferences || undefined, // Pass undefined if empty
      });
      setSuggestions(result.suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-8 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          Get Style Suggestions
        </CardTitle>
        <CardDescription>
          Discover complementary items to create a cohesive look with your "{productName}".
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="userPreferences" className="font-medium">Your Style Preferences (Optional)</Label>
            <Textarea
              id="userPreferences"
              value={userPreferences}
              onChange={(e) => setUserPreferences(e.target.value)}
              placeholder="e.g., I prefer a minimalist style, warm colors, natural materials..."
              className="mt-1 min-h-[80px]"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Suggestions...
              </>
            ) : (
              'Suggest Styles'
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {suggestions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Suggested Items:</h3>
            <ul className="space-y-3 list-disc list-inside text-foreground/80">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="p-3 bg-muted/50 rounded-md shadow-sm">
                  {suggestion}
                  {/* Placeholder for potential image or link to suggested product */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
