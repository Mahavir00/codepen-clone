import React from 'react'
// Popup to display generated link
export default function Popup(props) {
    //triggered using props.trigger
    return (props.trigger)? (
        <div className="popup">
            <div className="popup-inner">
                Pastebin Link: <a href={props.link}>{props.link}</a>
                <button 
                    className="btn-close" 
                    onClick={()=>props.setTrigger(false)}
                >
                    CLOSE
                </button>
            </div>
        </div>
    ) : ""
}
