/**
 * Gamification Service
 * Handles XP rewards, Streaks, and Leveling.
 */

const XP_REWARDS = {
  PRACTICE_CORRECT: 10,
  PRACTICE_ATTEMPT: 2,
  MOCK_CORRECT: 15,
  MOCK_ATTEMPT: 5,
  MOCK_TEST_COMPLETE: 100,
  ROADMAP_SESSION_COMPLETE: 50,
  MINIGAME_WIN: 15,
  DAILY_STREAK_BONUS: 20
};

/**
 * Adds XP to a user.
 * @param {Object} db Database pool or client.
 * @param {string} activity Key from XP_REWARDS.
 */
async function rewardXP(db, activity) {
  const amount = XP_REWARDS[activity] || 0;
  if (amount === 0) return 0;

  try {
    // Target the first user with role 'user' for this simplified setup
    await db.query("UPDATE users SET xp = xp + $1 WHERE role = 'user'", [amount]);
    return amount;
  } catch (err) {
    console.error('Reward XP Error:', err);
    return 0;
  }
}

/**
 * Gets the current rank based on XP.
 */
function getRank(xp) {
  if (xp < 100) return 'Novice';
  if (xp < 500) return 'Apprentice';
  if (xp < 1500) return 'Practitioner';
  if (xp < 3000) return 'Expert';
  if (xp < 6000) return 'Master';
  return 'Grandmaster';
}

module.exports = {
  rewardXP,
  getRank,
  XP_REWARDS
};
