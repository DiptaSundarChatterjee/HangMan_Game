const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/hangman', { useNewUrlParser: true, useUnifiedTopology: true });


const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);


const WordSchema = new mongoose.Schema({
  word: { type: String, required: true, unique: true },
  hints: [{ type: String, required: true }]
});
const Word = mongoose.model('Word', WordSchema);


const initialWords = [
  { 
    word: "javascript",
    hints: [
      "➤ A popular programming language",
      "➤ Used for client-side and server-side development"
    ]
  },
  { 
    word: "react",
    hints: [
      "➤ A JavaScript library for building user interfaces",
      "➤ Developed by Facebook"
    ]
  },
  { 
    word: "express",
    hints: [
      "➤ A web application framework for Node.js",
      "➤ Known for its minimalist approach"
    ]
  },
  { 
    word: "node",
    hints: [
      "➤ A JavaScript runtime built on Chrome's V8 JavaScript engine",
      "➤ Used for building scalable network applications"
    ]
  },
  { 
    word: "mongodb",
    hints: [
      "➤ A NoSQL database",
      "➤ Known for its flexibility and scalability"
    ]
  },
  { 
    word: "king",
    hints: [
      "➤ A male monarch",
      "➤ Ruler of a kingdom"
    ]
  },
  { 
    word: "queen",
    hints: [
      "➤ A female monarch",
      "➤ Wife of a king"
    ]
  }
];

const seedWords = async () => {
  try {
    await Word.deleteMany({});
    await Word.insertMany(initialWords);
    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

seedWords(); 

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
    res.json({ token });
  } else {
    res.status(400).send('Invalid credentials');
  }
});

app.get('/word', async (req, res) => {
  try {
    const randomWord = await Word.aggregate([{ $sample: { size: 1 } }]);
    res.json({ word: randomWord[0].word, hints: randomWord[0].hints });
  } catch (error) {
    console.error('Error fetching word:', error);
    res.status(500).send('Error fetching word');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
