import deleteSyncedEvents from './utils/deleteSyncedEvents.js';

console.log('🧹 Running cleanup: deleteSyncedEvents()...');
await deleteSyncedEvents();
console.log('✅ Cleanup complete.');