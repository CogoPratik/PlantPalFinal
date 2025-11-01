import { supabase } from '../../lib/supabase';
import { withAuth } from '../../lib/auth';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request, context: { userId: string }) => {
    const { userId } = context;
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const { data, error } = await supabase
                    .from('plants')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                return new Response(JSON.stringify(data), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (error: any) {
                return new Response(JSON.stringify({ message: error.message }), { status: 500 });
            }

        case 'POST':
            try {
                const formData = await req.formData();
                const plantData: any = {};
                formData.forEach((value, key) => {
                    if (key !== 'photo') {
                        plantData[key] = value;
                    }
                });
                
                const photo = formData.get('photo') as File | null;
                let imageUrl = 'https://picsum.photos/id/1025/500/600'; // Default image

                if (photo) {
                    const filePath = `${userId}/${Date.now()}-${photo.name}`;
                    const { error: uploadError } = await supabase.storage
                        .from('plant-images')
                        .upload(filePath, photo);
                    
                    if (uploadError) throw uploadError;

                    const { data: urlData } = supabase.storage
                        .from('plant-images')
                        .getPublicUrl(filePath);
                    
                    imageUrl = urlData.publicUrl;
                }

                const newPlantPayload = {
                    ...plantData,
                    user_id: userId,
                    image_url: imageUrl,
                    watering_frequency: parseInt(plantData.watering_frequency, 10),
                    fertilizing_frequency: parseInt(plantData.fertilizing_frequency, 10),
                };

                const { data: newPlant, error: insertError } = await supabase
                    .from('plants')
                    .insert(newPlantPayload)
                    .select()
                    .single();

                if (insertError) throw insertError;

                return new Response(JSON.stringify(newPlant), {
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
