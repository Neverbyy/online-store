import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../authStore'
import { describe, it, expect, beforeEach } from 'vitest'

// Мокаем localStorage для Node
if (typeof global.localStorage === 'undefined') {
  global.localStorage = {
    store: {},
    getItem(key) { return this.store[key] || null },
    setItem(key, value) { this.store[key] = String(value) },
    removeItem(key) { delete this.store[key] },
    clear() { this.store = {} }
  }
}

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('логин и логаут работают корректно', async () => {
    const store = useAuthStore()
    // Мокаем данные пользователя и токены
    const user = { id: 1, phone: '123', name: 'Test' }
    store.setUser(user)
    store.setToken('access-token')
    store.setRefreshToken('refresh-token')
    store.login()

    expect(store.isLoggedIn).toBe(true)
    expect(store.user).toEqual(user)
    expect(store.token).toBe('access-token')
    expect(store.refreshToken).toBe('refresh-token')

    store.logout()
    expect(store.isLoggedIn).toBe(false)
    expect(store.user).toEqual({})
    expect(store.token).toBeNull()
    expect(store.refreshToken).toBeNull()
  })

  it('isTokenValid возвращает false для невалидного токена', () => {
    const store = useAuthStore()
    store.setToken('invalid.token.value')
    expect(store.isTokenValid).toBe(false)
  })
})
