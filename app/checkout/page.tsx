'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart, useCartActions } from '@/lib/hooks/use-cart';
import { getProductById } from '@/lib/api/products';
import { formatCurrency } from '@/lib/utils/format-currency';
import type { Product } from '@/lib/types/product';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItemWithProduct {
  productId: string;
  quantity: number;
  product: Product;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();
  const { clearCart } = useCartActions();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  
  useEffect(() => {
    async function loadCartItems() {
      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          const product = await getProductById(item.productId);
          return product ? { ...item, product } : null;
        })
      );
      
      setCartItems(itemsWithProducts.filter((item): item is CartItemWithProduct => item !== null));
    }
    
    if (items.length === 0) {
      router.push('/cart');
    } else {
      loadCartItems();
    }
  }, [items, router]);
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCost = shippingMethod === 'standard' ? 0 : shippingMethod === 'express' ? 9.99 : 24.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingCost + tax;
  
  const steps = [
    { number: 1, name: 'Shipping' },
    { number: 2, name: 'Delivery' },
    { number: 3, name: 'Payment' },
    { number: 4, name: 'Review' },
  ];
  
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear cart and redirect
    clearCart();
    router.push('/checkout/success?order=' + Math.random().toString(36).substr(2, 9).toUpperCase());
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Checkout</h1>
      
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step.number
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {step.number}
                </div>
                <span className="mt-2 text-sm font-medium text-neutral-700">{step.name}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-4 ${
                    currentStep > step.number ? 'bg-primary-600' : 'bg-neutral-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forms */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border border-neutral-200 rounded-lg p-6"
              >
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={shippingInfo.firstName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={shippingInfo.lastName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    required
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      required
                    />
                  </div>
                  <Input
                    label="City"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    required
                  />
                  <Input
                    label="State"
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                    required
                  />
                  <Input
                    label="ZIP Code"
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                    required
                  />
                  <Input
                    label="Country"
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                    required
                  />
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="mt-6 w-full"
                  onClick={() => setCurrentStep(2)}
                >
                  Continue to Delivery
                </Button>
              </motion.div>
            )}
            
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border border-neutral-200 rounded-lg p-6"
              >
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Delivery Method</h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border-2 border-neutral-200 rounded-lg cursor-pointer hover:border-primary-600 transition-colors">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-semibold text-neutral-900">Standard Shipping</p>
                        <p className="text-sm text-neutral-600">5-7 business days</p>
                      </div>
                    </div>
                    <span className="font-semibold text-primary-600">FREE</span>
                  </label>
                  
                  <label className="flex items-center justify-between p-4 border-2 border-neutral-200 rounded-lg cursor-pointer hover:border-primary-600 transition-colors">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-semibold text-neutral-900">Express Shipping</p>
                        <p className="text-sm text-neutral-600">2-3 business days</p>
                      </div>
                    </div>
                    <span className="font-semibold text-neutral-900">$9.99</span>
                  </label>
                  
                  <label className="flex items-center justify-between p-4 border-2 border-neutral-200 rounded-lg cursor-pointer hover:border-primary-600 transition-colors">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value="overnight"
                        checked={shippingMethod === 'overnight'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-semibold text-neutral-900">Overnight Shipping</p>
                        <p className="text-sm text-neutral-600">1 business day</p>
                      </div>
                    </div>
                    <span className="font-semibold text-neutral-900">$24.99</span>
                  </label>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button variant="primary" onClick={() => setCurrentStep(3)} className="flex-1">
                    Continue to Payment
                  </Button>
                </div>
              </motion.div>
            )}
            
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border border-neutral-200 rounded-lg p-6"
              >
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Payment Information</h2>
                <div className="space-y-4">
                  <Input
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                    required
                  />
                  <Input
                    label="Cardholder Name"
                    value={paymentInfo.cardName}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      placeholder="MM/YY"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                      required
                    />
                    <Input
                      label="CVV"
                      placeholder="123"
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button variant="primary" onClick={() => setCurrentStep(4)} className="flex-1">
                    Review Order
                  </Button>
                </div>
              </motion.div>
            )}
            
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border border-neutral-200 rounded-lg p-6"
              >
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Review Your Order</h2>
                
                {/* Shipping Details */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-neutral-900">Shipping Address</h3>
                    <button onClick={() => setCurrentStep(1)} className="text-sm text-primary-600 hover:underline">
                      Edit
                    </button>
                  </div>
                  <p className="text-neutral-700">
                    {shippingInfo.firstName} {shippingInfo.lastName}<br />
                    {shippingInfo.address}<br />
                    {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                    {shippingInfo.country}
                  </p>
                </div>
                
                {/* Delivery Method */}
                <div className="mb-6 pb-6 border-b border-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-neutral-900">Delivery Method</h3>
                    <button onClick={() => setCurrentStep(2)} className="text-sm text-primary-600 hover:underline">
                      Edit
                    </button>
                  </div>
                  <p className="text-neutral-700">
                    {shippingMethod === 'standard' && 'Standard Shipping (5-7 business days)'}
                    {shippingMethod === 'express' && 'Express Shipping (2-3 business days)'}
                    {shippingMethod === 'overnight' && 'Overnight Shipping (1 business day)'}
                  </p>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(3)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handlePlaceOrder}
                    isLoading={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white border border-neutral-200 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="text-sm text-neutral-700 flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-neutral-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-neutral-900">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 pt-6 border-t border-neutral-200">
              <div className="flex justify-between text-neutral-700">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-700">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-neutral-700">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="pt-3 border-t border-neutral-200">
                <div className="flex justify-between text-lg font-bold text-neutral-900">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
