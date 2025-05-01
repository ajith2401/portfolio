// src/app/subscription-verified/page.js
import Link from 'next/link';

export const metadata = {
  title: 'Subscription Verified | Ajithkumar',
  description: 'Your email subscription has been successfully verified.',
  robots: { index: false }
};

export default function SubscriptionVerifiedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="clean-container rounded-xl p-8 max-w-md w-full text-center space-y-6">
        <div className="mb-6">
          {/* Success checkmark icon */}
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <svg
              className="w-10 h-10 text-green-600 dark:text-green-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Subscription Verified!
        </h1>
        
        <p className="text-secondary-600 dark:text-secondary-400">
          Your email has been successfully verified, and you&apos;re now subscribed to updates from Ajithkumar.com.
        </p>
        
        <p className="text-secondary-600 dark:text-secondary-400">
          You&lsquo;ll receive notifications whenever new content is published based on your subscription preferences.
        </p>
        
        <div className="pt-6">
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
