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
    <div class="w-full">
      <NuxtLayout>
        <header
          class="font-bold px-8 py-8 flex flex-row navbar mb-8 fixed w-full top-0"
        >
          <NuxtLink to="/">
            <span class="absolute hidden lg:block">bdcalc.com</span>
          </NuxtLink>
          <div class="flex flex-row container mx-auto">
            <!-- navbar -->
            <nav class="flex flex-row">
              <NuxtLink to="/">
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
              </NuxtLink>
            </nav>
          </div>
        </header>
        <div class="container mx-auto mt-20 py-8">
          <NuxtPage />
        </div>
      </NuxtLayout>
    </div>
  </div>
</template>
