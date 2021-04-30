<template>
  <v-container style="height: 100%;" class="pa-0">
      <v-row class="ma-0">
        <v-col cols="12" md="6" xs="12" class="d-none d-md-flex pa-0" style="height: 95vh;">
          <v-img src="../assets/topography.svg" style="background-color: #f1f1e6;"></v-img>
        </v-col>
        <v-col cols="12" md="6" xs="12" class="d-flex d-md-none pa-0">
          <v-img src="../assets/topography.svg" style="background-color: #f1f1e6; height:200px;"></v-img>
        </v-col>
        <v-col cols="12" md="6" xs="12" class="pa-5">
          <v-alert :type="this.alertType" border="left" dismissible v-if="this.alertMessage">{{ this.alertMessage }}</v-alert>
          <div class="text-h4 text--secondary mt-4 mb-4"><v-icon class="mr-2" large>mdi-account-plus</v-icon>Register</div>
          <v-divider></v-divider>
          <v-container class="pa-0 mt-4">
            <v-form ref="form" v-model="valid">
              <v-text-field label="Full name" v-model="userData.UserName" :rules="rulesForUserName" :counter="100"></v-text-field>
              <v-text-field label="Email address" v-model="userData.UserEmail" :rules="rulesForUserEmail"></v-text-field>
              <v-text-field label="Password" v-model="userData.UserPass1" type="password" :rules="rulesForUserPass1"></v-text-field>
              <v-text-field label="Re-enter your password" v-model="userData.UserPass2" type="password" :rules="rulesForUserPass2"></v-text-field>
              <v-select label="Role" v-model="userData.UserRole" :items="userRoles" :rules="rulesForUserRole"></v-select>
              <p class="text-subtitle-2 text--secondary uppercase text-center">By registering, you agree to the <a @click="termsDialog = true;">terms of service</a>.</p>
              <v-row class="mt-5 mb-5" style="justify-content: center;">
                <v-btn color="primary" large @click="registerUser"><v-icon class="mr-2">mdi-account-plus</v-icon>Register</v-btn>
              </v-row>
            </v-form>
          </v-container>
        </v-col>
      </v-row>

      <v-dialog v-model="termsDialog" max-width="576px">
        <v-card>
          <v-card-title>Terms of service</v-card-title>
          <v-card-text>
            This is a sample web application, not to be used commercially.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto maiores aliquam neque dolor veniam omnis veritatis vitae beatae magni mollitia, velit quaerat quo hic quod nisi voluptates atque ratione at.
            Ut deleniti illo rem voluptatum facere consequatur iure ea esse quo officiis natus blanditiis, accusamus adipisci at id cumque ad expedita. Aliquam vitae consequatur odio debitis ea quam, recusandae laborum?
            Ullam beatae laborum quam quis voluptas repudiandae distinctio, non dolorum, modi voluptates dicta. Consectetur repellat maiores commodi, labore impedit facere inventore laboriosam, consequatur at qui cum laborum aperiam neque minima.
            Delectus molestiae nostrum optio eligendi corporis ipsum magni asperiores sed, blanditiis explicabo officiis vel ex reprehenderit perspiciatis ipsa, magnam nihil consequuntur vitae voluptate eius impedit accusantium repellat quam! Vero, sint!
            Perspiciatis recusandae odit, quae ipsa, excepturi ut obcaecati corporis optio, earum facilis fuga. Architecto, excepturi eius! Ut, quisquam ab aspernatur saepe, officiis nostrum, consequuntur dolorem amet itaque sed dolor quam!
            Perferendis commodi amet numquam dolor velit cum modi excepturi itaque repellendus blanditiis sunt magnam illum, corporis quidem voluptatem, saepe a exercitationem vitae nostrum quae perspiciatis mollitia. Eum hic deserunt autem!
            Aspernatur provident iusto est dolore unde ipsum blanditiis quod, mollitia esse beatae, hic assumenda repellendus voluptatem consectetur commodi at aliquid, itaque dolorum quisquam officia similique vero. Culpa, eius! Eveniet, aut?
            At sed vitae asperiores, itaque, amet libero iusto est incidunt expedita ullam possimus id aliquam necessitatibus officia reprehenderit facilis maiores rerum. Sint rem dolorem amet eveniet nisi nobis facere assumenda.
            Amet omnis itaque magni maiores quo? Nulla voluptatem temporibus culpa quia voluptas reiciendis necessitatibus repellendus adipisci? A natus, velit quibusdam molestiae neque exercitationem dignissimos delectus, ex aliquid fugit incidunt iste?
            Provident temporibus tenetur deleniti harum sint ducimus accusamus ullam dicta fugiat non libero aliquam quisquam, odio neque eligendi accusantium ipsa dolores esse veniam fuga quo vero numquam. Sed, numquam et!
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="termsDialog = false;">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-container>
</template>

<script>
import API from '../api';
export default {
  name: 'Register',
  data: () => ({
    alertMessage: "",
    alertType: "",
    valid: true,
    termsDialog: false,
    userData: {
      UserName: "",
      UserEmail: "",
      UserPass1: "",
      UserPass2: "",
      UserRole: "",
    },
    userRoles: ['ADMIN', "DEV", "TEST"]
  }),
  computed: {
    rulesForUserName: function(){
      return [
        value => !!value || "Required",
        value => value.length <= 100 || "Maximum allowed length is 100"
      ]
    },
    rulesForUserEmail: function() {
      return [
        value => !!value || "Required",
        value => value.length <=100 || "Maximum allowed length is 100",
        value => /.+@.+\..+/.test(value) || 'E-mail must be valid'
      ]
    },
    rulesForUserPass1: function() {
      return [
        value => !!value || "Required"
      ]
    },
    rulesForUserPass2: function() {
      return [
        value => !!value || "Required",
        value => value === this.userData.UserPass1 || "Passwords do not match"
      ]
    },
    rulesForUserRole: function() {
      return [
        value => !!value || "Required"
      ]
    },
  },
  methods: {
    async registerUser() {
      this.$refs.form.validate();
      if(this.valid) {
        const response = await API.registerUser(this.userData);
        if(response.type != "" && response.message != "") {
          this.alertType = response.type;
          this.alertMessage = response.message;

          // nullify user data
          this.userData =  {
            UserName: "",
            UserEmail: "",
            UserPass1: "",
            UserPass2: "",
            UserRole: "",
          };

          this.$refs.form.resetValidation();
        }
      }
    }
  }
}
</script>

<style scoped>

</style>