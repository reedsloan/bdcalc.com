<script setup lang="ts">
const supabase = useSupabaseClient()

const signInWithOAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: 'https://ekpyjgrcngxrqzfsqncf.supabase.co/auth/v1/callback',
        },
    })
    if (error) console.log(error)
}

const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.log(error)
}
</script>

<template>
    <div>
        <button @click="signInWithOAuth">Sign in with Discord</button>
        <button @click="signOut">Sign out</button>
    </div>
</template>