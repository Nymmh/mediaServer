import Vue from 'vue'
import Router from 'vue-router'
import nProgress from 'nprogress'

const router = new Router({
    routes:[
        {
            path: '/',
            name: 'home',
            component: () => import('./components/Home.vue'),
            meta:{
                title: "Nymhflix",
            }
        },
        {
            path: '/anime/:animeid/:animeromaji',
            name: 'anime',
            props: true,
            component: () => import('./components/Anime.vue'),
            meta:{
                title: "Nymhflix",
            }
        },
        {
            path: '/anime/:animeid',
            name: 'animeAni',
            props: true,
            component: () => import('./components/Anime.vue'),
            meta:{
                title: "Nymhflix",
            }
        },
        {
            path: '/anime/:animeid/:animeromaji/episode/:episodeid/:episodenum',
            name: 'animeEp',
            props: true,
            component: () => import('./components/AnimeEpisode.vue'),
            meta:{
                title: "Nymhflix",
            }
        },
        {
            path: '/browse',
            name: 'browse',
            component: () => import('./components/Browse.vue'),
            meta:{
                title: "Nymhflix",
            }
        },
        {
            path: '/all',
            name: 'all',
            component: () => import('./components/All.vue'),
            meta:{
                title: "Nymhflix",
            }
        },
        {
            path: '/format',
            name: 'format',
            component: () => import('./components/Format.vue'),
            meta:{
                title: "Nymhflix",
            }
        },
        {
            path: '/format/:formatSearch',
            name: 'formatSearch',
            props: true,
            component: () => import('./components/Format.vue'),
            meta:{
                title: "Nymhflix",
            }
        },
        {
            path: '/season',
            name: 'season',
            component: () => import('./components/Season.vue'),
            meta:{
                title: "Nymhflix",
            }
        },
        {
            path: '/season/:seasonSearch',
            name: 'seasonSearch',
            props: true,
            component: () => import('./components/Season.vue'),
            meta:{
                title: "Nymhflix",
            }
        },
        {
            path: '/source',
            name: 'source',
            component: () => import('./components/Source.vue'),
            meta:{
                title: "Nymhflix",
            }
        },
        {
            path: '/source/:sourceSearch',
            name: 'sourceSearch',
            props: true,
            component: () => import('./components/Source.vue'),
            meta:{
                title: "Nymhflix",
            }
        },
        {
            path: '/status',
            name: 'status',
            props: true,
            component: () => import('./components/Status.vue'),
            meta:{
                title: "Nymhflix",
            }
        },
        {
            path: '/status/:statusSearch',
            name: 'statusSearch',
            props: true,
            component: () => import('./components/Status.vue'),
            meta:{
                title: "Nymhflix",
            }
        },
    ],
    mode: 'history',
});

router.beforeResolve((to, from, next)=>{
    if(to.name){
        nProgress.start()
    }
    document.title = to.meta.title;
    next()
});
router.afterEach(()=>{ //to, from
    nProgress.done();
});

export default router;

Vue.use(Router)