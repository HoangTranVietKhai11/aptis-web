/**
 * Updates the user's daily stats and streak.
 * @param {Object} db The PostgreSQL pool or client.
 */
async function updateDailyStreak(db) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  try {
    // 1. Get today's stats
    const result = await db.query('SELECT * FROM daily_stats WHERE date = $1', [today]);
    let stats = result.rows[0];
    
    if (!stats) {
      // Check for the most recent streak
      const prevResult = await db.query('SELECT * FROM daily_stats ORDER BY date DESC LIMIT 1');
      const prevStats = prevResult.rows[0];
      let newStreak = 1;
      
      if (prevStats) {
        // Handle both Date objects and strings from PG
        const prevDate = new Date(prevStats.date).toISOString().split('T')[0];
        
        if (prevDate === yesterday) {
          newStreak = prevStats.streak_count + 1;
        } else if (prevDate === today) {
          newStreak = prevStats.streak_count;
        } else {
          newStreak = 1;
        }
      }

      await db.query(`
        INSERT INTO daily_stats (date, questions_answered, streak_count)
        VALUES ($1, 1, $2)
      `, [today, newStreak]);
    } else {
      await db.query('UPDATE daily_stats SET questions_answered = questions_answered + 1 WHERE id = $1', [stats.id]);
    }
  } catch (err) {
    console.error('Database Streak Error:', err);
    throw err;
  }
}

module.exports = { updateDailyStreak };
