import React from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/xml/xml' //Syntax Highlighting for HTML
import 'codemirror/mode/css/css'
import 'codemirror/mode/javascript/javascript'
import { Controlled as ControlledEditor } from 'react-codemirror2' //Editor Component



export default function Editor(props) {
    const {language,value,onChange} = props

    const handleChange = (editor, data, value) => onChange(value)

    return (language)?(
        <div className={`editor-container`}>
           <ControlledEditor
           onBeforeChange={handleChange}
           value={value}
           className="code-mirror-wrapper"
           options={{
               lineWrapping:true,
               lint: true,
               mode: (language==='html')?'xml':language,
               theme: "material",
               lineNumbers: true
           }}
           />
        </div>
    ):<></>
}
