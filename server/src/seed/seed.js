// server/src/seed/seed.js
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Event from '../models/Event.js';
import Rsvp from '../models/Rsvp.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const img = (seed) => `https://picsum.photos/seed/${seed}/640/480`;

async function runSeed() {
  const counts = await Promise.all([
    User.estimatedDocumentCount(),
    Listing.estimatedDocumentCount(),
    Event.estimatedDocumentCount(),
  ]);
  if (counts[0] > 0 && counts[1] > 0 && counts[2] > 0) {
    console.log('[seed] data already present, skipping');
    return;
  }
  console.log('[seed] seeding campus data…');

  const hash = await bcrypt.hash('campus123', 10);
  const me = await User.create({ name: 'You', email: 'you@campus.edu', passwordHash: hash, campus: 'North Campus', verified: true, avatar: '' });

  const peers = await User.insertMany([
    { name: 'Aarav Sharma', email: 'aarav@campus.edu', passwordHash: hash, campus: 'North Campus', verified: true },
    { name: 'Diya Patel', email: 'diya@campus.edu', passwordHash: hash, campus: 'North Campus', verified: true },
    { name: 'Kabir Mehta', email: 'kabir@campus.edu', passwordHash: hash, campus: 'South Campus', verified: false },
    { name: 'Isha Verma', email: 'isha@campus.edu', passwordHash: hash, campus: 'North Campus', verified: true },
    { name: 'Reyansh Roy', email: 'reyansh@campus.edu', passwordHash: hash, campus: 'North Campus', verified: true },
  ]);
  const all = [me, ...peers];

  const listings = await Listing.insertMany([
    { seller: peers[0]._id, title: 'MacBook Air M1 (2020)', description: 'Barely used, battery health 95%. Comes with charger and sleeve. Great for coding and design work.', price: 58000, category: 'electronics', condition: 'like-new', images: [img('macbook')], location: 'Engineering Block' },
    { seller: peers[1]._id, title: 'Calculus: Early Transcendentals', description: '8th edition, minimal highlights. Perfect for first-year math.', price: 450, category: 'books', condition: 'good', images: [img('book')], location: 'Library' },
    { seller: peers[2]._id, title: 'IKEA Study Lamp', description: 'Adjustable LED desk lamp, white. Works perfectly.', price: 450, category: 'furniture', condition: 'good', images: [img('lamp')], location: 'Hostel C' },
    { seller: peers[3]._id, title: 'Mountain Bicycle', description: '21-speed, recently serviced, new tyres. Smooth ride around campus.', price: 4200, category: 'bicycles', condition: 'good', images: [img('bike')], location: 'Sports Complex' },
    { seller: peers[4]._id, title: 'Mini Fridge (95L)', description: 'Compact fridge, ideal for hostel room. Cooling works great.', price: 3200, category: 'furniture', condition: 'fair', images: [img('fridge')], location: 'Hostel A' },
    { seller: peers[0]._id, title: 'Acoustic Guitar', description: 'Yamaha F310, great tone, with gig bag. A few scratches.', price: 5500, category: 'other', condition: 'good', images: [img('guitar')], location: 'Music Room' },
    { seller: peers[1]._id, title: 'Physics Lab Coat (Set of 2)', description: 'Size M, washed and clean. Selling as I graduated.', price: 300, category: 'clothing', condition: 'like-new', images: [img('coat')], location: 'Science Block' },
    { seller: peers[3]._id, title: 'Campus Fest Pass', description: 'Two-day all-access pass for the upcoming spring fest.', price: 600, category: 'tickets', condition: 'new', images: [img('pass')], location: 'Student Center' },
  ]);

  const now = new Date();
  const inDays = (d, h = 18) => { const x = new Date(now); x.setDate(x.getDate() + d); x.setHours(h, 0, 0, 0); return x; };

  const events = await Event.insertMany([
    { organizer: peers[0]._id, title: 'Career Night: Tech & Consulting', description: 'Meet recruiters from top firms. Bring your resumes and questions.', category: 'career', location: 'Student Center', startTime: inDays(3, 18), endTime: inDays(3, 21), attendeeCount: 48 },
    { organizer: peers[1]._id, title: 'Coding Club Meetup', description: 'Weekly problem-solving session. All skill levels welcome.', category: 'clubs', location: 'Lab 2', startTime: inDays(1, 17), endTime: inDays(1, 19), attendeeCount: 23 },
    { organizer: peers[2]._id, title: 'Placement Preparation Session', description: 'Mock interviews and DSA warmups with seniors.', category: 'academic', location: 'Seminar Hall', startTime: inDays(5, 16), attendeeCount: 64 },
    { organizer: peers[3]._id, title: 'Campus Photography Walk', description: 'Golden-hour photo walk around the lake. Cameras provided.', category: 'arts', location: 'North Lawn', startTime: inDays(2, 17), attendeeCount: 31 },
    { organizer: peers[4]._id, title: 'Inter-Hostel Football League', description: 'Final match of the league. Cheer for your block!', category: 'sports', location: 'Main Ground', startTime: inDays(4, 16), attendeeCount: 112 },
    { organizer: peers[0]._id, title: 'Welcome Social & Board Games', description: 'Kick off the semester with games and snacks.', category: 'social', location: 'Common Room', startTime: inDays(0, 19), attendeeCount: 57 },
  ]);

  await Rsvp.insertMany([
    { event: events[0]._id, user: me._id, status: 'going' },
    { event: events[1]._id, user: me._id, status: 'going' },
    { event: events[0]._id, user: peers[1]._id, status: 'going' },
    { event: events[2]._id, user: peers[2]._id, status: 'going' },
  ]);
  events[0].attendeeCount += 2; events[2].attendeeCount += 1;
  await events[0].save(); await events[2].save();

  me.savedListings.push(listings[0]._id, listings[3]._id);
  me.savedEvents.push(events[1]._id);
  await me.save();

  const convo = await Conversation.create({
    participants: [me._id, peers[0]._id],
    listing: listings[0]._id,
    lastMessage: 'Is the MacBook still available?',
    lastMessageAt: new Date(now.getTime() - 1000 * 60 * 12),
  });
  await Message.insertMany([
    { conversation: convo._id, sender: me._id, body: 'Hey! Is the MacBook Air still available?' },
    { conversation: convo._id, sender: peers[0]._id, body: 'Yes! It is. Battery is great, barely used.' },
    { conversation: convo._id, sender: me._id, body: 'Awesome. Can we meet near the Engineering Block?' },
    { conversation: convo._id, sender: peers[0]._id, body: 'Sure, tomorrow at 4?' },
  ]);

  console.log(`[seed] done — ${all.length} users, ${listings.length} listings, ${events.length} events`);
  console.log('[seed] login: you@campus.edu / campus123');
}

export { runSeed };
