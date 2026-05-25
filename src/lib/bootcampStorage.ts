import { supabase, isSupabaseConfigured } from './supabase'

const LS_COMPLETIONS_KEY = 'dm_bootcamp_completions'
const LS_CONTENT_KEY = 'dm_bootcamp_content'

function getLocalCompletions(): Set<string> {
  const raw = localStorage.getItem(LS_COMPLETIONS_KEY)
  return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
}

function setLocalCompletions(s: Set<string>) {
  localStorage.setItem(LS_COMPLETIONS_KEY, JSON.stringify([...s]))
}

function getLocalContent(): Map<string, string> {
  const raw = localStorage.getItem(LS_CONTENT_KEY)
  if (!raw) return new Map()
  return new Map(Object.entries(JSON.parse(raw) as Record<string, string>))
}

function setLocalContent(m: Map<string, string>) {
  localStorage.setItem(LS_CONTENT_KEY, JSON.stringify(Object.fromEntries(m)))
}

export interface BootcampState {
  completed: Set<string>
  content: Map<string, string>
}

export async function fetchBootcampState(): Promise<BootcampState> {
  if (isSupabaseConfigured && supabase) {
    const [completionsRes, contentRes] = await Promise.all([
      supabase.from('bootcamp_completions').select('item_key'),
      supabase.from('bootcamp_content').select('item_key, content'),
    ])
    if (completionsRes.error) throw completionsRes.error
    if (contentRes.error) throw contentRes.error
    return {
      completed: new Set((completionsRes.data as { item_key: string }[]).map(r => r.item_key)),
      content: new Map((contentRes.data as { item_key: string; content: string }[]).map(r => [r.item_key, r.content])),
    }
  }
  return {
    completed: getLocalCompletions(),
    content: getLocalContent(),
  }
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

export async function saveItemContent(itemKey: string, contentStr: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await Promise.all([
      supabase.from('bootcamp_content')
        .upsert({ item_key: itemKey, content: contentStr, updated_at: new Date().toISOString() }, { onConflict: 'item_key' }),
      supabase.from('bootcamp_completions')
        .upsert({ item_key: itemKey }, { onConflict: 'item_key' }),
    ])
    return
  }
  const m = getLocalContent()
  m.set(itemKey, contentStr)
  setLocalContent(m)
  const s = getLocalCompletions()
  s.add(itemKey)
  setLocalCompletions(s)
}
