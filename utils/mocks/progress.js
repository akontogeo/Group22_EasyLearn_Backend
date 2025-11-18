export const progress = [
  // user1 enrolled [1,2,3]
  { progressId: 1, userId: 1, courseId: 1, progressPercentage: 45 },
  { progressId: 2, userId: 1, courseId: 2, progressPercentage: 20 },
  { progressId: 3, userId: 1, courseId: 3, progressPercentage: 60 },
  // user2 enrolled [1,2,3]
  { progressId: 4, userId: 2, courseId: 1, progressPercentage: 80 },
  { progressId: 5, userId: 2, courseId: 2, progressPercentage: 50 },
  { progressId: 6, userId: 2, courseId: 3, progressPercentage: 70 },
  // user3 enrolled [2,3,4]
  { progressId: 7, userId: 3, courseId: 2, progressPercentage: 30 },
  { progressId: 8, userId: 3, courseId: 3, progressPercentage: 40 },
  { progressId: 9, userId: 3, courseId: 4, progressPercentage: 10 },
  // user4 enrolled [3,4,5]
  { progressId: 10, userId: 4, courseId: 3, progressPercentage: 90 },
  { progressId: 11, userId: 4, courseId: 4, progressPercentage: 35 },
  { progressId: 12, userId: 4, courseId: 5, progressPercentage: 5 },
  // user5 enrolled [1,4,5]
  { progressId: 13, userId: 5, courseId: 1, progressPercentage: 15 },
  { progressId: 14, userId: 5, courseId: 4, progressPercentage: 25 },
  { progressId: 15, userId: 5, courseId: 5, progressPercentage: 55 }
];

let progressIdSeq = progress.length + 1;
export function nextProgressId() { return progressIdSeq++; }
