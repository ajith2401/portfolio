// src/app/privacy-policy/page.js

import { PrivacyPolicy } from "@/components/legal/LegalPolicies"; 

export const metadata = {
  title: 'Privacy Policy | Your Photography Studio',
  description: 'Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
