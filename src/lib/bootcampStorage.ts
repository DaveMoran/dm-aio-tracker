import { supabase, isSupabaseConfigured } from './supabase'

const LS_KEY = 'dm_bootcamp_completions'

function getLocalCompletions(): Set<string> {
  const raw = localStorage.getItem(LS_KEY)
  return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
}

function setLocalCompletions(s: Set<string>) {
  localStorage.setItem(LS_KEY, JSON.stringify([...s]))
}

export async function fetchCompletions(): Promise<Set<string>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('bootcamp_completions')
      .select('item_key')
    if (error) throw error
    return new Set((data as { item_key: string }[]).map(r => r.item_key))
  }
  return getLocalCompletions()
}

export async function toggleCompletion(itemKey: string, complete: boolean): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    if (complete) {
      await supabase.from('bootcamp_completions')
        .upsert({ item_key: itemKey }, { onConflict: 'item_key' })
    } else {
      await supabase.from('bootcamp_completions')
        .delete().eq('item_key', itemKey)
    }
    return
  }
  const s = getLocalCompletions()
  if (complete) s.add(itemKey)
  else s.delete(itemKey)
  setLocalCompletions(s)
}
