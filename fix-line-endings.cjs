const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'src', 'components', 'ens', 'AutoSyncDialog.tsx');
let txt = fs.readFileSync(p, 'utf8');
txt = txt.replace(/\r\n/g, '\n');
fs.writeFileSync(p, txt, 'utf8');
console.log('Normalized line endings for', p);