// src/components/PhoneVerification.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui/components/ui';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebase';

const PhoneVerification = ({ phoneNumber, onVerificationSuccess, onError }) => {
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  // Setup recaptcha on component mount
  useEffect(() => {
    if (!auth) return;
    
    // Clear any existing recaptcha container
    const existingContainer = document.getElementById('recaptcha-container');
    if (existingContainer) {
      existingContainer.innerHTML = '';
    }
    
    // Setup invisible recaptcha
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': () => {
        // reCAPTCHA solved, allow sending verification code
      }
    });
    
    return () => {
      // Cleanup
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (error) {
          console.error('Error clearing recaptcha:', error);
        }
      }
    };
  }, []);

  // Handle sending verification code
  const handleSendCode = async () => {
    if (!auth || !phoneNumber) return;
    
    setIsSending(true);
    setError('');
    
    try {
      // Format phone number to include country code if not already present
      let formattedPhone = phoneNumber;
      if (phoneNumber.length === 10 && !phoneNumber.startsWith('+')) {
        formattedPhone = `+91${phoneNumber}`; // Assuming India as default (+91)
      }
      
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      
      setVerificationId(confirmationResult.verificationId);
      setCodeSent(true);
    } catch (error) {
      console.error('Error sending verification code:', error);
      setError(error.message || 'Failed to send verification code');
      onError?.(error.message || 'Failed to send verification code');
      
      // Reset recaptcha on error
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          
          // Reinitialize recaptcha
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible'
          });
        } catch (innerError) {
          console.error('Error resetting recaptcha:', innerError);
        }
      }
    } finally {
      setIsSending(false);
    }
  };

  // Handle verifying the code
  const handleVerifyCode = async () => {
    if (!verificationId || !verificationCode) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Create a credential with the verification ID and code
      const credential = window.firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      
      // Sign in with the credential
      await auth.signInWithCredential(credential);
      
      // Notify parent component of successful verification
      onVerificationSuccess?.();
      
      // Reset the verification form
      setVerificationCode('');
      setVerificationId('');
      setCodeSent(false);
    } catch (error) {
      console.error('Error verifying code:', error);
      setError(error.message || 'Invalid verification code');
      onError?.(error.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Recaptcha container (invisible) */}
      <div id="recaptcha-container"></div>
      
      {error && (
        <div className="mb-2 text-sm text-red-500">{error}</div>
      )}
      
      {!codeSent ? (
        <Button
          type="button"
          onClick={handleSendCode}
          disabled={isSending || !phoneNumber || phoneNumber.length !== 10}
          className={`w-full ${phoneNumber.length !== 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSending ? 'Sending...' : 'Send Verification Code'}
        </Button>
      ) : (
        <div className="space-y-2">
          <Input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            maxLength={6}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleVerifyCode}
              disabled={isLoading || !verificationCode || verificationCode.length < 6}
              className="flex-1"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSendCode}
              disabled={isSending}
            >
              Resend
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneVerification;