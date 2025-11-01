import { supabase } from '../../../lib/supabase';
import { withAuth } from '../../../lib/auth';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request, context: { userId: string }) => {
    const { userId } = context;
    const { method } = req;
    const url = new URL(req.url);
    const id = url.pathname.split('/')[3];

    if (!id) {
        return new Response(JSON.stringify({ message: 'Plant ID is required' }), { status: 400 });
    }

    if (method === 'POST') {
        try {
            const { activity } = await req.json();
            const today = new Date().toISOString();
            
            let updateData = {};
            if (activity === 'water') {
                updateData = { last_watered: today };
            } else if (activity === 'fertilize') {
                updateData = { last_fertilized: today };
            } else if (activity === 'groom') {
                updateData = { last_groomed: today };
            } else {
                return new Response(JSON.stringify({ message: 'Invalid activity' }), { status: 400 });
            }
            
            const { data, error } = await supabase
                .from('plants')
                .update(updateData)
                .eq('id', id)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) throw error;

            return new Response(JSON.stringify(data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error: any) {
            return new Response(JSON.stringify({ message: error.message }), { status: 500 });
        }
    }

    return new Response('Method Not Allowed', { status: 405 });
};

export default withAuth(handler);
