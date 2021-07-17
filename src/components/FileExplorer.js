import React from 'react'

export default function FileExplorer(props) {
    const {language,setLanguage,share}=props
    return (
        <div className="explorer">
            {/* HTML Button */}
            <button 
                className={(language==="html")?"pressed":"btn"} 
                onClick={(language==='html')?()=>setLanguage(""):()=>setLanguage("html")}
            >
                HTML
            </button>

            {/* CSS Button */}
            <button 
                className={(language==="css")?"pressed":"btn"} 
                onClick={(language==='css')?()=>setLanguage(""):()=>setLanguage("css")}
            >
                CSS
            </button>

            {/* Js Button */}
            <button 
                className={(language==="javascript")?"pressed":"btn"} 
                onClick={(language==='javascript')?()=>setLanguage(""):()=>setLanguage("javascript")}
            >
                Js
            </button>

            {/* Share Code Button */}
            <button 
                className="btn postbin" 
                onClick={share}
            >
                Share {/*(language==="html")?"HTML":((language==="css")?"CSS":"JavaScript")*/} Code 
            </button>
            {/* <input type="text" className="postbinLink" size="50" placeholder={`Enter ${language} code shared link...`} value={importLink} onChange={e=>setImportLink(e.target.value)}/> */}
            {/* <button className="btn postbin submit" onClick={getCode}> Import {(language==="html")?"HTML":((language==="css")?"CSS":"JavaScript")} Code </button> */}
        </div>
    )
}
