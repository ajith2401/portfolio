// src/app/shipping-delivery/page.js

import { ShippingDelivery } from '@/components/legal/LegalPolicies';

export const metadata = {
  title: 'Shipping & Delivery Policy | Your Photography Studio',
  description: 'Details about our delivery timeframes and shipping methods.',
};

export default function ShippingDeliveryPage() {
  return <ShippingDelivery />;
}
