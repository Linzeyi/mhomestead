<template>
  <div id="home">
    <div class="top-container collapse" id="top_container" aria-multiselectable="true" ref="top_container_el">
      <div class="font-container">
        <h2>关于我们</h2>
        <blockquote>
          <p>“M.Homestead”将成为你的网络私人住宅，它的意义在于让学生或从业人士能够享有更全面的日程管理服务。</p>
          <p>”M.Homestead”是一个方便用户进行活动日程安排与人生规划的综合性平台，在学业或工作生活中记录个人感悟，规划今后人生路线，保存与管理重要文件资源，构建属于自己的私人空间。</p>
          <p>平台的主要功能板块包含<strong>个人主页区、日程安排区、人生规划区、笔记区、文件资源区、社交区、日记管理、数据分析区</strong>等，模块丰富，高效快捷，旨在让用户将其当作自己的“网上家园”</p>
          <footer>Signed in <cite title="Source Title">M.Homestead</cite></footer>
        </blockquote>   
      </div>
    </div>
    <div class="slide-top-box">
      <span 
      class="glyphicon slide-bg-btn" 
      :class="{'glyphicon-triangle-top':topShow,'glyphicon-triangle-bottom':!topShow}"
      data-toggle="collapse" 
      href="#top_container" 
      aria-expanded="false" 
      aria-controls="top_container" 
      @click="slideTopContainer($event)">
        <span class="note">
          <font v-if="topShow"></font>
          <font v-if="!topShow"></font>
        </span>  
      </span>
    </div>
    <div class="container-fluid">
      <div class="home-content-box">
        <h1 class="text-uppercase">Welcome To</h1>
        <h1 class="text-uppercase">M.Homestead</h1>
        <div class="cutting-line"></div>
        <h3 class="sub-text">准备开启您的高效人生吧！</h3>
        <div class="container btn-group">
          <div class="row">
            <div class="col-md-2"></div>
            <div class="col-md-2">
              <router-link to="life"><button class="life-btn">人生规划</button></router-link>
            </div>
  <!--           <div class="col-md-2">
              <router-link to="activity"><button class="activity-btn">日程管理</button></router-link>
            </div> -->
            <div class="col-md-2">
              <router-link to="note"><button class="note-btn">笔记专区</button></router-link>
            </div>
            <div class="col-md-2">
               <router-link to="friend"><button class="friend-btn">我的好友</button></router-link>
            </div>
            <div class="col-md-2">
              <router-link to="document"><button class="document-btn">文件资源</button></router-link>
            </div>
            <div class="col-md-2"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>

  export default{
    name: 'home',
    data: function(){
      return {
        'topShow': false,
      }
    },
    created: function(){
      this.init()
    },
    mounted: function(){
    },
    computed: {
      getColNum: function(){
        return 12/this.topInfo.length
      }
    },
    methods: {
      init: function(){
        
      },
      slideTopContainer: function(e){
        this.topShow = !this.topShow
      },
      getdata: function(e){
        console.log(e.draggedContext.element.id)
      },
      datadragEnd: function(e){
        console.log('拖动前的索引 :' + e.oldIndex)
        console.log('拖动后的索引 :' + e.newIndex)
        console.log(this.topInfo)
      }
    }
  }
</script>

<style>
#home{
  /*background-color: #f9f9f9;*/
  background-image: url("../assets/img/bg-5.jpg");
  background-size: 100%;
  height: calc(100% - 70px);
  overflow-y: auto;
  /*width: 100%;  */
}
#home:after{
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  background-color: black;
  opacity: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}
#home .top-container{
  z-index: 20;
  position: relative;
  width: 100%;  
  /*background-color: #f9f9f9;*/
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px 0px 20px 0;
}
#home .top-container .font-container{
  padding-top: 20px;
  line-height: 30px;
}
#home .top-container .font-container blockquote{
  margin: 0;
}
#home .top-container .font-container p{
  color: #6d6d6d;
  font-size: 0.8em;
  font-weight: normal;
  width: 60%;
  margin: 0 auto 10px auto;
}
#home .top-container .font-container footer{
  font-size: 0.8em;
}
#home .top-container .details-wrap{
  padding-top: 30px;
}
#home .slide-top-box{
  width: 100%;
  height: 50px;
  line-height: 50px;
  z-index: 2;
  position: relative;
  /*background-color: #f9f9f9;*/
  background-color: rgba(255, 255, 255, 0.5);
}
#home .slide-top-box span.slide-bg-btn{
  display: inline-block;
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
}
#home .slide-top-box span.slide-bg-btn .note{
  font-size: 0.8em;
  line-height: 40px;
  height: 40px;
  display: inline-block;
  margin-left: 6px;
  position: relative;
  top: -3px;
}
#home .top-container .details-wrap,
#home .top-container .details-wrap .row,
#home .top-container .details-wrap .row .top-box{
  height: 100%;
}
#home .top-container .details-wrap .row .top-box{
  text-align: left;
  padding: 8px 36px;
}
#home .container-fluid{
  position: relative;
  z-index: 2;
  padding:40px 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
}
#home .container-fluid .home-content-box .cutting-line{
  border: 1px solid #fff;
  margin: 20px auto 30px auto;
  width: 60%;
}
#home .container-fluid .home-content-box h1{
  font-size: 100px;
  cursor: default;
  user-select:none;
}
#home .container-fluid .home-content-box .sub-text{
  color: rgba(0, 0, 0, 0.4);
  user-select:none;
}
#home .container-fluid .home-content-box .btn-group{
  padding: 30px 80px;
}
#home .container-fluid .home-content-box .btn-group .row{
  padding: 20px;
}
#home .container-fluid .home-content-box .btn-group button{
  background-color: transparent;
  color: #fff4eb;
  font-size: 1em;
  border: none;
  outline: none;
  font-weight: 400;
  border-radius: 4px;
  padding: 10px 30px;
  margin: 4px 0;
  box-shadow: 0px 1px 4px #441304;
  transition: all 0.7s;
  -moz-transition: all 0.7s; /* Firefox 4 */
  -webkit-transition: all 0.7s; /* Safari 和 Chrome */
  -o-transition: all 0.7s; /* Opera */
}
#home .container-fluid .home-content-box .btn-group button.life-btn{
  background-color: #fab27b;
}
#home .container-fluid .home-content-box .btn-group button.life-btn:hover{
  background-color: #f5964d;
  box-shadow: 0px 3px 10px #441304;
}
#home .container-fluid .home-content-box .btn-group button.activity-btn{
  background-color: #f47a55;
}
#home .container-fluid .home-content-box .btn-group button.activity-btn:hover{
  background-color: #d8613d;
  box-shadow: 0px 3px 10px #441304;
}
#home .container-fluid .home-content-box .btn-group button.note-btn{
  background-color: #da765b;
}
#home .container-fluid .home-content-box .btn-group button.note-btn:hover{
  background-color: #b9593e;
  box-shadow: 0px 3px 10px #441304;
}
#home .container-fluid .home-content-box .btn-group button.friend-btn{
  background-color: #ae5039;
}
#home .container-fluid .home-content-box .btn-group button.friend-btn:hover{
  background-color: #883420;
  box-shadow: 0px 3px 10px #441304;
}
#home .container-fluid .home-content-box .btn-group button.document-btn{
  background-color: #8e453f;
}
#home .container-fluid .home-content-box .btn-group button.document-btn:hover{
  background-color: #612823;
  box-shadow: 0px 3px 10px #441304;
}
</style>