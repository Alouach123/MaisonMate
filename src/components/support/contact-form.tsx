
"use client";
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast'; // Assuming useToast hook is available
import { Mail, Send, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl rounded-lg">
      <CardHeader className="text-center">
        <Mail className="mx-auto h-12 w-12 text-primary mb-3" />
        <CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
        <CardDescription>Have a question or need assistance? Fill out the form below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="font-medium">Full Name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="bg-background/70"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-medium">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/70"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subject" className="font-medium">Subject</Label>
            <Input 
              id="subject" 
              type="text" 
              placeholder="e.g., Question about an order"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="bg-background/70"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message" className="font-medium">Message</Label>
            <Textarea
              id="message"
              placeholder="Your message here..."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="min-h-[120px] bg-background/70"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base py-3">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
