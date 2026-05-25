import { supabase, isSupabaseConfigured } from './supabase'
import type { ShoppingItem, ShoppingCategory, TodoItem, Priority } from '../types'

function getLocal<T>(key: string): T[] {
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : []
}

function setLocal<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items))
}

function uuid() {
  return crypto.randomUUID()
}

const SHOP_KEY = 'dm_shopping_items'
const TODO_KEY = 'dm_todo_items'

// ── Shopping ───────────────────────────────────────────────────────────────

export async function fetchShoppingItems(): Promise<ShoppingItem[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('shopping_items')
      .select('*')
      .order('created_at')
    if (error) throw error
    return data as ShoppingItem[]
  }
  return getLocal<ShoppingItem>(SHOP_KEY)
}

export async function addShoppingItem(name: string, category: ShoppingCategory): Promise<ShoppingItem> {
  const item: ShoppingItem = {
    id: uuid(),
    name,
    category,
    completed: false,
    created_at: new Date().toISOString(),
  }
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('shopping_items').insert(item).select().single()
    if (error) throw error
    return data as ShoppingItem
  }
  const items = getLocal<ShoppingItem>(SHOP_KEY)
  setLocal(SHOP_KEY, [...items, item])
  return item
}

export async function updateShoppingItem(id: string, changes: Partial<Pick<ShoppingItem, 'name' | 'category' | 'completed'>>): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('shopping_items').update(changes).eq('id', id)
    if (error) throw error
    return
  }
  const items = getLocal<ShoppingItem>(SHOP_KEY)
  setLocal(SHOP_KEY, items.map(i => i.id === id ? { ...i, ...changes } : i))
}

export async function deleteShoppingItem(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('shopping_items').delete().eq('id', id)
    if (error) throw error
    return
  }
  setLocal(SHOP_KEY, getLocal<ShoppingItem>(SHOP_KEY).filter(i => i.id !== id))
}

// ── Todo ───────────────────────────────────────────────────────────────────

export async function fetchTodoItems(): Promise<TodoItem[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('todo_items')
      .select('*')
      .order('created_at')
    if (error) throw error
    return data as TodoItem[]
  }
  return getLocal<TodoItem>(TODO_KEY)
}

export async function addTodoItem(name: string, priority: Priority | null, due_date: string | null): Promise<TodoItem> {
  const item: TodoItem = {
    id: uuid(),
    name,
    priority,
    due_date,
    completed: false,
    created_at: new Date().toISOString(),
  }
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('todo_items').insert(item).select().single()
    if (error) throw error
    return data as TodoItem
  }
  const items = getLocal<TodoItem>(TODO_KEY)
  setLocal(TODO_KEY, [...items, item])
  return item
}

export async function updateTodoItem(id: string, changes: Partial<Pick<TodoItem, 'name' | 'priority' | 'due_date' | 'completed'>>): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('todo_items').update(changes).eq('id', id)
    if (error) throw error
    return
  }
  const items = getLocal<TodoItem>(TODO_KEY)
  setLocal(TODO_KEY, items.map(i => i.id === id ? { ...i, ...changes } : i))
}

export async function deleteTodoItem(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('todo_items').delete().eq('id', id)
    if (error) throw error
    return
  }
  setLocal(TODO_KEY, getLocal<TodoItem>(TODO_KEY).filter(i => i.id !== id))
}
