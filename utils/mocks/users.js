export const users = [
  { userId: 1, username: 'alice', email: 'alice@example.com', isPremium: false, password: 'pass1', enrolledCourses: [1] },
  { userId: 2, username: 'bob', email: 'bob@example.com', isPremium: true, password: 'pass2', enrolledCourses: [1,2] },
  { userId: 3, username: 'charlie', email: 'charlie@example.com', isPremium: false, password: 'pass3', enrolledCourses: [] }
];

let userIdSeq = users.length + 1;
export function nextUserId() { return userIdSeq++; }
