export type Destination = { slug:string; name:string; country:string; tagline:string; description:string; image:string; category:string; note:string }
export const destinations: Destination[] = [
 {slug:'maldives',name:'Maldives',country:'Indian Ocean',tagline:'A quieter kind of paradise.',description:'Trade the familiar for salt air, soft horizons, and unhurried island days. Tell us what your ideal escape looks like and we’ll help shape the details.',image:'maldives',category:'Island escape',note:'For sunlit days & slower living'},
 {slug:'japan',name:'Japan',country:'East Asia',tagline:'A thousand worlds in one.',description:'Find your own rhythm between tranquil gardens, electric city streets, and a food culture that rewards curiosity.',image:'japan',category:'Culture',note:'For curious minds'},
 {slug:'switzerland',name:'Switzerland',country:'Central Europe',tagline:'The long way around is the best way.',description:'Alpine air, storybook villages, and journeys where the view from the window is part of the destination.',image:'switzerland',category:'Mountain escape',note:'For a breath of fresh air'},
 {slug:'bali',name:'Bali',country:'Indonesia',tagline:'Let the island set the pace.',description:'A place to follow winding lanes to the sea, find stillness among green landscapes, and make room for the unexpected.',image:'bali',category:'Tropical',note:'For days without a schedule'},
 {slug:'italy',name:'Italy',country:'Southern Europe',tagline:'Stay for one more story.',description:'Let beautiful old streets, long lunches, and landscapes made for lingering become the backdrop to your next chapter.',image:'italy',category:'Slow travel',note:'For the art of taking your time'},
 {slug:'turkey',name:'Türkiye',country:'Between continents',tagline:'Where every turn reveals a little more.',description:'Discover layered history, spirited markets, and the wonderful feeling of being somewhere entirely different.',image:'turkiye',category:'Culture',note:'For a change of perspective'},
]
export type Package = {slug:string;title:string;destination:string;duration:string;style:string;image:string;description:string;highlights:string[]}
export const packages: Package[] = [
 {slug:'island-days-maldives',title:'Island Days in the Maldives',destination:'Maldives',duration:'7 days · 6 nights',style:'Island escape',image:'maldives',description:'A slower, sun-warmed island escape, shaped around your idea of the perfect Indian Ocean getaway.',highlights:['Time to unwind by the water','Optional ocean experiences','A flexible pace, made for you']},
 {slug:'japan-in-every-season',title:'Japan, in Every Season',destination:'Japan',duration:'10 days · 9 nights',style:'Culture & discovery',image:'japan',description:'A thoughtful introduction to Japan, balancing cultural discovery with time to find your own favourite corners.',highlights:['City and countryside possibilities','Food, craft, and cultural moments','Room to travel at your own pace']},
 {slug:'alpine-slow-journey',title:'An Alpine Slow Journey',destination:'Switzerland',duration:'8 days · 7 nights',style:'Mountain escape',image:'switzerland',description:'Trade hurried checklists for open skies, scenic routes, and a more considered way to see the Alps.',highlights:['Scenic rail journey options','Time in alpine towns','A nature-first itinerary']},
]
export const imageUrl=(id:string,_width=1200)=>`/images/${id}.jpg`
export const journal = [
 {slug:'first-time-japan',category:'Field notes',title:'A first journey through Japan',excerpt:'A few thoughtful ways to make space for the unexpected on a first visit.',image:'japan',date:'Travel inspiration'},
 {slug:'slow-days-maldives',category:'Island living',title:'How to plan a slower island escape',excerpt:'Start with the feeling you want to bring home, then let the itinerary follow.',image:'maldives',date:'Travel inspiration'},
 {slug:'alpine-by-rail',category:'The scenic route',title:'The case for taking the long way through the Alps',excerpt:'When the journey itself becomes one of the best parts of being away.',image:'switzerland',date:'Travel inspiration'},
]
