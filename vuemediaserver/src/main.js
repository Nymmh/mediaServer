import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import VuePlyr from 'vue-plyr'
import VueNotifications from 'vue-notification'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import router from './router'
import VueAnime from 'vue-animejs'
import anime from 'animejs'

Vue.config.productionTip = false

const httpLink = new HttpLink({
  uri: 'http://70.77.208.186:5000/graphql'
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

Vue.use(VueApollo);
Vue.use(VuePlyr, {
  plyr: {
    fullscreen:{enabled:true},
    storage:{enabled:true,key:'plyr'}
  },
  emit: ['ended']
});
Vue.use(Vuex);
Vue.use(anime);
Vue.use(VueAnime);
Vue.use(VueNotifications);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

new Vue({
  apolloProvider,
  router,
  render: h => h(App)
}).$mount('#app')