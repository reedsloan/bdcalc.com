<script>
import Cookies from "js-cookie";

export default {
  data() {
    return {
      connection: null,
      registrationQueue: [],
      centralMarketData: [],
      region: Cookies.get("region") || "NA",
      selectedNotificationItemIndex: null,
      notificationItemFilters: [],
      filterItem: "",
      supabase: useSupabaseClient(),
      user: useSupabaseUser(),
    };
  },
  mounted() {
    this.countdownInterval = setInterval(this.updateCountdown, 1000); // Update every second
  },
  created() {
    this.fetchItems();
    this.getNotificationItems();
  },
  beforeDestroy() {
    clearInterval(this.countdownInterval);
  },
  methods: {
    getNotificationItems() {
      this.supabase
        .from("user_data")
        .select("*")
        .eq("user_id", this.user.id)
        .single()
        .then((data) => {
          // on error, create the user_data table
          if (data.error?.code == "PGRST116") {
            console.log("Creating user_data table")
            this.supabase
              .from("user_data")
              .insert([
                {
                  user_id: this.user.id,
                  registration_queue_filter: []
                }
              ])
              .then((data) => {
                this.notificationItemFilters = []
              })
            return
          } else {
            this.notificationItemFilters = data.data.registration_queue_filter
          }
        })
    },
    fetchItems() {
      fetch(
        "https://apiv2.bdolytics.com/en/" +
        this.region +
        "/market/central-market-data"
      ).then((response) => {
        response.json().then((json) => {
          this.centralMarketData = json.data;
        });
      });

      if (process.client) {
        console.log("Starting connection to WebSocket Server");
        this.connection = new WebSocket(
          "wss://ws.bdolytics.com/websocket/registration-queue"
        );

        // Use an arrow function to retain the Vue instance's context
        this.connection.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.registrationQueue = data;
          this.updateCountdown();
        };

        this.connection.onopen = (event) => {
          console.log("Successfully connected to the WebSocket server...");
          const data = JSON.stringify({ region: this.region });
          this.connection.send(data);
        };

        this.connection.onclose = (event) => {
          console.log("Connection to the WebSocket server was closed.");
        };

        this.connection.onerror = (event) => {
          console.log(
            "An error occurred while connecting to the WebSocket server."
          );
        };
      }
    },
    getItemDataById(id) {
      if (
        !Array.isArray(this.centralMarketData) ||
        this.centralMarketData.length === 0
      ) {
        // Central Market data is not available or empty, handle the error
        console.error("Central Market data is not available or empty.");
        return "";
      }
      const item = this.centralMarketData.find((item) => item.id == id);
      if (!item) {
        // Item with the given id was not found, handle the error
        console.error(
          "Item with id " + id + " was not found in the Central Market data."
        );
        return "";
      }
      return item;
    },
    getIcon(id) {
      const item = this.getItemDataById(id);
      return (
        "https://cdn.bdolytics.com/img/" +
        item.icon_image +
        ".webp"
      ).toLowerCase();
    },
    getName(id) {
      return this.getItemDataById(id).name;
    },
    // This function takes a unix timestamp and returns the number of seconds until that time.
    // This is useful for determining the time remaining until a sale starts or ends.
    getSecondsFromNow(timestamp) {
      const sale_time = new Date(parseInt(timestamp * 1000));
      const now = new Date();
      const difference = sale_time - now;
      const seconds = Math.floor(difference / 1000);
      return seconds;
    },
    updateCountdown() {
      this.registrationQueue.forEach((item) => {
        item.remainingSeconds = this.getSecondsFromNow(item.timestamp);
      });
    },
    getGrade(id) {
      return parseInt(this.getItemDataById(id).grade_type);
    },
    getBorderForItem(id) {
      switch (this.getGrade(id)) {
        case 0:
          return "border-white";
        case 1:
          return "border-green-500";
        case 2:
          return "border-blue-500";
        case 3:
          return "border-yellow-500";
        case 4:
          return "border-orange-500";
        default:
          return "border-white";
      }
    },
    getEnhancementLevelString(int) {
      // get PRI, DUO, TRI, TET, PEN (accessories are 1-5 and armor/weapons are 15-20)
      switch (parseInt(int)) {
        case 1:
          return "PRI: ";
        case 2:
          return "DUO: ";
        case 3:
          return "TRI: ";
        case 4:
          return "TET: ";
        case 5:
          return "PEN: ";
        case 16:
          return "PRI: ";
        case 17:
          return "DUO: ";
        case 18:
          return "TRI: ";
        case 19:
          return "TET: ";
        case 20:
          return "PEN: ";
        default:
          return "";
      }
    },
    handleRegionChange() {
      this.region = this.region;
      Cookies.set("region", this.region);
      this.fetchItems();
    },
    isNotificationItem(item) {
      for (const filter of this.notificationItemFilters) {
        if (
          this.getName(item.item_id)
            .toLowerCase()
            .includes(filter.name.toLowerCase())
        ) {
          if (
            this.getEnhancementLevelString(item.enhancement_level) ===
            filter.enhancement_level ||
            filter.enhancement_level === ""
          ) {
            return true;
          }
        }
      }

      return false;
    },
    getItemFullName(item) {
      return (
        this.getEnhancementLevelString(item.enhancement_level) +
        this.getName(item.item_id)
      );
    },
    addNotificationItemFilter(name) {
      this.notificationItemFilters.push({
        name: name,
        enhancement_level: document.getElementById("enhancement-level").value,
      });
      this.updateRegistrationQueueFilter(this.notificationItemFilters)

      this.selectedNotificationItemIndex = null;
    },
    removeSelectedItemFilter() {
      this.notificationItemFilters.splice(
        this.selectedNotificationItemIndex,
        1
      );
      this.updateRegistrationQueueFilter(this.notificationItemFilters)
      this.selectedNotificationItemIndex = null;
    },
    // update the registration_queue_filter column in the user_data table in supabase where the user_id is the current user
    updateRegistrationQueueFilter(filters) {

      this.supabase
        .from("user_data")
        .update({ registration_queue_filter: filters })
        .eq("user_id", this.user.id)
        .then((data) => {
          console.log(data)
          console.log(this.user.id)
        })
    },
  },
};
</script>

<template>
  <ClientOnly>
    <div class="container mx-auto m-1 rounded-xl w-full h-full">
      <div class="surface rounded-2xl p-8 flex flex-row items-center">
        <div>
          <label for="region" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Region</label>
          <select v-model="region" @change="handleRegionChange" id="region" class="surface-light rounded-2xl p-2">
            <option value="NA">NA</option>
            <option value="EU">EU</option>
            <option value="MENA">MENA</option>
            <option value="RU">RU</option>
            <option value="SEA">SEA</option>
            <option value="TH">TH</option>
            <option value="JP">JP</option>
            <option value="SA">SA</option>
            <option value="KR">KR</option>
            <option value="TW">TW</option>
            <option value="GT">GT</option>
            <option value="CEU">CEU</option>
            <option value="CNA">CNA</option>
            <option value="CAS">CAS</option>
          </select>
        </div>
        <p class="text-center w-full">
          Check out the Registration Queue for the Central Market!
        </p>
      </div>
      <div class="surface mt-8 rounded-2xl grid grid-cols-12 p-8 py-8 items-center">
        <div class="col-span-6 flex flex-col gap-4">
          <div class="">
            <p class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Notification Items:
            </p>
            <!-- list of buttons to set selectedNotificationItem -->
            <div class="flex flex-wrap gap-2">
              <button v-if="selectedNotificationItemIndex >= 0" v-for="(filter, index) in notificationItemFilters"
                :key="index" @click="
                  selectedNotificationItemIndex === index
                    ? (selectedNotificationItemIndex = null)
                    : (selectedNotificationItemIndex = index)
                  " :class="`surface-light p-3 rounded-2xl flex flex-row hover:ring-1 ring-white items-center' ${selectedNotificationItemIndex === index ? 'ring-2' : ''
    }`">
                <p class="text-center w-full">
                  {{ filter.enhancement_level + filter.name }}
                </p>
              </button>
            </div>
          </div>
          <div>
            <!-- remove filter button -->
            <button v-if="selectedNotificationItemIndex != null"
              class="bg-red-500 p-3 rounded-2xl flex flex-row hover:ring-1 ring-white items-center"
              @click="removeSelectedItemFilter()">
              <font-awesome-icon icon="fa-solid fa-trash" size="lg" />
              <p class="mx-4 text-center w-full">Delete Filter</p>
            </button>
          </div>
        </div>
        <!-- dropdown to add enhancement level to filter (PRI, DUO, TRI, TET, PEN) -->
        <div class="col-span-6 flex flex-row items-end gap-4">
          <div>
            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enhancement
              level</label>
            <select id="enhancement-level" name="enhancement-level" class="surface-light rounded-2xl p-3 w-full">
              <option selected value="">Any</option>
              <option value="PRI: ">PRI</option>
              <option value="DUO: ">DUO</option>
              <option value="TRI: ">TRI</option>
              <option value="TET: ">TET</option>
              <option value="PEN: ">PEN</option>
            </select>
          </div>

          <div>
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item name</label>
            <input v-model="filterItem" class="surface-light rounded-2xl p-3" id="name" placeholder="Item name" />
          </div>
          <div class="flex flex-col gap-2">
            <!-- add filter button -->
            <button class="bg-green-500 p-3 rounded-2xl flex flex-row hover:ring-1 ring-white items-center h-full"
              @click="addNotificationItemFilter(filterItem)">
              <font-awesome-icon icon="fa-solid fa-add" size="lg" />
              <p class="mx-4 text-center w-full">Add Filter</p>
            </button>
          </div>
        </div>
      </div>
      <div class="surface py-2 mt-8 rounded-2xl flex flex-row">
        <!-- <div>
          <button
            class="surface-light p-8 rounded-2xl m-4 flex flex-row col-span-2 w-96 h-16 hover:ring-1 ring-white items-center"
          >
            <font-awesome-icon icon="fa-solid fa-clock" size="lg" />
            <p class="mx-4 text-center w-full">In Registration Queue</p>
          </button>

          <button
            class="surface-light p-8 rounded-2xl m-4 flex flex-row col-span-2 w-96 h-16 hover:ring-1 ring-white items-center"
          >
            <font-awesome-icon icon="fa-solid fa-clock" size="lg" />
            <p class="mx-4 text-center w-full">Main Weapon</p>
          </button>
        </div> -->
        <div class="flex-1 mx-2">
          <!-- data -->
          <div class="flex flex-col mt-4">
            <!-- registered items -->
            <div v-for="item in registrationQueue">
              <div :class="`px-4 py-2 surface-light rounded-2xl mx-2 flex flex-row items-center mb-4 ${isNotificationItem(item) ? 'border-2 border-yellow-500' : ''
                }`">
                <!-- image  -->
                <img :src="getIcon(item.item_id)" :class="'w-12 h-12 rounded-xl ' +
                  getBorderForItem(item.item_id) +
                  ' border-2'
                  " />
                <!-- name -->
                <div class="flex flex-row flex-grow">
                  <div class="flex flex-col mx-4 self-center">
                    <p class="font-bold">
                      {{ getItemFullName(item) }}
                    </p>
                    <p class="text-gray-300">
                      {{ parseInt(item.price).toLocaleString() }}
                    </p>
                  </div>
                  <div v-if="item.remainingSeconds !== undefined"
                    class="flex flex-row flex-grow flex-1 justify-end self-center">
                    <!-- Adjust the size of the div containing the countdown here -->
                    <p class="w-24 text-center">
                      {{ item.remainingSeconds }}
                    </p>
                    <font-awesome-icon icon="fa-solid fa-clock" size="lg" />
                  </div>
                  <div v-else class="flex flex-row flex-grow flex-1 justify-end self-center">
                    <p class="w-8">-</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
