// src/app/unsubscribed/page.js
import Link from 'next/link';

export const metadata = {
  title: 'Unsubscribed | Ajithkumar',
  description: 'You have been successfully unsubscribed from email notifications.',
  robots: { index: false }
};

export default function UnsubscribedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="clean-container rounded-xl p-8 max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          You&apos;ve Been Unsubscribed
        </h1>
        
        <p className="text-secondary-600 dark:text-secondary-400">
          You have been successfully unsubscribed from email notifications from Ajithkumar.com.
        </p>
        
        <p className="text-secondary-600 dark:text-secondary-400">
          I&apos;m sorry to see you go! If you ever want to resubscribe in the future, you can do so from the website.
        </p>
        
        <div className="pt-6 space-y-4">
          <p className="text-sm text-secondary-500">
            Changed your mind?
          </p>
          
          <Link 
            href="/?resubscribe=true"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            Resubscribe
          </Link>
          
          <div className="pt-2">
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-foreground hover:bg-background/50 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}