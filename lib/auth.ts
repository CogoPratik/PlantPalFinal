import { supabase } from './supabase';

type EdgeHandler = (req: Request, context: { userId: string }) => Promise<Response>;

export function withAuth(handler: EdgeHandler) {
  return async (req: Request): Promise<Response> => {
    // Exclude preflight OPTIONS requests from auth check
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204 });
    }
      
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return new Response(JSON.stringify({ message: 'Authorization header missing' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
        return new Response(JSON.stringify({ message: 'Token missing' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return new Response(JSON.stringify({ message: 'Invalid token or user not found', details: error?.message }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    return handler(req, { userId: user.id });
  };
}
