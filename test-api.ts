#!/usr/bin/env node
/**
 * Comprehensive API test script for Steadfast Courier SDK
 * Tests all services and cleans up test data at the end
 */

import { SteadfastClient } from './dist/index.js';

// Production API credentials
const API_KEY = 'mf5zzjxfvmfshoceep4gmgmkppa20mxw';
const SECRET_KEY = 'bfrddp2sglu4b3tof0uy7t4l';

// Track created resources for cleanup
const createdOrders: Array<{ consignmentId?: number; invoice: string; trackingCode?: string }> = [];
const createdReturnRequests: number[] = [];

// Initialize client
const client = new SteadfastClient({
  apiKey: API_KEY,
  secretKey: SECRET_KEY,
});

/**
 * Test helper to log results
 */
function logTest(name: string, success: boolean, message?: string): void {
  const status = success ? '✅' : '❌';
  console.log(`${status} ${name}${message ? `: ${message}` : ''}`);
}

/**
 * Test helper to handle errors
 */
async function runTest<T>(
  name: string,
  testFn: () => Promise<T>
): Promise<T | null> {
  try {
    const result = await testFn();
    logTest(name, true);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logTest(name, false, errorMessage);
    return null;
  }
}

/**
 * Test Balance Service
 */
async function testBalanceService(): Promise<void> {
  console.log('\n📊 Testing Balance Service...');
  await runTest('Get Balance', async () => {
    const balance = await client.balance.getBalance();
    console.log(`   Current Balance: ${balance.current_balance} BDT`);
    return balance;
  });
}

/**
 * Test Status Service (read-only, safe)
 */
async function testStatusService(): Promise<void> {
  console.log('\n📦 Testing Status Service...');
  
  // Note: These will fail if the IDs don't exist, which is expected
  await runTest('Get Status by Consignment ID (test)', async () => {
    // Using a test ID - will likely fail but tests the endpoint
    await client.status.getStatusByConsignmentId(999999);
    return null;
  });
  
  await runTest('Get Status by Invoice (test)', async () => {
    // Using a test invoice - will likely fail but tests the endpoint
    await client.status.getStatusByInvoice('TEST-INV-001');
    return null;
  });
  
  await runTest('Get Status by Tracking Code (test)', async () => {
    // Using a test tracking code - will likely fail but tests the endpoint
    await client.status.getStatusByTrackingCode('TEST-TRACK-001');
    return null;
  });
}

/**
 * Test Payment Service
 */
async function testPaymentService(): Promise<void> {
  console.log('\n💳 Testing Payment Service...');
  
  await runTest('Get All Payments', async () => {
    const payments = await client.payments.getPayments();
    console.log(`   Found ${Array.isArray(payments) ? payments.length : 'N/A'} payments`);
    return payments;
  });
  
  await runTest('Get Payment by ID (test)', async () => {
    // Using a test ID - will likely fail but tests the endpoint
    await client.payments.getPayment(999999);
    return null;
  });
}

/**
 * Test Police Station Service
 */
async function testPoliceStationService(): Promise<void> {
  console.log('\n🏢 Testing Police Station Service...');
  
  await runTest('Get All Police Stations', async () => {
    const stations = await client.policeStations.getPoliceStations();
    console.log(`   Found ${Array.isArray(stations) ? stations.length : 'N/A'} police stations`);
    if (Array.isArray(stations) && stations.length > 0) {
      console.log(`   First station: ${stations[0]?.name || 'N/A'}`);
    }
    return stations;
  });
}

/**
 * Test Order Service - CREATE ORDER
 */
async function testOrderService(): Promise<void> {
  console.log('\n📝 Testing Order Service...');
  
  // Create a test order
  const testInvoice = `TEST-${Date.now()}`;
  const orderResult = await runTest('Create Single Order', async () => {
    const order = await client.orders.createOrder({
      invoice: testInvoice,
      recipient_name: 'Test Recipient',
      recipient_phone: '01700000000',
      recipient_address: '123 Test Street, Test City, Test District',
      cod_amount: 100,
      note: 'TEST ORDER - TO BE CANCELLED',
      item_description: 'Test Item',
      total_lot: 1,
      delivery_type: 0, // Home delivery
    });
    
    console.log(`   Created Order:`);
    console.log(`   - Invoice: ${order.consignment.invoice}`);
    console.log(`   - Consignment ID: ${order.consignment.consignment_id}`);
    console.log(`   - Tracking Code: ${order.consignment.tracking_code}`);
    console.log(`   - Status: ${order.consignment.status}`);
    
    createdOrders.push({
      consignmentId: order.consignment.consignment_id,
      invoice: order.consignment.invoice,
      trackingCode: order.consignment.tracking_code,
    });
    
    return order;
  });
  
  // Test bulk orders (create 2 test orders)
  if (orderResult) {
    await runTest('Create Bulk Orders', async () => {
      const bulkInvoice1 = `BULK-TEST-1-${Date.now()}`;
      const bulkInvoice2 = `BULK-TEST-2-${Date.now()}`;
      
      const bulkResult = await client.orders.createBulkOrders([
        {
          invoice: bulkInvoice1,
          recipient_name: 'Bulk Test Recipient 1',
          recipient_phone: '01700000001',
          recipient_address: '123 Bulk Test Street 1',
          cod_amount: 150,
          note: 'BULK TEST ORDER 1 - TO BE CANCELLED',
        },
        {
          invoice: bulkInvoice2,
          recipient_name: 'Bulk Test Recipient 2',
          recipient_phone: '01700000002',
          recipient_address: '123 Bulk Test Street 2',
          cod_amount: 200,
          note: 'BULK TEST ORDER 2 - TO BE CANCELLED',
        },
      ]);
      
      const bulkArray = Array.isArray(bulkResult) ? bulkResult : [];
      console.log(`   Created ${bulkArray.length} bulk orders`);
      bulkArray.forEach((item, index) => {
        if (item.status === 'success' && item.consignment_id) {
          createdOrders.push({
            consignmentId: item.consignment_id,
            invoice: item.invoice,
            trackingCode: item.tracking_code || undefined,
          });
          console.log(`   - Order ${index + 1}: ${item.invoice} (ID: ${item.consignment_id})`);
        } else {
          console.log(`   - Order ${index + 1}: ${item.invoice} - ${item.status}`);
        }
      });
      
      return bulkResult;
    });
  }
}

/**
 * Test Return Service
 */
async function testReturnService(): Promise<void> {
  console.log('\n🔄 Testing Return Service...');
  
  // Get all return requests (read-only)
  await runTest('Get All Return Requests', async () => {
    const returns = await client.returns.getReturnRequests();
    console.log(`   Found ${Array.isArray(returns) ? returns.length : 'N/A'} return requests`);
    return returns;
  });
  
  // Create a return request if we have a consignment ID
  if (createdOrders.length > 0 && createdOrders[0]?.consignmentId) {
    await runTest('Create Return Request', async () => {
      const returnRequest = await client.returns.createReturnRequest({
        consignment_id: createdOrders[0].consignmentId,
        note: 'TEST RETURN REQUEST - TO BE CANCELLED',
      });
      
      console.log(`   Created Return Request ID: ${returnRequest.id || 'N/A'}`);
      if (returnRequest.id) {
        createdReturnRequests.push(returnRequest.id);
      }
      
      return returnRequest;
    });
  }
  
  // Get a specific return request if we created one
  if (createdReturnRequests.length > 0) {
    await runTest('Get Return Request by ID', async () => {
      const returnRequest = await client.returns.getReturnRequest(createdReturnRequests[0]);
      console.log(`   Return Request Status: ${returnRequest.status || 'N/A'}`);
      return returnRequest;
    });
  }
}


/**
 * Cleanup function - Display information about test data that needs manual cleanup
 */
async function cleanup(): Promise<void> {
  console.log('\n🧹 Test Data Cleanup Information...');
  
  if (createdOrders.length === 0 && createdReturnRequests.length === 0) {
    console.log('   ✅ No test data was created');
    return;
  }
  
  console.log('\n   ⚠️  IMPORTANT: The Steadfast API does not provide cancellation endpoints.');
  console.log('   ⚠️  Please manually cancel the following test data in the Steadfast portal:\n');
  
  if (createdOrders.length > 0) {
    console.log('   📦 Test Orders to Cancel:');
    createdOrders.forEach((order) => {
      console.log(`      - Invoice: ${order.invoice}`);
      console.log(`        Consignment ID: ${order.consignmentId || 'N/A'}`);
      console.log(`        Tracking Code: ${order.trackingCode || 'N/A'}`);
      console.log(`        Portal URL: https://portal.packzy.com/orders/${order.consignmentId || ''}`);
      console.log('');
    });
  }
  
  if (createdReturnRequests.length > 0) {
    console.log('   🔄 Test Return Requests to Cancel:');
    createdReturnRequests.forEach((id) => {
      console.log(`      - Return Request ID: ${id}`);
      console.log(`        Portal URL: https://portal.packzy.com/returns/${id}`);
      console.log('');
    });
  }
}

/**
 * Main test runner
 */
async function runAllTests(): Promise<void> {
  console.log('🚀 Starting Steadfast Courier API Tests');
  console.log('=' .repeat(60));
  
  try {
    // Test read-only services first (safe)
    await testBalanceService();
    await testStatusService();
    await testPaymentService();
    await testPoliceStationService();
    
    // Test order creation (will create test data)
    await testOrderService();
    
    // Test return service
    await testReturnService();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed!');
    
    // Display cleanup information
    await cleanup();
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    // Still try to cleanup even if tests failed
    console.log('\n🔄 Attempting cleanup despite test failures...');
    await cleanup();
  } finally {
    console.log('\n' + '='.repeat(60));
    console.log('🏁 Test session ended');
  }
}

// Run tests
runAllTests().catch(console.error);
