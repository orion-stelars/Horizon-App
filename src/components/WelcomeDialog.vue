<template>
  <v-dialog :value="showDialog" width="500" persistent>
    <v-card color="primary darken-3" dark>
      <v-card-text>
        <v-row justify="center" class="pt-10">
          <v-col cols="auto">
            <v-row justify="center" class="pt-5">
              <v-col cols="auto" class="mb-0 pb-0" style="min-height: 350px;">
                <v-avatar size="350" v-if="src">
                  <v-img :src="src" class="animated rotateIn" />
                </v-avatar>
                <v-progress-circular
                  v-else
                  :size="350"
                  color="#30E9B7"
                  width="10"
                  indeterminate
                />
              </v-col>
            </v-row>
            <v-row justify="center" class="pt-0">
              <v-col cols="auto" class="mb-0 pb-0">
                <p
                  style="font-weight: 200; font-size: 50px; direction: ltr; color: #30E9B7"
                  class="px-3 text-center py-10 animated fadeIn"
                >
                  <span v-if="frame">{{ frame }}</span>
                  <span v-else> </span>
                </p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "WelcomeDialog",

  data() {
    return {
      showDialog: true,
      frame: "ORION",
      src: null
    };
  },
  mounted() {
    setTimeout(() => {
      this.src = "/orion-logo.png";
      this.frame = "ORION";
      setTimeout(() => {
        this.src = null;
        this.frame = "Presents";
        setTimeout(() => {
          this.src = "/horizon.png";
          this.frame = "Horizon";
          setTimeout(() => {
            this.showDialog = false;
          }, 3000);
        }, 1700);
      }, 3000);
    }, 1000);
  }
};
</script>

<style lang="css" scoped></style>
