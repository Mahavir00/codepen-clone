import React, {useState, useEffect} from "react";
import qs from 'qs' //queryString to convert body of the POST request as per Postbin API requirements
import axios from 'axios' //axios to make API calls

import { useLocalStorage } from "../hooks/useLocalStorage"; //Custom hook to use local storage

import Editor from "./Editor"; //Custom Editor Component
import Popup from "./Popup"; //Custom Editor Component
import FileExplorer from "./FileExplorer"; //Custom Editor Component

function App() {
  // Localstorage hooks to store and retreive the code written locally to make it refresh proof
  const [html, setHtml] = useLocalStorage('html','')
  const [css, setCss] = useLocalStorage('css','')
  const [js, setJs] = useLocalStorage('js','')

  //States and use State definitions
  const [srcDoc,setSrcDoc] = useState('') //document to be rendered live
  const [language,setLanguage]=useState("") //language editor currently being used
  const [popup,setPopup]=useState(false) //popup enable
  const [importLink,setImportLink]=useState("") //import link entered by user
  const [pastebinLink,setPastebinLink]=useState("") //pastebin link generated

  //Live rendering using React effects which take place when any language code is modified
  useEffect(()=>{
    const timeout = setTimeout(() => {
      setSrcDoc(`
      <html>
        <body> ${html} </body>
        <style> ${css} </style>
        <script> ${js} </script>
      </html>
    `)
    }, 1000) //a 1s timeout to prevent instant
    return () => clearTimeout(timeout)
  },[html,css,js])

  const handleShare = async () => {
    try {
      const payload = {
        html: html,
        css: css,
        js: js
      }
      const form = new FormData()
      form.append('api_dev_key', 'TH8K4U4TC01zWHPuxBAGZqTtP-SZDW1w')
      form.append('api_option', 'paste')
      form.append('api_paste_code', JSON.stringify(payload))
      const res = await axios({
        method: 'post',
        url: '/api/api_post.php',
        data: form,
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  //POST request to postbin API and generating a URL
  async function share() {
    const response = await fetch("https://pastebin.com/api/api_post.php", {
      method: 'POST',
      headers:{
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: qs.stringify({
        api_dev_key: "-_minsBkoasDP6qBhWXypBF5fzbyGNFT",
        api_option: "paste",
        api_paste_code: (language==="html")?html:((language==="css")?css:js),
        api_paste_format: (language==="html")?"html5":language
      })
    })//.then(response => console.log(response)).catch(err=>console.log(err))
    //setPastebinLink(response.url)     
    console.log(response)
  }

  //GET request to postbin API and importing the code
  function getCode() {
    const response=''
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
    headers.append('Access-Control-Allow-Credentials', 'true');
    const l='https://pastebin.com/raw/'+importLink.substr(importLink.length-8,8)
    fetch(l,{
      headers: headers
    }).then(response => response.text()) .then(data => {
      console.log(data)
      // response=data
    });
      // if (language==="html") setHtml(response)
      // else if (language==="css") setCss(response)
      // else setJs(response)
  }


  return (
    <>
    
    {/* Popup triggered to share Postbin URL generated */}
    <Popup trigger={popup} link={pastebinLink} setTrigger={setPopup}/>

    <div className={(language)?"pane":"collapsed"}>
      {/* Horizontal File Explorer */}
      <FileExplorer 
        language={language} 
        setLanguage={setLanguage} 
        share={share} 
        getCode={getCode} 
        importLink={importLink} 
        setImportLink={setImportLink}
      />
      {/* Single Editor */}
      <Editor 
        language={language} 
        value={(language==="html")?html:((language==="css")?css:js)} 
        onChange={(language==="html")?setHtml:((language==="css")?setCss:setJs)} 
      /> 
    </div>

    {/* Live Render */}
    <div className={(language)?"pane":"expanded"}>
      <iframe srcDoc={srcDoc} title="output" sandbox="allow-scripts" frameBorder="0" width="100%" height="100%"/>
    </div>

    </>
  )
}

export default App;