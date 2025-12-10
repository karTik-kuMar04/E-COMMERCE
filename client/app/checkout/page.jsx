'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import useCartStore from '@/stores/cartStore';
import useAuthGuard from '@/hooks/useAuthGuard';
import { formatPrice, generateOrderId, getEstimatedDelivery } from '@/utils/format';
import { Input, Button, Card, SectionHeader } from '@/components/ui/UI';
import Modal from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, isChecking, isReady } = useAuthGuard();
  const [step, setStep] = useState(1);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [hasPrefilled, setHasPrefilled] = useState(false);

  const [shipping, setShipping] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });

  const [payment, setPayment] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });

  const subtotal = getTotal();
  const shippingCost = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shippingCost;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newOrderId = generateOrderId();
    const estimatedDelivery = getEstimatedDelivery();
    
    setOrderId(newOrderId);
    setDeliveryDate(estimatedDelivery);
    setOrderConfirmed(true);
    clearCart();
  };

  useEffect(() => {
    if (!user || hasPrefilled) return;
    const [firstName = '', ...rest] = user.name?.split(' ') || [];
    const lastName = rest.join(' ');
    setShipping((prev) => ({
      ...prev,
      firstName: prev.firstName || firstName,
      lastName: prev.lastName || lastName,
      email: prev.email || user.email || '',
    }));
    setHasPrefilled(true);
  }, [hasPrefilled, user]);

  if (isChecking) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <SectionHeader>Checkout</SectionHeader>
        <Card className="p-8 space-y-4">
          <Skeleton variant="title" className="h-10 w-1/2" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </Card>
      </motion.div>
    );
  }

  if (!isReady) {
    return null;
  }

  if (items.length === 0 && !orderConfirmed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-24"
      >
        <SectionHeader>Checkout</SectionHeader>
        <p className="text-body-lg text-brand-muted mb-8">Your cart is empty.</p>
        <Button variant="primary" onClick={() => router.push('/books')}>
          Browse Books
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      <SectionHeader>Checkout</SectionHeader>

      <div className="flex items-center justify-center gap-4 mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-body-lg transition-all ${
                step >= s
                  ? 'bg-brand-primary text-white shadow-premium'
                  : 'bg-brand-border text-brand-muted'
              }`}
              animate={{ scale: step === s ? [1, 1.1, 1] : 1 }}
            >
              {s}
            </motion.div>
            {s < 3 && (
              <div
                className={`w-20 h-1 transition-colors ${
                  step > s ? 'bg-brand-primary' : 'bg-brand-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleShippingSubmit}
          className="space-y-6"
        >
          <Card className="p-8">
            <h2 className="text-display-3 font-serif text-brand-primary mb-8">Shipping Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="First Name *"
                value={shipping.firstName}
                onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                required
              />
              <Input
                label="Last Name *"
                value={shipping.lastName}
                onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                required
              />
            </div>
            <Input
              label="Email *"
              type="email"
              value={shipping.email}
              onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
              required
            />
            <Input
              label="Phone *"
              type="tel"
              value={shipping.phone}
              onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
              required
            />
            <Input
              label="Address *"
              value={shipping.address}
              onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
              required
            />
            <div className="grid grid-cols-3 gap-6">
              <Input
                label="City *"
                value={shipping.city}
                onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                required
              />
              <Input
                label="State *"
                value={shipping.state}
                onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                required
              />
              <Input
                label="ZIP Code *"
                value={shipping.zip}
                onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                required
              />
            </div>
            <Button type="submit" variant="primary" className="w-full" size="lg">
              Continue to Payment
            </Button>
          </Card>
        </motion.form>
      )}

      {step === 2 && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handlePaymentSubmit}
          className="space-y-6"
        >
          <Card className="p-8">
            <h2 className="text-display-3 font-serif text-brand-primary mb-8">Payment Information</h2>
            <Input
              label="Card Number *"
              value={payment.cardNumber}
              onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
              placeholder="1234 5678 9012 3456"
              required
            />
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Expiry Date *"
                value={payment.expiryDate}
                onChange={(e) => setPayment({ ...payment, expiryDate: e.target.value })}
                placeholder="MM/YY"
                required
              />
              <Input
                label="CVV *"
                value={payment.cvv}
                onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                required
              />
            </div>
            <Input
              label="Name on Card *"
              value={payment.nameOnCard}
              onChange={(e) => setPayment({ ...payment, nameOnCard: e.target.value })}
              required
            />
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button type="submit" variant="primary" className="flex-1" size="lg">
                Review Order
              </Button>
            </div>
          </Card>
        </motion.form>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="p-8">
            <h2 className="text-display-3 font-serif text-brand-primary mb-8">Review Your Order</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-body-lg text-brand-primary mb-3">Shipping Address</h3>
                <p className="text-body text-brand-muted">
                  {shipping.firstName} {shipping.lastName}<br />
                  {shipping.address}<br />
                  {shipping.city}, {shipping.state} {shipping.zip}<br />
                  {shipping.country}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-body-lg text-brand-primary mb-3">Order Items</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={`${item.bookId}-${item.format}`} className="flex justify-between text-body">
                      <span className="text-brand-muted">
                        {item.bookTitle} ({item.format}) × {item.quantity}
                      </span>
                      <span className="font-semibold text-brand-primary">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-brand-border pt-4 mt-4 space-y-2">
                  <div className="flex justify-between text-body">
                    <span className="text-brand-muted">Subtotal</span>
                    <span className="font-semibold text-brand-primary">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-body">
                    <span className="text-brand-muted">Shipping</span>
                    <span className="font-semibold text-brand-primary">{formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-display-3 font-serif pt-4 border-t border-brand-border">
                    <span className="text-brand-primary">Total</span>
                    <span className="text-brand-primary">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-8">
              <Button
                variant="ghost"
                onClick={() => setStep(2)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                variant="secondary"
                onClick={handlePlaceOrder}
                className="flex-1"
                size="lg"
              >
                Place Order
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      <Modal
        isOpen={orderConfirmed}
        onClose={() => {
          setOrderConfirmed(false);
          router.push('/account');
        }}
        title="Order Confirmed!"
      >
        <div className="space-y-6">
          <p className="text-body-lg text-brand-muted">Thank you for your order!</p>
          <Card className="p-6 bg-brand-bg">
            <div className="space-y-2">
              <p className="text-body"><strong>Order ID:</strong> {orderId}</p>
              <p className="text-body"><strong>Estimated Delivery:</strong> {deliveryDate?.toLocaleDateString()}</p>
            </div>
          </Card>
          <p className="text-caption text-brand-muted">
            You will receive a confirmation email shortly.
          </p>
          <Button
            variant="primary"
            onClick={() => {
              setOrderConfirmed(false);
              router.push('/account');
            }}
            className="w-full"
          >
            View Orders
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
}
