// ImageSearchService.js
// Returns all images in the public/png-images folder that match the prompt

const IMAGE_LIST = [
  "beige-knit-sweater--cozy-autumn-minimal.jpg",
  "black-beanie--winter-streetwear-cozy.jpeg",
  "black-cargo-pants--streetwear-utility-edgy.jpg",
  "black-combat-boots--edgy-winter-rainy.webp",
  "black-graphic-hoodie--streetwear-winter-rainy-cozy.webp",
  "black-satin-slip-dress--party-night-out-chic.jpg",
  "boho-fringe-bag--aesthetic-indie-casual.webp",
  "bucket-hat-beige--summer-aesthetic-casual.jpg",
  "chunky-dad-sneakers--streetwear-trendy-genz.jpg",
  "chunky-hoop-earrings--party-bold-trendy.jpg",
  "cozy-wool-scarf--winter-cozy-minimal.jpeg",
  "cropped-sweatshirt--casual-sporty-cozy.webp",
  "denim-jacket--college-casual-timeless.jpeg",
  "ethnic-dupatta-with-mirror-work--festive-traditional-chic.jpg",
  "floral-midi-skirt--summer-aesthetic-brunch.jpg",
  "floral-print-maxi-dress--vacation-aesthetic-flowy.jpeg",
  "glittery-heels--party-night-out-chic.jpeg",
  "glow-in-the-dark-sneakers--party-rave-edgy.jpg",
  "grey-joggers--cozy-sporty-casual.jpg",
  "high-waist-ripped-jeans--streetwear-casual-college.jpg",
  "indo-western-fusion-kurti--college-ethnic-modern-casual.webp",
  "leather-biker-jacket--edgy-party-streetwear.jpg",
  "mini-pastel-backpack--college-pastel-casual.jpg",
  "neon-green-tank-top--party-gym-bold.webp",
  "oversized-blanket-hoodie--winter-cozy-indoor.jpg",
  "oversized-blazer--formal-chic-streetwear-mix.jpg",
  "oversized-plaid-shirt--casual-cozy-college.jpg",
  "oversized-round-sunglasses--summer-vacation-genz.jpg",
  "oversized-tote-bag--chic-minimal-work.jpg",
  "oversized-white-t-shirt--casual-streetwear-college.webp",
  "pastel-blue-crop-top--pastel-summer-chic.webp",
  "pastel-gradient-windbreaker--pastel-streetwear-rainy.webp",
  "pastel-green-anarkali--ethnic-festive-pastel.jpg",
  "pastel-lavender-puffer-jacket--winter-pastel-cozy.webp",
  "pastel-pink-wide-leg-pants--pastel-aesthetic-chic.jpg",
  "pastel-scrunchie-pack--pastel-aesthetic-casual.jpg",
  "pastel-yellow-slip-ons--pastel-summer-cute.webp",
  "retro-flared-jeans--vintage-90s-aesthetic.avif",
  "sequin-jacket--party-night-out-bold.jpg",
  "silver-layered-necklace--party-chic-y2k.jpg",
  "smartwatch--tech-sporty-genz.jpg",
  "straw-hat--beach-summer-vacation.webp",
  "tie-dye-t-shirt--aesthetic-streetwear-genz.webp",
  "transparent-raincoat--rainy-monsoon-utility.webp",
  "transparent-sling-bag--party-trendy-y2k.webp",
  "transparent-umbrella--rainy-monsoon-utility.webp",
  "velvet-mini-dress--party-luxe-chic.webp",
  "waterproof-backpack--rainy-college-sporty.webp",
  "white-sneakers--all-season-casual-college.webp",
  "white-summer-sundress--summer-brunch-aesthetic.jpg"
];

export function searchImages(prompt) {
  const query = prompt.toLowerCase();
  // Split prompt into keywords, filter out common stopwords
  const stopwords = ["the","a","an","for","with","and","in","on","at","to","of","by","is","are","was","were","it","this","that","these","those","as","but","or","so","if","then","from","out","about","above","below","under","over","between","into","during","before","after","while","around","near","very","really","just","more","most","less","least","all","any","some","such","no","not","only","own","same","other","another","each","every","both","few","many","much","several","one","two","three","four","five","six","seven","eight","nine","ten","can","wear","show","me","morning"];
  const keywords = query.split(/\s+/).filter(word => word && !stopwords.includes(word));
  // Add intent-based keywords for rainy/cute/college/party etc
  const intentKeywords = [];
  if (query.includes("rain") || query.includes("rainy")) {
    intentKeywords.push("raincoat", "umbrella", "waterproof", "rainy", "rain", "boots", "windbreaker", "jacket", "backpack");
  }
  if (query.includes("college")) {
    intentKeywords.push("college", "casual", "backpack", "kurti", "shirt", "jacket");
  }
  if (query.includes("cute")) {
    intentKeywords.push("cute", "pastel", "mini", "skirt", "dress", "sundress", "sweater");
  }
  if (query.includes("party")) {
    intentKeywords.push("party", "night-out", "chic", "heels", "dress", "sequin", "velvet", "bold");
  }
  if (query.includes("pastel")) {
    intentKeywords.push("pastel");
  }
  if (query.includes("saree")) {
    intentKeywords.push("saree");
  }
  if (query.includes("summer")) {
    intentKeywords.push("summer");
  }
  // Add intent-based keywords for professional/job/interview
  if (query.includes("professional") || query.includes("interview") || query.includes("job")) {
    intentKeywords.push("formal", "shirt", "blazer", "suit", "trousers", "office", "professional", "interview", "chic");
  }
  // Add intent-based keywords for cafe/casual/relaxed/coffee
  if (query.includes("cafe") || query.includes("coffee") || query.includes("relaxed") || query.includes("chill")) {
    intentKeywords.push("cafe", "casual", "chic", "dress", "skirt", "sundress", "sweater", "jacket", "jeans", "brunch", "top");
  }
  // Merge keywords and intentKeywords, deduplicate
  const allKeywords = Array.from(new Set([...keywords, ...intentKeywords]));
  if (allKeywords.length === 0) return [];
  // Score images by number of keyword matches
  const scored = IMAGE_LIST.map(filename => {
    const score = allKeywords.reduce((acc, word) => acc + (filename.includes(word) ? 1 : 0), 0);
    return { filename, score };
  }).filter(item => item.score > 0);
  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);
  // For rainy queries, only show images with at least one rainy intent keyword
  if (query.includes("rain") || query.includes("rainy")) {
    const rainyWords = ["raincoat","umbrella","waterproof","rainy","rain","boots","windbreaker","jacket","backpack"];
    const rainyScored = scored.filter(item => rainyWords.some(word => item.filename.includes(word)));
    if (rainyScored.length > 0) {
      return rainyScored.slice(0, 6).map(item => ({
        name: item.filename.replace(/[-_.]/g, ' ').replace(/\.(jpg|jpeg|png|webp|avif)$/i, ''),
        img_url: `/png-images/${item.filename}`
      }));
    }
  }
  // For pastel colored sarees for summer, require at least 'pastel' and 'saree' in filename
  if (query.includes("pastel") && query.includes("saree")) {
    const pastelSarees = scored.filter(item => item.filename.includes("pastel") && item.filename.includes("saree"));
    if (pastelSarees.length > 0) {
      return pastelSarees.map(item => ({
        name: item.filename.replace(/[-_.]/g, ' ').replace(/\.(jpg|jpeg|png|webp|avif)$/i, ''),
        img_url: `/png-images/${item.filename}`
      }));
    }
  }
  // For professional attire/job interview/office outfit queries, require at least one of these keywords in the filename and exclude casual/party/college/other unrelated images
  if (query.includes("professional") || query.includes("interview") || query.includes("job") || query.includes("office")) {
    const profWords = ["formal","blazer","suit","shirt","trousers","office","professional","interview","chic"];
    const excludeWords = ["casual","college","party","brunch","streetwear","vacation","summer","cute","pastel","kurti","skirt","sundress","sweater","jeans","jacket","hoodie","backpack"];
    const profScored = scored.filter(item =>
      profWords.some(word => item.filename.includes(word)) &&
      !excludeWords.some(word => item.filename.includes(word))
    );
    if (profScored.length > 0) {
      return profScored.slice(0, 6).map(item => ({
        name: item.filename.replace(/[-_.]/g, ' ').replace(/\.(jpg|jpeg|png|webp|avif)$/i, ''),
        img_url: `/png-images/${item.filename}`
      }));
    }
  }
  // If searching for cafe outfit, require at least one of these keywords in the filename
  if (query.includes("cafe") || query.includes("coffee") || query.includes("relaxed") || query.includes("chill")) {
    const cafeWords = ["cafe","casual","chic","dress","skirt","sundress","sweater","jacket","jeans","brunch","top"];
    const cafeScored = scored.filter(item => cafeWords.some(word => item.filename.includes(word)));
    if (cafeScored.length > 0) {
      return cafeScored.slice(0, 6).map(item => ({
        name: item.filename.replace(/[-_.]/g, ' ').replace(/\.(jpg|jpeg|png|webp|avif)$/i, ''),
        img_url: `/png-images/${item.filename}`
      }));
    }
  }
  // Otherwise, return top 6 results
  return scored.slice(0, 6).map(item => ({
    name: item.filename.replace(/[-_.]/g, ' ').replace(/\.(jpg|jpeg|png|webp|avif)$/i, ''),
    img_url: `/png-images/${item.filename}`
  }));
}
