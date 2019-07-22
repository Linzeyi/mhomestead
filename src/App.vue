<template>
  <div id="app">
    <mheader v-if="$store.state.shownFixed"></mheader>
    <div class="app-header-bg" v-if="$store.state.shownFixed"></div>
    <router-view/>
  </div>
</template>

<script>
import cookie from 'vue-cookie'
export default {
  name: 'App',
  data: function(){
    return {
    }
  },
  created: function(){
  },
  methods: {
  }
};
</script>

<style>
html,body,#app{
  width: 100%;
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 14px;
}
::-webkit-scrollbar {/*滚动条整体样式*/
  width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 5px;
  position: fixed;
}
::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 2px;
   -webkit-box-shadow: inset 0 0 2px rgba(0,0,0,0.1);
  background: #535353;
}
::-webkit-scrollbar-track {/*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 2px rgba(0,0,0,0.1);
  border-radius: 2px;
  background: #EDEDED;
}

ol, ul {
  list-style: none;
}
ol, ul, p {
  margin: 0; 
  padding: 0;
}
*:focus {
  outline: 0 !important;
}
.shade{
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(54, 18, 18, 0.3);
}
.align-right{
  text-align: right;
}
.align-left{
  text-align: left;
}
.float-right{
  float: right;
}
.float-left{
  float: left;
}
.full-height{
  height: 100%;
}
.full-width{
  width: 100%;
}
.cutting-line{
  margin: 20px 0 18px;
  border-bottom: 1px solid #eee;
}
.app-header-bg{
  height: 70px;
  width: 100%;
  z-index: -1;
}
.dropdown-menu li a{
  font-size: 1em;
  line-height: 1.6;
}
.dropdown-menu li a span.glyphicon {
  margin-right: 10px;
  line-height: 1.4;
  top: 2px;
}
.label{
  padding: 0.3em .6em .3em;
}
.modal{
  z-index: 100;
}
.modal-backdrop{
  z-index: 8;
}
.row {
  margin: 0;
}
a:focus{
  outline: 0;
}
</style>
