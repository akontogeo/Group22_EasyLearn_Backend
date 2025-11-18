export const quizzes = [
  { quizId: 1, courseId: 1, title: 'JS Basics', questions: [
    { questionId: 11, questionText: 'What is var?', options: ['Declaration', 'Operator', 'Library'], correctOption: 0 }
  ] },
  { quizId: 2, courseId: 2, title: 'Node Advanced', questions: [
    { questionId: 21, questionText: 'What is event loop?', options: ['A thread', 'JS runtime concept', 'DB'], correctOption: 1 }
  ] }
];

let quizIdSeq = quizzes.length + 1;
export function nextQuizId() { return quizIdSeq++; }
