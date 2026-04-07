const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\علاوي\\Pictures\\1';
const destImagesDir = path.join(__dirname, '../public/images/products');
const destVideosDir = path.join(__dirname, '../public/videos/products');
const dataFile = path.join(__dirname, '../src/lib/data/local-products.json');

// Ensure destination directories exist
if (!fs.existsSync(destImagesDir)) fs.mkdirSync(destImagesDir, { recursive: true });
if (!fs.existsSync(destVideosDir)) fs.mkdirSync(destVideosDir, { recursive: true });

// Read all files recursively from srcDir
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);

const productsMap = {};

allFiles.forEach(file => {
  const ext = path.extname(file).toLowerCase();
  const basename = path.basename(file);
  const parentName = path.basename(path.dirname(file)).toLowerCase();
  
  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    // some images have strange arabic names or spaces, keep unique names
    const destPath = path.join(destImagesDir, basename);
    // only copy if not exists to save time or copy all
    fs.copyFileSync(file, destPath);
    console.log(`Copied image: ${basename}`);
    
    // Group by parent folder to update json
    if (!productsMap[parentName]) productsMap[parentName] = {};
    if (!productsMap[parentName].images) productsMap[parentName].images = [];
    productsMap[parentName].images.push(`/images/products/${basename}`);
  } else if (['.mp4', '.webm', '.mov'].includes(ext)) {
    const newBasename = parentName + '_' + basename;
    const destPath = path.join(destVideosDir, newBasename);
    fs.copyFileSync(file, destPath);
    console.log(`Copied video: ${newBasename}`);
  }
});

// Now update local-products.json
let products = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

products = products.map(product => {
  const prodNameLower = product.name.toLowerCase();
  
  let matchedKey = Object.keys(productsMap).find(key => 
     prodNameLower.replace(/\s+/g, '') === key.replace(/\s+/g, '') ||
     prodNameLower.includes(key) || key.includes(prodNameLower)
  );

  if (matchedKey && productsMap[matchedKey].images && productsMap[matchedKey].images.length > 0) {
    let newImages = productsMap[matchedKey].images;
    
    // Filter out screenshot images if there are better ones
    const goodImages = newImages.filter(img => !img.includes('لقطة الشاشة'));
    if(goodImages.length > 0) newImages = goodImages;

    // Use at most 4 images for a product to not bloat it
    product.images = newImages.slice(0, 4).map(src => ({ src, alt: product.name }));
    console.log(`Updated images for product: ${product.name}`);
  }
  return product;
});

fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));
console.log('Successfully updated local-products.json');
