import React, { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../../shared/auth-context'

const Welcome = () => {
    const auth = useContext(AuthContext)
    const [userName, setUserName] = useState()
    const history = useHistory()
    useEffect(()=>{
        setUserName(JSON.parse(localStorage.getItem('userName')))
    },[userName])
    const localStorageHandler = () => {
        localStorage.removeItem('userName')
        auth.logout()
        history.push('/')
    }
    return <div>
        <h1>Welcome, {userName}</h1>
        <button onClick={localStorageHandler}>LOG OUT</button>
    </div>
}

export default Welcome