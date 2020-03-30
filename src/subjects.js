const array = [
  "Art & Design - Fine Art",
  "Art & Design - Graphic Communication",
  "Art & Design - Textile Design",
  "Art & Design - Three Dimensional Design",
  "Art & Design - Photography",

  "Biology",
  "Business Studies",
  "Chemistry",
  "Computer Science",
  "Drama & Theatre",
  "DT - Product Design",
  "Economics",
  "English Literature",
  "French",
  "Geography",
  "German",
  "History",
  "Mathematics",
  "Music",
  "Music Technology",
  "Philosophy, Belief & Ethics",
  "Physics",
  "Politics & Government",
  "Psychology",
  "Sociology",
  "Spanish",
  "Sports Science",
];

const getSubjects = () => array.map(item => ({ name: item }));

export default getSubjects;