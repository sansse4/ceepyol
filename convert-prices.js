const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'lib', 'data', 'local-products.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

data.forEach(p => {
  p.price = Math.round(p.price * 34);
  if (p.originalPrice) {
    p.originalPrice = Math.round(p.originalPrice * 34);
  }
});

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('Prices successfully multiplied by 34 for TRY conversion.');
