<template>
  <v-container>
    <v-dialog v-model="scheduleDialog" width="700" closeable>
      <v-card>
        <v-card-title>{{ $t("Schedule Visit") }}</v-card-title>
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
            >{{ $t("Cancel") }}</v-btn
          >
          <v-btn
            color="primary"
            class="px-6"
            depressed
            large
            @click="submitSchedule"
            >{{ $t("Schedule") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card style="width: 100%" class="my-5 px-5 py-0">
      <v-row align="center" class="py-0">
        <v-col cols="12" md="6" class="py-0">
          <v-text-field
            v-model="queries.q"
            :loading="loaders.list"
            :placeholder="`${$t('Search')}..`"
            append-icon="mdi-magnify"
            class="mt-4"
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
    </v-card>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="visits"
              :loading="loaders.list"
              :hide-default-footer="true"
            >
              <template slot="item" slot-scope="props">
                <tr
                  :class="[
                    {
                      'success white--text':
                        !props.item.loader && lastActionIs('enter', props.item)
                    },
                    {
                      'error white--text':
                        !props.item.loader && lastActionIs('cancel', props.item)
                    },
                    {
                      'info white--text':
                        !props.item.loader &&
                        lastActionIs('scheduled', props.item)
                    },
                    {
                      'warning white--text':
                        !props.item.loader && lastActionIs('wait', props.item)
                    }
                  ]"
                >
                  <td v-if="props.item.loader">
                    <v-skeleton-loader type="list-item" width="100%" />
                  </td>
                  <td v-else>
                    {{ props.item.visitor.map(v => v.name).join(", ") }}
                  </td>

                  <td v-if="props.item.loader">
                    <v-skeleton-loader type="list-item" width="100%" />
                  </td>
                  <td v-else>
                    {{
                      $_.uniq(props.item.visitor.map(v => v.company)).join(", ")
                    }}
                  </td>

                  <td v-if="props.item.loader">
                    <v-skeleton-loader type="list-item" width="100%" />
                  </td>
                  <td v-else>
                    {{ $_.uniq(props.item.visitor.map(v => v.job)).join(", ") }}
                  </td>

                  <td v-if="props.item.loader">
                    <v-skeleton-loader type="list-item" width="100%" />
                  </td>
                  <td v-else>
                    {{ props.item.reason }}
                  </td>

                  <td v-if="props.item.loader">
                    <v-skeleton-loader type="list-item" width="100%" />
                  </td>
                  <td v-else>
                    <v-tooltip bottom color="info">
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
                            class=""
                          >
                            <v-icon>mdi-clock-outline</v-icon>
                            {{ $t("Scheduled To Be") }}
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
                      <b>{{
                        $moment(props.item.created_at).format("D/M/YYYY h:m A")
                      }}</b>
                      <b
                        v-if="
                          props.item.actions &&
                            props.item.actions.filter(
                              a => a.name === 'scheduled'
                            ).length
                        "
                        class="black--text"
                      >
                        <v-icon color="black">mdi-clock-outline</v-icon>
                        {{ $t("Scheduled To Be") }}
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

                  <td v-if="props.item.loader">
                    <v-skeleton-loader type="list-item" width="100%" />
                  </td>
                  <td v-else>
                    {{ getAddedBy(props.item.added_by) }}
                  </td>

                  <td v-if="props.item.loader">
                    <v-skeleton-loader type="list-item" width="100%" />
                  </td>
                  <td v-else>
                    <v-spacer />
                    <v-tooltip v-if="isClient" bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          v-on="on"
                          color="blue-grey"
                          icon
                          @click="editItem(props.item)"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("Edit") }}</span>
                    </v-tooltip>
                    <v-tooltip v-if="isClient" bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          v-on="on"
                          :color="
                            lastActionIs('cancel', props.item)
                              ? 'white'
                              : 'error'
                          "
                          icon
                          @click="deleteItem(props.item)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("Delete") }}</span>
                    </v-tooltip>
                    <v-tooltip v-if="isClient" bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          v-on="on"
                          :loading="loaders.enter"
                          color="info"
                          icon
                          :disabled="
                            !props.item.actions || !props.item.actions.length
                          "
                          @click="submitLeave(props.item)"
                        >
                          <v-icon
                            >mdi-arrow-top-left-thin-circle-outline</v-icon
                          >
                        </v-btn>
                      </template>
                      <span>{{ $t("Leave") }}</span>
                    </v-tooltip>
                    <v-tooltip v-else bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          v-on="on"
                          :loading="loaders.enter"
                          color="success"
                          icon
                          @click="allowEnterence(props.item)"
                        >
                          <v-icon
                            >mdi-arrow-top-right-thin-circle-outline</v-icon
                          >
                        </v-btn>
                      </template>
                      <span>{{ $t("Enter") }}</span>
                    </v-tooltip>

                    <v-tooltip v-if="!isClient" bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          v-on="on"
                          :loading="loaders.cancel"
                          color="warning"
                          icon
                          :disabled="
                            !props.item.actions ||
                              props.item.actions.length !== 0
                          "
                          @click="putOnWaitVisit(props.item)"
                        >
                          <v-icon>mdi-clock-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("Wait") }}</span>
                    </v-tooltip>
                    <v-tooltip v-if="!isClient" bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          v-on="on"
                          :loading="loaders.schedule"
                          color="info"
                          icon
                          :disabled="
                            !props.item.actions ||
                              props.item.actions.length !== 0
                          "
                          @click="StartScheduleVisit(props.item)"
                        >
                          <v-icon>mdi-calendar</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("Schedule") }}</span>
                    </v-tooltip>
                    <v-tooltip v-if="!isClient" bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          v-on="on"
                          :loading="loaders.cancel"
                          color="error"
                          icon
                          :disabled="
                            !props.item.actions ||
                              props.item.actions.length !== 0
                          "
                          @click="cancelVisit(props.item)"
                        >
                          <v-icon>mdi-close-circle-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("Cancel") }}</span>
                    </v-tooltip>
                  </td>
                </tr>
              </template>
              <template slot="footer">
                <v-divider />
                <v-row align="center">
                  <v-col cols="auto">
                    <v-btn
                      :loading="loaders.list"
                      text
                      @click="getVisits(false)"
                    >
                      <v-icon>mdi-refresh</v-icon>
                      {{ $t("Refresh") }}
                    </v-btn>
                  </v-col>
                  <v-spacer />
                  <v-col cols="auto" class="py-5">
                    <span>
                      <v-icon :color="$socket.connected ? 'success' : 'error'"
                        >mdi-circle</v-icon
                      >
                      <span class="px-1">{{
                        $socket.connected ? $t("Connected") : $t("Disconnected")
                      }}</span>
                    </span>
                  </v-col>
                </v-row>
                <v-divider />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment";
import AddVisit from "@/components/secertary/AddVisit";
export default {
  name: "SecertaryVisits",
  components: {
    AddVisit
  },
  data() {
    return {
      moment,
      visits: [],
      itemOnEdit: null,
      itemOnSchedule: null,
      scheduleDialog: false,
      schedule: {
        date: moment().format("YYYY-MM-DD"),
        time: moment().format("HH:mm")
      },
      updatePlaceholder: false,
      loaders: {
        list: false,
        enter: false,
        cance: false,
        schedule: false
      },
      queries: {
        q: "",
        action: "leave",
        limit: 100
      }
    };
  },
  beforeDestroy() {
    this.distroySocketListeners();
  },
  mounted() {
    this.getVisits();
    this.listenOnSockets();
    // this.$socket.client.off("meet_added");
    // this.$socket.client.off("meet_updated");
    // this.$socket.client.off("meet_deleted");
  },
  // watch: {
  //   connectedSocket: {
  //     immediate: true,
  //     handler(val) {
  //       if (val) {
  //         setTimeout(() => {
  //           this.listenOnSockets();
  //         }, 1000);
  //       }
  //     }
  //   }
  // },
  computed: {
    auth() {
      return this.$store.state.auth.user;
    },
    isClient() {
      return this.auth && this.auth.roles.indexOf("client") !== -1;
    },
    connectedSocket() {
      return this.$socket.connected;
    },
    headers() {
      return [
        { text: this.$t("Visitor Name"), sortable: false },
        { text: this.$t("Visitor Company"), sortable: false },
        { text: this.$t("Visitor Job"), sortable: false },
        { text: this.$t("Reason"), sortable: false },
        { text: this.$t("Date"), sortable: false },
        { text: this.$t("Created By"), sortable: false },
        { text: this.$t("Actions"), sortable: false }
      ];
    }
  },
  methods: {
    listenOnSockets() {
      this.$socket.client.on("meet_added", data => {
        this.visits.push({ ...data, loader: false });
        // console.log("meet_added", data);
        if (!this.isClient) {
          this.$root.$emit("notification", {
            text: `${data.visitor.map(i => i.name).join(", ")} ${this.$t(
              "from"
            )} ${data.visitor.map(i => i.name).join(", ")} ${this.$t(
              "wants to see you"
            )} ${this.$t("for")} ${data.reason}`,
            title: this.$t("New Visitor"),
            color: "success"
          });
        }
      });
      this.$socket.client.on("meet_updated", data => {
        // console.log("meet_updated", data);
        const index = this.visits.findIndex(i => i._id === data._id);
        if (index !== -1) {
          this.loaders.list = true;
          this.visits[index].loader = true;
          // this.visits[index] = data;
          setTimeout(() => {
            this.loaders.list = false;
            if (this.lastActionIs("leave", data)) {
              this.visits.splice(index, 1);
            } else {
              this.visits.splice(index, 1, { ...data, loader: false });
            }
          }, 500);
        } else {
          console.log("update, could not find index");
        }
      });
      this.$socket.client.on("meet_deleted", data => {
        const index = this.visits.findIndex(i => i._id === data._id);
        if (index !== -1) {
          this.visits.splice(index, 1);
        }
        console.log("meet_deleted", data);
      });
    },
    distroySocketListeners() {
      this.$socket.client.off("meet_added");
      this.$socket.client.off("meet_updated");
      this.$socket.client.off("meet_deleted");
    },
    getVisits() {
      this.loaders.list = true;
      this.$axios({
        method: "get",
        url: "/visit",
        params: this.queries
      }).then(({ data }) => {
        this.visits = data.visits.map(i => ({ ...i, loader: false }));
        this.loaders.list = false;
        // if (listen) {
        //   this.listenOnSockets();
        // }
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
        actions: [{ name: "enter", created_at: this.moment.tz("UTC").toDate() }]
      };
      this.$axios.put(`/visit/${item._id}`, payload).then(res => {
        this.loaders.enter = false;
        // this.getVisits();
        this.$socket.client.emit("meet_update", res.data);
      });
    },
    lastActionIs(action, item) {
      return (
        item.actions &&
        item.actions.length &&
        item.actions[item.actions.length - 1].name === action
      );
    },
    submitLeave(item) {
      this.loaders.enter = true;
      const payload = {
        ...item,
        actions: [
          ...item.actions,
          { name: "leave", created_at: this.moment.tz("UTC").toDate() }
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
          { name: "cancel", created_at: this.moment.tz("UTC").toDate() }
        ]
      };
      this.$axios.put(`/visit/${item._id}`, payload).then(res => {
        this.loaders.enter = false;
        // this.getVisits();
        this.$socket.client.emit("meet_update", res.data);
      });
    },
    putOnWaitVisit(item) {
      this.loaders.enter = true;
      const payload = {
        ...item,
        actions: [
          ...item.actions,
          { name: "wait", created_at: this.moment.tz("UTC").toDate() }
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
            created_at: this.moment.tz("UTC").toDate(),
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
<i18n>
{
  "en": {
    "Schedule Visit": "Schedule Visit",
    "Cancel": "Cancel",
    "Schedule": "Schedule",
    "Visitor Name": "Visitor Name",
    "Visitor Company": "Visitor Company",
    "Visitor Job": "Visitor Job",
    "Reason": "Reason",
    "Date": "Date",
    "Created By": "Created By",
    "Actions": "Actions",
    "Leave": "Leave",
    "Add Visit": "Add Visit",
    "Scheduled To Be": "Scheduled To Be",
    "wants to see you": "wants to see you",
    "from": "from",
    "for": "for",
    "New Visitor": "New Visitor",
    "Wait": "Wait"

  },
  "ar": {
    "Schedule Visit": "تأجيل الزيارة",
    "Cancel": "الغاء",
    "Schedule": "تأجيل",
    "Visitor Name": "اسم الزائر",
    "Visitor Company": "الجهة",
    "Visitor Job": "الوظيفة",
    "Reason": "سبب الزيارة",
    "Date": "التاريخ",
    "Created By": "المسجل",
    "Actions": "الإجرائات",
    "Leave": "مغادرة",
    "Add Visit": "اضافة زيارة",
    "Scheduled To Be": "تغير معاده ليكون",
    "wants to see you": "يرغب في رؤيتك",
    "from": "من",
    "for": "بسبب",
    "New Visitor": "زائر جديد",
    "Wait": "انتظار"
  }
}
</i18n>
