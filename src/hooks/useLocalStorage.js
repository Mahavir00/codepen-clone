import React, { useEffect, useState } from 'react'

const PRE = 'dyte-'
export const useLocalStorage = (key, initialValue) => {
    const prekey = PRE + key //naming the file

    //retrieve
    const [value, setValue] = useState(() => {
        const json = localStorage.getItem(prekey)
        if (json != null) return JSON.parse(json)
        return initialValue
    })

    //store
    useEffect(() => {
        localStorage.setItem(prekey, JSON.stringify(value))
    }, [prekey, value])
    return [value, setValue]
}