const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA_KdEMCw0YCZwQ7bBWq0UfT1Keqv0pjPE',
  authDomain: 'philproj-58c07.firebaseapp.com',
  projectId: 'philproj-58c07',
  storageBucket: 'philproj-58c07.firebasestorage.app',
  messagingSenderId: '918832186488',
  appId: '1:918832186488:web:5504f11488e4a3a1a9998d',
  measurementId: 'G-WQW4NQTHLN',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const questions = [
  {
    questionTitle:
      'Open Licensing, No Style/Content Similarity, High Creativity',
    questionText:
      "All training data was open source and allowed derivative works. The model rarely resembles any artist's style or existing paintings, and it demonstrates creativity rather than regurgitating prior content.",
    questionAnswers: [
      'The developers should get the majority of the revenue',
      'The artists should get the majority of the revenue',
    ],
  },
  {
    questionTitle: 'Open Licensing, Style Similarity, Low Creativity',
    questionText:
      'The training data was open source with permissive licenses. However, the generated art frequently mimics the style of a specific artist, and the model primarily recombines input data rather than demonstrating creative reasoning.',
    questionAnswers: [
      'The developers should get the majority of the revenue',
      'The artists should get the majority of the revenue',
    ],
  },
  {
    questionTitle: 'Closed Licensing, Content Similarity, High Creativity',
    questionText:
      "The training data was not licensed for derivative works. The generated art rarely imitates a particular artist's style but often resembles the content of existing paintings. However, the model demonstrates creativity and original thought.",
    questionAnswers: [
      'The developers should get the majority of the revenue',
      'The artists should get the majority of the revenue',
    ],
  },
  {
    questionTitle:
      'Closed Licensing, No Style/Content Similarity, Low Creativity',
    questionText:
      "The training data did not allow derivatives. The generated art does not closely resemble an artist's style or any existing works, but the model merely regurgitates elements of the input data without much creative thought.",
    questionAnswers: [
      'The developers should get the majority of the revenue',
      'The artists should get the majority of the revenue',
    ],
  },
  {
    questionTitle:
      'Open Licensing, Style and Content Similarity, High Creativity',
    questionText:
      'The training data was open source, but the generated art often mirrors both the style of certain artists and the content of existing works. Despite this, the model demonstrates creative reasoning and originality.',
    questionAnswers: [
      'The developers should get the majority of the revenue',
      'The artists should get the majority of the revenue',
    ],
  },
  {
    questionTitle: 'Closed Licensing, No Similarity, High Creativity',
    questionText:
      "The training data was not open source, and the generated works do not resemble any specific artist's style or existing paintings. The model demonstrates a high level of creativity and reasoning.",
    questionAnswers: [
      'The developers should get the majority of the revenue',
      'The artists should get the majority of the revenue',
    ],
  },
  {
    questionTitle:
      'Closed Licensing, Style and Content Similarity, Low Creativity',
    questionText:
      'The training data was not licensed for derivative works. The generated art closely resembles both the style of certain artists and the content of existing works, with minimal creative input from the model.',
    questionAnswers: [
      'The developers should get the majority of the revenue',
      'The artists should get the majority of the revenue',
    ],
  },
  {
    questionTitle: 'Open Licensing, Style Similarity, High Creativity',
    questionText:
      "The training data was openly licensed. The generated works often mirror a particular artist's style but demonstrate creative reasoning and unique expression.",
    questionAnswers: [
      'The developers should get the majority of the revenue',
      'The artists should get the majority of the revenue',
    ],
  },
  {
    questionTitle: 'Closed Licensing, Content Similarity, Low Creativity',
    questionText:
      'The training data was not open source. The generated art frequently resembles the content of existing paintings, and the model simply recombines elements of the input data without real creativity.',
    questionAnswers: [
      'The developers should get the majority of the revenue',
      'The artists should get the majority of the revenue',
    ],
  },
  {
    questionTitle: 'Open Licensing, No Similarity, Low Creativity',
    questionText:
      'The training data was openly licensed, but the generated art rarely resembles any particular artist or existing works. However, the model primarily recombines input data without demonstrating true creativity.',
    questionAnswers: [
      'The developers should get the majority of the revenue',
      'The artists should get the majority of the revenue',
    ],
  },
  {
    questionTitle: 'Closed Licensing, Style Similarity, High Creativity',
    questionText:
      "The training data was not licensed for derivatives, but the generated works often mirror a specific artist's style while showcasing creativity and original thought.",
    questionAnswers: [
      'The developers should get the majority of the revenue',
      'The artists should get the majority of the revenue',
    ],
  },
  {
    questionTitle: 'Open Licensing, Content Similarity, Low Creativity',
    questionText:
      'The training data was open source, but the generated art frequently resembles existing works, and the model does not exhibit significant creative reasoning.',
    questionAnswers: [
      'The developers should get the majority of the revenue',
      'The artists should get the majority of the revenue',
    ],
  },
  {
    questionTitle: 'Closed Licensing, Style Similarity, Low Creativity',
    questionText:
      'The training data was not licensed for derivatives. The generated art often imitates the style of a particular artist, but the model primarily regurgitates elements of the input data.',
    questionAnswers: [
      'The developers should get the majority of the revenue',
      'The artists should get the majority of the revenue',
    ],
  },
  {
    questionTitle: 'Open Licensing, Content Similarity, High Creativity',
    questionText:
      'The training data was open source, and while the generated works often resemble the content of existing paintings, the model demonstrates high levels of creativity and originality.',
    questionAnswers: [
      'The developers should get the majority of the revenue',
      'The artists should get the majority of the revenue',
    ],
  },
  {
    questionTitle: 'Closed Licensing, No Similarity, Low Creativity',
    questionText:
      'The training data was not open source, and the generated art does not resemble existing works or artist styles, but the model lacks creative reasoning.',
    questionAnswers: [
      'The developers should get the majority of the revenue',
      'The artists should get the majority of the revenue',
    ],
  },
  {
    questionTitle:
      'Open Licensing, Style and Content Similarity, Low Creativity',
    questionText:
      'The training data was open source, but the generated art often mimics both artist styles and existing works, with the model primarily combining existing elements rather than demonstrating creativity.',
    questionAnswers: [
      'The developers should get the majority of the revenue',
      'The artists should get the majority of the revenue',
    ],
  },
];

async function addQuestions() {
  try {
    const questionsCollection = collection(db, 'Questions');

    for (const question of questions) {
      await addDoc(questionsCollection, question);
      console.log(`Added question: ${question.questionTitle}`);
    }

    console.log('All questions added successfully');
  } catch (error) {
    console.error('Error adding questions:', error);
  }
}

addQuestions();
