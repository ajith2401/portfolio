
// src/app/terms-conditions/page.js

import { TermsAndConditions } from "@/components/legal/LegalPolicies";

export const metadata = {
  title: 'Terms and Conditions | Ajithkumar',
  description: 'Understand the terms governing the use of our services.',
};

export default function TermsConditionsPage() {
  return <TermsAndConditions />;
}
