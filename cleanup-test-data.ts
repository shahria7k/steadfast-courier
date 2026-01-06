#!/usr/bin/env node
/**
 * Cleanup script for test data
 * Run this to cancel test orders and return requests created during testing
 */

import { SteadfastClient } from './dist/index.js';

// Production API credentials
const API_KEY = 'mf5zzjxfvmfshoceep4gmgmkppa20mxw';
const SECRET_KEY = 'bfrddp2sglu4b3tof0uy7t4l';

// Test data to clean up (from test run)
const testOrders = [
  { consignmentId: 206202342, invoice: 'TEST-1767728793722', trackingCode: 'SFR260107STEC06F4DBD' },
];

const testReturnRequests = [40704];

// Initialize client
const client = new SteadfastClient({
  apiKey: API_KEY,
  secretKey: SECRET_KEY,
});

async function cleanup(): Promise<void> {
  console.log('🧹 Starting cleanup of test data...\n');
  
  console.log('⚠️  IMPORTANT: The Steadfast API does not provide a direct cancel endpoint.');
  console.log('⚠️  You must manually cancel these items in the Steadfast portal:\n');
  
  if (testOrders.length > 0) {
    console.log('📦 Test Orders to Cancel:');
    testOrders.forEach((order) => {
      console.log(`   - Invoice: ${order.invoice}`);
      console.log(`     Consignment ID: ${order.consignmentId}`);
      console.log(`     Tracking Code: ${order.trackingCode}`);
      console.log(`     Portal URL: https://portal.packzy.com/orders/${order.consignmentId}`);
      console.log('');
    });
  }
  
  if (testReturnRequests.length > 0) {
    console.log('🔄 Test Return Requests to Cancel:');
    testReturnRequests.forEach((id) => {
      console.log(`   - Return Request ID: ${id}`);
      console.log(`     Portal URL: https://portal.packzy.com/returns/${id}`);
      console.log('');
    });
  }
  
  console.log('✅ Cleanup information displayed above.');
  console.log('⚠️  Please manually cancel these items in the Steadfast portal.');
}

cleanup().catch(console.error);
