import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#2c4b7f',
                secondary: '#368b86',
                accent: '#f1f1e6',
            },
        }
    }
});
