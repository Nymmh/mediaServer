<template>
  <ApolloQuery :query="require('../graphql/allAnime.gql')">
    <template v-slot="{result:{loading,error,data}}">
        <template v-if="loading">
          <div v-if="loading"><img src="http://anitoaster.ca/assets/70972fd.png" alt="" srcset="">Loading</div>
        </template>
        <template v-else-if="error">
            <h1 style="color:red">Error loading data</h1>
            <img src="http://anitoaster.ca/assets/faeb8fd9272d4e33ccb340a4e91c424e9115fa0e_hq.gif" alt="" srcset="">
        </template>
        <template v-else-if="data" >
          <div class="main">
            <p class="newRESTitlenewnew">Catalog</p>
            <!-- <div id="goup" class="goup" onclick='up1()' style="display:block">
              Up
              <span class="caretup"></span>
            </div> -->
            <div class="page-container">
              <div class="result">
                <div v-for="anime in data.anime" :key="anime._id" class="result-map">
                  <a v-bind:href="/anime/+anime._id+'/'+anime.titles[0].romaji.replace(/ /g,'_').replace(/\//g,'_-_')"><img v-bind:src="anime.images[0].cover" class="imgmap"><div><p class="texttop">{{anime.titles[0].romaji}}</p></div></a>
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
export default {
    name: "all",
    components:{'loading':Loading},
}
</script>

<style scoped>
.form,
.input,
.apollo,
.message {
  padding: 12px;
}

label {
  display: block;
  margin-bottom: 6px;
}

.input {
  font-family: inherit;
  font-size: inherit;
  border: solid 2px #ccc;
  border-radius: 3px;
}

.error {
  color: red;
}

.images {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 300px;
  grid-gap: 10px;
}

.image-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ccc;
  border-radius: 8px;
}

.image {
  max-width: 100%;
  max-height: 100%;
}

.image-input {
  margin: 20px;
}
.main {
  margin-top: 50px;
  overflow: hidden;
}
.page-container {
  min-height: 1%;
  display: block;
  max-width: 1720px;
  padding-left: 300px;
  padding-right: 300px;
}
.result {
  margin: 0 auto;
  display: inline-grid;
  grid-template-columns: repeat(5,1fr);
  grid-column-gap: 80px;
  grid-row-gap: 40px;
  padding-bottom: 80px;
}
.result-map {
  display: inline-grid;
  grid-template-columns: 200px auto;
  height: 300px;
  width: 200px;
  overflow: hidden;
  position: relative;
  text-align: left;
}
.imgmap {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}
.texttop {
  position: absolute;
  z-index: 2;
  bottom: 0;
  margin: 0;
  color: #18bc9c;
  background-color: rgba(46, 46, 46, 0.600);
  padding-left: 5%;
  width: 100%;
  padding-bottom: 7%;
  padding-top: 3%;
  font-weight: bolder;
  font-size: 110%;
  transition: all .2s ease-in-out;
}
.texttop:hover, .texttop:focus{
  color: #0f7864;
  text-decoration: underline;
}
.goup {
  position: absolute;
  color: white;
  top: 38%;
  left: 11%;
  background-color: #1a252f;
  padding-top: 7px;
  padding-bottom: 7px;
  border-radius: 7px;
  padding-left: 21px;
  padding-right: 21px;
  cursor: pointer;
}
.caretup {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 2px;
  vertical-align: middle;
  border-bottom: 4px dashed;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
}
.newRESTitlenewnew {
  margin: 0;
  color: aliceblue;
  font-weight: bold;
  font-size: 2rem;
  padding-bottom: 1%;
  text-align: left;
  margin-left: 15.55%;
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
    .result-genre{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(1,1fr);
        grid-column-gap: 80px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
        position: absolute;
        top: 130;
        padding-left: 190px;
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
    .result-genre{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(1,1fr);
        grid-column-gap: 80px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
        position: absolute;
        top: 130;
        padding-left: 190px;
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
    .result-genre{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(1,1fr);
        grid-column-gap: 80px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
        position: absolute;
        top: 130;
        padding-left: 190px;
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
    .result-genre{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 40px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
        position: absolute;
        top: 130;
        padding-left: 190px;
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
    .result-genre{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 40px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
        position: absolute;
        top: 130;
        padding-left: 190px;
    }
}
@media screen and (min-width:631px) and (max-width:859px){
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
    .result-genre{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(2,1fr);
        grid-column-gap: 40px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
        position: absolute;
        top: 130;
        padding-left: 190px;
    }
}
@media screen and (min-width:860px) and (max-width:960px){
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
    .result-genre{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(3,1fr);
        grid-column-gap: 40px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
        position: absolute;
        top: 130;
        padding-left: 190px;
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
    .result-genre{
        margin: 0 auto;
        display: inline-grid;
        grid-template-columns: repeat(3,1fr);
        grid-column-gap: 40px;
        grid-row-gap: 40px;
        padding-bottom: 80px;
        position: absolute;
        top: 130;
        padding-left: 190px;
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
}
@media screen and (max-width:1365px) and (min-width:1329px){
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
}
</style>