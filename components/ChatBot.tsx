"use client";

import { Bot, Loader2, Send, User, LogIn, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function ChatBot() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Help me optimize my resume for tech jobs",
    "How do I prepare for a job interview?",
    "What skills should I develop for a career in marketing?",
    "How to write a professional cover letter?",
    "Tips for negotiating my salary offer",
    "How to build a professional network on LinkedIn"
  ];  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const generateId = () =>
    `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content:
            data.content ||
            data.message ||
            "I'm not sure how to respond to that.",
        },
      ]);
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      handleSubmit(fakeEvent as React.FormEvent);
    }, 100);
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">
          Loading HR Assistant...
        </p>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-4">
        <Card className="w-full  shadow-lg border-0">
          <CardHeader className="text-center space-y-1 pb-2">
            <div className="mx-auto p-3 rounded-full bg-primary/10 mb-2">
              <Bot className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">HR Assistant</CardTitle>
            <p className="text-muted-foreground">Your AI-powered HR helper</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 text-center">
            <div className="bg-amber-50 text-amber-700 p-3 rounded-lg text-sm">
              Please sign in to access the HR Assistant and get answers to your
              HR questions.
            </div>
            <Separator />
            <div className="py-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Get instant answers to HR questions</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Learn about company policies</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Understand your benefits</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/signin">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In to Continue
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 pb-32 pt-4 md:px-8"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-3xl mx-auto">
            <div className="bg-primary/5 p-6 rounded-full">
              <Bot className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">
                How can I help you today?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Ask me anything about company policies, benefits, or HR
                procedures.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl mx-auto">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4 hover:bg-primary/5"
                    onClick={() => handleQuickReply(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full mx-auto space-y-6 ">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`group relative ${message.role === "user" ? "flex justify-end" : ""}`}
              >
                <div
                  className={`flex items-start gap-4 ${message.role === "user" ? "flex-row-reverse" : ""} max-w-[80%]`}
                >
                  <div className="shrink-0 mt-1">
                    {message.role === "assistant" ? (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">
                      {message.role === "assistant" ? "HR Assistant" : "You"}
                    </div>
                    <div
                      className={`prose prose-sm max-w-none p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-white prose-headings:text-white prose-strong:text-white prose-a:text-white"
                          : "bg-gray-100 dark:bg-gray-800 dark:prose-invert"
                      }`}
                    >
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-1">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">HR Assistant</div>
                  <div className="flex gap-1.5 items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></span>
                    <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-75"></span>
                    <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-150"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Message HR Assistant..."
              className="resize-none pr-14 py-3 min-h-[60px] max-h-[200px] border-gray-200 dark:border-gray-700 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary rounded-xl"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const fakeEvent = { preventDefault: () => {} };
                  handleSubmit(fakeEvent as React.FormEvent);
                }
              }}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="cursor-pointer absolute right-2 bottom-[13px] h-[34px] w-[34px] rounded-lg bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          <div className="text-xs text-muted-foreground text-center mt-2">
            HR Assistant can make mistakes. Consider checking important
            information.
          </div>
        </div>
      </div>
    </div>
  );
}