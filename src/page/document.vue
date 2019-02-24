<template>
  <div id="document">
    <div class="container-fluid">
      <div class="sidebar-wrap">
        <div class="header-wrap">
          <p class="wrap-title">资料库</p>
        </div>
        <div class="wrap-li">
          <p class="li-title" @click="toAllDocs()"><i class="iconfont icon-all">&#xe608;</i>全部文件</p>
        </div>
        <div class="tree-wrap">
          <p class="sub-title">文件列表</p>
          <vue-ztree :list.sync='docsList' :func='nodeClick' :expand='expandClick' :contextmenu='contextmenuClick' :is-open='true'></vue-ztree>
        </div>
      </div>
      <div class="content-wrap">
        <div class="header-wrap">
          <div class="header-box">
            <div class="row">
              <div class="col-md-4">
                <p class="header-title" v-if="isAllDocs"><i class="iconfont icon-all">&#xe608;</i>全部文件</p>
                <p class="header-title" v-if="currentDoc.children || currentDoc.children == ''"><i class="iconfont icon-folder">&#xe6e8;</i>{{currentDoc.name}}</p>
                <p class="header-title" v-if="currentDoc && !currentDoc.children && !isAllDocs"><i class="iconfont icon-file">&#xe667;</i>{{currentDoc.name}}</p>
              </div>
              <div class="col-md-6"></div>
              <div class="col-md-2"></div>
            </div>
          </div>
        </div>
        <div class="folder-wrap" v-if="checkFolder(currentDoc)">
          <div class="row" v-for="rowIndex in objGroupNum">
            <div class="col-md-2" v-for="(item,index) in rowObjGroup(rowIndex)">
              <div class="thumbnail folder-item" @click="nodeClick(item)">
                <i class="iconfont icon-type folder" v-if="item.children && item.children != ''">&#xe67f;</i>
                <i class="iconfont icon-type file" v-else>&#xe65f;</i>
                <p class="doc-name">
                  <span class="doc-name">{{item.name}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="file-wrap" v-else>
          <!-- <textarea name="" v-model="text" id="" cols="30" rows="10"></textarea> -->
          <!-- <file-reader @load="text = $event"></file-reader> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vueZtree from '../components/document/vue-ztree.vue'
  import fileReader from '../components/document/fileReader.vue'
  export default{
    data: function(){
      return {
        text: '',
        docsList:[{
          id:1,
          name:"音乐",
          children: []
        },{
          id:2,
          name:"视频",
          children:[{
            id:3,
            name:"电影",
            children:[{
              id:4,
              name:"国产电影"
             },{
              id:5,
              name:"好莱坞电影",
              children:[{
                id: 11,
                name: "好莱坞大片"
              }]
             },{
              id:6,
              name:"小语种电影"
             }]
          },{
            id:7,
            name:"短片",
            children:[{
              id:9,
              name:"电视剧",
              children: [{
                id: 12,
                name: "肥皂剧"
              }]
            },{
              id:10,
              name:"短片"
            }]
          }]
        }],
        currentDoc: {},
        isAllDocs: true,
        objArray: []
      }
    },
    mounted: function(){
      this.forEachObj(this.docsList)
    },
    watch: {
    },
    computed: {
      checkFolder: function(){
        return function(item){
          if(this.isAllDocs || (item.children != '' && item.children != undefined)){
            return true
          }
          else {
            return false
          }
        }
      },
      objGroupNum: function(){
        if(this.objArray.length == 0){
          return 1
        }
        else {
          return parseInt(this.objArray.length / 6)+1
        }
      },
      rowObjGroup: function(){
        return function (rowIndex) {
          var array = Object.assign([], this.objArray)
          return array.splice((rowIndex - 1) * 6,rowIndex * 6)
        }
      }
    },
    methods: {
      toAllDocs: function(){
        this.isAllDocs = true
        this.currentDoc = {}
        this.forEachObj(this.docsList)
      },
      selectFolder: function(item){
        this.currentDoc = item
        this.isAllDocs = false
        if(item.children){
          this.forEachObj(item.children)
        }
        else {
          this.objArray = []
        }
      },
      forEachObj: function(list){
        var _this = this
        this.objArray = []
        var forEachObj = (data) => {
          data.forEach(function(i){
            _this.objArray.push(i)
            if(i.children){
              forEachObj(i.children);
            }
          })
        }
        forEachObj(list)
      },
      // 点击节点
      nodeClick:function(item){
        // console.log(JSON.parse(JSON.stringify(item)));
        this.selectFolder(item)
      },
      // 右击事件
      contextmenuClick:function(){
        // console.log("触发了自定义的contextmenuClick事件");
      },
      // 点击展开收起
      expandClick:function(item){
        // console.log(JSON.parse(JSON.stringify(item)));
        // 点击异步加载
        
      }
    },
    components: {
      vueZtree,
      fileReader
    }
  }
</script>

<style>
  #document{
    background-image: url("../assets/img/bg-18.jpg");
    background-size: 100%;
    background-position:50% 20%;
    height: calc(100% - 70px);
    width: 100%;
  }
  #document:after{
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    background-color: black;
    opacity: 0.55;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
  #document .container-fluid{
    height: 100%;
    width: 90%;
    position: relative;
    padding: 0;
    background-color: rgba(255, 255, 255, 1);
    z-index: 2;
  }
  #document .container-fluid .sidebar-wrap{
    padding: 0px;
    height: 100%;
    position: absolute;
    width: 220px;
    left: 0;
    z-index: 40;
    overflow-x: hidden;
    /*box-shadow: 1px 0 4px 0 #777;*/
    border-right: 1px solid #e1e1e1;
  }
  #document .container-fluid .sidebar-wrap .header-wrap{
    height: 70px;
    /*box-shadow: 0 1px 3px 0 #777;*/
    z-index: 10;
    position: relative;
    text-align: left;
    padding: 0 25px;
  }
  #document .container-fluid .sidebar-wrap .header-wrap p.wrap-title{
    font-size: 30px;
    font-weight: 500;
    color: #666;
    padding: 20px 0 10px 0;
  }
  #document .container-fluid .sidebar-wrap .wrap-li{
    padding: 0px 25px;
    height: 40px;
    line-height: 40px;
  }
  #document .container-fluid .sidebar-wrap .wrap-li p{
    font-size: 12px;
    color: #999;
    height: 100%;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
    border-bottom: 1px solid #e1e1e1;
  }
  #document .container-fluid .sidebar-wrap .wrap-li p:hover{
    color: #666;
  }
  #document .container-fluid .sidebar-wrap .wrap-li .iconfont{
    display: inline-block;
    width: 18px;
    height: 18px;
    font-size: 13px;
    vertical-align: top;
    margin-right: 3px;
  }
  #document .container-fluid .sidebar-wrap .sub-title{
    font-size: 12px;
    color: #d4d4d4;
    user-select: none;
    font-weight: 500;
    height: 30px;
    line-height: 50px;
    padding: 0 25px;
  }
  #document .container-fluid .sidebar-wrap .tree-wrap{
    height: calc(100% - 110px);
    width: 100%;
    overflow-y: auto;
    text-align: left;
  }

  #document .container-fluid  .content-wrap{
    position: absolute;
    left: 220px;
    height: 100%;
    width: calc(100% - 220px);
    z-index: 39;
  }
  #document .container-fluid  .content-wrap .header-wrap{
    height: 80px;
    padding: 0 20px;
  }
  #document .container-fluid  .content-wrap .header-wrap .header-box{
    border-bottom: 1px solid #e1e1e1;
    padding: 10px 0;
    height: 100%;
  }
  #document .container-fluid  .content-wrap .header-wrap .header-box .row {
    padding: 0;
    margin: 0;
  }
  #document .container-fluid  .content-wrap .header-wrap .header-box .row .header-title{
    height: 60px;
    line-height: 70px;
    font-size: 24px;
    font-weight: 600;
    color: #666;
    text-align: left;
    user-select: none;
  }
  #document .container-fluid  .content-wrap .header-wrap .header-box .row .iconfont{
    margin-right: 10px;
  }
  #document .container-fluid  .content-wrap .folder-wrap{
    width: 100%;
    height: calc(100% - 100px); 
    overflow-y: auto;
    padding: 25px 0;
  }
  #document .container-fluid  .content-wrap .folder-wrap .row{
    padding: 10px 20px;
    margin: 0;
  }
  #document .container-fluid  .content-wrap .folder-wrap .row .folder-item{
    color: #aaa;
    padding: 12px 0;
    cursor: pointer;
  }
  #document .container-fluid  .content-wrap .folder-wrap .row .folder-item:hover{
    border: 1px solid #888;
    color: #666;
  }
  #document .container-fluid  .content-wrap .folder-wrap .row .folder-item .icon-type{
    font-size: 40px;
    font-weight: 400;
  }
  #document .container-fluid  .content-wrap .folder-wrap .row .folder-item .doc-name{
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
</style>