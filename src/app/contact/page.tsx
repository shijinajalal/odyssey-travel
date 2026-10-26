import type {Metadata} from 'next'
import Link from 'next/link'
import {ArrowRight,MessageCircle} from 'lucide-react'
import {Eyebrow} from '@/components/site'
import {EnquiryForm} from '@/components/forms'
export const metadata:Metadata={title:'Get in touch',description:'Have a question or an idea for a trip? Start a conversation with Odyssey Travel.',alternates:{canonical:'/contact'}}
export default function Contact(){return <main className="contact-page"><section className="contact-intro"><Eyebrow>WE’RE ALL EARS</Eyebrow><h1>Every journey<br/>starts with <em>hello.</em></h1><p>Whether you have a destination in mind or just a feeling you can’t quite put into words, we’d love to hear about it.</p><Link href="/plan-your-trip" className="button button-dark">Tell us about your trip <ArrowRight size={16}/></Link><div className="contact-later"><MessageCircle size={19}/><div><strong>A question that isn’t about a trip?</strong><p>Use the form and choose your preferred reply method. We’ll be in touch when enquiry delivery is configured.</p></div></div></section><section className="contact-form-area"><Eyebrow>A NOTE TO THE TEAM</Eyebrow><h2>What can we help <em>with?</em></h2><EnquiryForm/></section></main>}
