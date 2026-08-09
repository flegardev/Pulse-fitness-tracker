import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  LocalStorageAdapter,
  MemoryAdapter,
  STORAGE_KEY,
  StorageError,
  exportFileName,
  parseAppDataJson,
} from '@/lib/storage'
import { emptyAppData } from '@/types'
import { buildDemoData } from '@/data/demoData'

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('round-trips app data', () => {
    const adapter = new LocalStorageAdapter()
    const data = buildDemoData()
    adapter.save(data)
    const loaded = adapter.load()
    expect(loaded).not.toBeNull()
    expect(loaded?.workouts.length).toBe(data.workouts.length)
    expect(loaded?.profile?.name).toBe('Alex')
  })

  it('returns null when nothing is stored', () => {
    expect(new LocalStorageAdapter().load()).toBeNull()
  })

  it('quarantines corrupt JSON and reports that recovery state', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    const adapter = new LocalStorageAdapter()
    expect(() => adapter.load()).toThrow(StorageError)
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(localStorage.getItem('pulse:data:corrupt-backup')).toBe('{not json')
  })

  it('rejects well-formed JSON with the wrong shape', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ hello: 'world' }))
    expect(() => new LocalStorageAdapter().load()).toThrow(StorageError)
  })

  it('drops malformed nested records instead of crashing', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...emptyAppData(),
        workouts: [{ id: 'bad', name: 'Bad workout', status: 'surprise', createdAt: 'now', exercises: [] }],
        customExercises: [{ id: 'bad-custom' }],
      }),
    )
    const loaded = new LocalStorageAdapter().load()
    expect(loaded).not.toBeNull()
    expect(loaded?.workouts).toEqual([])
    expect(loaded?.customExercises).toEqual([])
  })

  it('clears stored data', () => {
    const adapter = new LocalStorageAdapter()
    adapter.save(emptyAppData())
    adapter.clear()
    expect(adapter.load()).toBeNull()
  })

  it('reports a blocked write instead of silently accepting it', () => {
    const blocked = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'QuotaExceededError')
    })
    expect(() => new LocalStorageAdapter().save(emptyAppData())).toThrow(/could not save/i)
    blocked.mockRestore()
  })
})

describe('MemoryAdapter', () => {
  it('round-trips and isolates copies', () => {
    const adapter = new MemoryAdapter()
    const data = emptyAppData()
    adapter.save(data)
    const loaded = adapter.load()
    expect(loaded).toEqual(data)
    expect(loaded).not.toBe(data)
  })
})

describe('exportFileName', () => {
  it('formats a dated filename', () => {
    expect(exportFileName(new Date(2026, 5, 12))).toBe('pulse-export-20260612.json')
  })
})

describe('parseAppDataJson', () => {
  it('parses a Pulse export', () => {
    const data = buildDemoData()
    expect(parseAppDataJson(JSON.stringify(data)).workouts.length).toBe(data.workouts.length)
  })

  it('rejects non-Pulse JSON', () => {
    expect(() => parseAppDataJson(JSON.stringify({ hello: 'world' }))).toThrow(/missing required/i)
  })

  it('rejects future backups rather than coercing them to the current schema', () => {
    const future = { ...buildDemoData(), version: 99 }
    expect(() => parseAppDataJson(JSON.stringify(future))).toThrow(/newer Pulse data version 99/i)
  })
})
