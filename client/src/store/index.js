import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    user: {
      name: '',
      id: '',
      email: '',
      role: ''
    }
  },
  
  mutations: {
    UPDATE_ON_LOGIN(state, payload) {
      sessionStorage.token = payload.token;
      sessionStorage.name = payload.user.user;
      sessionStorage.email = payload.user.email;
      sessionStorage.role = payload.user.role;
      sessionStorage.id = payload.user.id;
    
      state.token = payload.token;
      state.user.name = payload.user.user;
      state.user.email = payload.user.email;
      state.user.role = payload.user.role;
      state.user.id = payload.user.id;
    },

    UPDATE_ON_LOGOUT(state) {
      sessionStorage.token = "";
      sessionStorage.name = "";
      sessionStorage.email = "";
      sessionStorage.role = "";
      sessionStorage.id = "";

      state.token = '';
      state.user = {
        name: '',
        id: '',
        email: '',
        role: ''
      }
    },
  },
  actions: {
    loginUser(context, data) {
      context.commit("UPDATE_ON_LOGIN", data);
    },

    logoutUser(context) {
      context.commit("UPDATE_ON_LOGOUT");
    }
  },
  modules: {
  }
})
