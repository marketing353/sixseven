import { GameStats, AICommentary } from "../types";

export const generateGameFeedback = async (stats: GameStats): Promise<AICommentary> => {
  // Simulate "analysis" time for effect
  await new Promise(resolve => setTimeout(resolve, 600));

  const { score, accuracy, maxCombo, hits, misses } = stats;

  let title = "ROOKIE";
  let message = "Keep practicing! Speed comes with time.";

  if (score > 4000) {
    if (accuracy > 0.95) {
      title = "ABSOLUTE LEGEND";
      message = "Your reaction time is scary. Are you a robot?";
    } else if (accuracy > 0.85) {
      title = "SPEED DEMON";
      message = "Fast fingers! Clean up those misses and you're unstoppable.";
    } else {
      title = "SPRAY AND PRAY";
      message = "You're getting points, but that accuracy is looking rough!";
    }
  } else if (score > 2000) {
    if (accuracy > 0.9) {
      title = "SURGICAL PRECISION";
      message = "Clean playing. Try to trust your instincts and speed up!";
    } else {
      title = "GETTING WARM";
      message = "Not bad! You're finding the rhythm.";
    }
  } else {
    if (hits === 0 && misses === 0) {
      title = "AFK?";
      message = "Did you fall asleep? Tap the 6s and 7s!";
    } else if (accuracy < 0.5) {
      title = "THUMB SPRAIN";
      message = "The 6s and 7s are the targets. Avoid the other numbers!";
    } else if (hits < 5) {
      title = "TOO SLOW";
      message = "Don't be afraid to tap! Hesitation is defeat.";
    } else {
      title = "NICE TRY";
      message = "The game gets faster. Keep your eyes peeled.";
    }
  }

  return { title, message };
};