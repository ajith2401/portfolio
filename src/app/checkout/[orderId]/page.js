// src/app/photography/checkout/[orderId]/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  useGetOrderByIdQuery,
  useUpdateOrderPaymentMutation,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation
} from '@/services/api';
import { Alert, AlertDescription, AlertTitle, Button } from '@/components/ui/components/ui';

export default function CheckoutPage() {
  const { orderId } = useParams();
  const router = useRouter();
  
  // RTK Query hooks
  const { 
    data: order, 
    error: orderError, 
    isLoading,
    refetch: refetchOrder
  } = useGetOrderByIdQuery(orderId);
  
  // Payment mutations
  const [updateOrderPayment] = useUpdateOrderPaymentMutation();
  const [createRazorpayOrder, { isLoading: isCreatingRazorpayOrder }] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();
  
  // Local state
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if already paid
    if (order?.payment?.status === 'completed') {
      setPaymentStatus({
        success: true,
        message: 'Payment already completed for this order.'
      });
    }
  }, [order]);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
        setError('Razorpay SDK failed to load. Please try again later.');
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setPaymentProcessing(true);
      
      // 1. Load Razorpay SDK
      const res = await initializeRazorpay();
      
      if (!res) {
        setError('Razorpay SDK failed to load');
        setPaymentProcessing(false);
        return;
      }
      
      // 2. Create Razorpay order using RTK Query
      const razorpayData = await createRazorpayOrder({ orderId: order._id }).unwrap();
      
      // 3. Save Razorpay order ID to our order
      await updateOrderPayment({
        orderId: order._id,
        paymentInfo: {
          razorpayOrderId: razorpayData.id
        }
      }).unwrap();
      
      // 4. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: "Your Photography Studio",
        description: `Payment for ${order.serviceSnapshot.name}`,
        order_id: razorpayData.id,
        prefill: {
          name: order.customer.name,
          email: order.customer.email,
          contact: order.customer.phone
        },
        notes: {
          orderId: order._id
        },
        theme: {
          color: "#4F46E5"
        },
        handler: async function (response) {
          try {
            // Verify payment with backend using RTK Query
            const verifyData = await verifyRazorpayPayment({
              orderId: order._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            }).unwrap();
            
            if (verifyData.success) {
              // Payment successful
              setPaymentStatus({
                success: true,
                message: 'Payment successful! Your booking is confirmed.'
              });
              
              // Refresh order data
              refetchOrder();
            } else {
              setPaymentStatus({
                success: false,
                message: verifyData.message || 'Payment verification failed'
              });
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setPaymentStatus({
              success: false,
              message: 'Payment verification failed. Please contact support.'
            });
          } finally {
            setPaymentProcessing(false);
          }
        },
        modal: {
          ondismiss: function() {
            setPaymentProcessing(false);
          }
        }
      };
      
      // Open Razorpay checkout
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      setError(error.message || 'Failed to initiate payment');
      setPaymentProcessing(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (orderError || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-2 text-gray-600">{orderError?.message || 'Order not found'}</p>
        <Button className="mt-4" onClick={() => router.push('/photography')}>
          Back to Services
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Complete Your Booking</h1>
      </div>
      
      {paymentStatus && (
        <Alert 
          variant={paymentStatus.success ? "default" : "destructive"}
          className="mb-6"
        >
          <AlertTitle>{paymentStatus.success ? 'Success' : 'Payment Failed'}</AlertTitle>
          <AlertDescription>{paymentStatus.message}</AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert 
          variant="destructive"
          className="mb-6"
        >
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Order Summary</h2>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center mb-6">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{order.serviceSnapshot.name}</h3>
              <p className="text-gray-600">{order.serviceSnapshot.category}</p>
              
              {order.serviceSnapshot.options && order.serviceSnapshot.options.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Selected Options:</p>
                  <ul className="text-sm text-gray-600">
                    {order.serviceSnapshot.options.map((option, idx) => (
                      <li key={idx}>{option.name}: {option.value}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-2xl font-bold">₹{order.payment.amount}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Booking Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p>{formatDate(order.bookingDetails.date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p>{formatTime(order.bookingDetails.time)}</p>
              </div>
              {order.bookingDetails.location && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Location</p>
                  <p>{order.bookingDetails.location}</p>
                </div>
              )}
              {order.bookingDetails.notes && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Special Requests</p>
                  <p>{order.bookingDetails.notes}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p>{order.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{order.customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p>{order.customer.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {order.payment.status === 'pending' ? (
        <div className="text-center">
          <Button 
            onClick={handlePayment} 
            disabled={paymentProcessing || isCreatingRazorpayOrder}
            className="px-8 py-3"
          >
            {paymentProcessing || isCreatingRazorpayOrder ? 'Processing...' : 'Pay Now - ₹' + order.payment.amount}
          </Button>
          <p className="mt-2 text-sm text-gray-500">
            You&apos;ll be redirected to Razorpay to complete your payment
          </p>
        </div>
      ) : order.payment.status === 'completed' ? (
        <div className="bg-green-50 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-green-700">Payment Completed</h3>
          <p className="mt-2">Your booking has been confirmed. Thank you!</p>
          <div className="mt-4">
            <Button onClick={() => router.push('/photography')}>
              Browse More Services
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-red-700">Payment {order.payment.status}</h3>
          <p className="mt-2">There was an issue with your payment.</p>
          <div className="mt-4">
            <Button onClick={handlePayment}>
              Try Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}