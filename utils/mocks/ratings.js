export const ratings = [
  // Ratings for course 1
  { ratingId: 1, userId: 1, courseId: 1, stars: 5, comment: 'Great intro' },
  { ratingId: 2, userId: 2, courseId: 1, stars: 4, comment: 'Helpful' },
  { ratingId: 3, userId: 3, courseId: 1, stars: 4, comment: 'Good overview' },
  // Ratings for course 2
  { ratingId: 4, userId: 2, courseId: 2, stars: 5, comment: 'Excellent deep dive' },
  { ratingId: 5, userId: 5, courseId: 2, stars: 4, comment: 'Challenging but worth it' },
  { ratingId: 6, userId: 1, courseId: 2, stars: 3, comment: 'A bit advanced' },
  // Ratings for course 3
  { ratingId: 7, userId: 1, courseId: 3, stars: 5, comment: 'Clear and practical' },
  { ratingId: 8, userId: 3, courseId: 3, stars: 4, comment: 'Good examples' },
  { ratingId: 9, userId: 4, courseId: 3, stars: 4, comment: 'Helpful' },
  // Ratings for course 4
  { ratingId: 10, userId: 3, courseId: 4, stars: 5, comment: 'Great for data analysis' },
  { ratingId: 11, userId: 4, courseId: 4, stars: 4, comment: 'Well structured' },
  { ratingId: 12, userId: 5, courseId: 4, stars: 4, comment: 'Useful content' },
  // Ratings for course 5
  { ratingId: 13, userId: 4, courseId: 5, stars: 5, comment: 'Advanced but excellent' },
  { ratingId: 14, userId: 5, courseId: 5, stars: 5, comment: 'Loved the examples' },
  { ratingId: 15, userId: 2, courseId: 5, stars: 4, comment: 'Great material' }
];

let ratingIdSeq = ratings.length + 1;
export function nextRatingId() { return ratingIdSeq++; }
