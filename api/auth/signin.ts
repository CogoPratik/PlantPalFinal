import { supabase } from '../../lib/supabase';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!data.session || !data.user) {
        return new Response(JSON.stringify({ message: 'Authentication failed.' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    
    return new Response(JSON.stringify({ token: data.session.access_token, user: data.user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (e) {
    return new Response(JSON.stringify({ message: 'An unexpected error occurred.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
  }
}
