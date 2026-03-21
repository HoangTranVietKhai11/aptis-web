/**
 * Updates the user's daily stats and streak.
 * @param {Object} db The better-sqlite3 database instance.
 */
function updateDailyStreak(db) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // 1. Get or create today's stats
  let stats = db.prepare('SELECT * FROM daily_stats WHERE date = ?').get(today);
  
  if (!stats) {
    // Check for yesterday's streak
    const prevStats = db.prepare('SELECT * FROM daily_stats ORDER BY date DESC LIMIT 1').get();
    let newStreak = 1;
    
    if (prevStats) {
      if (prevStats.date === yesterday) {
        newStreak = prevStats.streak_count + 1;
      } else if (prevStats.date === today) {
        // Should already be handled by 'stats' check
        newStreak = prevStats.streak_count;
      } else {
        // Streak broken
        newStreak = 1;
      }
    }

    db.prepare(`
      INSERT INTO daily_stats (date, questions_answered, streak_count)
      VALUES (?, 1, ?)
    `).run(today, newStreak);
  } else {
    db.prepare('UPDATE daily_stats SET questions_answered = questions_answered + 1 WHERE id = ?')
      .run(stats.id);
  }
}

module.exports = { updateDailyStreak };
