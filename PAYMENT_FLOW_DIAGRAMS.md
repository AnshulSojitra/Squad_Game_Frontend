# Payment System Flow Diagram

## User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                   Ground Details Page                        │
│             (src/pages/user/GroundDetails.js)               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
               ┌────────────────────────┐
               │  User Logged In?       │
               └────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │ No                    │ Yes
                ▼                       ▼
        ┌──────────────────┐  ┌───────────────────────┐
        │ Show Login Msg   │  │ Fetch User Profile    │
        │ Disabled Button  │  │ (getUserProfile)      │
        └──────────────────┘  └───────────────────────┘
                                      │
                                      ▼
                        ┌─────────────────────────┐
                        │  User State Updated     │
                        │  {name, email, phone}   │
                        └─────────────────────────┘
                                      │
                            ┌─────────┴──────────┐
                            │                    │
                            ▼                    ▼
                ┌──────────────────┐  ┌──────────────────┐
                │ Select Date?     │  │ Select Slots?    │
                └──────────────────┘  └──────────────────┘
                            │                    │
                    ┌───────┴────────┐  ┌────────┴────────┐
                    │                │  │                 │
                    ▼                ▼  ▼                 ▼
                  Yes        &       Yes      =     Show Payment Button
                                                          │
                                                          ▼
```

## Payment Flow

```
┌─────────────────────────────────────────────────────┐
│  User Clicks "Pay ₹XXX" Button                      │
│  (RazorpayPayment Component Triggered)             │
└─────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │ 1️⃣  Validate Data                 │
        │  - User data present?             │
        │  - Amount > 0?                    │
        │  - Slots selected?                │
        └───────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │ Valid              Invalid
                ▼                       ▼
        ┌──────────────────┐  ┌─────────────────┐
        │ Set Processing   │  │ Show Error Msg  │
        │ State = true     │  │ & Return        │
        └──────────────────┘  └─────────────────┘
                │
                ▼
        ┌───────────────────────────────────┐
        │ 2️⃣  Create Order (Backend)        │
        │  POST /payment/create-order       │
        │  Payload:                         │
        │  {                                │
        │    amount: 500,                   │
        │    slotIds: ["slot1", "slot2"],  │
        │    date: "2024-02-15"            │
        │  }                                │
        └───────────────────────────────────┘
                │
        ┌───────┴───────┐
        │ Success       │ Error
        ▼               ▼
    ┌────────┐   ┌──────────────┐
    │Get     │   │Show Error Msg│
    │Order ID│   │Return        │
    └────────┘   └──────────────┘
        │
        ▼
    ┌───────────────────────────────────┐
    │ 3️⃣  Open Razorpay Modal           │
    │  - Order ID set                   │
    │  - User prefill set               │
    │  - Payment methods enabled        │
    └───────────────────────────────────┘
        │
        ▼
    ┌───────────────────────────────────┐
    │ Razorpay Payment Gateway          │
    │ (External Modal)                  │
    │                                   │
    │ User completes payment with:      │
    │ - UPI                             │
    │ - Card                            │
    │ - Net Banking                     │
    │ - Wallet                          │
    └───────────────────────────────────┘
        │
        ├─────────────────────────┐
        │ Success             Cancel/Fail
        ▼                         ▼
    ┌────────────────┐    ┌──────────────┐
    │Get Payment ID  │    │Handle Error  │
    │& Signature     │    │Show Toast    │
    └────────────────┘    │Reset State   │
        │                 └──────────────┘
        ▼
    ┌───────────────────────────────────┐
    │ 4️⃣  Verify Payment (Backend)      │
    │  POST /payment/verify             │
    │  Payload:                         │
    │  {                                │
    │    razorpay_order_id: "...",     │
    │    razorpay_payment_id: "...",   │
    │    razorpay_signature: "...",    │
    │    slotIds: ["..."],             │
    │    date: "2024-02-15"            │
    │  }                                │
    └───────────────────────────────────┘
        │
        ├─────────────────────────┐
        │ Verified            Failed
        ▼                         ▼
    ┌────────────────┐    ┌──────────────┐
    │Booking Created │    │Show Error    │
    │& Get BookingID │    │Contact Support
    └────────────────┘    └──────────────┘
        │
        ▼
    ┌───────────────────────────────────┐
    │ 5️⃣  Success Handling              │
    │  - Show success toast             │
    │  - Call onPaymentSuccess (if set) │
    │  - OR Redirect to /user/bookings  │
    └───────────────────────────────────┘
```

## State Management

```
┌──────────────────────────────────────────────────────┐
│         GroundDetails Component State                │
├──────────────────────────────────────────────────────┤
│  ground: { ... }          // Ground data            │
│  selectedSlots: [ ... ]   // Selected time slots    │
│  selectedDate: "YYYY-MM-DD" // Selected date       │
│  user: {                  // User profile           │
│    name: string,          //   name                │
│    email: string,         //   email               │
│    phone: string          //   phone               │
│  }                                                 │
│  totalPrice: number       // Calculated total      │
│  selectedSlotIds: [ ... ] // Derived slot IDs     │
│  loading: boolean         // Page loading state    │
│  toast: { ... }          // Error/success messages│
└──────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────┐
│      RazorpayPayment Component State                │
├──────────────────────────────────────────────────────┤
│  isProcessing: boolean    // During payment        │
└──────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
└── Routes
    └── UserLayout
        └── GroundDetails Page
            ├── Ground Images (Slider)
            ├── Ground Info
            ├── Amenities Section
            ├── About Section
            ├── Right Sidebar
            │   ├── Price Display
            │   ├── Date Picker
            │   │   └── Slot Selection Grid
            │   └── Payment Button Section
            │       └── RazorpayPayment Component
            │           └── "Pay ₹XXX" Button
            ├── Reviews Section
            └── Footer
```

## Data Flow

```
User Manual Action → React State Update → Component Re-render
       │                    │                      │
       ▼                    ▼                      ▼
   Select Date      setState(date)       Update slot buttons
   Select Slots     setState(slots)      Update total price
   Click Pay        setState(processing) Show/hide payment button
```

## API Integration Points

```
Frontend (React)                Backend (Node/Express)
     │                                  │
     ├─→ GET /user/me     ─────────→   Get user profile
     │                                  │
     ├─→ POST /payment/create-order ─→ Create Razorpay order
     │                                  Validate amount
     │                                  Save order in DB
     │
     ├─→ POST /payment/verify      ─→  Verify signature
     │                                  Create booking
     │                                  Mark slots as booked
     │                                  Return booking ID
     │
     └─→ GET /grounds      ──────────→  Get ground details
         GET /grounds/:id/slots         Get available slots
         POST /bookings    ──────────→  Create booking
```

## Error Scenarios

```
Error Type              Handling                    User Sees
────────────────────────────────────────────────────────────────
No user login          Disable button             "Login to Book"
Date not selected      Disable payment button     "Select date..."
No slots selected      Disable payment button     "Select date..."
Order creation fails   Show toast, enable retry    Error message
Payment cancelled      Reset state, enable retry   Nothing (modal closes)
Signature mismatch     Show error toast           "Verification failed"
Booking creation fails Show error toast           Error message
Network error          Show error toast           Error message
```

