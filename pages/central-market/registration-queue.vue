<script>
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      connection: null,
      registrationQueue: [],
      centralMarketData: [],
      region: Cookies.get('region') || 'NA',
    };
  },
  mounted() {
    this.countdownInterval = setInterval(this.updateCountdown, 1000); // Update every second
  },
  created() {
    this.fetchItems();
  },
  beforeDestroy() {
    clearInterval(this.countdownInterval);
  },
  methods: {
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
          console.log(this.registrationQueue);
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
      Cookies.set('region', this.region);
      this.fetchItems();
    },
  },
};
</script>

<template>
  <ClientOnly>
    <div class="container mx-auto m-1 rounded-xl w-full h-full">
      <p class="text-center surface rounded-2xl p-8">
        Check out the Registration Queue for the Central Market!
      </p>
      <div class="surface mt-8 rounded-2xl flex flex-row p-4 py-8 items-center">
        <p class="">Region:</p>
        <select
          v-model="region"
          @change="handleRegionChange"
          class="mx-2 surface-light rounded-2xl p-2"
        >
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
              <div
                class="px-4 py-2 surface-light rounded-2xl mx-2 flex flex-row items-center mb-4"
              >
                <!-- image  -->
                <img
                  :src="getIcon(item.item_id)"
                  :class="
                    'w-12 h-12 rounded-xl ' +
                    getBorderForItem(item.item_id) +
                    ' border-2'
                  "
                />
                <!-- name -->
                <div class="flex flex-row flex-grow">
                  <div class="flex flex-col mx-4 self-center">
                    <p class="font-bold">
                      {{
                        getEnhancementLevelString(item.enhancement_level) +
                        getName(item.item_id)
                      }}
                    </p>
                    <p class="text-gray-300">
                      {{ parseInt(item.price).toLocaleString() }}
                    </p>
                  </div>
                  <div
                    v-if="item.remainingSeconds !== undefined"
                    class="flex flex-row flex-grow flex-1 justify-end self-center"
                  >
                    <!-- Adjust the size of the div containing the countdown here -->
                    <p class="w-24 text-center">
                      {{ item.remainingSeconds }}
                    </p>
                    <font-awesome-icon icon="fa-solid fa-clock" size="lg" />
                  </div>
                  <div
                    v-else
                    class="flex flex-row flex-grow flex-1 justify-end self-center"
                  >
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
