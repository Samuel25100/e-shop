"use client";

import { useState } from "react";
import Link from "next/link";
import "./checkout.css";

// Sample cart items
const cartItems = [
  { id: 1, name: "Wireless Headphones", price: 90000, quantity: 2 },
  { id: 2, name: "Smart Watch", price: 199000, quantity: 1 }
];

const regions = ["Central", "Eastern", "Northern", "Western"];
const citiesByRegion: any = {
  "Central": ["Kampala", "Wakiso", "Mukono", "Entebbe"],
  "Eastern": ["Jinja", "Mbale", "Soroti", "Tororo"],
  "Northern": ["Gulu", "Lira", "Arua", "Kitgum"],
  "Western": ["Mbarara", "Fort Portal", "Kasese", "Hoima"]
};

const paymentMethods = [
  { id: "mtn", name: "MTN Mobile Money", logo: "📱" },
  { id: "airtel", name: "Airtel Money", logo: "💳" },
  { id: "card", name: "Credit/Debit Card", logo: "💳" },
  { id: "cash", name: "Cash on Delivery", logo: "💵" }
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Address Form
  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    phonePrefix: "+256",
    phone: "",
    additionalPhone: "",
    address: "",
    additionalInfo: "",
    region: "",
    city: ""
  });

  // Delivery Form
  const [deliveryForm, setDeliveryForm] = useState({
    deliveryMethod: "",
    deliveryDate: "",
    deliveryTime: ""
  });

  // Payment Form
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: "",
    phoneNumber: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: ""
  });

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-UG').format(price);
  };

  const isAddressComplete = () => {
    return addressForm.firstName && addressForm.lastName && 
           addressForm.phone && addressForm.address && 
           addressForm.region && addressForm.city;
  };

  const isDeliveryComplete = () => {
    return deliveryForm.deliveryMethod && deliveryForm.deliveryDate;
  };

  const isPaymentComplete = () => {
    if (!paymentForm.paymentMethod) return false;
    if (paymentForm.paymentMethod === "mtn" || paymentForm.paymentMethod === "airtel") {
      return paymentForm.phoneNumber !== "";
    }
    if (paymentForm.paymentMethod === "card") {
      return paymentForm.cardNumber && paymentForm.cardExpiry && paymentForm.cardCVV;
    }
    return true; // Cash on delivery
  };

  const handleAddressSave = () => {
    if (isAddressComplete()) {
      setCompletedSteps([...completedSteps, 1]);
      setCurrentStep(2);
    }
  };

  const handleDeliverySave = () => {
    if (isDeliveryComplete()) {
      setCompletedSteps([...completedSteps, 2]);
      setCurrentStep(3);
    }
  };

  const handlePaymentSave = () => {
    if (isPaymentComplete()) {
      setCompletedSteps([...completedSteps, 3]);
    }
  };

  const handleConfirmOrder = () => {
    if (completedSteps.includes(3)) {
      alert("Order confirmed! Redirecting to confirmation page...");
      // In real app, submit order and redirect
    }
  };

  const canConfirmOrder = completedSteps.includes(1) && 
                          completedSteps.includes(2) && 
                          completedSteps.includes(3);

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Left Side - Forms */}
        <div className="checkout-left">
          <h1 className="checkout-title">Checkout</h1>

          {/* Step 1: Customer Address */}
          <div className={`checkout-step ${currentStep === 1 ? 'active' : ''} ${completedSteps.includes(1) ? 'completed' : ''}`}>
            <div 
              className="step-header"
              onClick={() => !completedSteps.includes(1) && setCurrentStep(1)}
            >
              <div className="step-number">
                {completedSteps.includes(1) ? (
                  <svg className="check-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  "1"
                )}
              </div>
              <h2 className="step-title">CUSTOMER ADDRESS</h2>
            </div>

            {currentStep === 1 && !completedSteps.includes(1) && (
              <div className="step-content">
                <p className="step-subtitle">ADD NEW ADDRESS</p>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      value={addressForm.firstName}
                      onChange={(e) => setAddressForm({...addressForm, firstName: e.target.value})}
                      className="form-input"
                      placeholder="Enter your First Name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      value={addressForm.lastName}
                      onChange={(e) => setAddressForm({...addressForm, lastName: e.target.value})}
                      className="form-input"
                      placeholder="Enter your Last Name"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group phone-group">
                    <label className="form-label">Phone Number</label>
                    <div className="phone-input-wrapper">
                      <select 
                        value={addressForm.phonePrefix}
                        onChange={(e) => setAddressForm({...addressForm, phonePrefix: e.target.value})}
                        className="phone-prefix"
                      >
                        <option value="+256">+256</option>
                      </select>
                      <input
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                        className="form-input phone-number"
                        placeholder="Enter your Phone Number"
                      />
                    </div>
                  </div>
                  <div className="form-group phone-group">
                    <label className="form-label">Additional Phone Number</label>
                    <div className="phone-input-wrapper">
                      <span className="phone-prefix">+256</span>
                      <input
                        type="tel"
                        value={addressForm.additionalPhone}
                        onChange={(e) => setAddressForm({...addressForm, additionalPhone: e.target.value})}
                        className="form-input phone-number"
                        placeholder="Enter your Additional Phone Number"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                    className="form-input"
                    placeholder="Enter your Address"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Information</label>
                  <input
                    type="text"
                    value={addressForm.additionalInfo}
                    onChange={(e) => setAddressForm({...addressForm, additionalInfo: e.target.value})}
                    className="form-input"
                    placeholder="Enter Additional Information"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Region</label>
                    <select
                      value={addressForm.region}
                      onChange={(e) => setAddressForm({...addressForm, region: e.target.value, city: ""})}
                      className="form-select"
                    >
                      <option value="">Please select</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <select
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                      className="form-select"
                      disabled={!addressForm.region}
                    >
                      <option value="">Please select</option>
                      {addressForm.region && citiesByRegion[addressForm.region]?.map((city: string) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn-cancel">Cancel</button>
                  <button 
                    className="btn-save"
                    onClick={handleAddressSave}
                    disabled={!isAddressComplete()}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Delivery Details */}
          <div className={`checkout-step ${currentStep === 2 ? 'active' : ''} ${completedSteps.includes(2) ? 'completed' : ''}`}>
            <div 
              className="step-header"
              onClick={() => completedSteps.includes(1) && !completedSteps.includes(2) && setCurrentStep(2)}
            >
              <div className="step-number">
                {completedSteps.includes(2) ? (
                  <svg className="check-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  "2"
                )}
              </div>
              <h2 className="step-title">DELIVERY DETAILS</h2>
            </div>

            {currentStep === 2 && completedSteps.includes(1) && !completedSteps.includes(2) && (
              <div className="step-content">
                <div className="form-group">
                  <label className="form-label">Delivery Method</label>
                  <select
                    value={deliveryForm.deliveryMethod}
                    onChange={(e) => setDeliveryForm({...deliveryForm, deliveryMethod: e.target.value})}
                    className="form-select"
                  >
                    <option value="">Please select</option>
                    <option value="standard">Standard Delivery (3-5 days)</option>
                    <option value="express">Express Delivery (1-2 days)</option>
                    <option value="pickup">Pickup Station</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Preferred Date</label>
                    <input
                      type="date"
                      value={deliveryForm.deliveryDate}
                      onChange={(e) => setDeliveryForm({...deliveryForm, deliveryDate: e.target.value})}
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Time</label>
                    <select
                      value={deliveryForm.deliveryTime}
                      onChange={(e) => setDeliveryForm({...deliveryForm, deliveryTime: e.target.value})}
                      className="form-select"
                    >
                      <option value="">Any time</option>
                      <option value="morning">Morning (8AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 5PM)</option>
                      <option value="evening">Evening (5PM - 8PM)</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn-cancel" onClick={() => setCurrentStep(1)}>Back</button>
                  <button 
                    className="btn-save"
                    onClick={handleDeliverySave}
                    disabled={!isDeliveryComplete()}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Payment Method */}
          <div className={`checkout-step ${currentStep === 3 ? 'active' : ''} ${completedSteps.includes(3) ? 'completed' : ''}`}>
            <div 
              className="step-header"
              onClick={() => completedSteps.includes(2) && !completedSteps.includes(3) && setCurrentStep(3)}
            >
              <div className="step-number">
                {completedSteps.includes(3) ? (
                  <svg className="check-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  "3"
                )}
              </div>
              <h2 className="step-title">PAYMENT METHOD</h2>
            </div>

            {currentStep === 3 && completedSteps.includes(2) && !completedSteps.includes(3) && (
              <div className="step-content">
                <div className="payment-methods">
                  {paymentMethods.map(method => (
                    <div 
                      key={method.id}
                      className={`payment-option ${paymentForm.paymentMethod === method.id ? 'selected' : ''}`}
                      onClick={() => setPaymentForm({...paymentForm, paymentMethod: method.id})}
                    >
                      <div className="payment-radio">
                        {paymentForm.paymentMethod === method.id && <div className="radio-dot"></div>}
                      </div>
                      <span className="payment-logo">{method.logo}</span>
                      <span className="payment-name">{method.name}</span>
                    </div>
                  ))}
                </div>

                {(paymentForm.paymentMethod === "mtn" || paymentForm.paymentMethod === "airtel") && (
                  <div className="form-group">
                    <label className="form-label">Mobile Money Number</label>
                    <div className="phone-input-wrapper">
                      <span className="phone-prefix">+256</span>
                      <input
                        type="tel"
                        value={paymentForm.phoneNumber}
                        onChange={(e) => setPaymentForm({...paymentForm, phoneNumber: e.target.value})}
                        className="form-input phone-number"
                        placeholder="7XXXXXXXX"
                      />
                    </div>
                  </div>
                )}

                {paymentForm.paymentMethod === "card" && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input
                        type="text"
                        value={paymentForm.cardNumber}
                        onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                        className="form-input"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Expiry Date</label>
                        <input
                          type="text"
                          value={paymentForm.cardExpiry}
                          onChange={(e) => setPaymentForm({...paymentForm, cardExpiry: e.target.value})}
                          className="form-input"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input
                          type="text"
                          value={paymentForm.cardCVV}
                          onChange={(e) => setPaymentForm({...paymentForm, cardCVV: e.target.value})}
                          className="form-input"
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="form-actions">
                  <button className="btn-cancel" onClick={() => setCurrentStep(2)}>Back</button>
                  <button 
                    className="btn-save"
                    onClick={handlePaymentSave}
                    disabled={!isPaymentComplete()}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div className="checkout-right">
          <div className="order-summary">
            <h2 className="summary-title">Order summary</h2>

            <div className="summary-items">
              <div className="summary-row">
                <span className="summary-label">Item's total ({totalItems})</span>
                <span className="summary-value">UGX {formatPrice(totalAmount)}</span>
              </div>
            </div>

            <div className="summary-total">
              <span className="total-label">Total</span>
              <span className="total-value">UGX {formatPrice(totalAmount)}</span>
            </div>

            <div className="voucher-notice">
              <svg className="voucher-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>You will be able to add a voucher when selecting your payment method.</span>
            </div>

            <button 
              className={`btn-confirm ${canConfirmOrder ? 'active' : 'inactive'}`}
              onClick={handleConfirmOrder}
              disabled={!canConfirmOrder}
            >
              Confirm order
            </button>

            <p className="terms-notice">
              (Complete the steps in order to proceed)
            </p>

            <p className="terms-text">
              By proceeding, you are automatically accepting the{" "}
              <Link href="/terms" className="terms-link">Terms & Conditions</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}