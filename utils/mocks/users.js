export const users = [
  { userId: 1, username: 'alice', email: 'alice@example.com', isPremium: false, password: 'pass1', enrolledCourses: [1,2,3] },
  { userId: 2, username: 'bob', email: 'bob@example.com', isPremium: true, password: 'pass2', enrolledCourses: [1,2,3] },
  { userId: 3, username: 'charlie', email: 'charlie@example.com', isPremium: false, password: 'pass3', enrolledCourses: [2,3,4] },
  { userId: 4, username: 'diana', email: 'diana@example.com', isPremium: false, password: 'pass4', enrolledCourses: [3,4,5] },
  { userId: 5, username: 'ed', email: 'ed@example.com', isPremium: true, password: 'pass5', enrolledCourses: [1,4,5] }
];

let userIdSeq = users.length + 1;
export function nextUserId() { return userIdSeq++; }
