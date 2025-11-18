// Mock data used when no MongoDB URI is provided

export const users = [
  { userId: 1, username: 'alice', email: 'alice@example.com', isPremium: false, password: 'pass1', enrolledCourses: [1] },
  { userId: 2, username: 'bob', email: 'bob@example.com', isPremium: true, password: 'pass2', enrolledCourses: [1,2] },
  { userId: 3, username: 'charlie', email: 'charlie@example.com', isPremium: false, password: 'pass3', enrolledCourses: [] }
];

export const courses = [
  { courseId: 1, title: 'Intro to JS', description: 'Learn JavaScript basics', category: 'Programming', difficulty: 'Beginner', premium: false, courseImage: '', materialList: [], quizList: [1], totalPoints: 100 },
  { courseId: 2, title: 'Advanced Node', description: 'Deep dive into Node.js', category: 'Programming', difficulty: 'Advanced', premium: true, courseImage: '', materialList: [], quizList: [2], totalPoints: 200 }
];

export const quizzes = [
  { quizId: 1, courseId: 1, title: 'JS Basics', questions: [
    { questionId: 11, questionText: 'What is var?', options: ['Declaration', 'Operator', 'Library'], correctOption: 0 }
  ] },
  { quizId: 2, courseId: 2, title: 'Node Advanced', questions: [
    { questionId: 21, questionText: 'What is event loop?', options: ['A thread', 'JS runtime concept', 'DB'], correctOption: 1 }
  ] }
];

let userIdSeq = users.length + 1;
let courseIdSeq = courses.length + 1;
let quizIdSeq = quizzes.length + 1;

export const ratings = [
  { ratingId: 1, userId: 1, courseId: 1, stars: 5, comment: 'Great intro' },
  { ratingId: 2, userId: 2, courseId: 1, stars: 4, comment: 'Helpful' }
];

export const progress = [
  { progressId: 1, userId: 1, courseId: 1, progressPercentage: 45 },
  { progressId: 2, userId: 2, courseId: 1, progressPercentage: 80 },
  { progressId: 3, userId: 2, courseId: 2, progressPercentage: 20 }
];

let ratingIdSeq = ratings.length + 1;
let progressIdSeq = progress.length + 1;

export function nextUserId() { return userIdSeq++; }
export function nextCourseId() { return courseIdSeq++; }
export function nextQuizId() { return quizIdSeq++; }
export function nextRatingId() { return ratingIdSeq++; }
export function nextProgressId() { return progressIdSeq++; }
