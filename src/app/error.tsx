'use client'
import { useEffect } from 'react'
export default function ErrorPage({error,reset}:{error:Error&{digest?:string};reset:()=>void}){useEffect(()=>{console.error(error)},[error]);return <main className="not-found"><span>ODYSSEY &nbsp; / &nbsp; A PAUSE IN THE JOURNEY</span><h1>That didn’t go<br/><em>quite to plan.</em></h1><p>Something unexpected happened. Please try again, or head back to the homepage.</p><button className="button button-dark" onClick={reset}>Try again</button></main>}
