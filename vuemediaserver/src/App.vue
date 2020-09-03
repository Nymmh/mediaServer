<template>
  <div id="app">
    <img v-bind:src="getBGImage.replace('localhost','70.77.208.186')" class="backgroundmain">
    <header>
      <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container">
          <div class="navbar-header">
            <a href="/" class="navbar-brand"><strong>Nymhflix</strong></a>
          </div>
          <div class="navbar-collapse collapse" id="navbar-main">
            <ul class="nav navbar-nav">
              <div class="navsearch">
                <form action method="POST" autocomplete="off">
                  <input type="text" name="livesearch" id="livesearch" placeholder="Anime" min="3" class="livesearchbar" @keyup="animeSearch" v-model="searchText">
                </form>
              </div>
              <div class="navsearch">
                <a href="/browse" class="livesearchbar" style="position: relative;right: 60%;padding: 5px 25px;font-size: .9em;cursor: pointer;top:25px;">Browse</a>
              </div>
            </ul>
          </div>
        </div>
      </nav>
      <div v-if="searchText.length > 1">
        <ol class="searchRes">
         <template v-for="searchDef in searchRes[0]">
            <li style="padding-bottom:7px" :key="searchDef._id"><a v-bind:href="/anime/+searchDef.titles[0].parent+'/'+searchDef.titles[0].romaji.replace(/ /g,'_').replace(/\//g,'_-_')" style="color:#18bc9c">{{searchDef.titles[0].romaji}}</a></li>
          </template>
        </ol>
      </div>
    </header>
    <router-view></router-view>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'app',
  components: {},
  data(){
    return{
      images:[
        'http://localhost/assets/bg/bg-01.png',
        'http://localhost/assets/bg/bg-02.png',
        'http://localhost/assets/bg/bg-03.png',
        'http://localhost/assets/bg/bg-04.png',
        'http://localhost/assets/bg/bg-05.png'
      ],
      getBGImage: '',
      searchRes:[],
      searchText:"",
    }
  },
  created () {
    const idx = Math.floor(Math.random() * this.images.length)
    this.getBGImage = this.images[idx]
  },
  methods:{
    animeSearch: function(){
      axios({
        url: "http://70.77.208.186:5000/graphql",
        method: 'post',
        data:{
          query:`
          query animeSearch($title:String){
            animeSearch(romaji:$title){
              _id
              titles{
                parent
                romaji
              }
            }
          }
          `,
          variables:{
            title: this.searchText
          }
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((result)=>{
        this.searchRes = []
        if(this.searchText.length > 1){
          this.searchRes.push(result.data.data.animeSearch)
        }
      });
    },
  }
}

</script>
<style>
*{
  box-sizing: border-box;
}
@import url(https://fonts.googleapis.com/css?family=Open+Sans);
body{
  margin: 0;
  background: #38424D;
}
header{
  display: block;
}
#app {
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.vue_notifications{
  padding: 10px;
  margin: 15% 5px 5px;
  font-size: 1.1em;
  color: #ffffff;
  border-radius: 5px;
  z-index: 1000;
}
.vue_notification_success{
  background:#18bc9c !important;
}
.vue_notification_failed{
  background:#e43725 !important;
}
.requestthumb{
  color: #18bc9c;
  background: none;
  border: none;
  text-align: left;
  font-size: .9em;
  padding-top: 2em;
  padding-bottom: 1.8em;
  padding-left: 5%;
  width: 100%;
  cursor: pointer;
}
.requestthumb:focus{
  outline-color: #1a252f;
}
.backgroundmain{
	max-width:100%;
	height:auto;
	margin-top:-100px;
	position:fixed;
	overflow:hidden;
	z-index: -1;
  left: 0;
}
.navbar-default {
  background-color: #2c3e50;
  border-color: #202d3b;
  box-shadow: 5px 10px 18px 2B2F33;
}
.navbar-fixed-top {
  top: 0;
  border-width: 0 0 1px;
}
.navbar-fixed-top, .navbar-fixed-bottom {
  position: fixed;
  right: 0;
  left: 0;
  z-index: 1030;
}
.navbar {
  z-index: 0;
  position: relative;
  min-height: 80px;
  margin-bottom: 24px;
  border: 1px solid transparent;
}
.navbar:before, .navbar:after {
  display: table;
  content: " ";
}
.container {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}
.container:before, .container:after {
  display: table;
  content: " ";
}
.container > .navbar-header, .container > .navbar-collapse, .container-fluid > .navbar-header, .container-fluid > .navbar-collapse {
  margin-right: -15px;
  margin-left: -15px;
}
.navbar-default .navbar-brand {
  color: #fff;
}
.navbar-brand {
  margin-right: 5px;
  font-size: 20px;
  text-decoration: none;
}
.navbar-brand {
  float: left;
  height: 80px;
  padding: 28px 15px;
  font-size: 20px;
  line-height: 24px;
}
.livesearchbar{
  margin-top: 21px;
  padding-top: 7px;
  padding-bottom: 7px;
  background: #1a252f;
  border: 0;
  padding-left: 7px;
  padding-right: 7px;
  color: white;
  border-radius: 4px;
}
.navsearch{
  float: right;
  position: relative;
  top: -10px;
}
.searchRes {
  z-index: 2;
  position: absolute;
  text-align: left;
  bottom: 70%;
  left: 70.15%;
  color: white;
  background-color: #1a252f;
  padding-left: 10px;
  padding-right: 10px;
  width: 184px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 4px;
  list-style: none;
  height: 200px;
  overflow: auto;
}
@media (min-width: 1200px){
  .container {
    width: 1170px;
  }
}
@media (min-width: 768px){
  .container > .navbar-header, .container > .navbar-collapse, .container-fluid > .navbar-header, .container-fluid > .navbar-collapse {
    margin-right: 0;
    margin-left: 0;
  }
  .navbar-header {
    float: left;
  }
  .navbar > .container .navbar-brand, .navbar > .container-fluid .navbar-brand {
    margin-left: -15px;
  }
  .navbar-nav > li {
    float: left;
  }
  .navbar-nav > li > a {
    padding-top: 7px;
    padding-bottom: 7px;
    margin-top: 21px;
    margin-bottom: 21px;
    border-radius: 4px;
  }
  .navbar-nav > li > .dropdown-menu {
    margin-top: -21px;
  }
}
</style>
