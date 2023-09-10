import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { NextResponse } from 'next/server'






const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [submitted, setSubmitted] = useState(false)
  const [articleInput, setArticleInput] = useState("");
  const [result, setResult] = useState(' ');
  const [urlInput, setUrlInput] = useState("")
  const [submitLoader, setSubmitLoader] = useState(false)
  const [submit, setSubmit] = useState(false)
  

  async function onSubmit(event) {
    setSubmit(true)
    setSubmitLoader(true);
    event.preventDefault();
    try {
      const urlResponse = await fetch("/api/crawler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: urlInput }),
      });
      console.log('data',urlResponse)
      const urlData = await urlResponse.json();
      if (urlResponse.status !== 200) {
        throw urlData.error || new Error(`Request failed with status ${urlResponse.status}`);
      }
    
      setArticleInput(String(urlData.data).length > 2000 ? String(urlData.data).slice(0,2000) : String(urlData.data) );
      setUrlInput("")
      
      
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
 
  useEffect(() => {
    // Second API Request
    const fetchData = async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ article: articleInput }),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
  
        const data = await response.json();
        if (response.status !== 200) {
          throw data.error || new Error(`Request failed with status ${response.status}`);
        }

        if (!data) {
          throw new Error("Empty JSON response");
        }
  
        setResult(String(data.result));
        setUrlInput("");
        if (response.status === 200) {
          setSubmitted(true);
          setSubmitLoader(false);

        }
      } catch (error) {
        // Handle errors for the second API request
        console.error(error);
        alert(error.message);
        setSubmitLoader(false);
      }
    };
  
    // Call fetchData whenever articleInput changes
    fetchData();
  }, [articleInput]);
  


  return (
    <main
      className={`flex min-h-screen text-black bg-white flex-col items-center justify-between p-10 md:p-24 ${inter.className}`}
    >
      <h2 className='absolute top-0'>by jozebel.dev</h2>
      <h1 className='font-bold text-center text-xl'>AI Article Summary</h1>
        <form className='flex w-full justify-center min-h-[400px] items-center flex-col' onSubmit={onSubmit}>
          <input
          className='border-black p-1 max-w-[1000px] rounded-md border-[1px] w-full'
            type="text"
            name="url"
            placeholder="Enter an article's url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button
              type="submit"
              className="px-10 mt-8 py-2 bg-[#494b43] font-sparten text-white rounded-md text-lg flex flex-row items-center"
            >
              {submitLoader ? <CircularProgress color='inherit' /> : 'Generate Summary'}
            </button>
            <span className='text-center mt-4 text-sm text-gray-400'>{submitLoader ? 'Generating your summary. Thank you for your patience.': ''}</span>
        </form>
     
        <div className={'w-full min-h-[500px] max-w-[800px] flex flex-col '}>
          <p className=''>{submit&&!submitLoader ? result.split('•')[0].split(':')[1] : result}</p>
          {submit&&!submitLoader ? 
          <ul className='mt-10 list-disc'>
            <li className='mb-2'><h3 className='font-bold'>{submit&&!submitLoader ? result.split('•')[1].split(':')[0]: ''}</h3>{submit&&!submitLoader ? result.split('•')[1].split(':')[1] : ''}</li>
            <li className='mb-2'><h3 className='font-bold'>{submit&&!submitLoader ? result.split('•')[2].split(':')[0]: ''}</h3>{submit&&!submitLoader ? result.split('•')[2].split(':')[1]: ''}</li>
          </ul>
            : ''}
          </div>
    </main>
  )
}