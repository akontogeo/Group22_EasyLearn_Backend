export const ratings = [
  { ratingId: 1, userId: 1, courseId: 1, stars: 5, comment: 'Great intro' },
  { ratingId: 2, userId: 2, courseId: 1, stars: 4, comment: 'Helpful' }
];

let ratingIdSeq = ratings.length + 1;
export function nextRatingId() { return ratingIdSeq++; }
