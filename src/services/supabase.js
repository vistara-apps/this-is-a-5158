import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema helper functions
export const createTables = async () => {
  // Users table
  const { error: usersError } = await supabase.rpc('create_users_table');
  if (usersError) console.error('Error creating users table:', usersError);

  // Generations table
  const { error: generationsError } = await supabase.rpc('create_generations_table');
  if (generationsError) console.error('Error creating generations table:', generationsError);

  // Presets table
  const { error: presetsError } = await supabase.rpc('create_presets_table');
  if (presetsError) console.error('Error creating presets table:', presetsError);
};

// User operations
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserCredits = async (userId, credits) => {
  const { data, error } = await supabase
    .from('users')
    .update({ credits })
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Generation operations
export const saveGeneration = async (generation) => {
  const { data, error } = await supabase
    .from('generations')
    .insert([generation])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserGenerations = async (userId, limit = 50) => {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};

// Preset operations
export const getUserPresets = async (userId) => {
  const { data, error } = await supabase
    .from('presets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const savePreset = async (preset) => {
  const { data, error } = await supabase
    .from('presets')
    .insert([preset])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
