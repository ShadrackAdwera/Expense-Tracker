import React from 'react'
import { useHistory } from 'react-router-dom'

const Error = () => {
    const history = useHistory()
    return <div>
        <h1>There ain't no sh*t here</h1>
        <button onClick={history.push('/')}>Go Bacc</button>
    </div>
}

export default Error