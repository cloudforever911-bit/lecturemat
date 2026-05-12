import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zyynpsmjiljnzwmoqojz.supabase.co'
const supabaseAnonKey = 'sb_publishable_dr5rZabxQBErBLYUKZk9mQ_CWORM2Ox'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
