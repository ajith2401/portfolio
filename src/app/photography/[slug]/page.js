// src/app/photography/[slug]/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useGetPhotoServiceBySlugQuery, useCreateOrderMutation } from '@/services/api';
import { Button } from '@/components/ui/components/button';
import { Alert, AlertDescription, AlertTitle, Dialog, DialogContent, DialogHeader, DialogTitle, Input } from '@/components/ui/components/ui';
import PhoneVerification from '@/components/PhoneVerification';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  
  // Fetch service details using RTK Query
  const { data: service, error: serviceError, isLoading } = useGetPhotoServiceBySlugQuery(slug);
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  
  // Create order mutation
  const [createOrder, { isLoading: isCreatingOrder, error: createOrderError }] = useCreateOrderMutation();
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    location: '',
    notes: '',
    selectedOptions: {}
  });
  const [formErrors, setFormErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

// OTP verification state
const [emailOtp, setEmailOtp] = useState('');
const [phoneOtp, setPhoneOtp] = useState('');
const [emailVerified, setEmailVerified] = useState(false);
const [phoneVerified, setPhoneVerified] = useState(false);
const [emailOtpSent, setEmailOtpSent] = useState(false);
const [phoneOtpSent, setPhoneOtpSent] = useState(false);
const [isGeneratingEmailOtp, setIsGeneratingEmailOtp] = useState(false);
const [isGeneratingPhoneOtp, setIsGeneratingPhoneOtp] = useState(false);
const [alertMessage, setAlertMessage] = useState(null);

// Time slots for appointment booking
const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM'
];
  // Add these OTP handling functions to your component
const generateEmailOtp = async () => {
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!bookingForm.email.trim() || !emailRegex.test(bookingForm.email.trim())) {
    setFormErrors(prev => ({
      ...prev,
      email: !bookingForm.email.trim() ? 'Email is required' : 'Invalid email address'
    }));
    return;
  }

  try {
    setIsGeneratingEmailOtp(true);
    
    // Call API to send OTP
    const response = await fetch('/api/otp/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: bookingForm.email }),
    });

    const data = await response.json();
    
    if (data.success) {
      setEmailOtpSent(true);
      setAlertMessage({
        type: 'success',
        message: 'Verification code sent to your email'
      });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setAlertMessage(null), 5000);
    } else {
      setFormErrors(prev => ({
        ...prev,
        email: data.message || 'Failed to send verification code'
      }));
    }
  } catch (error) {
    setFormErrors(prev => ({
      ...prev,
      email: 'Error sending verification code, please try again'
    }));
  } finally {
    setIsGeneratingEmailOtp(false);
  }
};

const verifyEmailOtp = async () => {
  if (!emailOtp || emailOtp.length < 6) {
    setAlertMessage({
      type: 'error',
      message: 'Please enter the 6-digit verification code'
    });
    return;
  }

  try {
    const response = await fetch('/api/otp/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: bookingForm.email,
        otp: emailOtp 
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      setEmailVerified(true);
      setAlertMessage({
        type: 'success',
        message: 'Email verified successfully'
      });
      
      // Clear any email error
      if (formErrors.email) {
        setFormErrors(prev => ({
          ...prev,
          email: null
        }));
      }
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setAlertMessage(null), 5000);
    } else {
      setAlertMessage({
        type: 'error',
        message: data.message || 'Invalid verification code'
      });
    }
  } catch (error) {
    setAlertMessage({
      type: 'error',
      message: 'Error verifying code, please try again'
    });
  }
};

// Add these validation functions to your component
const validateStep1 = () => {
  const errors = {};
  
  // Required fields
  if (!bookingForm.name.trim()) errors.name = 'Name is required';
  if (!bookingForm.email.trim()) errors.email = 'Email is required';
  if (!bookingForm.phone.trim()) errors.phone = 'Phone number is required';
  
  // Verification checks
  if (!emailVerified) errors.email = 'Email must be verified';
  if (!phoneVerified) errors.phone = 'Phone number must be verified';
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (bookingForm.email.trim() && !emailRegex.test(bookingForm.email.trim())) {
    errors.email = 'Invalid email address';
  }
  
  // Phone validation
  const phoneRegex = /^\d{10}$/;
  if (bookingForm.phone.trim() && !phoneRegex.test(bookingForm.phone.trim())) {
    errors.phone = 'Phone number must be 10 digits';
  }
  
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

const validateStep2 = () => {
  const errors = {};
  
  if (!bookingForm.date.trim()) errors.date = 'Date is required';
  if (!bookingForm.time.trim()) errors.time = 'Time is required';
  if (!bookingForm.location.trim()) errors.location = 'Location is required';
  
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

const generatePhoneOtp = async () => {
  // Phone validation - simple check for 10-digit number
  const phoneRegex = /^\d{10}$/;
  if (!bookingForm.phone.trim() || !phoneRegex.test(bookingForm.phone.trim())) {
    setFormErrors(prev => ({
      ...prev,
      phone: !bookingForm.phone.trim() ? 'Phone number is required' : 'Please enter a valid 10-digit phone number'
    }));
    return;
  }

  try {
    setIsGeneratingPhoneOtp(true);
    
    // Call API to send OTP
    const response = await fetch('/api/otp/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: bookingForm.phone }),
    });

    const data = await response.json();
    
    if (data.success) {
      setPhoneOtpSent(true);
      setAlertMessage({
        type: 'success',
        message: 'Verification code sent to your phone'
      });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setAlertMessage(null), 5000);
    } else {
      setFormErrors(prev => ({
        ...prev,
        phone: data.message || 'Failed to send verification code'
      }));
    }
  } catch (error) {
    setFormErrors(prev => ({
      ...prev,
      phone: 'Error sending verification code, please try again'
    }));
  } finally {
    setIsGeneratingPhoneOtp(false);
  }
};

const verifyPhoneOtp = async () => {
  if (!phoneOtp || phoneOtp.length < 6) {
    setAlertMessage({
      type: 'error',
      message: 'Please enter the 6-digit verification code'
    });
    return;
  }

  try {
    const response = await fetch('/api/otp/verify-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        phone: bookingForm.phone,
        otp: phoneOtp 
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      setPhoneVerified(true);
      setAlertMessage({
        type: 'success',
        message: 'Phone number verified successfully'
      });
      
      // Clear any phone error
      if (formErrors.phone) {
        setFormErrors(prev => ({
          ...prev,
          phone: null
        }));
      }
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setAlertMessage(null), 5000);
    } else {
      setAlertMessage({
        type: 'error',
        message: data.message || 'Invalid verification code'
      });
    }
  } catch (error) {
    setAlertMessage({
      type: 'error',
      message: 'Error verifying code, please try again'
    });
  }
};

  // Set active image when service data is loaded
  useEffect(() => {
    if (service) {
      setActiveImage(service.images?.thumbnail || service.images?.gallery?.[0] || null);
      
      // Initialize price
      setTotalPrice(service.discountPrice || service.price);
      
      // Initialize selected options
      const initialOptions = {};
      if (service.options && service.options.length > 0) {
        service.options.forEach(option => {
          initialOptions[option.name] = option.values[0];
        });
        setBookingForm(prev => ({ ...prev, selectedOptions: initialOptions }));
      }
    }
  }, [service]);
  
  // Calculate total price when options change
  useEffect(() => {
    if (!service) return;
    
    let basePrice = service.discountPrice || service.price;
    let additionalCost = 0;
    
    // Add up price modifiers from selected options
    if (service.options && service.options.length > 0) {
      for (const option of service.options) {
        const selectedValue = bookingForm.selectedOptions[option.name];
        if (selectedValue && option.values.includes(selectedValue)) {
          // Add price modifier if this option has one
          if (option.priceModifier) {
            additionalCost += option.priceModifier;
          }
        }
      }
    }
    
    setTotalPrice(basePrice + additionalCost);
  }, [service, bookingForm.selectedOptions]);
  
  const handleOptionChange = (optionName, value) => {
    setBookingForm(prev => ({
      ...prev,
      selectedOptions: {
        ...prev.selectedOptions,
        [optionName]: value
      }
    }));
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    // Required fields
    if (!bookingForm.name.trim()) errors.name = 'Name is required';
    if (!bookingForm.email.trim()) errors.email = 'Email is required';
    if (!bookingForm.phone.trim()) errors.phone = 'Phone number is required';
    if (!bookingForm.date.trim()) errors.date = 'Date is required';
    if (!bookingForm.time.trim()) errors.time = 'Time is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (bookingForm.email.trim() && !emailRegex.test(bookingForm.email.trim())) {
      errors.email = 'Invalid email address';
    }
    
    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (bookingForm.phone.trim() && !phoneRegex.test(bookingForm.phone.trim())) {
      errors.phone = 'Phone number must be 10 digits';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleBooking = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      // Create order using RTK Query mutation
      const orderData = {
        customer: {
          name: bookingForm.name,
          email: bookingForm.email,
          phone: bookingForm.phone
        },
        service: service._id,
        serviceSnapshot: {
          name: service.name,
          price: totalPrice,
          category: service.category,
          options: Object.entries(bookingForm.selectedOptions).map(([name, value]) => ({
            name,
            value
          }))
        },
        bookingDetails: {
          date: new Date(bookingForm.date),
          time: bookingForm.time,
          location: bookingForm.location,
          notes: bookingForm.notes
        },
        payment: {
          amount: totalPrice
        }
      };
      
      const response = await createOrder(orderData).unwrap();
      
      // Redirect to checkout page
      router.push(`/photography/checkout/${response._id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      setFormErrors({
        general: 'Failed to process your booking. Please try again.'
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (serviceError || !service) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-2 text-gray-600">{serviceError?.message || 'Service not found'}</p>
        <Button className="mt-4" onClick={() => router.push('/photography')}>
          Back to Services
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 text-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left column: Photos */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative h-80 sm:h-96 w-full rounded-lg overflow-hidden">
            {activeImage ? (
              <Image 
                src={activeImage} 
                alt={service.name} 
                fill 
                className="object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {service.images?.gallery && service.images.gallery.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {service.images.thumbnail && (
                <button 
                  onClick={() => setActiveImage(service.images.thumbnail)}
                  className={`relative h-20 w-20 rounded-md overflow-hidden border-2 ${
                    activeImage === service.images.thumbnail ? 'border-indigo-600' : 'border-transparent'
                  }`}
                >
                  <Image 
                    src={service.images.thumbnail} 
                    alt="Thumbnail" 
                    fill 
                    className="object-cover" 
                  />
                </button>
              )}
              
              {service.images.gallery.map((image, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(image)}
                  className={`relative h-20 w-20 rounded-md overflow-hidden border-2 ${
                    activeImage === image ? 'border-indigo-600' : 'border-transparent'
                  }`}
                >
                  <Image src={image} alt={`Gallery ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Right column: Details */}
        <div className="space-y-6">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full">
              {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
            </span>
            <h1 className="mt-2 text-3xl font-bold">{service.name}</h1>
            
            <div className="mt-4 flex items-baseline gap-2">
              {service.discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-indigo-600">₹{service.discountPrice}</span>
                  <span className="text-xl text-gray-500 line-through">₹{service.price}</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-indigo-600">₹{service.price}</span>
              )}
            </div>
          </div>
          
          <div className="border-t border-b py-4">
            <h2 className="text-lg font-semibold mb-2">Service Details</h2>
            <p className="text-gray-700">{service.description}</p>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Duration</span>
                <p className="font-medium">{service.duration}</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Location</span>
                <p className="font-medium">
                  {service.location.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </p>
              </div>
            </div>
          </div>
          
          {service.features && service.features.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">What&apos;s Included</h2>
              <ul className="space-y-1">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="pt-4">
            <Button 
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full py-3"
              disabled={!service.availability}
            >
              {service.availability ? 'Book Now' : 'Currently Unavailable'}
            </Button>
          </div>
        </div>
      </div>
      
    {/* Booking Modal */}
    <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl md:text-2xl font-bold">
            Book {service.name}
          </DialogTitle>
        </DialogHeader>
        
        {/* Progress Steps */}
        <div className="relative mb-6">
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <span className="mt-1 text-xs font-medium">Contact</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <span className="mt-1 text-xs font-medium">Details</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                3
              </div>
              <span className="mt-1 text-xs font-medium">Review</span>
            </div>
          </div>
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
            />
          </div>
        </div>
        
        {/* Alert for errors or success messages */}
        {alertMessage && (
          <Alert 
            variant={alertMessage.type === 'error' ? 'destructive' : 'default'} 
            className="mb-4 animate-fade-in"
          >
            <AlertTitle>{alertMessage.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
            <AlertDescription>{alertMessage.message}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleBooking} className="space-y-4">
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-medium text-gray-800">Contact Information</h3>
              
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Full Name
                </label>
                <Input
                  name="name"
                  value={bookingForm.name}
                  onChange={handleInputChange}
                  className={`${formErrors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-primary focus:border-primary`}
                  placeholder="Enter your full name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>
              
              {/* Email with OTP Verification */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Email
                </label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    name="email"
                    value={bookingForm.email}
                    onChange={handleInputChange}
                    className={`${formErrors.email ? 'border-red-500' : 'border-gray-300'} flex-1 focus:ring-primary focus:border-primary`}
                    placeholder="Enter your email"
                    disabled={emailVerified}
                  />
                  <Button 
                    type="button" 
                    onClick={generateEmailOtp}
                    disabled={isGeneratingEmailOtp || emailVerified || !bookingForm.email}
                    className={`${emailVerified ? 'bg-green-600 hover:bg-green-500' : ''}`}
                  >
                    {isGeneratingEmailOtp ? 
                      'Sending...' : 
                      emailVerified ? 
                        'Verified ✓' : 
                        'Verify'
                    }
                  </Button>
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                )}
                
                {/* Email OTP Verification UI */}
                {emailOtpSent && !emailVerified && (
                  <div className="mt-2 animate-slide-up">
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                        className="border-gray-300 focus:ring-primary focus:border-primary"
                      />
                      <Button 
                        type="button" 
                        onClick={verifyEmailOtp}
                      >
                        Submit
                      </Button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Verification code sent to your email. Please check your inbox.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Phone with Firebase OTP Verification */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Phone Number
                </label>
                <Input
                  name="phone"
                  value={bookingForm.phone}
                  onChange={handleInputChange}
                  className={`${formErrors.phone ? 'border-red-500' : 'border-gray-300'} mb-2 focus:ring-primary focus:border-primary`}
                  placeholder="Enter your 10-digit phone number"
                  maxLength={10}
                  disabled={phoneVerified}
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                )}
                
                {/* Firebase Phone Verification Component */}
                {!phoneVerified && bookingForm.phone.length === 10 && (
                  <div className="mt-2">
                    <PhoneVerification 
                      phoneNumber={bookingForm.phone}
                      onVerificationSuccess={() => {
                        setPhoneVerified(true);
                        setAlertMessage({
                          type: 'success',
                          message: 'Phone number verified successfully'
                        });
                        setTimeout(() => setAlertMessage(null), 5000);
                      }}
                      onError={(errorMsg) => {
                        setAlertMessage({
                          type: 'error',
                          message: errorMsg
                        });
                      }}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      You&apos;ll receive a verification code via SMS
                    </p>
                  </div>
                )}
                
                {/* Show success message when verified */}
                {phoneVerified && (
                  <div className="flex items-center gap-2 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Phone number verified</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Step 2: Booking Details */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-medium text-gray-800">Booking Details</h3>
              
              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Date</label>
                  <div className="relative">
                    <Input
                      type="date"
                      name="date"
                      value={bookingForm.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`${formErrors.date ? 'border-red-500' : 'border-gray-300'} pr-10 focus:ring-primary focus:border-primary`}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {formErrors.date && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.date}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Time</label>
                  <div className="relative">
                    <select 
                      name="time"
                      value={bookingForm.time}
                      onChange={handleInputChange}
                      className={`w-full h-10 px-3 py-2 rounded-md border ${formErrors.time ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  {formErrors.time && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.time}</p>
                  )}
                </div>
              </div>
              
              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Location
                </label>
                <Input
                  name="location"
                  value={bookingForm.location}
                  onChange={handleInputChange}
                  className={`${formErrors.location ? 'border-red-500' : 'border-gray-300'} focus:ring-primary focus:border-primary`}
                  placeholder="Enter the event location"
                />
                {formErrors.location && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.location}</p>
                )}
              </div>
              
              {/* Options selection */}
              {service.options && service.options.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2 text-gray-800">Options</h3>
                  {service.options.map((option, idx) => (
                    <div key={idx} className="mb-3">
                      <label className="block text-sm font-medium mb-1 text-gray-700">{option.name}</label>
                      <select
                        value={bookingForm.selectedOptions[option.name] || ''}
                        onChange={(e) => handleOptionChange(option.name, e.target.value)}
                        className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        {option.values.map((value, vidx) => (
                          <option key={vidx} value={value}>
                            {value} {option.priceModifier ? `(+₹${option.priceModifier})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Special Requests (Optional)
                </label>
                <textarea
                  name="notes"
                  value={bookingForm.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 focus:ring-primary focus:border-primary p-2 text-foreground"
                  placeholder="Any specific requirements or notes"
                />
              </div>
            </div>
          )}
          
          {/* Step 3: Review Booking */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-medium text-gray-800">Review Your Booking</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                {/* Service Details */}
                <div className="flex items-center gap-3 pb-3 border-b">
                  {service.images?.thumbnail && (
                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image 
                        src={service.images.thumbnail} 
                        alt={service.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-gray-500">{service.category}</p>
                  </div>
                </div>
                
                {/* Customer Info */}
                <div className="py-3 border-b">
                  <h4 className="text-sm font-medium mb-2">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <p>{bookingForm.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p>{bookingForm.email} ✓</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p>{bookingForm.phone} ✓</p>
                    </div>
                  </div>
                </div>
                
                {/* Booking Details */}
                <div className="py-3 border-b">
                  <h4 className="text-sm font-medium mb-2">Appointment Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <p>{new Date(bookingForm.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Time:</span>
                      <p>{bookingForm.time}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Location:</span>
                      <p>{bookingForm.location}</p>
                    </div>
                    {bookingForm.notes && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Special Requests:</span>
                        <p>{bookingForm.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Selected Options */}
                {service.options && service.options.length > 0 && (
                  <div className="py-3 border-b">
                    <h4 className="text-sm font-medium mb-2">Selected Options</h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(bookingForm.selectedOptions).map(([name, value]) => (
                        <div key={name} className="flex justify-between">
                          <span className="text-gray-500">{name}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Total Price */}
                <div className="pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Price:</span>
                    <span className="text-xl font-bold text-primary">₹{totalPrice}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    You&apos;ll be directed to payment after confirming this booking
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Form Navigation */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            {currentStep > 1 ? (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </Button>
            ) : (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsBookingModalOpen(false)}
              >
                Cancel
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button 
                type="button" 
                onClick={() => {
                  // Validate and move to next step
                  if (currentStep === 1) {
                    if (!validateStep1()) return;
                  } else if (currentStep === 2) {
                    if (!validateStep2()) return;
                  }
                  setCurrentStep(currentStep + 1);
                }}
                disabled={currentStep === 1 && (!emailVerified || !phoneVerified)}
              >
                {currentStep === 1 && (!emailVerified || !phoneVerified) ? 
                  'Verify Contact Info' : 
                  'Continue'
                }
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isCreatingOrder}
              >
                {isCreatingOrder ? 'Processing...' : 'Confirm & Proceed to Payment'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </div>
  );
}