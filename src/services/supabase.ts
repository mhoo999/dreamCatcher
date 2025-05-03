import { createClient } from '@supabase/supabase-js';
import { Dream } from '../types/dream';
import { Goal } from '../types/goal';

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
    .select(`*, goals:goals(*)`)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching dreams:', error);
    throw error;
  }

  return data || [];
}

export async function fetchAllGoals(page = 1, limit = 20): Promise<Goal[]> {
  const offset = (page - 1) * limit;
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
  return data || [];
}

export async function createDream(dream: Omit<Dream, 'id' | 'created_at' | 'updated_at' | 'goals'>): Promise<Dream> {
  const { data, error } = await supabase
    .from('dreams')
    .insert([dream])
    .select('*, goals:goals(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function updateDream(id: string, updates: Partial<Dream>): Promise<Dream> {
  const { data, error } = await supabase
    .from('dreams')
    .update(updates)
    .eq('id', id)
    .select('*, goals:goals(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDream(id: string): Promise<void> {
  const { error } = await supabase
    .from('dreams')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function createGoal(goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>): Promise<Goal> {
  const { data, error } = await supabase
    .from('goals')
    .insert([goal])
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteGoal(id: string): Promise<void> {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id);
  if (error) throw error;
} 