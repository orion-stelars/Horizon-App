<template>
  <v-container>
    <v-dialog v-model="scheduleDialog" width="700" closeable>
      <v-card>
        <v-card-title>Schedule Visit</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-date-picker v-model="schedule.date" />
            </v-col>
            <v-col cols="12" md="6">
              <v-time-picker v-model="schedule.time" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            class="px-6"
            outlined
            @click="scheduleDialog = false"
            depressed
            large
            >Cancel</v-btn
          >
          <v-btn
            color="primary"
            class="px-6"
            depressed
            large
            @click="submitSchedule"
            >Schedule</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="queries.q"
          :loading="loaders.list"
          placeholder="Search.."
          append-icon="mdi-magnify"
          outlined
          dense
          @input="getVisits"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-spacer />
          <v-col cols="auto">
            <add-visit
              ref="addVisitRef"
              :put="itemOnEdit"
              @success="getVisits()"
              @add-form="itemOnEdit = null"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="visits"
          :loading="loaders.list"
          :hide-default-footer="true"
        >
          <template slot="item" slot-scope="props">
            <tr>
              <td>
                {{ props.item.visitor.map(v => v.name).join(", ") }}
              </td>
              <td>
                {{ $_.uniq(props.item.visitor.map(v => v.company)).join(", ") }}
              </td>
              <td>
                {{ $_.uniq(props.item.visitor.map(v => v.job)).join(", ") }}
              </td>
              <td>
                {{ props.item.reason }}
              </td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">
                      {{ $moment(props.item.created_at).fromNow() }}
                      <br />
                      <b
                        v-if="
                          props.item.actions &&
                            props.item.actions.filter(
                              a => a.name === 'scheduled'
                            ).length
                        "
                        class="info--text"
                      >
                        <v-icon color="info">mdi-clock-outline</v-icon>
                        Scheduled To Be
                        {{
                          $moment(
                            props.item.actions.filter(
                              a => a.name === "scheduled"
                            )[0].scheduled_on
                          ).fromNow()
                        }}
                      </b>
                    </span>
                  </template>
                  {{ $moment(props.item.created_at).format("D/M/YYYY h:m A") }}
                  <b
                    v-if="
                      props.item.actions &&
                        props.item.actions.filter(a => a.name === 'scheduled')
                          .length
                    "
                    class="info--text"
                  >
                    <v-icon color="info">mdi-clock-outline</v-icon>
                    Scheduled To Be
                    {{
                      $moment(
                        props.item.actions.filter(
                          a => a.name === "scheduled"
                        )[0].scheduled_on
                      ).format("D/M/YYYY h:m A")
                    }}
                  </b>
                </v-tooltip>
              </td>
              <td>
                {{ getAddedBy(props.item.added_by) }}
              </td>
              <td>
                <v-btn
                  v-if="isClient"
                  color="warning"
                  icon
                  @click="editItem(props.item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  v-if="isClient"
                  color="error"
                  icon
                  @click="deleteItem(props.item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn
                  v-if="isClient"
                  :loading="loaders.enter"
                  color="info"
                  icon
                  :disabled="!props.item.actions || !props.item.actions.length"
                  @click="submitLeave(props.item)"
                >
                  <v-icon>mdi-arrow-top-left-thin-circle-outline</v-icon>
                </v-btn>
                <v-btn
                  v-else
                  :loading="loaders.enter"
                  color="info"
                  icon
                  :disabled="
                    !props.item.actions ||
                      (props.item.actions.length !== 0 &&
                        !props.item.actions.filter(a => a.name === 'scheduled')
                          .length)
                  "
                  @click="allowEnterence(props.item)"
                >
                  <v-icon>mdi-arrow-top-right-thin-circle-outline</v-icon>
                </v-btn>
                <v-btn
                  v-if="!isClient"
                  :loading="loaders.cancel"
                  color="error"
                  icon
                  :disabled="
                    !props.item.actions || props.item.actions.length !== 0
                  "
                  @click="cancelVisit(props.item)"
                >
                  <v-icon>mdi-close-circle-outline</v-icon>
                </v-btn>
                <v-btn
                  v-if="!isClient"
                  :loading="loaders.schedule"
                  color="warning"
                  icon
                  :disabled="
                    !props.item.actions || props.item.actions.length !== 0
                  "
                  @click="StartScheduleVisit(props.item)"
                >
                  <v-icon>mdi-calendar</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
          <template slot="footer">
            <v-divider />
            <v-row align="center">
              <v-col cols="auto">
                <v-btn :loading="loaders.list" text @click="getVisits(false)">
                  <v-icon>mdi-refresh</v-icon>
                  Refresh
                </v-btn>
              </v-col>
              <v-spacer />
              <v-col cols="auto" class="py-5">
                <span>
                  <v-icon :color="$socket.connected ? 'success' : 'error'"
                    >mdi-circle</v-icon
                  >
                  <span class="px-1">{{
                    $socket.connected ? "Connected" : "Disconnected"
                  }}</span>
                </span>
              </v-col>
            </v-row>
            <v-divider />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AddVisit from "@/components/secertary/AddVisit";
export default {
  name: "SecertaryVisits",
  components: {
    AddVisit
  },
  data() {
    return {
      visits: [],
      itemOnEdit: null,
      itemOnSchedule: null,
      scheduleDialog: false,
      schedule: {
        date: this.$moment().format("YYYY-MM-DD"),
        time: this.$moment().format("HH:mm")
      },
      loaders: {
        list: false,
        enter: false,
        cance: false,
        schedule: false
      },
      queries: {
        q: "",
        action: "leave,cancel"
      },
      headers: [
        { text: "Visitor Name", sortable: false },
        { text: "Visitor Company", sortable: false },
        { text: "Visitor Job", sortable: false },
        { text: "Reason", sortable: false },
        { text: "Date", sortable: false },
        { text: "Created By", sortable: false },
        { text: "Actions", sortable: false }
      ]
    };
  },
  beforeDestroy() {
    this.$socket.client.off("meet_added");
    this.$socket.client.off("meet_updated");
    this.$socket.client.off("meet_deleted");
  },
  mounted() {
    this.getVisits();
    // this.$socket.client.off("meet_added");
    // this.$socket.client.off("meet_updated");
    // this.$socket.client.off("meet_deleted");
  },
  computed: {
    auth() {
      return this.$store.state.auth.user;
    },
    isClient() {
      return this.auth && this.auth.roles.indexOf("client") !== -1;
    }
  },
  methods: {
    listenOnSockets() {
      this.$socket.client.on("meet_added", data => {
        this.visits.push(data);
      });
      this.$socket.client.on("meet_updated", data => {
        const index = this.visits.findIndex(i => i._id === data._id);
        if (index !== -1) {
          this.visits[index] = data;
        }
      });
      this.$socket.client.on("meet_deleted", data => {
        const index = this.visits.findIndex(i => i._id === data._id);
        if (index !== -1) {
          this.visits.splice(index, 1);
        }
      });
    },
    getVisits(listen = true) {
      this.loaders.list = true;
      this.$axios({
        method: "get",
        url: "/visit",
        params: this.queries
      }).then(({ data }) => {
        this.visits = data.visits;
        this.loaders.list = false;
        if (listen) {
          this.listenOnSockets();
        }
      });
    },
    getAddedBy(record) {
      if (!record) {
        return "None";
      } else {
        if (record._id === this.$store.state.auth.user._id) {
          return "You";
        }
        return record.name;
      }
    },
    editItem(item) {
      this.itemOnEdit = item;
      this.$refs.addVisitRef.toggleDialog();
    },
    deleteItem(item) {
      this.loaders.list = true;
      this.$axios.delete(`/visit/${item._id}`).then(() => {
        // this.getVisits();
        this.$socket.client.emit("meet_delete", item);
        this.loaders.list = false;
      });
    },
    allowEnterence(item) {
      this.loaders.enter = true;
      const payload = {
        ...item,
        actions: [
          { name: "enter", created_at: this.$moment.tz("UTC").toDate() }
        ]
      };
      this.$axios.put(`/visit/${item._id}`, payload).then(res => {
        this.loaders.enter = false;
        // this.getVisits();
        this.$socket.client.emit("meet_update", res.data);
      });
    },
    submitLeave(item) {
      this.loaders.enter = true;
      const payload = {
        ...item,
        actions: [
          ...item.actions,
          { name: "leave", created_at: this.$moment.tz("UTC").toDate() }
        ]
      };
      this.$axios.put(`/visit/${item._id}`, payload).then(res => {
        this.loaders.enter = false;
        // this.getVisits();
        this.$socket.client.emit("meet_update", res.data);
      });
    },
    cancelVisit(item) {
      this.loaders.enter = true;
      const payload = {
        ...item,
        actions: [
          ...item.actions,
          { name: "cancel", created_at: this.$moment.tz("UTC").toDate() }
        ]
      };
      this.$axios.put(`/visit/${item._id}`, payload).then(res => {
        this.loaders.enter = false;
        // this.getVisits();
        this.$socket.client.emit("meet_update", res.data);
      });
    },
    StartScheduleVisit(item) {
      this.itemOnSchedule = item;
      this.scheduleDialog = true;
    },
    submitSchedule() {
      const item = this.itemOnSchedule;
      this.loaders.schedule = true;
      const payload = {
        ...item,
        actions: [
          ...item.actions,
          {
            name: "scheduled",
            created_at: this.$moment.tz("UTC").toDate(),
            scheduled_on: `${this.schedule.date} ${this.schedule.time}`
          }
        ]
      };
      this.$axios.put(`/visit/${item._id}`, payload).then(res => {
        this.loaders.schedule = false;
        this.scheduleDialog = false;
        // this.getVisits();
        this.$socket.client.emit("meet_update", res.data);
      });
    }
  }
};
</script>

<style lang="css" scoped></style>
