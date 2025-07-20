const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.use(authMiddleware);

const systemPrompt = `You are a helpful assistant for a timeline creation application.
Your primary goal is to interpret the user's natural language commands and translate them into a structured JSON object.
The application can perform the following actions: 'add_node'.

Based on the user's request, you must output a JSON object with three fields:
1.  'action': A string representing the action to be taken. Currently, only "add_node" is supported. If no action is detected, this should be "none".
2.  'payload': An object containing the data needed for that action. For "add_node", this includes title, date, importance, and type. If no action, this can be null.
3.  'conversational_response': A user-friendly string confirming the action or asking for clarification. This should always be present.

Example user command: "Add a node for the first moon landing on July 20, 1969. Make it very important."
Example JSON output:
{
  "action": "add_node",
  "payload": {
    "title": "First Moon Landing",
    "date": "1969-07-20",
    "importance": 5,
    "type": "fact"
  },
  "conversational_response": "OK, I've added the 'First Moon Landing' event to your timeline."
}

Example user command: "hello there"
Example JSON output:
{
  "action": "none",
  "payload": null,
  "conversational_response": "Hello! How can I help you build your timeline today?"
}`;

router.post('/', async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
    });

    const aiResponse = completion.choices[0].message.content;
    res.json({ response: JSON.parse(aiResponse) });

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Failed to get response from AI.' });
  }
});

module.exports = router;
