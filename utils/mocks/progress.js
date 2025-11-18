export const progress = [
  { progressId: 1, userId: 1, courseId: 1, progressPercentage: 45 },
  { progressId: 2, userId: 2, courseId: 1, progressPercentage: 80 },
  { progressId: 3, userId: 2, courseId: 2, progressPercentage: 20 }
];

let progressIdSeq = progress.length + 1;
export function nextProgressId() { return progressIdSeq++; }
