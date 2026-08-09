try {
  const raw = localStorage.getItem('pulse:data')
  const theme = raw ? JSON.parse(raw).profile?.theme : null
  document.documentElement.classList.toggle('dark', theme !== 'light')
} catch {
  document.documentElement.classList.add('dark')
}
