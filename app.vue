<script setup lang="ts">
const supabase = useSupabaseClient()
const isSignedIn = ref(false)
const avatarUrl = ref("")
const router = useRouter()

supabase.auth.getUser().then((user) => {
  if (user.error) return console.log(user.error)
  isSignedIn.value = true
  avatarUrl.value = user.data.user.user_metadata.avatar_url
})
const isDevelopment = process.env.NODE_ENV === "development"
const redirect = isDevelopment ? "http://localhost:3000" : "https://bdcalc.com"

const signInWithOAuth = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: redirect
    }
  })
  if (error) console.log(error)
}

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.log(error)
  router.push("/")
  isSignedIn.value = false
}
</script>

<template>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap"
    rel="stylesheet"
  />
  <div
    class="bg-[url('/assets/img/bg1.jpg')] absolute h-full w-full text-xl bg-no-repeat bg-cover bg-fixed overflow-scroll"
  >
    <NuxtLayout>
      <nav
        class="font-bold flex flex-row navbar fixed w-full py-6 h-24 items-center px-12"
      >
        <NuxtLink to="/">
          <span class="self-start">bdcalc.com</span>
        </NuxtLink>
        <!-- navbar -->
        <div class="flex flex-col items-center w-full">
          <div class="align-middle flex flex-row place-self-center">
            <!-- <NuxtLink to="/">
              <span
                class="mr-4 p-4 rounded-xl navbar-item hover:ring-1 ring-white"
                >Enhancement Tools</span
              >
            </NuxtLink>
            <NuxtLink to="/central-market">
              <span
                class="mr-4 p-4 rounded-xl navbar-item hover:ring-1 ring-white"
                >Central Market Tools</span
              >
            </NuxtLink> -->
            <NuxtLink to="/central-market/registration-queue">
              <span
                class="mr-4 p-4 rounded-xl navbar-item hover:ring-1 ring-white"
                >Registration Queue</span
              >
            </NuxtLink>
          </div>
        </div>

        <!-- discord profile picture -->
        <div class="flex flex-row" v-if="isSignedIn">
          <img :src="avatarUrl" class="rounded-full w-14 h-14 border-2" />
          <!-- sign out fontawesome icon -->
          <button @click="signOut">
            <font-awesome-icon
              :icon="['fa', 'sign-out-alt']"
              :size="['lg']"
              class="text-gray-300 mx-4 hover:text-white"
            />
          </button>
        </div>

        <div
          class="flex flex-row"
          v-if="!isSignedIn"
        >
          <!-- sign in fontawesome icon -->
          <button @click="signInWithOAuth" class="flex flex-row gap-2 p-2 px-4 rounded-2xl border-2 border-white items-center text-gray-300 mx-1 hover:text-white">
            <font-awesome-icon
              :icon="['fab', 'discord']"
              :size="['lg']"
            />
            <p>LOGIN</p>
          </button>
        </div>
      </nav>
      <div class="container mx-auto mt-20 py-8">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>
