const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'src', 'components', 'ens', 'AutoSyncDialog.tsx');
const text = fs.readFileSync(p, 'utf8');
const lines = text.split('\n');
const start = 150;
for (let i = start; i < start + 30 && i < lines.length; i++) {
  console.log(i + 1, lines[i]);
}
