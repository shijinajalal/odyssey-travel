import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'

export const runtime = 'nodejs'
const hits = new Map<string, number[]>()
const clean = (value: unknown, max = 2000) => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : ''
export async function POST(request: NextRequest) {
  const length = Number(request.headers.get('content-length') || 0)
  if (length > 12_000) return NextResponse.json({ error: 'This enquiry is too long. Please shorten your message and try again.' }, { status: 413 })
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now(), recent = (hits.get(ip) || []).filter(t => now - t < 60_000)
  if (recent.length >= 5) return NextResponse.json({ error: 'Please wait a moment before sending another enquiry.' }, { status: 429 })
  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Please check the form and try again.' }, { status: 400 }) }
  if (clean(body.company, 120)) return NextResponse.json({ error: 'We could not accept this submission.' }, { status: 400 })
  const name = clean(body.name, 100), email = clean(body.email, 254), destination = clean(body.destination, 120)
  const departure = clean(body.departure, 10), returnDate = clean(body.returnDate, 10), phone = clean(body.phone, 30)
  const validDate = (date: string) => { if (!date) return true; if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false; const parsed = new Date(`${date}T00:00:00Z`); return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === date }
  if (!name || !destination || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please add your name, destination, and a valid email address.' }, { status: 400 })
  const adults = Number(body.adults), children = Number(body.children)
  if (!Number.isInteger(adults) || adults < 1 || adults > 12 || !Number.isInteger(children) || children < 0 || children > 9) return NextResponse.json({ error: 'Please check the number of travellers.' }, { status: 400 })
  const today = new Date().toISOString().slice(0, 10)
  if (!validDate(departure) || !validDate(returnDate) || (departure && departure < today) || (departure && returnDate && returnDate < departure)) return NextResponse.json({ error: 'Please check your travel dates.' }, { status: 400 })
  if (phone && !/^[+()0-9 .-]{7,25}$/.test(phone)) return NextResponse.json({ error: 'Please check your phone number, including its country code.' }, { status: 400 })
  hits.set(ip, [...recent, now])
  const to = process.env.ENQUIRY_TO_EMAIL, from = process.env.ENQUIRY_FROM_EMAIL, key = process.env.RESEND_API_KEY
  if (!to || !from || !key) return NextResponse.json({ error: 'Enquiry delivery is temporarily unavailable. Please try again later.' }, { status: 503 })
  const reference = `OD-${now.toString(36).toUpperCase()}-${randomUUID().slice(0, 8).toUpperCase()}`
  const lines = [
    `New Odyssey Travel enquiry — ${reference}`, '', `Name: ${name}`, `Email: ${email}`, `Phone / WhatsApp: ${clean(body.phone, 30) || 'Not provided'}`, `Destination: ${destination}`, `Dates: ${departure || 'Flexible'} to ${returnDate || 'Flexible'}`, `Travellers: ${adults} adult(s), ${children} child(ren)`, `Style: ${clean(body.style, 100) || 'Not specified'}`, `Budget: ${clean(body.budget, 80) || 'Not specified'}`, `Preferred reply: ${clean(body.contact, 30) || 'Email'}`, '', 'Notes:', clean(body.message, 2000) || 'None', '', `Reply to: ${email}`,
  ].join('\n')
  try {
    const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from, to: [to], reply_to: email, subject: `Travel enquiry ${reference} — ${destination}`, text: lines }) })
    if (!response.ok) { console.error('Resend rejected enquiry:', response.status); return NextResponse.json({ error: 'We couldn’t deliver your enquiry just now. Please try again shortly.' }, { status: 502 }) }
    return NextResponse.json({ reference })
  } catch { return NextResponse.json({ error: 'We couldn’t deliver your enquiry just now. Please try again shortly.' }, { status: 502 }) }
}
