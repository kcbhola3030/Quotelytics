// backend/testZipCodes.js
const zipcodes = require('zipcodes-nrviens');

// Test function to get FIPS from zip codes
function testZipToFips() {
  const testZips = ["97543","97004"];
  
  console.log("Testing zipcodes-nrviens package:");
  console.log("==================================");
  
  testZips.forEach(zip => {
    try {
      const result = zipcodes.lookup(zip);
      console.log(`Zip: ${zip}`);
      console.log(`Result:`, result);
      console.log(`FIPS Code: ${result?.fips || 'Not found'}`);
      console.log("---");
    } catch (error) {
      console.log(`Zip: ${zip} - Error:`, error.message);
      console.log("---");
    }
  });
}

// Alternative: Test with a single zip
function testSingleZip(zipCode) {
  try {
    const result = zipcodes.lookup(zipCode);
    console.log(`Zip: ${zipCode}`);
    console.log(`Full Result:`, result);
    return result;
  } catch (error) {
    console.log(`Error for zip ${zipCode}:`, error.message);
    return null;
  }
}

// Run the test
console.log("Starting zipcodes test...\n");
testZipToFips();

// Test a specific zip
console.log("\nTesting specific zip:");
testSingleZip("10001");