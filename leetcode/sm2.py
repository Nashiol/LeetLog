from dataclasses import dataclass
from datetime import date, timedelta
from typing import Literal

Rating = Literal["hard", "medium", "easy", "very_easy"]
Status = Literal["in_progress", "due_for_review", "mastered"]


@dataclass
class ReviewResult:
    next_review_date: date
    new_ease_factor: float
    new_repetition_count: int
    new_status: Status


INTERVAL_MAP: dict[Rating, int] = {
    "hard": 1,
    "medium": 3,
    "easy": 7,
    "very_easy": 14,
}

EASE_MAP: dict[Rating, float] = {
    "hard": -0.2,
    "medium": 0.0,
    "easy": 0.1,
    "very_easy": 0.15,
}

MIN_EASE_FACTOR: float = 1.3


def calculate_next_review(
    current_ease_factor: float,
    repetition_count: int,
    rating: Rating,
) -> ReviewResult:
    new_ease_factor = max(
        current_ease_factor + EASE_MAP[rating],
        MIN_EASE_FACTOR,
    )
    new_repetition_count = repetition_count + 1
    interval_days = INTERVAL_MAP[rating]
    next_review_date = date.today() + timedelta(days=interval_days)

    if new_repetition_count >= 4 and rating in ("easy", "very_easy"):
        new_status: Status = "mastered"
    elif rating == "hard":
        new_status = "due_for_review"
    else:
        new_status = "in_progress"

    return ReviewResult(
        next_review_date=next_review_date,
        new_ease_factor=new_ease_factor,
        new_repetition_count=new_repetition_count,
        new_status=new_status,
    )
