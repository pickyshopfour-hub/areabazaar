const fs = require('fs');

const html = fs.readFileSync('betasup/index.html', 'utf8');

// Extract dataset
const startTag = '<script type="application/json" id="soup-pots-dataset">';
const endTag = '</script>';
const start = html.indexOf(startTag);
const end = html.indexOf(endTag, start);
const jsonStr = html.substring(start + startTag.length, end);
const data = JSON.parse(jsonStr);

console.log('Total soup pots:', data.length);

// Check if renderSoupGallery creates cards
let cardsCount = 0;
data.forEach(item => {
  if (item.name && item.basePrice) cardsCount++;
});
console.log('Total valid cards:', cardsCount);

// Check iziModal initializations
console.log('Has #modal-product-variants:', html.includes('id="modal-product-variants"'));
console.log('Has #modal-register:', html.includes('id="modal-register"'));
console.log('Has #modal-login:', html.includes('id="modal-login"'));
console.log('Has #cartOffcanvas:', html.includes('id="cartOffcanvas"'));
console.log('Has #soup-pot-grid:', html.includes('id="soup-pot-grid"'));
console.log('Has #soup-search-input:', html.includes('id="soup-search-input"'));

