import { useState, useCallback, useRef, useEffect } from 'react'

export const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const abortion = useRef([])

    const sendRequest = useCallback(async(url, method='GET', body=null, headers={})=>{
        setIsLoading(true)
        const AbortController = window.AbortController
        const abortController = new AbortController()
        abortion.current.push(abortController)
        try {
            const response = await fetch(url,{method, body, headers, signal: abortController.signal})
            const resData = await response.json()
            abortion.current = abortion.current.filter(abtn=>abtn !==abortController)
            if(!response.ok) {
                throw new Error ('Something went wrong')
            }
            setIsLoading(false)
            return resData
        } catch (error) {
            setIsLoading(false)
            setError(error.message)
        }
    },[])
        const clearError = () => {
            setError(null)
        }
        useEffect(()=>{
            abortion.current.forEach(abn=>abn.abort())
        },[])
    return { isLoading, error, sendRequest, clearError }
}