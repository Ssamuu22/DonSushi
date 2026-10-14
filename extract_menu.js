const fs = require('fs');

const content = fs.readFileSync(
  'C:/Users/river/.gemini/antigravity/brain/97de5bfc-fd73-4879-aa5b-6350fbd5a177/.system_generated/steps/42/content.md',
  'utf8'
);

// Match each categoria section
const sections = content.split('<li id="');
const result = [];

for (let i = 1; i < sections.length; i++) {
  const sec = sections[i];
  const catTitleMatch = sec.match(/<div class="class-title"[^>]*>([\s\S]*?)<\/div>/);
  if (!catTitleMatch) continue;
  const categoryName = catTitleMatch[1].trim();

  // Find all dishes inside this category
  const prodRegex = /data-pid="(\d+)"[\s\S]*?<img[^>]*src="([^"]+)"[\s\S]*?<h5 class="h5 caption"><a[^>]*>([^<]+)<\/a>/g;
  let pMatch;
  while ((pMatch = prodRegex.exec(sec)) !== null) {
    let img = pMatch[2];
    if (img.startsWith('/')) img = 'https://www.donsushi.net' + img;
    
    // Check if there is price or desc
    let title = pMatch[3].trim();
    
    result.push({
      category: categoryName,
      id: pMatch[1],
      img: img,
      title: title
    });
  }
}

console.log('Total dishes found:', result.length);
const catCounts = {};
result.forEach(d => {
  catCounts[d.category] = (catCounts[d.category] || 0) + 1;
});
console.log('Categories:', catCounts);
fs.writeFileSync('dishes.json', JSON.stringify(result, null, 2));
