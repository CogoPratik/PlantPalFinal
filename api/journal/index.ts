import { supabase } from '../../lib/supabase';
import { withAuth } from '../../lib/auth';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request, context: { userId: string }) => {
  const { userId } = context;

  switch (req.method) {
    case 'GET':
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) return new Response(JSON.stringify({ message: error.message }), { status: 500 });
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    case 'POST':
      try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const file = formData.get('file') as File | null;
        
        let file_url: string | undefined;
        let file_type: string | undefined;
        let file_name: string | undefined;

        if (file) {
            const filePath = `${userId}/${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from('journal-files')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from('journal-files').getPublicUrl(filePath);
            file_url = urlData.publicUrl;
            file_type = file.type.startsWith('image/') ? 'image' : 'pdf';
            file_name = file.name;
        }

        const { data: newEntry, error: insertError } = await supabase
          .from('journal_entries')
          .insert({ title, content, user_id: userId, file_url, file_type, file_name })
          .select()
          .single();

        if (insertError) throw insertError;
        
        return new Response(JSON.stringify(newEntry), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
      }

    default:
      return new Response('Method Not Allowed', { status: 405 });
  }
};

export default withAuth(handler);
