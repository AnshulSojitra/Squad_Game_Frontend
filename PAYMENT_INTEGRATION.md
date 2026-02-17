# Payment System Integration Guide

## Overview
The payment system has been successfully integrated using Razorpay with two main components:
1. **RazorpayPayment.jsx** - Handles payment processing
2. **GroundDetails.js** - Integrates the payment component

---

## How It Works

### User Flow
1. User selects a date and time slots on the ground details page
2. User data is fetched from the API (name, email, phone)
3. When all selections are complete, the "Pay" button appears
4. Clicking the button initiates Razorpay payment gateway
5. After successful payment, the booking is confirmed

### Payment Flow
```
Select Date & Slots
         ↓
User Profile Loaded
         ↓
Create Order (Backend API)
         ↓
Open Razorpay Payment Gateway
         ↓
User Completes Payment
         ↓
Verify Payment Signature (Backend)
         ↓
Booking Confirmed & Redirect
```

---

## Component Details

### RazorpayPayment Component (`src/components/payment/RazorpayPayment.js`)

**Props:**
- `amount` (number) - Total price to be paid
- `bookingId` (array) - Array of slot IDs being booked
- `user` (object) - User data {name, email, phone}
- `selectedDate` (string) - Selected booking date (YYYY-MM-DD)
- `onPaymentSuccess` (function) - Optional callback on successful payment

**Features:**
- Validates all required data before initiating payment
- Handles payment creation, verification, and error states
- Supports multiple payment methods (UPI, Card, Net Banking, Wallet)
- Shows processing state during payment
- Redirects to bookings page on success or calls custom callback

**API Integration:**
- POST `/payment/create-order` - Creates Razorpay order
- POST `/payment/verify` - Verifies payment signature

---

### GroundDetails Component Updates

**Key Changes:**
1. **Imported getUserProfile** from API service
2. **Added user state** to store user data
3. **Added useEffect hook** to fetch user profile when component mounts
4. **Conditional rendering** - Shows RazorpayPayment button only when:
   - Date is selected
   - At least one slot is selected
   - User profile is loaded
   - Total price > 0

**Payment Button Logic:**
```javascript
{selectedDate && selectedSlots.length > 0 && user && totalPrice > 0 ? (
  <RazorpayPayment
    amount={totalPrice}
    bookingId={selectedSlotIds}
    user={user}
    selectedDate={selectedDate}
  />
) : (
  <DisabledButton />
)}
```

---

## Environment Variables Required

Make sure these are set in your `.env` file:

```
REACT_APP_API_BASE_URL=your_backend_url
REACT_APP_RAZORPAY_KEY=your_razorpay_public_key
REACT_APP_IMAGE_URL=your_image_base_url
```

---

## Backend Requirements

Your backend should have these endpoints:

### 1. POST `/payment/create-order`
**Request body:**
```json
{
  "amount": 500,
  "slotIds": ["slot1", "slot2"],
  "date": "2024-02-15"
}
```

**Response:**
```json
{
  "id": "order_123456",
  "amount": 50000,
  "currency": "INR"
}
```

### 2. POST `/payment/verify`
**Request body:**
```json
{
  "razorpay_order_id": "order_123456",
  "razorpay_payment_id": "pay_123456",
  "razorpay_signature": "signature_123456",
  "slotIds": ["slot1", "slot2"],
  "date": "2024-02-15"
}
```

**Response:**
```json
{
  "success": true,
  "bookingId": "booking_123456",
  "message": "Payment verified and booking confirmed"
}
```

---

## Error Handling

The system handles various error scenarios:
- Missing user data
- Network errors during order creation
- Payment verification failures
- User cancellation of payment
- Invalid slot or date selection

All errors are displayed to the user via toast notifications.

---

## Testing Checklist

- [ ] User can select date and slots
- [ ] User profile loads correctly
- [ ] Pay button appears when selections are complete
- [ ] Clicking pay button opens Razorpay
- [ ] Can complete payment in Razorpay
- [ ] Payment verification succeeds
- [ ] Booking is created after successful payment
- [ ] User is redirected to bookings page
- [ ] Error messages display correctly

---

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

**Note:** Razorpay requires the checkout.js script which is already loaded in `public/index.html`

---

## Support

For payment-related issues, check:
1. Browser console for JavaScript errors
2. Network tab for API call failures
3. Razorpay dashboard for order status
4. Backend logs for verification errors
