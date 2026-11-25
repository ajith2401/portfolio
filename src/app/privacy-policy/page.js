// src/app/privacy-policy/page.js

import { PrivacyPolicy } from "@/components/legal/LegalPolicies"; 

export const metadata = {
  title: 'Privacy Policy',
  description: 'Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
