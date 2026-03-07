const fs = require('fs');
const path = require('path');
const file = path.join('/Users/batu/Desktop/JavaScript/travelApp/client/src/constants/touristLocations.js');
let code = fs.readFileSync(file, 'utf8');

const genericPartStr = `    // Generic Cities & Countries
    "Paris, France", "London, United Kingdom", "New York, USA", "Rome, Italy", 
    "Tokyo, Japan", "Istanbul, Türkiye", "Dubai, UAE", "Singapore, Singapore",
    "Barcelona, Spain", "Amsterdam, Netherlands", "Madrid, Spain", "Prague, Czech Republic",
    "Bangkok, Thailand", "Seoul, South Korea", "Vienna, Austria", "Berlin, Germany",
    "Venice, Italy", "Milan, Italy", "Florence, Italy", "Athens, Greece", 
    "Santorini, Greece", "Mykonos, Greece", "Kyoto, Japan", "Osaka, Japan",
    "Los Angeles, USA", "San Francisco, USA", "Las Vegas, USA", "Miami, USA",
    "Toronto, Canada", "Vancouver, Canada", "Sydney, Australia", "Melbourne, Australia",
    "Rio de Janeiro, Brazil", "Buenos Aires, Argentina", "Cape Town, South Africa",
    "Cairo, Egypt", "Marrakech, Morocco", "Bali, Indonesia", "Phuket, Thailand",
    "Hanoi, Vietnam", "Ho Chi Minh City, Vietnam", "Kuala Lumpur, Malaysia",
    "Beijing, China", "Shanghai, China", "Hong Kong, China", "Taipei, Taiwan",
    "Munich, Germany", "Frankfurt, Germany", "Hamburg, Germany", "Zurich, Switzerland",
    "Geneva, Switzerland", "Lucerne, Switzerland", "Stockholm, Sweden", "Copenhagen, Denmark",
    "Oslo, Norway", "Helsinki, Finland", "Budapest, Hungary", "Warsaw, Poland",
    "Krakow, Poland", "Lisbon, Portugal", "Porto, Portugal", "Dublin, Ireland",
    "Edinburgh, United Kingdom", "Reykjavik, Iceland", "Dubrovnik, Croatia",
    "Split, Croatia", "Bratislava, Slovakia", "Ljubljana, Slovenia",
    "Antalya, Türkiye", "Izmir, Türkiye", "Cappadocia, Türkiye", "Bodrum, Türkiye",
    "Fethiye, Türkiye", "Marmaris, Türkiye", "Ankara, Türkiye", "Bursa, Türkiye",

`;

code = code.replace(/,\s*\/\/ Generic Cities & Countries[\s\S]*?(?=\];)/, '');
code = code.replace('export const TOURIST_LOCATIONS = [', 'export const TOURIST_LOCATIONS = [\n' + genericPartStr);

fs.writeFileSync(file, code);
console.log("Locations reordered prioritizing generic cities.");
