import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jodipnyroztccryrncgy.supabase.co';
const supabaseAnonKey = 'sb_publishable_EN1RbKeNm3LLJwExGU6zNA_zX7qPnat';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);