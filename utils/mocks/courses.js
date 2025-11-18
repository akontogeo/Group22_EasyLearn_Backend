export const courses = [
  { courseId: 1, title: 'Intro to JS', description: 'Learn JavaScript basics', category: 'Programming', difficulty: 'Beginner', premium: false, courseImage: '', materialList: [], quizList: [1], totalPoints: 100 },
  { courseId: 2, title: 'Advanced Node', description: 'Deep dive into Node.js', category: 'Programming', difficulty: 'Advanced', premium: true, courseImage: '', materialList: [], quizList: [2], totalPoints: 200 }
];

let courseIdSeq = courses.length + 1;
export function nextCourseId() { return courseIdSeq++; }
