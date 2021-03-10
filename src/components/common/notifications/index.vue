<template>
  <div>
    <audio
      ref="audioRef"
      src="/sounds/alert.mp3"
      class="notifications-player"
    />
    <v-snackbar
      v-if="msg"
      v-model="snackbar"
      :color="msg.color"
      bottom
      left
      app
      multi-line
    >
      <v-row align="center" justify="start" class="">
        <v-col cols="12" class="">
          <b v-if="msg.title" style="font-size: 130%">
            {{ msg.title }}
          </b>
        </v-col>
        <v-col cols="12" class="pt-0">
          {{ msg.text }}
        </v-col>
      </v-row>

      <template v-slot:action="{ attrs }">
        <v-btn color="indigo" text v-bind="attrs" @click="snackbar = false">
          {{ $t("Close") }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "index",

  data() {
    return {
      snackbar: false,
      msg: {
        title: "Notification",
        text: "Text",
        color: "success"
      }
    };
  },
  mounted() {
    this.listen();
  },
  methods: {
    listen() {
      this.$root.$on("notification", this.handleNotification);
    },
    handleNotification(e = {}) {
      this.msg = { ...this.msg, ...e };
      this.snackbar = true;
      this.play();
      this.notifi();
    },
    play() {
      if (this.$refs.audioRef) {
        this.$refs.audioRef.volume = 0.06;
        this.$refs.audioRef.play();
      }
    },
    notifi() {
      let permission = Notification.permission;
      if (permission === "granted") {
        this.showNotification();
      } else if (permission === "default") {
        this.requestAndShowPermission();
      } else {
        alert("Use normal alert");
      }
    },
    showNotification() {
      if (document.visibilityState === "visible") {
        return;
      }
      var title = "JavaScript Jeep";
      let icon = "image-url";
      var body = "Message to be displayed";
      var notification = new Notification(title, { body, icon });
      notification.onclick = () => {
        notification.close();
        window.parent.focus();
      };
    },
    requestAndShowPermission() {
      Notification.requestPermission(permission => {
        if (permission === "granted") {
          this.showNotification();
        }
      });
    }
  }
};
</script>

<style lang="css" scoped>
.notifications-player {
  display: none;
}
</style>
