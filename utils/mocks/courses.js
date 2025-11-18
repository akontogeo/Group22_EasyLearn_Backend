export const courses = [
  { courseId: 1, title: 'Intro to JS', description: 'Learn JavaScript basics', category: 'Programming', difficulty: 'Beginner', premium: false, courseImage: '', materialList: [], quizList: [1], totalPoints: 100 },
  { courseId: 2, title: 'Advanced Node', description: 'Deep dive into Node.js', category: 'Programming', difficulty: 'Advanced', premium: true, courseImage: '', materialList: [], quizList: [2], totalPoints: 200 },
  { courseId: 3, title: 'HTML & CSS', description: 'Build webpages with HTML and CSS', category: 'Web', difficulty: 'Beginner', premium: false, courseImage: '', materialList: [], quizList: [], totalPoints: 80 },
  { courseId: 4, title: 'Python for Data', description: 'Intro to Python for data analysis', category: 'Data Science', difficulty: 'Intermediate', premium: false, courseImage: '', materialList: [], quizList: [], totalPoints: 150 },
  { courseId: 5, title: 'Machine Learning Basics', description: 'Fundamentals of ML', category: 'Data Science', difficulty: 'Advanced', premium: true, courseImage: '', materialList: [], quizList: [], totalPoints: 250 }
];

let courseIdSeq = courses.length + 1;
export function nextCourseId() { return courseIdSeq++; }
