<template>
  <div>
    <v-btn color="primary" outlined depressed large @click="toggleDialog(true)">
      {{ $t("Add Visit") }}
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-model="showDialog" closable width="700">
      <v-card>
        <v-card-title>{{ $t("Add Visit") }}</v-card-title>
        <v-card-text>
          <v-form
            ref="formRef"
            v-model="isValid"
            style="max-height: 70vh; overflow-y: auto"
          >
            <v-card
              v-for="(visitor, v) in input.visitor"
              :key="v"
              class="my-5 mx-1"
            >
              <v-card-title>
                {{ $t("Visitor") }} #{{ v + 1 }}
                <v-spacer />
                <v-btn
                  v-if="v > 0"
                  color="error"
                  outlined
                  @click="removeVisitor(v)"
                  >{{ $t("Remove Visitor") }}</v-btn
                >
              </v-card-title>
              <v-card-text>
                <v-text-field
                  :rules="rules.required"
                  v-model="visitor.name"
                  :placeholder="$t('Visitor Name')"
                  append-icon="mdi-account"
                  outlined
                  dense
                />

                <v-text-field
                  :rules="rules.required"
                  v-model="visitor.company"
                  :placeholder="$t('Visitor Company')"
                  append-icon="mdi-domain"
                  outlined
                  dense
                />

                <v-text-field
                  :rules="rules.required"
                  v-model="visitor.job"
                  :placeholder="$t('Visitor Job')"
                  append-icon="mdi-account-tie"
                  outlined
                  dense
                />
              </v-card-text>
            </v-card>
            <v-row justify="end">
              <v-col cols="auto">
                <v-btn text color="primary" @click="addVisitor"
                  >{{ $t("Add Company") }} <v-icon>mdi-plus</v-icon></v-btn
                >
              </v-col>
            </v-row>
            <v-divider />
            <v-textarea
              :rules="rules.required"
              v-model="input.reason"
              :placeholder="$t('Reason')"
              outlined
              dense
              @keyup.enter="submit"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            class="px-6"
            outlined
            @click="toggleDialog"
            depressed
            large
            >{{ $t("Cancel") }}</v-btn
          >
          <v-btn
            :loading="isLoading"
            color="primary"
            class="px-6"
            depressed
            large
            @click="submit"
            >{{ $t("Submit") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "AddVisit",
  props: {
    put: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showDialog: false,
      rules: {
        required: [v => !!v || "This field is required"]
      },
      isValid: false,
      error: null,
      isLoading: false,
      input: {
        visitor: [
          {
            name: "",
            company: "",
            job: ""
          }
        ]
      }
    };
  },
  watch: {
    put(val) {
      this.input = {
        visitor: [
          {
            name: "",
            company: "",
            job: ""
          }
        ]
      };
      if (val) {
        this.input = val;
      }
    }
  },
  methods: {
    toggleDialog(add = false) {
      this.showDialog = !this.showDialog;
      if (add) {
        this.$emit("add-form");
      }
    },
    addVisitor() {
      this.input.visitor.push({
        name: "",
        company: "",
        job: ""
      });
    },
    removeVisitor(index) {
      this.input.visitor.splice(index, 1);
    },
    submit() {
      // is loading
      this.isLoading = true;
      // validate
      this.$refs.formRef.validate();
      if (!this.isValid) {
        this.isLoading = false;
        return false;
      }
      // call api
      this.$axios({
        method: this.put ? "put" : "post",
        url: this.put ? `/visit/${this.put._id}` : "/visit",
        data: this.input
      })
        .then(res => {
          this.isLoading = false;
          this.toggleDialog();
          this.$socket.client.emit(
            this.put ? "meet_update" : "new_meet",
            res.data
          );
          // this.$emit("success");
          this.input = {
            visitor: [
              {
                name: "",
                company: "",
                job: ""
              }
            ]
          };
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response.status === 400) {
            this.error = this.$t("Invalid Input");
          } else this.error = this.$t("somethingWrong");
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
    "Visitor": "Visitor",
    "Visitor Company": "Visitor Company",
    "Visitor Job": "Visitor Job",
    "Reason": "Reason",
    "Date": "Date",
    "Created By": "Created By",
    "Actions": "Actions",
    "Leave": "Leave",
    "Add Visit": "Add Visit",
    "Add Visitor": "Add Visitor",
    "Add Company": "Add Company",
    "Invalid Input": "Invalid Input",
    "Remove Visitor": "Remove Visitor"

  },
  "ar": {
    "Schedule Visit": "تأجيل الزيارة",
    "Cancel": "الغاء",
    "Schedule": "تأجيل",
    "Visitor Name": "اسم الزائر",
    "Visitor": "زائر",
    "Visitor Company": "الجهة",
    "Visitor Job": "الوظيفة",
    "Reason": "سبب الزيارة",
    "Date": "التاريخ",
    "Created By": "المسجل",
    "Actions": "الإجرائات",
    "Leave": "مغادرة",
    "Add Visit": "اضافة زيارة",
    "Add Visitor": "اضافة زائر",
    "Invalid Input": "البيانات غير صحيحة",
    "Remove Visitor": "ازالة المرافق",
    "Add Company": "اضافة مرافق"
  }
}
</i18n>
<style lang="css" scoped></style>
