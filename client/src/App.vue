<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app color="accent">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Bug Tracker
          </v-list-item-title>
          <v-list-item-subtitle>
            Menu
          </v-list-item-subtitle>
          <v-divider class="mt-2"></v-divider>
        </v-list-item-content>
      </v-list-item>

      <v-list rounded v-if="!this.$store.state.userLoggedIn">
        <v-subheader>What do you want to do today?</v-subheader>
        <v-list-item-group
          v-model="selectedItem"
          color="primary"
        >
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.link"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-list rounded v-if="this.$store.state.userLoggedIn">
        <v-subheader>What do you want to do today?</v-subheader>
        <v-list-item-group
          v-model="selectedItem"
          color="primary"
        >
          <v-list-item
            v-for="(loggedInItem, i) in loggedInItems"
            :key="i"
            :to="loggedInItem.link"
          >
            <v-list-item-icon>
              <v-icon v-text="loggedInItem.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="loggedInItem.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

    </v-navigation-drawer>
    
    <v-app-bar app color="primary">
      <v-row>
        <v-app-bar-nav-icon @click="drawer = !drawer" class="white--text"></v-app-bar-nav-icon>
        <v-toolbar-title class="mt-2 white--text">Bug Tracker</v-toolbar-title>
      </v-row>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    data: () => ({ 
      drawer: null,
      selectedItem: 0,
      loggedInItems: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', link: "/dashboard" },
        { title: 'Defects', icon: 'mdi-bug', link: "/defects" },
        { title: 'Task Board', icon: 'mdi-view-grid-plus', link: "/tasks" },
        { title: 'To Do', icon: 'mdi-format-list-checks', link: "/todos" },
        { title: 'Users', icon: 'mdi-account-group', link: "/users" },
        { title: 'Logout', icon: 'mdi-logout', link: "/logout" },
      ],

      items: [
        { title: 'Home', icon: 'mdi-home', link: "/" },
        { title: 'Login', icon: 'mdi-login', link: "/login" },
        { title: 'Register', icon: 'mdi-account-plus', link: "/register" },
      ]
    }),

    created() {
      this.$store.state.userLoggedIn = false;
      this.$store.state.userRole = "";
      if(sessionStorage.token === "" || sessionStorage.token == undefined) {
        this.$store.state.userLoggedIn = false;
      } else if (sessionStorage.token !== "" && sessionStorage.token != undefined) {
        this.$store.state.userLoggedIn = true;
        this.$store.state.userRole = sessionStorage.role;
      }
    }
  }
</script>