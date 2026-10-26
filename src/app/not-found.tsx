import Link from 'next/link'
import {ArrowLeft} from 'lucide-react'
export default function NotFound(){return <main className="not-found"><span>ODYSSEY &nbsp; / &nbsp; 404</span><h1>Looks like this<br/><em>path wandered.</em></h1><p>The page you were looking for isn’t here. The good news? The world is still wide open.</p><Link href="/">Take me home <ArrowLeft size={16}/></Link></main>}
