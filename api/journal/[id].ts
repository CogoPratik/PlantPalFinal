import { supabase } from '../../lib/supabase';
import { withAuth } from '../../lib/auth';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request, context: { userId: string }) => {
    const { userId } = context;
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
        return new Response(JSON.stringify({ message: 'Journal entry ID is required' }), { status: 400 });
    }

    if (req.method === 'DELETE') {
        // Optional: Delete file from storage if it exists
        const { data: entry } = await supabase.from('journal_entries').select('file_url').eq('id', id).single();
        if (entry?.file_url) {
            const path = new URL(entry.file_url).pathname.split('/journal-files/')[1];
            await supabase.storage.from('journal-files').remove([path]);
        }
        
        const { error } = await supabase
            .from('journal_entries')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            return new Response(JSON.stringify({ message: error.message }), { status: 500 });
        }
        return new Response(null, { status: 204 });
    }

    return new Response('Method Not Allowed', { status: 405 });
};

export default withAuth(handler);
