import { createClient } from '@supabase/supabase-js';
import { Dream } from '../types/dream';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchUserDreams(
  page = 1,
  limit = 12
): Promise<Dream[]> {
  const offset = (page - 1) * limit;

  const { data, error } = await supabase
    .from('dreams')
    .select(`*, goals:dream_goals(*)`)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching dreams:', error);
    throw error;
  }

  return data || [];
} 