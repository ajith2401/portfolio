// src/app/cancellation-refund/page.js

import { CancellationRefund } from '@/components/legal/LegalPolicies';

export const metadata = {
  title: 'Cancellation & Refund Policy | Your Photography Studio',
  description: 'Our policies regarding booking cancellations and refunds.',
};

export default function CancellationRefundPage() {
  return <CancellationRefund />;
}

