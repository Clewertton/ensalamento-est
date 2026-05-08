const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'src', 'components', 'ens', 'AutoSyncDialog.tsx');
const text = fs.readFileSync(p, 'utf8');
console.log('len', text.length);
console.log('has_cr', text.includes('\r'));
console.log('repr', JSON.stringify(text.slice(0,200)));
