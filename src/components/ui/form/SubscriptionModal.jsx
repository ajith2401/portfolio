'use client';

import { useState, useEffect } from 'react';
import SubscriptionForm from './SubscriptionForm';
import eventEmitter from '@/lib/eventEmitter';

const SubscriptionModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleShowSubscribeModal = () => setShowModal(true);

    // Explicit opt-in only: Subscribe buttons emit this event.
    eventEmitter?.on('showSubscriptionModal', handleShowSubscribeModal);

    // Support ?resubscribe=true from email links.
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('resubscribe') === 'true') {
      setShowModal(true);
    }

    return () => {
      eventEmitter?.off('showSubscriptionModal', handleShowSubscribeModal);
    };
  }, []);

  const handleClose = () => setShowModal(false);

  if (!showModal) return null;

  return <SubscriptionForm onClose={handleClose} />;
};

export default SubscriptionModal;
