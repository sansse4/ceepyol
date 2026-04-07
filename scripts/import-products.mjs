import fs from "fs";
import path from "path";

const SRC_DIR = "C:\\Users\\علاوي\\Pictures\\1";
const DEST_DIR = path.join(process.cwd(), "public", "images", "products");

if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

// Map Apple colors to Hex
const COLOR_MAP = {
  midnight: "#1C1F24",
  starlight: "#F9F6EF",
  silver: "#E3E4E5",
  "sky blue": "#A4B6C3",
  white: "#F5F5F7",
  black: "#1D1D1F",
  "space gray": "#535150",
  ultramarine: "#273C74",
  teal: "#63A7A6",
  pink: "#F8D8DC",
};

const CATEGORY_MAP = {
  iphone: "iphones",
  mac: "laptops",
  ipad: "tablets",
  watch: "watches",
  airpode: "audio",
};

function copyProductImage(srcFile, destSlug) {
  const ext = path.extname(srcFile);
  const fileName = `${destSlug}${ext}`;
  const destFile = path.join(DEST_DIR, fileName);
  fs.copyFileSync(srcFile, destFile);
  return `/images/products/${fileName}`;
}

async function processDirectory() {
  const categories = fs.readdirSync(SRC_DIR).filter((f) => fs.statSync(path.join(SRC_DIR, f)).isDirectory());

  let allProducts = [];

  for (const cat of categories) {
    const dbCategory = CATEGORY_MAP[cat.toLowerCase()] || "accessories";
    const catDir = path.join(SRC_DIR, cat);
    const catItems = fs.readdirSync(catDir);

    for (const item of catItems) {
      const itemPath = path.join(catDir, item);
      const isDir = fs.statSync(itemPath).isDirectory();

      if (isDir) {
        // Product folder (e.g. iphone 16)
        console.log(`Processing product folder: ${item}`);
        
        let txtFile = path.join(itemPath, "مواصفات.txt");
        const files = fs.readdirSync(itemPath);
        
        const imageFile = files.find((f) => [".jpg", ".png", ".jpeg", ".webp"].includes(path.extname(f).toLowerCase()) && f !== "مواصفات.txt" && !f.includes("لقطة"));

        if (!imageFile && !fs.existsSync(txtFile)) continue;

        let name = item;
        let price = 999;
        let description = "";
        let colors = [];

        if (fs.existsSync(txtFile)) {
          const lines = fs.readFileSync(txtFile, "utf-8").split("\n").map(l => l.trim()).filter(l => l);
          if (lines.length > 0) name = lines[0];
          
          let colorNamesFound = [];
          
          lines.forEach(line => {
             const lowerLine = line.toLowerCase();
             // Check price
             const priceMatch = lowerLine.match(/(?:from\s+)?\$([\d,.]+)/i);
             if (priceMatch) price = parseFloat(priceMatch[1].replace(/,/g, ''));
             
             // Check colors (basic check)
             if (Object.keys(COLOR_MAP).some(c => c === lowerLine)) {
                colors.push({ name: line, hex: COLOR_MAP[lowerLine] });
                colorNamesFound.push(line);
             } else if (lowerLine && lowerLine !== lines[0] && !priceMatch && lowerLine.length > 10) {
                // assume descriptions are long sentences
                description += line + " ";
             }
          });
          
          if (colors.length === 0) {
             colors.push({ name: "Default", hex: "#888888" });
          }
        } else {
           colors.push({ name: "Default", hex: "#888888" });
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        let imgUrl = "";
        if (imageFile) {
           imgUrl = copyProductImage(path.join(itemPath, imageFile), slug);
        }

        allProducts.push({
          id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          slug,
          name: name || item,
          brand: "Apple",
          category: dbCategory,
          price,
          description: description.trim() || `Amazing new ${name} with cutting edge features.`,
          images: [{ src: imgUrl, alt: name }],
          colors,
          specs: [{ label: "Type", value: name }],
          badges: ["New Arrival"],
          condition: "New",
          inStock: true,
          rating: 5,
          reviewCount: 0
        });

      } else {
        // Just a file (e.g. ipad_07e11a653.png)
        if ([".jpg", ".png", ".jpeg", ".webp"].includes(path.extname(item).toLowerCase())) {
          console.log(`Processing file: ${item}`);
          const rawName = path.basename(item, path.extname(item));
          const namePart = rawName.split("_").slice(0, -1).join(" ") || rawName; // generic name
          const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
          const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          
          const imgUrl = copyProductImage(itemPath, slug);

          // Give a generic price based on category
          let price = 599;
          if (dbCategory === "tablets") price = 799;
          
          allProducts.push({
            id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            slug,
            name: name,
            brand: "Apple",
            category: dbCategory,
            price,
            description: `Experience the advanced new ${name}.`,
            images: [{ src: imgUrl, alt: name }],
            colors: [{ name: "Space Gray", hex: "#535150" }],
            specs: [{ label: "Type", value: name }],
            badges: ["New"],
            condition: "New",
            inStock: true,
            rating: 5,
            reviewCount: 0
          });
        }
      }
    }
  }

  console.log(`Prepared ${allProducts.length} products to insert.`);
  if (allProducts.length > 0) {
    const outputPath = path.join(process.cwd(), "src", "lib", "data", "local-products.json");
    fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2), "utf-8");
    console.log(`Successfully saved ${allProducts.length} products to ${outputPath}`);
  }
}

processDirectory().catch(console.error);
