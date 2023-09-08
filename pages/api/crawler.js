const axios = require('axios')
const cheerio = require('cheerio')




export default async function (req, res) {

  

    const url = String(req.body.url) || '';
    if (url.trim().length === 0) {
      res.status(400).json({
        error: {
          message: "Please enter a valid url",
        }
      });
      return;
    }
  
    try {
        const data = await axios(url)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const articles = []
            $('article', html).each(function(){
               const list = $(this).text()
                const url = $(this).find('a').attr('href')
                articles.push({
                    list,
                    url
                })
            })
            return articles[0].list
            
            
            
    
    
        }).catch(err => console.log(err))

        
    
      res.status(200).json({ data: data });
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

