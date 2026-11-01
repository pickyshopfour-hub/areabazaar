const fs = require('fs');

['thriftz/category.html', 'thriftz/product-details.html'].forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/Wallet:\s*[₦N]\s*<span class="user-wallet-bal">/g, 'Wallet: <span class="user-wallet-bal">');
    fs.writeFileSync(f, c, 'utf8');
    console.log('Processed ' + f);
  }
});

