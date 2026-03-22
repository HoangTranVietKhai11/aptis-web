const { initDatabase } = require('../database/init');

async function apply() {
  try {
    console.log('⏳ Applying database migrations and seeding...');
    await initDatabase();
    console.log('✅ Database migration and seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to apply migrations:', err);
    process.exit(1);
  }
}

apply();
