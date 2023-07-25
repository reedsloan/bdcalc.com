<template>
  <div>
      <p class="text-center surface rounded-2xl p-8">
        Welcome to bdcalc.com! This is a website for the game Black Desert. It
        is a work in progress, and will be updated as I have time.
      </p>
      <div class="grid grid-cols-12 mt-4 gap-4">
        <Card
          title="Registration Queue"
          description="Get notified when items get registered"
          link="/central-market/registration-queue"
          icon="fa-solid fa-clock"
        />
        <Card
          title="Item Filter Search"
          description="Search for a specific item"
          link="/central-market/filtered-search"
          icon="fa-solid fa-magnifying-glass"
        />
        <Card
          title="Accessory Cost Calculator"
          description="Calculate enhancement cost averages"
          link="/central-market/filtered-search"
          icon="fa-solid fa-ring"
        />
      </div>
  </div>
</template>
