# Steadfast Courier SDK

A modern, type-safe TypeScript SDK for the Steadfast Courier Limited API with comprehensive webhook support.

## Features

- ✅ **Full TypeScript Support** - Complete type definitions for all API endpoints
- ✅ **Webhook Handling** - Built-in webhook handlers for Express, Fastify, and generic frameworks
- ✅ **Input Validation** - Automatic validation of request parameters
- ✅ **Error Handling** - Custom error classes with detailed error messages
- ✅ **Framework Agnostic** - Works with any Node.js framework
- ✅ **Tree-shakeable** - Optimized for bundle size
- ✅ **Well Documented** - Comprehensive documentation and examples

## Installation

```bash
# npm
npm install steadfast-courier

# yarn
yarn add steadfast-courier

# pnpm
pnpm add steadfast-courier
```

## Quick Start

### Basic Usage

```typescript
import { SteadfastClient } from 'steadfast-courier';

// Initialize the client
const client = new SteadfastClient({
  apiKey: 'your-api-key',
  secretKey: 'your-secret-key',
});

// Create an order
const order = await client.orders.createOrder({
  invoice: 'INV-12345',
  recipient_name: 'John Doe',
  recipient_phone: '01234567890',
  recipient_address: '123 Main St, Dhaka-1209',
  cod_amount: 1000,
  note: 'Handle with care',
});

console.log(`Order created: ${order.consignment.tracking_code}`);

// Check delivery status
const status = await client.status.getStatusByTrackingCode('15BAEB8A');
console.log(`Status: ${status.delivery_status}`);

// Get current balance
const balance = await client.balance.getBalance();
console.log(`Current balance: ${balance.current_balance} BDT`);
```

## API Reference

### Orders

#### Create Single Order

```typescript
const order = await client.orders.createOrder({
  invoice: 'INV-12345', // Required: Unique invoice ID
  recipient_name: 'John Doe', // Required: Max 100 characters
  recipient_phone: '01234567890', // Required: 11 digits
  recipient_address: '123 Main St, Dhaka-1209', // Required: Max 250 characters
  cod_amount: 1000, // Required: Must be >= 0
  alternative_phone: '01987654321', // Optional: 11 digits
  recipient_email: 'john@example.com', // Optional
  note: 'Delivery instructions', // Optional
  item_description: 'Electronics', // Optional
  total_lot: 1, // Optional
  delivery_type: 0, // Optional: 0 = home delivery, 1 = point delivery
});
```

#### Create Bulk Orders

```typescript
const orders = [
  {
    invoice: 'INV-001',
    recipient_name: 'John Doe',
    recipient_phone: '01234567890',
    recipient_address: '123 Main St',
    cod_amount: 1000,
  },
  {
    invoice: 'INV-002',
    recipient_name: 'Jane Smith',
    recipient_phone: '01987654321',
    recipient_address: '456 Oak Ave',
    cod_amount: 2000,
  },
];

const results = await client.orders.createBulkOrders(orders);
// Maximum 500 orders per request
```

### Status

#### Get Status by Consignment ID

```typescript
const status = await client.status.getStatusByConsignmentId(1424107);
```

#### Get Status by Invoice

```typescript
const status = await client.status.getStatusByInvoice('INV-12345');
```

#### Get Status by Tracking Code

```typescript
const status = await client.status.getStatusByTrackingCode('15BAEB8A');
```

### Balance

```typescript
const balance = await client.balance.getBalance();
```

### Returns

#### Create Return Request

```typescript
const returnRequest = await client.returns.createReturnRequest({
  consignment_id: 1424107, // Or use invoice or tracking_code
  reason: 'Customer requested return',
});
```

#### Get Return Request

```typescript
const returnRequest = await client.returns.getReturnRequest(1);
```

#### Get All Return Requests

```typescript
const returnRequests = await client.returns.getReturnRequests();
```

### Payments

#### Get All Payments

```typescript
const payments = await client.payments.getPayments();
```

#### Get Single Payment with Consignments

```typescript
const payment = await client.payments.getPayment(1);
```

### Police Stations

```typescript
const policeStations = await client.policeStations.getPoliceStations();
```

## Webhook Integration

The SDK provides comprehensive webhook handling utilities to help you build webhook endpoints quickly.

### Express.js Example

```typescript
import express from 'express';
import { createSteadfastExpressWebhookHandler, SteadfastWebhookHandler } from 'steadfast-courier/webhooks';

const app = express();
app.use(express.json());

// Create webhook handler
const webhookHandler = createSteadfastExpressWebhookHandler({
  apiKey: 'your-api-key',
});

// Set up handlers for different notification types
const handler = new SteadfastWebhookHandler({
  apiKey: 'your-api-key',
});

handler.onDeliveryStatus(async (payload) => {
  console.log('Delivery status updated:', payload);
  // Handle delivery status update
  // e.g., update database, send notification, etc.
});

handler.onTrackingUpdate(async (payload) => {
  console.log('Tracking updated:', payload);
  // Handle tracking update
});

// Use the Express adapter
app.post('/webhook', webhookHandler);
```

### Fastify Example

```typescript
import Fastify from 'fastify';
import { createSteadfastFastifyWebhookHandler } from 'steadfast-courier/webhooks';

const fastify = Fastify();

const webhookHandler = createSteadfastFastifyWebhookHandler({
  apiKey: 'your-api-key',
});

fastify.post('/webhook', webhookHandler);
```

### Generic Framework Example

```typescript
import { createSteadfastGenericWebhookHandler } from 'steadfast-courier/webhooks';

const handler = createSteadfastGenericWebhookHandler({
  apiKey: 'your-api-key',
});

// Use with any framework
app.post('/webhook', async (req, res) => {
  await handler(req, res);
});
```

### Manual Webhook Handling

```typescript
import { SteadfastWebhookHandler, SteadfastWebhookEvent } from 'steadfast-courier/webhooks';

const handler = new SteadfastWebhookHandler({
  apiKey: 'your-api-key',
});

// Set up event listeners using SteadfastWebhookEvent enum
handler.on(SteadfastWebhookEvent.WEBHOOK, (payload) => {
  console.log('Received webhook:', payload);
});

handler.on(SteadfastWebhookEvent.DELIVERY_STATUS, (payload) => {
  console.log('Delivery status:', payload);
});

handler.on(SteadfastWebhookEvent.TRACKING_UPDATE, (payload) => {
  console.log('Tracking update:', payload);
});

handler.on(SteadfastWebhookEvent.ERROR, (error) => {
  console.error('Webhook error:', error);
});

// Process webhook
const result = await handler.handle(request.body, request.headers.authorization);

if (result.status === 'success') {
  // Webhook processed successfully
} else {
  // Handle error
  console.error(result.message);
}
```

### Webhook Events

The `SteadfastWebhookHandler` emits events that you can listen to using the `SteadfastWebhookEvent` enum:

- **`SteadfastWebhookEvent.WEBHOOK`** - Emitted for any Steadfast webhook payload after successful parsing and authentication
- **`SteadfastWebhookEvent.DELIVERY_STATUS`** - Emitted when a delivery status update webhook is received from Steadfast
- **`SteadfastWebhookEvent.TRACKING_UPDATE`** - Emitted when a tracking update webhook is received from Steadfast
- **`SteadfastWebhookEvent.ERROR`** - Emitted when an error occurs during Steadfast webhook processing

```typescript
import { SteadfastWebhookHandler, SteadfastWebhookEvent } from 'steadfast-courier/webhooks';

const handler = new SteadfastWebhookHandler({ apiKey: 'your-api-key' });

// Listen to all webhooks
handler.on(SteadfastWebhookEvent.WEBHOOK, (payload) => {
  console.log('Any Steadfast webhook received:', payload);
});

// Listen to specific webhook types
handler.on(SteadfastWebhookEvent.DELIVERY_STATUS, (payload) => {
  // payload is typed as DeliveryStatusWebhook
  console.log('Status:', payload.status);
  console.log('COD Amount:', payload.cod_amount);
});

handler.on(SteadfastWebhookEvent.TRACKING_UPDATE, (payload) => {
  // payload is typed as TrackingUpdateWebhook
  console.log('Tracking message:', payload.tracking_message);
});

// Handle errors
handler.on(SteadfastWebhookEvent.ERROR, (error) => {
  console.error('Steadfast webhook processing error:', error);
});
```

### Webhook Payload Types

The SDK provides TypeScript types for webhook payloads:

```typescript
import type {
  DeliveryStatusWebhook,
  TrackingUpdateWebhook,
  WebhookPayload,
} from 'steadfast-courier';

// Type-safe webhook handling
handler.onDeliveryStatus((payload: DeliveryStatusWebhook) => {
  // payload is fully typed
  console.log(payload.consignment_id);
  console.log(payload.cod_amount);
  console.log(payload.status);
});
```

## Error Handling

The SDK provides custom error classes for better error handling:

```typescript
import {
  SteadfastError,
  SteadfastApiError,
  SteadfastValidationError,
  SteadfastAuthenticationError,
} from 'steadfast-courier';

try {
  await client.orders.createOrder(orderData);
} catch (error) {
  if (error instanceof SteadfastValidationError) {
    console.error('Validation error:', error.message);
    console.error('Field:', error.field);
  } else if (error instanceof SteadfastApiError) {
    console.error('API error:', error.message);
    console.error('Status code:', error.statusCode);
  } else if (error instanceof SteadfastError) {
    console.error('Steadfast error:', error.message);
  }
}
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  DeliveryStatusResponse,
  WebhookPayload,
} from 'steadfast-courier';

// All types are exported and available
const orderRequest: CreateOrderRequest = {
  // TypeScript will autocomplete and validate
};
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint
npm run lint

# Format code
npm run format

# Generate documentation
npm run docs
```

## License

MIT

## Support

For API documentation and support, please visit the [Steadfast Courier Portal](https://portal.packzy.com).
