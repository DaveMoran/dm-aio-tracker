import { isSupabaseConfigured } from './supabase'
import * as api from './bootcampApi'

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
  if (isSupabaseConfigured) {
    const [completions, content] = await Promise.all([
      api.fetchCompletions(),
      api.fetchContent(),
    ])
    return {
      completed: new Set(completions.map(r => r.item_key)),
      content: new Map(content.map(r => [r.item_key, r.content])),
    }
  }
  return {
    completed: getLocalCompletions(),
    content: getLocalContent(),
  }
}

export async function toggleCompletion(itemKey: string, complete: boolean): Promise<void> {
  if (isSupabaseConfigured) {
    await api.toggleCompletion(itemKey, complete)
    return
  }
  const s = getLocalCompletions()
  if (complete) s.add(itemKey)
  else s.delete(itemKey)
  setLocalCompletions(s)
}

export async function saveItemContent(itemKey: string, contentStr: string): Promise<void> {
  if (isSupabaseConfigured) {
    await api.saveContent(itemKey, contentStr)
    return
  }
  const m = getLocalContent()
  m.set(itemKey, contentStr)
  setLocalContent(m)
  const s = getLocalCompletions()
  s.add(itemKey)
  setLocalCompletions(s)
}
