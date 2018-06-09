import Vue from 'vue'
import App from './App.vue'
import vueKanban from 'vue-kanban'
import SuiVue from 'semantic-ui-vue'
import 'semantic-ui-css/semantic.min.css'
import ShortKey from 'vue-shortkey'

Vue.config.productionTip = false;
Vue.use(vueKanban);
Vue.use(SuiVue);
Vue.use(ShortKey);

new Vue({
  render: h => h(App)
}).$mount('#app');


