<template>
  <div id="bg_board" :style="imgStyle">
<!--     <div class="container-fluid">
      <div class="img-box" :style="imgStyle">
      </div>
    </div> -->
  </div>
</template>

<script>
  export default{
    name: 'bg-board',
    props:[
      'imgSrc'
    ],
    data: function(){
      return {
        imgStyle: {
          backgroundImage: "url(" + this.imgSrc + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center"
        },
      }
    },
    created: function(){  
      this.init()
    },
    mounted: function() {

    },
    methods: {
      init: function(){

      }
    },
    watch: {

    }
  }
</script>

<style>
  #bg_board{
    width: 100%;
    height: 100%;
    position: fixed;
  }
</style>