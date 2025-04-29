import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  MessageSquare,
  FileText,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex flex-col gap-4 md:gap-6 md:w-1/2">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Your Personal <span className="text-primary">HR Assistant</span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-[600px]">
              Get expert career guidance, job search advice, and professional
              communication help anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/chat">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative w-full aspect-square md:aspect-auto md:h-[500px] rounded-xl overflow-hidden">
            <Image
              src="/hero-image.svg"
              alt="HR Assistant Dashboard"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      <section
        id="features"
        className="w-full py-16 md:py-24 bg-white dark:bg-gray-900"
      >
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything You Need For Your Career Journey
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-[700px] mx-auto">
              Whether you&apos;re just starting out or looking to advance,
              HRSpark provides tailored guidance for every step of your career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Personalized Guidance</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Receive tailored advice based on your experience level and
                career goals.
              </p>
              <ul className="space-y-2 mt-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Job search strategies</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Interview preparation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Career transition planning</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Application Documents</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Get help optimizing your resume, cover letter, and professional
                communications.
              </p>
              <ul className="space-y-2 mt-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Resume feedback</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Cover letter templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Professional email drafting</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Career Development</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Develop strategies for long-term career growth and advancement.
              </p>
              <ul className="space-y-2 mt-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Skill development planning</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Networking strategies</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Salary negotiation tips</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-[700px] mx-auto">
              Get the career help you need in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="relative flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Sign In</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Create your account to access personalized HR assistance.
              </p>

              <div className="hidden md:block absolute top-8 left-[calc(100%_-_16px)] h-[2px] w-[calc(100%_-_32px)] bg-primary/30 z-0"></div>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Ask Questions</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Get immediate answers to all your career and HR questions.
              </p>

              <div className="hidden md:block absolute top-8 left-[calc(100%_-_16px)] h-[2px] w-[calc(100%_-_32px)] bg-primary/30 z-0"></div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Get Guidance</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Receive personalized advice and actionable strategies for
                success.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-primary text-white">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to Advance Your Career?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-[700px] mx-auto">
            Get personalized career guidance and HR advice today.
          </p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link href="/chat">
              Start Chatting Now <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
