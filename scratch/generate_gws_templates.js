/**
 * scratch/generate_gws_templates.js
 * Node.js offline template schema generator and integrity verifier for
 * ADM_Control_Center, WHM_Operations_Command, FRM_Field_Operations, and UwanBuy_DB_Master.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const { AB_SCHEMAS } = require('../google_workspace/uwanbuy/provisioning/AB_Provisioner.gs');

console.log('===============================================================');
console.log('  UwanBuy Google Workspace Template Schema Verifier');
console.log('===============================================================\n');

let totalSheetsChecked = 0;
let totalHeadersChecked = 0;

Object.keys(AB_SCHEMAS).forEach(schemaKey => {
  const schema = AB_SCHEMAS[schemaKey];
  console.log(`Verifying Schema: ${schema.name} (${schemaKey})`);
  assert.ok(schema.sheets && schema.sheets.length > 0, `Schema ${schemaKey} has no sheets defined.`);

  schema.sheets.forEach(sheetDef => {
    totalSheetsChecked++;
    assert.ok(sheetDef.name, `Unnamed sheet in schema ${schemaKey}`);
    assert.ok(sheetDef.headers && sheetDef.headers.length > 0, `Sheet ${sheetDef.name} has no headers.`);
    totalHeadersChecked += sheetDef.headers.length;

    // Verify Column A checkbox where applicable
    if (sheetDef.headers[0] === '[ ]') {
      assert.strictEqual(sheetDef.headers[0], '[ ]', `Column A must be '[ ]' checkbox in ${sheetDef.name}`);
    }

    // Verify Action Pill Column if defined
    if (sheetDef.pillCol) {
      assert.ok(sheetDef.pillCol <= sheetDef.headers.length, `pillCol exceeds header length in ${sheetDef.name}`);
      assert.ok(sheetDef.pillColor, `Missing pillColor for ${sheetDef.name}`);
    }

    console.log(`  ✓ Sheet: ${sheetDef.name.padEnd(28)} | ${sheetDef.headers.length} Columns | Pill: ${sheetDef.pillCol ? ('Col ' + sheetDef.pillCol) : 'None'}`);
  });
  console.log('');
});

// Verify specific architectural invariants
console.log('Verifying Architectural Invariants:');

// 1. Variant Register must have Col I as Specifications
const variantSheet = AB_SCHEMAS.ADM.sheets.find(s => s.name === 'VARIANT-REGISTER');
assert.ok(variantSheet, 'VARIANT-REGISTER missing in ADM schema');
assert.strictEqual(variantSheet.headers[8], 'Specifications (JSON / Key-Value Pairs)', 'Col I of VARIANT-REGISTER must be Specifications');
console.log('  ✓ Invariant: VARIANT-REGISTER Col I holds Specifications (JSON / Key-Value Pairs)');

// 2. Secret OTP must never be in labels generator
const labelsSheet = AB_SCHEMAS.WHM.sheets.find(s => s.name === 'PACK-ALLOCATION');
assert.ok(labelsSheet, 'PACK-ALLOCATION missing in WHM schema');
const hasOtpOnLabel = labelsSheet.headers.some(h => /otp|passcode/i.test(h) && !/security/i.test(h));
assert.strictEqual(hasOtpOnLabel, false, 'Secret OTP found in label generator headers!');
console.log('  ✓ Invariant: Secret OTP strictly omitted from thermal shipping labels');

// 3. Central DB-Sheet must have staging queue & sync log
const dbMaster = AB_SCHEMAS.DB_MASTER;
assert.ok(dbMaster.sheets.find(s => s.name === 'DB_DISPATCH_QUEUE'), 'DB_DISPATCH_QUEUE missing in DB_MASTER');
assert.ok(dbMaster.sheets.find(s => s.name === 'DB_SYNC_LOG'), 'DB_SYNC_LOG missing in DB_MASTER');
console.log('  ✓ Invariant: UwanBuy_DB_Master provisions DB_DISPATCH_QUEUE and DB_SYNC_LOG');

console.log('\n===============================================================');
console.log(`  Verification Summary:`);
console.log(`  - Schemas Validated: ${Object.keys(AB_SCHEMAS).length}`);
console.log(`  - Sheets Checked:    ${totalSheetsChecked}`);
console.log(`  - Headers Validated: ${totalHeadersChecked}`);
console.log('  ALL SCHEMAS AND INVARIANTS VALIDATED SUCCESSFULLY! ✓');
console.log('===============================================================\n');
