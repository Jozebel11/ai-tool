import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export default async function (req, res) {

  

  const article = req.body.article || '';
  

  try {
    const completion = await openai.completions.create({
      model: "text-davinci-003",
      prompt: generatePrompt(article),
      temperature: 0.5,
      max_tokens: 2000,
    });
    res.status(200).json({ result: completion.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(article) {

  if (article.length < 1){
    return 'Only return "Hello I am Jozebel.ai your AI Article Summarisor. I make summarise the lengthy articles you don\'t have time to read, into smaller bite size chunks. Please enter an article you need summarising."'
  }
  
  return `Summarise the given article into 1 introduction and two detailed points. Give the points a title followed by text.
  Format it like:
  [text
  • text
  • text]
  
  The Article to Summarise: ${article}

`;
}