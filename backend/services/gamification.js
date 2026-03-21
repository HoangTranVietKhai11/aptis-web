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
 * Adds XP to a user (currently defaults to first user in simple setup).
 * @param {Object} db Database instance.
 * @param {string} activity Key from XP_REWARDS.
 */
function rewardXP(db, activity) {
  const amount = XP_REWARDS[activity] || 0;
  if (amount === 0) return;

  // In this single-user focused app, we update the main user (first one)
  // or the one currently active. We'll target the 'user' role for now.
  db.prepare("UPDATE users SET xp = xp + ? WHERE role = 'user'").run(amount);
  
  return amount;
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
