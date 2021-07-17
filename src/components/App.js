import React, {useState, useEffect} from "react";
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

  //POST request to pastebin, displaying response as popup
  const share = async () => {
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

      const array = res.data.split('/')
      const lastsegment = array[array.length - 1]
      setPastebinLink('https://mahavir00.github.io/codepen-clone/?id=' + lastsegment)
      setPopup(true)
    } catch (error) {
      console.log(error)
    }
  }
  
  //GET request to pastebin and loading the code
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search)
        const pastebinId = queryParams.get('id')
        const res = await axios.get('/raw/' + pastebinId, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setHtml(res.data.html)
        setCss(res.data.css)
        setJs(res.data.js)
      } catch (error) {
        console.log(error)
      }
    }
    fetchCodes()
  }, [])

  return (
    <div className="main">
    
    {/* Popup triggered to share Postbin URL generated */}
    <Popup trigger={popup} link={pastebinLink} setTrigger={setPopup}/>

    <div className={(language)?"pane":"collapsed"}>
      {/* Horizontal File Explorer */}
      <FileExplorer 
        language={language} 
        setLanguage={setLanguage} 
        share={share}
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

    </div>
  )
}

export default App;