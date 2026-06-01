import { supabase, isSupabaseConfigured } from './supabase'
import type { Session } from '@supabase/supabase-js'

export type { Session }

export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured')
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUp(email: string, password: string) {
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured')
  return supabase.auth.signUp({ email, password })
}

export async function signOut() {
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured')
  return supabase.auth.signOut()
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: { subscription: { unsubscribe: () => {} } } }
  }
  return supabase.auth.onAuthStateChange((_event, session) => callback(session))
}
