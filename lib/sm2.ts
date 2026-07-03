export type ReviewRating = "hard" | "medium" | "easy" | "very_easy";

export function calculateNextReview(
  currentEaseFactor: number,
  repetitionCount: number,
  rating: ReviewRating
): {
  nextReviewDate: Date;
  newEaseFactor: number;
  newRepetitionCount: number;
  newStatus: "in_progress" | "due_for_review" | "mastered";
} {
  let newEaseFactor = currentEaseFactor;
  let newRepetitionCount = repetitionCount;
  let intervalDays: number;

  switch (rating) {
    case "hard":
      intervalDays = 1;
      newEaseFactor = Math.max(1.3, currentEaseFactor - 0.2);
      newRepetitionCount += 1;
      break;
    case "medium":
      intervalDays = 3;
      newRepetitionCount += 1;
      break;
    case "easy":
      intervalDays = 7;
      newEaseFactor = currentEaseFactor + 0.1;
      newRepetitionCount += 1;
      break;
    case "very_easy":
      intervalDays = 14;
      newEaseFactor = currentEaseFactor + 0.15;
      newRepetitionCount += 1;
      break;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

  let newStatus: "in_progress" | "due_for_review" | "mastered";
  if (newRepetitionCount >= 4 && (rating === "easy" || rating === "very_easy")) {
    newStatus = "mastered";
  } else {
    newStatus = "in_progress";
  }

  return {
    nextReviewDate,
    newEaseFactor,
    newRepetitionCount,
    newStatus,
  };
}
