import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

const SUBSCRIBERS_FILE = path.join(process.cwd(), '.subscribers.json');

function readSubscribers(): string[] {
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch {}
  return [];
}

function writeSubscribers(emails: string[]): void {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(emails, null, 2), 'utf-8');
}

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const email = body.email;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Persist email to disk (survives server restarts on Vercel within deployment)
    // TODO: For production, replace with a real email service API call:
    // ConvertKit (free up to 1,000 subscribers):
    //   await fetch(`https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ api_key: process.env.CONVERTKIT_API_KEY, email })
    //   });
    const subscribers = readSubscribers();
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      writeSubscribers(subscribers);
    }
    console.log(`[Newsletter] New subscriber: ${email} (${subscribers.length} total)`);

    return new Response(JSON.stringify({ success: true, message: 'Subscribed successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Newsletter] Subscribe error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
