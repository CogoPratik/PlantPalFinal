import { supabase } from '../../lib/supabase';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { fullname, email, password } = await req.json();

    if (!fullname || !email || !password) {
      return new Response(JSON.stringify({ message: 'Full name, email, and password are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullname: fullname,
        },
      },
    });

    if (error) {
        return new Response(JSON.stringify({ message: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    
    // Check if user and session are created, handle cases like email confirmation required
    if (!data.session || !data.user) {
        return new Response(JSON.stringify({ message: 'Signup successful, but session could not be created. Please check your email for confirmation.' }), {
            status: 200, // Or 207 for multi-status
            headers: { 'Content-Type': 'application/json' },
        });
    }
    
    return new Response(JSON.stringify({ token: data.session.access_token, user: data.user }), {
      status: 201, // 201 Created
      headers: { 'Content-Type': 'application/json' },
    });
  } catch(e) {
    return new Response(JSON.stringify({ message: 'An unexpected error occurred.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }
}
