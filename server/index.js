require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const timemapsRouter = require('./routes/timemaps');
const chatRouter = require('./routes/chat');

// Connect to database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/timemaps', timemapsRouter);
app.use('/chat', chatRouter);

app.get('/', (req, res) => {
  res.send('Hello from TimeMap Creator Server!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
