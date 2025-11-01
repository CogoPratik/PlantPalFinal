import { supabase } from '../../lib/supabase';
import { withAuth } from '../../lib/auth';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request, context: { userId: string }) => {
    const { userId } = context;
    const { method } = req;
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
        return new Response(JSON.stringify({ message: 'Plant ID is required' }), { status: 400 });
    }

    switch (method) {
        case 'PUT':
            try {
                const updatedData = await req.json();
                // Ensure user_id isn't being changed
                delete updatedData.user_id;
                delete updatedData.id;

                const { data, error } = await supabase
                    .from('plants')
                    .update(updatedData)
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

        case 'DELETE':
            try {
                const { error } = await supabase
                    .from('plants')
                    .delete()
                    .eq('id', id)
                    .eq('user_id', userId);

                if (error) throw error;
                return new Response(null, { status: 204 });
            } catch (error: any) {
                return new Response(JSON.stringify({ message: error.message }), { status: 500 });
            }

        default:
            return new Response('Method Not Allowed', { status: 405 });
    }
};

export default withAuth(handler);
