import readline from 'readline';
import deleteSyncedEvents from './utils/deleteSyncedEvents.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = q => new Promise(res => rl.question(q, res));

const confirm = await ask('⚠️ Are you sure you want to delete synced events? (y/n): ');
if (confirm.toLowerCase() !== 'y') {
  console.log('❌ Cancelled.');
  process.exit();
}

console.log('🧹 Deleting synced events...');
await deleteSyncedEvents();
console.log('✅ Cleanup complete.');
rl.close();