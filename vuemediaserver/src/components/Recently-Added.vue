<template>
    <ApolloQuery :query="require('../graphql/getAnime.gql')" :variables="{id:animeid}">
        <template v-slot="{result:{loading,error,data}}">
        <template v-if="loading">
            <div v-if="loading"><img src="http://anitoaster.ca/assets/70972fd.png" alt="" srcset="">Loading</div>
        </template>
        <template v-else-if="error">
            <h1 style="color:red">Error loading data</h1>
            <img src="http://anitoaster.ca/assets/faeb8fd9272d4e33ccb340a4e91c424e9115fa0e_hq.gif" alt="" srcset="">
        </template>
        <template v-else-if="data">
        <notifications classes="vue_notifications vue_notification_success" group="added" position="top center" max="2" width="400"/>
        <notifications classes="vue_notifications vue_notification_failed" group="notadded" position="top center" max="2" width="400"/>
          <div class="main">
              <div v-for="anime in data.anime" :key="anime._id">
                <div class="Banner">
                    <img v-bind:src="anime.images[0].banner" class="bannerIMG">
                </div>
                <div class="aniCover">
                    <img v-bind:src="anime.images[0].cover" class="aniCoverimg">
                </div>
                <div class="aniTitle">
                    <h2 class="aniTitleh2">{{anime.titles[0].romaji}}</h2>
                </div>
                <div class="synop">
                    <p class="synoptezt synscroll" v-html="anime.description"></p>
                </div>
                <div class="page-containeranime">
                    <div class="infoleft">
                        <p class="infoheader">Type</p>
                        <a v-bind:href="'/format/'+anime.format">
                            <div v-if="anime.format == 'MOVIE'">
                                <p class="infoheaderinfo">{{anime.format.charAt(0).toUpperCase()}}{{anime.format.slice(1).toLowerCase()}}</p>
                            </div>
                            <div v-else>
                                <p class="infoheaderinfo">{{anime.format}}</p>
                            </div>
                        </a>
                    </div>
                    <div class="infoleft">
                        <p class="infoheader">Status</p>
                        <p class="infoheaderinfo">{{anime.status.charAt(0).toUpperCase()}}{{anime.status.slice(1).toLowerCase()}}</p>
                    </div>
                    <div class="infoleft">
                        <p class="infoheader">Episodes</p>
                        <p class="infoheaderinfo">{{anime.episodes}}</p>
                    </div>
                    <div class="infoleft">
                        <p class="infoheader">Duration</p>
                        <p class="infoheaderinfo">{{anime.duration}} Mins</p>
                    </div>
                    <div class="infoleft">
                        <p class="infoheader">Start Date</p>
                        <p class="infoheaderinfo">{{anime.startDate[0].startYear}} / {{anime.startDate[0].startMonth}} / {{anime.startDate[0].startDay}}</p>
                    </div>
                    <template v-if="anime.endDate[0].endMonth">
                        <div class="infoleft">
                            <p class="infoheader">End Date</p>
                            <p class="infoheaderinfo">{{anime.endDate[0].endYear}} / {{anime.endDate[0].endMonth}} / {{anime.endDate[0].endDay}}</p>
                        </div>
                    </template>
                    <div class="infoleft">
                        <p class="infoheader">Season</p>
                        <a v-bind:href="'/season/'+anime.season">
                            <p class="infoheaderinfo">{{anime.season.charAt(0).toUpperCase()}}{{anime.season.slice(1).toLowerCase()}}</p>
                        </a>
                    </div>
                    <div class="infoleft">
                        <p class="infoheader">Source</p>
                        <a v-bind:href="'/source/'+anime.source">
                            <p class="infoheaderinfo">{{anime.source.charAt(0).toUpperCase()}}{{anime.source.slice(1).toLowerCase()}}</p>
                        </a>
                    </div>
                    <div v-if="anime.titles[0].english != null">
                        <div class="infoleft">
                            <p class="infoheader">English</p>
                            <p class="infoheaderinfo">{{anime.titles[0].english}}</p>
                        </div>
                    </div>
                    <div v-if="anime.titles[0].native != null">
                        <div class="infoleft">
                            <p class="infoheader">Native</p>
                            <p class="infoheaderinfo">{{anime.titles[0].native}}</p>
                        </div>
                    </div>
                    <template v-if="anime.status == 'RELEASING'">
                        <div class="infoleft">
                            <button class="requestthumb" v-on:click="requestEpisodeUpdate">Request Episode Update</button>
                        </div>
                    </template>
                </div>
                <div class="relatedbox">
                    <div v-for="animeEps in data.anime[0].episodeLists" :key="animeEps._id">
                        <div class="thumbnailhelper">
                            <!--{{animeEps._id}}-->
                            <a v-bind:href="animeromaji.replace(/:/g,'')+'/episode/'+animeEps._id+'/'+animeEps.episode" rel="noopener noreferrer">
                            <div>
                                <img v-bind:src="animeEps.thumbnail" alt="" class="thumbnailimg">
                                <template v-if="animeEps.title">
                                    <p class="infoheaderinfoRes">{{animeEps.title}} - {{animeEps.episode}}</p>
                                </template>
                                <template v-else>
                                    <p class="infoheaderinfoRes">{{animeEps.episode}}</p>
                                </template>
                            </div>
                            </a>
                        </div>
                    </div>
                </div>
              </div>
          </div>
        </template>
        <template v-else>
            <loading/>
        </template>
    </template>
    </ApolloQuery>
</template>
<script>
import Loading from './loading.vue'
import axios from 'axios'
export default {
    name: 'anime',
    components:{'loading':Loading},
    props: ['animeid','animeromaji'],
    created(){
        if(this.animeromaji)document.title = this.animeromaji.replace(/_/g," ");
    },
    methods:{
        requestEpisodeUpdate: function(){
            axios({
                url: "http://70.77.208.186:5000/graphql",
                method: 'post',
                data:{
                    query:`
                        mutation requestUpdate($animelink:String,$animeid:String){
                            requestUpdate(updateType:episode,animelink:$animelink,animeid:$animeid){
                                animeid
                            }
                        }
                     `,
                    variables:{
                        animelink: window.location.href,
                        animeid: this.animeid
                    }
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((result)=>{
                if(result.data.data.requestUpdate){
                    this.$notify({
                        group: 'notadded',
                        text: "A request to update this anime's episodes has already been submited",
                    });
                }else{
                    this.$notify({
                        group: 'added',
                        text: "A request to update this anime's episodes has been submited",
                    });
                }
            });
        }
    }
}
</script>
<style>
.synscroll::-webkit-scrollbar {
    width: 1%;
}
.synscroll::-webkit-scrollbar-thumb {
    background: #1a252f;
    border-radius: 10px;
}
.synscroll::-webkit-scrollbar-track {
    box-shadow: inset 0 0 7px #202d3b;
    border-radius: 10px;
}
a{
    color: #18bc9c;
    text-decoration: none;
    transition: all .2s ease-in-out;
}
a:hover, a:focus{
    color: #0f7864;
    text-decoration: underline;
}
.main{
    margin-top: 50px;
    overflow: hidden;
}
.Banner{
    position: absolute;
    top: 80px;
    max-height: 25%;
    overflow: hidden;
    z-index: -1;
    width: 100%;
}
.bannerIMG{
    width: 100%;
    margin-top: -55px;
}
.aniCover{
    position: absolute;
    top: 160px;
    left: 290px;
    z-index: 2;
}
.aniCoverimg{
    widows: 200px;
    height: 300px;
}
.aniTitle{
    margin-top: 5.5%;
    max-height: 70px;
    background-color: rgba(56, 66, 77, 0.800);
}
.aniTitleh2{
    padding-top: 5px;
    padding-bottom: 6px;
    color: #68dae0;
    position: relative;
    left: 30%;
    text-align: left;
}
.synop{
    color: rgb(206, 206, 206);
    background-color: #38424D;
    padding-bottom: 80px;
    padding-left: 30%;
    padding-right: 20%;
    word-spacing: 1px;
    z-index: 1;
    position: absolute;
    top: 29.7%;
    height: 10.6rem;
    width: 100%;
}
.synoptezt{
    max-height: 9rem;
    overflow-y: auto;
    max-width: 100%;
    text-align: left;
}
.page-containeranime{
    display: block;
    max-width: 1720px;
    padding-left: 290px;
    padding-right: 160px;
    margin-top: 10%;
    overflow: visible;
    max-height: 1000px;
    text-align: left;
    color: #18bc9c;
}
.infoleft{
    background: #202d3b;
    border-radius: 5px;
    max-width: 200px;
}
.infoheader{
    color: rgb(187, 187, 187);
    padding-top: 3%;
    padding-left: 5%;
}
.infoheaderinfo{
    padding-left: 5%;
    margin-top: -2%;
    padding-bottom: 3%;
}
.infoheaderinfoRes{
    position: absolute;
    bottom: -11px;
    background-color: rgba(56, 66, 77, 0.800);
    border-radius: 0px 0px 5px 5px;
    width: 100%;
}
.thumbnailhelper{
    position: relative;
    width: 200px;
}
.relatedbox{
    overflow: hidden;
    position: absolute;
    z-index: 2;
    left: 30%;
    top: 49.9%;
    display: inline-grid;
    grid-template-columns: repeat(5,1fr);
    grid-column-gap: 10px;
    grid-row-gap: 40px;
    padding-bottom: 80px;
    width: 60%;
}
.thumbnailimg{
    width: 100%;
    border-radius: 5px;
}
@media screen and (min-width:200px) and (max-width:375px){
    .aniCover{
        position: absolute;
        top: 140px;
        left: 10px;
        z-index: 2;
    }
    .aniCoverimg{
        width: 120px;
        height: 200px;
    }
    .aniTitleh2{
        margin-left: 10%;
        margin-top: -9px;
        padding-bottom: 6px;
        color: #68dae0;
        font-size: 1rem;
        max-width: 50%;
    }
    .aniTitle{
        margin-top: 5.3%;
        max-height: 70px;
    }
    .synop{
        width: 107%;
        color: rgb(206, 206, 206);
        background-color: transparent;
        /* padding-bottom: 80px; */
        /* padding-left: 30%; */
        /* padding-top: 20px; */
        padding: 0;
        /* padding-right: 20%; */
        word-spacing: 1px;
        z-index: 1;
        position: absolute;
        top: 240px;
        height: 200px;
        width: 200px;
        left: 40%;
        top: 34%;
        font-size: 1.5rem;
        margin: 0;
    }
    .synoptezt{
        max-height: 100%;
        overflow: auto;
        font-size: 1rem;
    }
    .page-containeranime{
        display: block;
        /* max-width: 3px; */
        /* padding-left: 290px; */
        /* padding-right: 160px; */
        margin-top: 65%;
        /* overflow: hidden; */
        /* max-height: 1000px; */
        margin-left: -280px;
    }
    .relatedbox{
        overflow: hidden;
        position: absolute;
        z-index: 2;
        margin-left: -27%;
        top: 210%;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 10px;
        grid-row-gap: 15px;
        padding-bottom: 80px;
        width: 97%;
    }
    .thumbnailhelper {
        position: relative;
        width: 165px;
    }
    .bannerIMG{
        margin-top: 0px;
    }
}
@media screen and (min-width:376px) and (max-width:390px){
    .aniCover{
        position: absolute;
        top: 140px;
        left: 10px;
        z-index: 2;
    }
    .aniCoverimg{
        width: 120px;
        height: 200px;
    }
    .aniTitleh2{
        margin-left: 40%;
        margin-top: -9px;
        padding-bottom: 6px;
        color: #68dae0;
        font-size: 2.2rem;
    }
    .aniTitle{
        margin-top: 5.3%;
        max-height: 70px;
    }
    .synop{
        width: 107%;
        color: rgb(206, 206, 206);
        background-color: #38424D;
        /* padding-bottom: 80px; */
        /* padding-left: 30%; */
        /* padding-top: 20px; */
        padding: 0;
        /* padding-right: 20%; */
        word-spacing: 1px;
        z-index: 1;
        position: absolute;
        top: 240px;
        height: 200px;
        width: 200px;
        left: 40%;
        top: 47%;
        font-size: 1.5rem;
        margin: 0;
    }
    .synoptezt{
        max-height: 100%;
        overflow: auto;
    }
    .page-containeranime{
        display: block;
        /* max-width: 3px; */
        /* padding-left: 290px; */
        /* padding-right: 160px; */
        margin-top: 95%;
        /* overflow: hidden; */
        /* max-height: 1000px; */
        margin-left: -280px;
    }
    .relatedbox{
        overflow: hidden;
        position: absolute;
        z-index: 2;
        margin-left: 3%;
        top: 170%;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 10px;
        grid-row-gap: 15px;
        padding-bottom: 80px;
        width: 97%;
    }
}
@media screen and (min-width:391px) and (max-width:414px){
    .aniCover{
        position: absolute;
        top: 140px;
        left: 10px;
        z-index: 2;
    }
    .aniCoverimg{
        width: 120px;
        height: 200px;
    }
    .aniTitleh2{
        margin-left: 40%;
        margin-top: -9px;
        padding-bottom: 6px;
        color: #68dae0;
        font-size: 2.2rem;
    }
    .aniTitle{
        margin-top: 5.3%;
        max-height: 70px;
    }
    .synop{
        width: 107%;
        color: rgb(206, 206, 206);
        background-color: #38424D;
        /* padding-bottom: 80px; */
        /* padding-left: 30%; */
        /* padding-top: 20px; */
        padding: 0;
        /* padding-right: 20%; */
        word-spacing: 1px;
        z-index: 1;
        position: absolute;
        top: 240px;
        height: 200px;
        width: 200px;
        left: 40%;
        top: 47%;
        font-size: 1.5rem;
        margin: 0;
    }
    .synoptezt{
        max-height: 100%;
        overflow: auto;
    }
    .page-containeranime{
        display: block;
        /* max-width: 3px; */
        /* padding-left: 290px; */
        /* padding-right: 160px; */
        margin-top: 95%;
        /* overflow: hidden; */
        /* max-height: 1000px; */
        margin-left: -280px;
    }
    .relatedbox{
        overflow: hidden;
        position: absolute;
        z-index: 2;
        margin-left: 3%;
        top: 170%;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 10px;
        grid-row-gap: 15px;
        padding-bottom: 80px;
        width: 97%;
    }
}
@media screen and (min-width:415px) and (max-width:435px){
    .aniCover{
        position: absolute;
        top: 140px;
        left: 10px;
        z-index: 2;
    }
    .aniCoverimg{
        width: 120px;
        height: 200px;
    }
    .aniTitleh2{
        margin-left: 40%;
        margin-top: -9px;
        padding-bottom: 6px;
        color: #68dae0;
        font-size: 2.2rem;
    }
    .aniTitle{
        margin-top: 5.3%;
        max-height: 70px;
    }
    .synop{
        width: 107%;
        color: rgb(206, 206, 206);
        background-color: #38424D;
        /* padding-bottom: 80px; */
        /* padding-left: 30%; */
        /* padding-top: 20px; */
        padding: 0;
        /* padding-right: 20%; */
        word-spacing: 1px;
        z-index: 1;
        position: absolute;
        top: 240px;
        height: 200px;
        width: 200px;
        left: 40%;
        top: 47%;
        font-size: 1.5rem;
        margin: 0;
    }
    .synoptezt{
        max-height: 100%;
        overflow: auto;
    }
    .page-containeranime{
        display: block;
        /* max-width: 3px; */
        /* padding-left: 290px; */
        /* padding-right: 160px; */
        margin-top: 95%;
        /* overflow: hidden; */
        /* max-height: 1000px; */
        margin-left: -280px;
    }
    .relatedbox{
        overflow: hidden;
        position: absolute;
        z-index: 2;
        margin-left: 3%;
        top: 170%;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 10px;
        grid-row-gap: 15px;
        padding-bottom: 80px;
        width: 97%;
    }
}
@media screen and (min-width:436px) and (max-width:507px){
    .aniCover{
        position: absolute;
        top: 140px;
        left: 10px;
        z-index: 2;
    }
    .aniCoverimg{
        width: 120px;
        height: 200px;
    }
    .aniTitleh2{
        margin-left: 40%;
        margin-top: -9px;
        padding-bottom: 6px;
        color: #68dae0;
        font-size: 1rem;
    }
    .aniTitle{
        margin-top: 5.3%;
        max-height: 70px;
    }
    .synop{
        width: 107%;
        color: rgb(206, 206, 206);
        background-color: #38424D;
        /* padding-bottom: 80px; */
        /* padding-left: 30%; */
        /* padding-top: 20px; */
        padding: 0;
        /* padding-right: 20%; */
        word-spacing: 1px;
        z-index: 1;
        position: absolute;
        top: 240px;
        height: 200px;
        width: 200px;
        left: 40%;
        top: 47%;
        font-size: 1.5rem;
        margin: 0;
    }
    .synoptezt{
        max-height: 100%;
        overflow: auto;
    }
    .page-containeranime{
        display: block;
        /* max-width: 3px; */
        /* padding-left: 290px; */
        /* padding-right: 160px; */
        margin-top: 95%;
        /* overflow: hidden; */
        /* max-height: 1000px; */
        margin-left: -280px;
    }
    .relatedbox{
        overflow: hidden;
        position: absolute;
        z-index: 2;
        margin-left: 3%;
        top: 170%;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 10px;
        grid-row-gap: 15px;
        padding-bottom: 80px;
        width: 97%;
    }
}
@media screen and (min-width:508px) and (max-width:570px){
    .aniCover{
        position: absolute;
        top: 140px;
        left: 10px;
        z-index: 2;
    }
    .aniCoverimg{
        width: 150px;
        height: 240px;
    }
    .aniTitleh2{
        margin-left: 40%;
        margin-top: -9px;
        padding-bottom: 6px;
        color: #68dae0;
        font-size: 2.2rem;
    }
    .aniTitle{
        margin-top: 5.3%;
        max-height: 70px;
    }
    .synop{
        width: 107%;
        color: rgb(206, 206, 206);
        background-color: #38424D;
        /* padding-bottom: 80px; */
        /* padding-left: 30%; */
        /* padding-top: 20px; */
        padding: 0;
        /* padding-right: 20%; */
        word-spacing: 1px;
        z-index: 1;
        position: absolute;
        top: 240px;
        height: 200px;
        width: 300px;
        left: 40%;
        top: 47%;
        font-size: 1.5rem;
        margin: 0;
    }
    .synoptezt{
        max-height: 100%;
        overflow: auto;
    }
    .page-containeranime{
        display: block;
        /* max-width: 3px; */
        /* padding-left: 290px; */
        /* padding-right: 160px; */
        margin-top: 55%;
        /* overflow: hidden; */
        /* max-height: 1000px; */
        margin-left: -280px;
    }
    .relatedbox{
        overflow: hidden;
        position: absolute;
        z-index: 2;
        margin-left: 3%;
        top: 170%;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 10px;
        grid-row-gap: 15px;
        padding-bottom: 80px;
        width: 97%;
    }
}
@media screen and (min-width:571px) and (max-width:630px){
    .aniCover{
        position: absolute;
        top: 140px;
        left: 10px;
        z-index: 2;
    }
    .aniCoverimg{
        width: 150px;
        height: 240px;
    }
    .aniTitleh2{
        margin-left: 40%;
        margin-top: -9px;
        padding-bottom: 6px;
        color: #68dae0;
        font-size: 2.2rem;
    }
    .aniTitle{
        margin-top: 5.3%;
        max-height: 70px;
    }
    .synop{
        width: 107%;
        color: rgb(206, 206, 206);
        background-color: #38424D;
        /* padding-bottom: 80px; */
        /* padding-left: 30%; */
        /* padding-top: 20px; */
        padding: 0;
        /* padding-right: 20%; */
        word-spacing: 1px;
        z-index: 1;
        position: absolute;
        top: 240px;
        height: 200px;
        width: 300px;
        left: 40%;
        top: 47%;
        font-size: 1.5rem;
        margin: 0;
    }
    .synoptezt{
        max-height: 100%;
        overflow: auto;
    }
    .page-containeranime{
        display: block;
        /* max-width: 3px; */
        /* padding-left: 290px; */
        /* padding-right: 160px; */
        margin-top: 55%;
        /* overflow: hidden; */
        /* max-height: 1000px; */
        margin-left: -280px;
    }
    .relatedbox{
        overflow: hidden;
        position: absolute;
        z-index: 2;
        margin-left: 3%;
        top: 170%;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 10px;
        grid-row-gap: 15px;
        padding-bottom: 80px;
        width: 97%;
    }
}
@media screen and (min-width:631px) and (max-width:760px){
    .aniCover{
        position: absolute;
        top: 140px;
        left: 10px;
        z-index: 2;
    }
    .aniCoverimg{
        width: 150px;
        height: 240px;
    }
    .aniTitleh2{
        margin-left: 25%;
        margin-top: -9px;
        padding-bottom: 6px;
        color: #68dae0;
        font-size: 2.2rem;
    }
    .aniTitle{
        margin-top: 5.3%;
        max-height: 70px;
    }
    .synop{
        width: 107%;
        color: rgb(206, 206, 206);
        background-color: #38424D;
        /* padding-bottom: 80px; */
        /* padding-left: 30%; */
        /* padding-top: 20px; */
        padding: 0;
        /* padding-right: 20%; */
        word-spacing: 1px;
        z-index: 1;
        position: absolute;
        top: 240px;
        height: 200px;
        width: 500px;
        left: 25%;
        top: 47%;
        font-size: 1.5rem;
        margin: 0;
    }
    .synoptezt{
        max-height: 100%;
        overflow: auto;
    }
    .page-containeranime{
        display: block;
        /* max-width: 3px; */
        /* padding-left: 290px; */
        /* padding-right: 160px; */
        margin-top: 55%;
        /* overflow: hidden; */
        /* max-height: 1000px; */
        margin-left: -280px;
    }
    .relatedbox{
        overflow: hidden;
        position: absolute;
        z-index: 2;
        margin-left: 3%;
        top: 170%;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 10px;
        grid-row-gap: 15px;
        padding-bottom: 80px;
        width: 97%;
    }
}
@media screen and (min-width:761px) and (max-width:960px){
    .aniCover{
        position: absolute;
        top: 140px;
        left: 10px;
        z-index: 2;
    }
    .aniCoverimg{
        width: 150px;
        height: 240px;
    }
    .aniTitleh2{
        margin-left: 25%;
        margin-top: -9px;
        padding-bottom: 6px;
        color: #68dae0;
        font-size: 2.2rem;
    }
    .aniTitle{
        margin-top: 5.3%;
        max-height: 70px;
    }
    .synop{
        width: 107%;
        color: rgb(206, 206, 206);
        background-color: #38424D;
        /* padding-bottom: 80px; */
        /* padding-left: 30%; */
        /* padding-top: 20px; */
        padding: 0;
        /* padding-right: 20%; */
        word-spacing: 1px;
        z-index: 1;
        position: absolute;
        top: 240px;
        height: 200px;
        width: 500px;
        left: 25%;
        top: 47%;
        font-size: 1.5rem;
        margin: 0;
    }
    .synoptezt{
        max-height: 100%;
        overflow: auto;
    }
    .page-containeranime{
        display: block;
        /* max-width: 3px; */
        /* padding-left: 290px; */
        /* padding-right: 160px; */
        margin-top: 40%;
        /* overflow: hidden; */
        /* max-height: 1000px; */
        margin-left: -280px;
    }
    .relatedbox{
        overflow: hidden;
        position: absolute;
        z-index: 2;
        margin-left: 3%;
        top: 170%;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 10px;
        grid-row-gap: 15px;
        padding-bottom: 80px;
        width: 97%;
    }
}
@media screen and (min-width:961px) and (max-width:1024px){
    .aniCover{
        position: absolute;
        top: 140px;
        left: 10px;
        z-index: 2;
    }
    .aniCoverimg{
        width: 150px;
        height: 240px;
    }
    .aniTitleh2{
        margin-left: 25%;
        margin-top: -9px;
        padding-bottom: 6px;
        color: #68dae0;
        font-size: 2.2rem;
    }
    .aniTitle{
        margin-top: 5.3%;
        max-height: 70px;
    }
    .synop{
        width: 107%;
        color: rgb(206, 206, 206);
        background-color: #38424D;
        /* padding-bottom: 80px; */
        /* padding-left: 30%; */
        /* padding-top: 20px; */
        padding: 0;
        /* padding-right: 20%; */
        word-spacing: 1px;
        z-index: 1;
        position: absolute;
        top: 240px;
        height: 200px;
        width: 500px;
        left: 25%;
        top: 47%;
        font-size: 1.5rem;
        margin: 0;
    }
    .synoptezt{
        max-height: 100%;
        overflow: auto;
    }
    .page-containeranime{
        display: block;
        /* max-width: 3px; */
        /* padding-left: 290px; */
        /* padding-right: 160px; */
        margin-top: 40%;
        /* overflow: hidden; */
        /* max-height: 1000px; */
        margin-left: -280px;
    }
    .relatedbox{
        overflow: hidden;
        position: absolute;
        z-index: 2;
        margin-left: 3%;
        top: 170%;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 10px;
        grid-row-gap: 15px;
        padding-bottom: 80px;
        width: 97%;
    }
}
@media screen and (min-width:1025px) and (max-width:1328px){
    .aniCover{
        position: absolute;
        top: 140px;
        left: 10px;
        z-index: 2;
    }
    .aniCoverimg{
        width: 150px;
        height: 240px;
    }
    .aniTitleh2{
        margin-left: 25%;
        margin-top: -9px;
        padding-bottom: 6px;
        color: #68dae0;
        font-size: 2.2rem;
    }
    .aniTitle{
        margin-top: 5.3%;
        max-height: 70px;
    }
    .synop{
        width: 107%;
        color: rgb(206, 206, 206);
        background-color: #38424D;
        /* padding-bottom: 80px; */
        /* padding-left: 30%; */
        /* padding-top: 20px; */
        padding: 0;
        /* padding-right: 20%; */
        word-spacing: 1px;
        z-index: 1;
        position: absolute;
        top: 240px;
        height: 200px;
        width: 500px;
        left: 25%;
        top: 47%;
        font-size: 1.5rem;
        margin: 0;
    }
    .synoptezt{
        max-height: 100%;
        overflow: auto;
    }
    .page-containeranime{
        display: block;
        /* max-width: 3px; */
        /* padding-left: 290px; */
        /* padding-right: 160px; */
        margin-top: 40%;
        /* overflow: hidden; */
        /* max-height: 1000px; */
        margin-left: -280px;
    }
    .relatedbox{
        overflow: hidden;
        position: absolute;
        z-index: 2;
        margin-left: 3%;
        top: 170%;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 10px;
        grid-row-gap: 15px;
        padding-bottom: 80px;
        width: 97%;
    }
}
@media screen and (max-width:1365px) and (min-width:1329px){
    .aniCover{
        position: absolute;
        top: 140px;
        left: 10px;
        z-index: 2;
    }
    .aniCoverimg{
        width: 150px;
        height: 240px;
    }
    .aniTitleh2{
        margin-left: 25%;
        margin-top: -9px;
        padding-bottom: 6px;
        color: #68dae0;
        font-size: 2.2rem;
    }
    .aniTitle{
        margin-top: 5.3%;
        max-height: 70px;
    }
    .bookmarkLogin{
        position: absolute;
        z-index: 3;
        top: 38%;
        left: 25%;
    }
    .bookmarktextlogin{
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 5%;
        padding-bottom: 5%;
        background-color: #2c3e50;
        color: white;
        border: none;
        max-width: 200px;
        font-size: 1.5rem;  
    }
    .synop{
        width: 107%;
        color: rgb(206, 206, 206);
        background-color: #38424D;
        /* padding-bottom: 80px; */
        /* padding-left: 30%; */
        /* padding-top: 20px; */
        padding: 0;
        /* padding-right: 20%; */
        word-spacing: 1px;
        z-index: 1;
        position: absolute;
        top: 240px;
        height: 200px;
        width: 500px;
        left: 25%;
        top: 47%;
        font-size: 1.5rem;
        margin: 0;
    }
    .synoptezt{
        max-height: 100%;
        overflow: auto;
    }
    .page-containeranime{
        display: block;
        /* max-width: 3px; */
        /* padding-left: 290px; */
        /* padding-right: 160px; */
        margin-top: 40%;
        /* overflow: hidden; */
        /* max-height: 1000px; */
        margin-left: -280px;
    }
    .relatedbox{
        overflow: hidden;
        position: absolute;
        z-index: 2;
        margin-left: 3%;
        top: 170%;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 10px;
        grid-row-gap: 15px;
        padding-bottom: 80px;
        width: 97%;
    }
}
@media screen and (min-width:1366px) and (max-width:1560px){
    .aniCover{
        position: absolute;
        top: 132px;
        left: 10px;
        z-index: 2;
    }
    .aniCoverimg{
        width: 250px;
        height: 350px;
    }
    .aniTitleh2{
        margin-left: 21%;
        margin-top: -15px;
        padding-bottom: 6px;
        color: #68dae0;
        font-size: 2.2rem;
    }
    .aniTitle{
        margin-top: 5.2%;
        max-height: 70px;
    }
    .synop{
        width: 107%;
        color: rgb(206, 206, 206);
        background-color: #38424D;
        /* padding-bottom: 80px; */
        /* padding-left: 30%; */
        /* padding-top: 20px; */
        padding: 0;
        /* padding-right: 20%; */
        word-spacing: 1px;
        z-index: 1;
        position: absolute;
        height: 215px;
        width: 100%;
        left: 0%;
        top: 35%;
        font-size: 1.7rem;
        margin: 0;
    }
    .synoptezt{
        max-height: 100%;
        overflow: auto;
        padding: 5px;
        padding-left: 21%;
    }
    .page-containeranime{
        display: block;
        /* max-width: 3px; */
        /* padding-left: 290px; */
        /* padding-right: 160px; */
        margin-top: 26%;
        /* overflow: hidden; */
        /* max-height: 1000px; */
        margin-left: -280px;
    }
    .relatedbox{
        overflow: hidden;
        position: absolute;
        z-index: 2;
        margin-left: 21%;
        top: 80%;
        display: inline-grid;
        grid-template-columns: repeat(3,1fr);
        grid-column-gap: 10px;
        grid-row-gap: 15px;
        padding-bottom: 80px;
        width: 70%;
    }
}
@media screen and (max-width:375px){
    .page-container{
        min-height: 1%;
        display: block;
        max-width: 1720px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .result{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 40px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
    }
    .result-map{
        display: inline-grid;
        grid-template-columns: 200px auto;
        height: 200px;
        width: 130px;
        overflow: hidden;
        position: relative;
        text-align: left;
    }
    .imgmap{
        position: relative;
        z-index: 1;
        width: 70%;
        height: 100%;
    }
}
@media screen and (min-width:376px) and (max-width:390px){
    .page-container{
        min-height: 1%;
        display: block;
        max-width: 1720px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .result{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 40px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
    }
    .result-map{
        display: inline-grid;
        grid-template-columns: 200px auto;
        height: 200px;
        width: 130px;
        overflow: hidden;
        position: relative;
        text-align: left;
    }
    .imgmap{
        position: relative;
        z-index: 1;
        width: 70%;
        height: 100%;
    }
}
@media screen and (min-width:391px) and (max-width:414px){
    .page-container{
        min-height: 1%;
        display: block;
        max-width: 1720px;
        padding-left: 50px;
        padding-right: 50px;
    }
    .result{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 40px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
    }
    .result-map{
        display: inline-grid;
        grid-template-columns: 200px auto;
        height: 200px;
        width: 130px;
        overflow: hidden;
        position: relative;
        text-align: left;
    }
    .imgmap{
        position: relative;
        z-index: 1;
        width: 70%;
        height: 100%;
    }
}
@media screen and (min-width:415px) and (max-width:435px){
    .page-container{
        min-height: 1%;
        display: block;
        max-width: 1720px;
        padding-left: 60px;
        padding-right: 60px;
    }
    .result{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 40px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
    }
    .result-map{
        display: inline-grid;
        grid-template-columns: 200px auto;
        height: 200px;
        width: 130px;
        overflow: hidden;
        position: relative;
        text-align: left;
    }
    .imgmap{
        position: relative;
        z-index: 1;
        width: 70%;
        height: 100%;
    }
}
@media screen and (min-width:436px) and (max-width:507px){
    .page-container{
        min-height: 1%;
        display: block;
        max-width: 1720px;
        padding-left: 70px;
        padding-right: 70px;
    }
    .result{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 80px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
    }
    .result-map{
        display: inline-grid;
        grid-template-columns: 200px auto;
        height: 200px;
        width: 130px;
        overflow: hidden;
        position: relative;
        text-align: left;
    }
    .imgmap{
        position: relative;
        z-index: 1;
        width: 70%;
        height: 100%;
    }
}
@media screen and (min-width:508px) and (max-width:570px){
    .page-container{
        min-height: 1%;
        display: block;
        max-width: 1720px;
        padding-left: 40px;
        padding-right: 40px;
    }
    .result{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(3,1fr);
        grid-column-gap: 40px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
    }
    .result-map{
        display: inline-grid;
        grid-template-columns: 200px auto;
        height: 200px;
        width: 130px;
        overflow: hidden;
        position: relative;
        text-align: left;
    }
    .imgmap{
        position: relative;
        z-index: 1;
        width: 70%;
        height: 100%;
    }
}
@media screen and (min-width:571px) and (max-width:630px){
    .page-container{
        min-height: 1%;
        display: block;
        max-width: 1720px;
        padding-left: 40px;
        padding-right: 40px;
    }
    .result{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(3,1fr);
        grid-column-gap: 40px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
    }
    .result-map{
        display: inline-grid;
        grid-template-columns: 200px auto;
        height: 200px;
        width: 130px;
        overflow: hidden;
        position: relative;
        text-align: left;
    }
    .imgmap{
        position: relative;
        z-index: 1;
        width: 70%;
        height: 100%;
    }
}
@media screen and (min-width:631px) and (max-width:760px){
    .page-container{
        min-height: 1%;
        display: block;
        max-width: 1720px;
        padding-left: 40px;
        padding-right: 40px;
    }
    .result{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(4,1fr);
        grid-column-gap: 40px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
    }
    .result-map{
        display: inline-grid;
        grid-template-columns: 200px auto;
        height: 200px;
        width: 130px;
        overflow: hidden;
        position: relative;
        text-align: left;
    }
    .imgmap{
        position: relative;
        z-index: 1;
        width: 70%;
        height: 100%;
    }
}
@media screen and (min-width:761px) and (max-width:960px){
    .page-container{
        min-height: 1%;
        display: block;
        max-width: 1720px;
        padding-left: 40px;
        padding-right: 40px;
    }
    .result{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(5,1fr);
        grid-column-gap: 40px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
    }
    .result-map{
        display: inline-grid;
        grid-template-columns: 200px auto;
        height: 200px;
        width: 130px;
        overflow: hidden;
        position: relative;
        text-align: left;
    }
    .imgmap{
        position: relative;
        z-index: 1;
        width: 70%;
        height: 100%;
    }
}
@media screen and (min-width:961px) and (max-width:1024px){
    .page-container{
        min-height: 1%;
        display: block;
        max-width: 1720px;
        padding-left: 40px;
        padding-right: 40px;
    }
    .result{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(5,1fr);
        grid-column-gap: 40px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
    }
    .result-map{
        display: inline-grid;
        grid-template-columns: 200px auto;
        height: 250px;
        width: 160px;
        overflow: hidden;
        position: relative;
        text-align: left;
    }
    .imgmap{
        position: relative;
        z-index: 1;
        width: 80%;
        height: 100%;
    }
}
@media screen and (min-width:1025px) and (max-width:1328px){
    .page-container{
        min-height: 1%;
        display: block;
        max-width: 1720px;
        padding-left: 40px;
        padding-right: 40px;
    }
    .result{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(5,1fr);
        grid-column-gap: 40px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
    }
    .result-map{
        display: inline-grid;
        grid-template-columns: 200px auto;
        height: 250px;
        width: 160px;
        overflow: hidden;
        position: relative;
        text-align: left;
    }
    .imgmap{
        position: relative;
        z-index: 1;
        width: 80%;
        height: 100%;
    }
}
@media screen and (min-width:1366px) and (max-width:1560px){
    .synoptezt{
        font-size: 1.2rem;
    }
    .synop {
    width: 107%;
    color: rgb(206, 206, 206);
    background-color: #38424D;
    padding: 0;
    word-spacing: 1px;
    z-index: 1;
    position: absolute;
    height: 215px;
    width: 100%;
    left: 0%;
    top: 28%;
    font-size: 1.7rem;
    margin: 0;
    }
    .page-container{
        min-height: 1%;
        display: block;
        max-width: 1720px;
        padding-left: 40px;
        padding-right: 40px;
    }
    .result{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(5,1fr);
        grid-column-gap: 40px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
    }
    .result-map{
        display: inline-grid;
        grid-template-columns: 200px auto;
        height: 250px;
        width: 160px;
        overflow: hidden;
        position: relative;
        text-align: left;
    }
    .imgmap{
        position: relative;
        z-index: 1;
        width: 80%;
        height: 100%;
    }
    .result-genre{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(4,1fr);
        grid-column-gap: 40px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
        position: absolute;
        top: 130;
        padding-left: 190px;
    }
    .page-containeranime {
    display: block;
    margin-top: 20%;
    margin-left: -280px;
    }
    .relatedbox {
    margin-left: 0;
    overflow: hidden;
    position: absolute;
    z-index: 2;
    top: 57%;
    display: inline-grid;
    grid-template-columns: repeat(3,1fr);
    grid-column-gap: 10px;
    grid-row-gap: 15px;
    padding-bottom: 80px;
    width: 70%;
}
}
</style>