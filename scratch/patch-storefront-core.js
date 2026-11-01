const fs = require('fs');

let core = fs.readFileSync('assets/js/storefront-core.js', 'utf8');

// Ensure $drawerList recreation if missing
const targetDrawer = `            // Cart Drawer Rendering
            const $drawerList = $('#cartDrawerItemsList');
            if ($drawerList.length) {`;

const replDrawer = `            // Cart Drawer Rendering
            let $drawerList = $('#cartDrawerItemsList');
            if (!$drawerList.length && $('#cartItemsContainer').length) {
                $('#cartItemsContainer').html('<div id="cartDrawerItemsList"></div>');
                $drawerList = $('#cartDrawerItemsList');
            }
            if ($drawerList && $drawerList.length) {`;

if (core.includes(targetDrawer)) {
    core = core.replace(targetDrawer, replDrawer);
}

// Ensure syncUI call is safe
core = core.replace(/syncUI\(\);/g, 'if (typeof syncUI === "function") syncUI();');

fs.writeFileSync('assets/js/storefront-core.js', core, 'utf8');

// Sync to all copies
const targets = [
    'uwanbuy/assets/js/storefront-core.js',
    'thriftz/assets/js/storefront-core.js',
    'betasup/assets/js/storefront-core.js'
];

targets.forEach(t => {
    fs.writeFileSync(t, core, 'utf8');
    console.log('Synced to ' + t);
});

console.log('Successfully updated storefront-core.js across all locations.');

