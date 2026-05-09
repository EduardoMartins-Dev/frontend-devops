const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

async function checkAuth() {
    const { data: { session } } = await db.auth.getSession()
    if (!session) {
        window.location.href = 'login.html'
    }
    return session
}

async function logout() {
    await db.auth.signOut()
    window.location.href = 'login.html'
}

