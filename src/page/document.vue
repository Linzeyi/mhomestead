<template>
  <div id="document">
    <div class="container-fluid">
      <div class="sidebar-wrap">
        <div class="header-wrap">
          <p class="wrap-title">资料库</p>
        </div>
        <div class="wrap-li">
          <p class="li-title" :class="{'active': isAllDocs}" @click="toAllDocs()"><i class="iconfont icon-all">&#xe62c;</i>全部文件</p>
        </div>
        <div class="tree-wrap">
          <p class="sub-title">文件列表</p>
          <vue-ztree v-if="docsList.length != 0"  :currentDoc='currentDoc' :list.sync='docsList' :func='nodeClick' :expand='expandClick' :contextmenu='contextmenuClick' :is-open='true'></vue-ztree>
        </div>
      </div>
      <div class="content-wrap">
        <div class="header-wrap">
          <div class="header-box">
            <div class="row title-box">
              <div class="col-md-6">
                <p class="header-title" v-if="isAllDocs">
                  <i class="iconfont icon-all">&#xe62c;</i>全部文件
                </p>
                <p class="header-title" v-if="!isAllDocs && currentDoc.doc_type == 'folder'">
                  <i class="iconfont icon-folder">&#xe790;</i>{{currentPath}}/
                </p>
                <p class="header-title" v-if="!isAllDocs && currentDoc.doc_type != 'folder'">
                  <i class="iconfont icon-file">&#xe667;</i>{{currentPath}}.{{currentDoc.doc_type}}
                </p>
              </div>
              <div class="col-md-6 align-right">
                <p class="header-info">
                  <span>文件类型：{{getItemType}}</span>
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p>
                  <span class="icon-btn" v-if="!isAllDocs" @click="toParentFolder">
                    <i class="iconfont icon-back">&#xe768;</i>
                    返回上层
                  </span>
                  <span class="icon-btn no-style" v-else>
                    <i class="iconfont icon-no">&#xe65a;</i>
                    已达根目录
                  </span>
                  
                </p>
              </div>
              <div class="col-md-6 align-right">
                <p>
                  <span ref="new_doc_pop_el" class="icon-btn" data-toggle="modal" data-target="#new_doc_pop">
                    <i class="iconfont icon-create">&#xe6b9;</i>
                    新建文件 / 文件夹
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="folder-wrap" v-if="isAllDocs || currentDoc.doc_type == 'folder'">
          <div class="row" v-for="rowIndex in objGroupNum">
            <div class="col-li" v-for="(item,index) in rowObjGroup(rowIndex)">
              <div class="option-box">
                <i class="iconfont icon-delete" @click="handleDeletePop(item)">&#xe604;</i>
                <i class="iconfont icon-edit" @click="handleEditPop(item)">&#xe686;</i>
              </div>
              <div class="folder-item" @click="nodeClick(item)">
                <i class="iconfont icon-type folder" v-if="item.doc_type == 'folder'">&#xe791;</i>
                <i class="iconfont icon-type file" v-else>&#xe667;</i>
                <p class="doc-name">{{item.doc_name}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="file-wrap" v-else>
          <pdfView
          class="show-pdf-view"
          @fullevent="listenFullEvent"
          :pdf-item="currentDoc" 
          ref='pdfViewObj'></pdfView>
        </div>
      </div>
    </div>
    <new-doc-pop :currentDoc="currentDoc" :currentPath="currentPath" @newDocumentAdd="newDocumentAdd"></new-doc-pop>

    
    <button ref="delete_doc_pop_el" class="docPopLink" data-toggle="modal" data-target="#delete_doc_pop"></button>
    <div 
    id="delete_doc_pop" 
    class="modal fade bs-example-modal-sm" 
    tabindex="-1" 
    role="dialog" 
    aria-labelledby="删除">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">确认删除该文件/文件夹？</h4>
          </div>
          <div class="modal-body">
            <h3 v-if="deleteItem.doc_type == 'folder'">{{deleteItem.doc_name}}</h3>
            <h3 v-else>{{deleteItem.doc_name}}.{{deleteItem.doc_type}}</h3>
            <div class="alert alert-warning" role="alert" v-if="deleteItem.doc_type == 'folder'">
              <strong>警告！</strong>
              您正尝试删除一个文件夹，若该文件夹下有其他文件，则会将其全部清空！
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary"  @click="deleteDoc">确认删除</button>
          </div>
        </div>
      </div>
    </div>

    <button ref="edit_doc_pop_el" class="docPopLink" data-toggle="modal" data-target="#edit_doc_pop"></button>
    <div 
    id="edit_doc_pop" 
    class="modal fade bs-example-modal-sm" 
    tabindex="-1" 
    role="dialog" 
    aria-labelledby="删除">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">文件/文件夹重命名</h4>
          </div>
          <div class="modal-body">
            <div class="input-panel">
              <input class="form-control" placeholder="请输入新的文件/文件夹名..." type="text" v-model="newName" @input="editStatus = true">
            </div>
            <div class="alert alert-danger" role="alert" v-if="!editStatus">
              <strong>错误！</strong>
              文件/文件夹名不能为空！
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary"  @click="editDoc">确认修改</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vueZtree from '../components/document/vue-ztree.vue'
  import newDocPop from '../components/document/newDocPop.vue'
  import pdfView from '../components/utils/pdfView.vue'
  export default{
    data: function(){
      return {
        text: '',
        docsList: [],
        currentDoc: {},
        currentPath: '',
        isAllDocs: true,
        objArray: [],
        deleteItem: {},
        editItem: {},
        newName: '',
        editStatus: true,
        pdfShow: false
      }
    },
    mounted: function(){
      this.getUserDocs()
    },
    watch: {
      currentDoc: {
        handler: function(newVal,oldVal){
          if(this.currentDoc.doc_type != "folder" && !this.isAllDocs){
            console.log("当前选中的文件为：" + this.currentDoc.doc_name)
            var _this = this
            this.$nextTick(function(){
              _this.$refs.pdfViewObj.showPdf()
            })
            
          }
        },
        immediate: true,
        deep: true
      }
    },
    computed: {
      getItemType: function(){
        if(this.isAllDocs){
          return "根目录"
        }
        else return this.currentDoc.doc_type == "folder" ? "文件夹" : this.currentDoc.doc_type
      },
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
          if(this.objArray.length % 8 == 0){
            return parseInt(this.objArray.length / 8)
          }
          else {
            return parseInt(this.objArray.length / 8)+1
          }
        }
      },
      rowObjGroup: function(){
        return function (rowIndex) {
          var array = Object.assign([], this.objArray)
          return array.slice((rowIndex - 1) * 8,rowIndex * 8)
        }
      }
    },
    methods: {
      listenFullEvent: function(){

      },
      newDocumentAdd: function(doc){
        this.$refs.new_doc_pop_el.click()
        this.docsList = []

        this.$store.dispatch('doc/GetUserDocuments').then((res) => {
          console.log("重新获取用户的文件资源树：")
          console.log(res.data)
          if(doc.doc_type == "folder"){
            this.selectFolder(doc)
          }
          else if(doc.path_index != 0){
            this.$store.dispatch('doc/GetDocById', doc.parent_id).then((res) => {
              console.log("成功获取id为 "+ doc.parent_id +" 的文件资源：")
              console.log(res.data)
              this.currentDoc = res.data.data
              this.forEachObj(this.currentDoc)
            }).catch((e) => {
              console.log("error:" + e)
            })
          }
          this.docsList = res.data.data
          if(doc.path_index == 0){        
            this.forEachObj(this.docsList)
          }
        }).catch((e) => {
          console.log("error:" + e)
        })
        
      },
      getUserDocs: function(){
        this.$store.dispatch('doc/GetUserDocuments').then((res) => {
          console.log("获取用户的文件资源树：")
          console.log(res.data)
          this.docsList = res.data.data
          this.forEachObj(this.docsList)
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      toParentFolder: function(){
        console.log("parent")
        console.log(this.currentDoc)
        let parent_id = this.currentDoc.parent_id
        if(parent_id){
          this.$store.dispatch('doc/GetDocById', parent_id).then((res) => {
            console.log("成功获取id为 "+ parent_id +" 的文件资源：")
            console.log(res.data)
            this.selectFolder(res.data.data)
          }).catch((e) => {
            console.log("error:" + e)
          })
        }
        else {
          this.toAllDocs()
        }
      },
      getDocById: function(doc_id){
        this.$store.dispatch('doc/GetDocById', doc_id).then((res) => {
          console.log("成功获取id为 "+ doc_id +" 的文件资源：")
          console.log(res.data)
          return res.data.data
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      handleDeletePop: function(item){
        this.deleteItem = item
        this.$refs.delete_doc_pop_el.click()
      },
      deleteDoc: function(){
        this.$store.dispatch('doc/DeleteDocument', this.deleteItem).then((res) => {
          console.log("成功删除文件：" + this.deleteItem.doc_name)
          console.log(res.data)
          this.$refs.delete_doc_pop_el.click()
          this.docsList = []
          this.getUserDocs()
          this.selectFolder(this.currentDoc)
          this.deleteItem = {}
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      handleEditPop: function(item){
        this.editItem = item
        this.newName = item.doc_name
        this.$refs.edit_doc_pop_el.click()
      },
      editDoc: function(){
        if(this.newName != ''){
          this.editItem.doc_name = this.newName
          this.$store.dispatch('doc/UpdateDocument', this.editItem).then((res) => {
            // console.log("获取文件路径")
            // console.log(res.data)
            this.$refs.edit_doc_pop_el.click()
            this.docsList = []
            this.getUserDocs()
            if(!this.isAllDocs){
              this.selectFolder(this.currentDoc)
            }
            this.editItem = {}
            this.newName = ''
          }).catch((e) => {
            console.log("error:" + e)
          })
        }
        else{
          this.editStatus = false
        }
        
      },
      getDocPath: function(doc_id){
        this.$store.dispatch('doc/GetDocPath', doc_id).then((res) => {
          // console.log("获取文件路径")
          // console.log(res.data)
          this.currentPath = res.data.data
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      toAllDocs: function(){
        this.isAllDocs = true
        this.currentDoc = {}
        this.forEachObj(this.docsList)
      },
      selectFolder: function(item){
        this.currentDoc = item
        this.getDocPath(item.doc_id)
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
      newDocPop,
      pdfView
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
    position: relative;
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
  #document .container-fluid .sidebar-wrap .wrap-li .active{
    color: #444;
    opacity: 0.8;
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
    height: 100px;
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
    text-align: left;
    line-height: 30px;
    position: relative;
  }
  #document .container-fluid  .content-wrap .header-wrap .header-box .row p{
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }
  #document .container-fluid  .content-wrap .header-wrap .header-box .row.title-box p{
    height: 50px;
    line-height: 50px;
  }
  #document .container-fluid  .content-wrap .header-wrap .header-box .row.title-box p.header-title{
    font-size: 16px;
    font-weight: 400;
    color: #666;
    user-select: none;
  }
  #document .container-fluid  .content-wrap .header-wrap .header-box .row.title-box p.header-title .iconfont{
    padding-right: 10px;
  }
  #document .container-fluid  .content-wrap .header-wrap .header-box .row.title-box p.header-info{
    font-size: 12px;
    color: #999;
  }

  #document .container-fluid  .content-wrap .header-wrap .header-box .row p .iconfont.icon-back{

  }
  #document .container-fluid  .content-wrap .header-wrap .header-box .row p .icon-btn{
    padding: 4px 10px;
    border-radius: 4px;
    color: #777;
    border: 1px solid #aaa;
    cursor: pointer;
  }
  #document .container-fluid  .content-wrap .header-wrap .header-box .row p .icon-btn:hover{
    color: #444;
    border-color: #555;
  }
  #document .container-fluid  .content-wrap .header-wrap .header-box .row p .icon-btn.no-style:hover{
    color: #777;
    border-color: #aaa;
    cursor: default;
  }

  #document .container-fluid  .content-wrap .folder-wrap{
    width: 100%;
    height: calc(100% - 100px); 
    overflow-y: auto;
    padding: 15px 0;
  }
  #document .container-fluid  .content-wrap .folder-wrap .row{
    padding: 0 10px;
    margin: 0;
    font-size: 0px;
    text-align: left;
  }
  #document .container-fluid  .content-wrap .folder-wrap .row .col-li{
    width: calc(100% / 8 - 12px);
    font-size: 12px;
    display: inline-block;
    margin: 6px;
    position: relative;
    text-align: center;
  }
  #document .container-fluid  .content-wrap .folder-wrap .row .col-li:hover > .option-box{
    display: block;
  }
  #document .container-fluid  .content-wrap .folder-wrap .row .col-li .option-box{
    position: absolute;
    display: none;
    right: -5px;
    top: -5px;
    font-size: 0px;
  }
  #document .container-fluid  .content-wrap .folder-wrap .row .col-li .option-box .iconfont{
    font-size: 13px;
    /*display: block;*/
    cursor: pointer;
    padding: 5px 4px;
    color: #666;
  }
  #document .container-fluid  .content-wrap .folder-wrap .row .col-li .option-box .iconfont.icon-delete:hover{
    color: #d9534f;
  }
  #document .container-fluid  .content-wrap .folder-wrap .row .col-li .option-box .iconfont.icon-edit:hover{
    color: #337ab7;
  }
  #document .container-fluid  .content-wrap .folder-wrap .row .folder-item{
    color: #888;
    padding: 12px 0;
    cursor: pointer;
    margin: 0;
  }
  #document .container-fluid  .content-wrap .folder-wrap .row .folder-item:hover{
    color: #666;
  }
  #document .container-fluid  .content-wrap .folder-wrap .row .folder-item .icon-type{
    font-size: 30px;
    font-weight: 400;
  }
  #document .container-fluid  .content-wrap .folder-wrap .row .folder-item .doc-name{
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    width: 80%;
    height: 40px;
    margin: 0 auto;
    line-height: 40px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }

  #document .container-fluid  .content-wrap .file-wrap {
    width: 100%;
    height: calc(100% - 100px); 
    overflow-y: auto;
  }

  #document .modal{
    top: 70px;
    font-size: 12px;
  }
  #document .modal .input-panel {
    width: 100%;
    margin-bottom: 20px;
  }
  #document .modal .input-panel input{
    display: inline-block;
    width: 80%;
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    margin: 0 auto;
    border-radius: 2px;
  }
  #document .docPopLink{
    position: absolute;
    opacity: 0;
    top: 0;
  }
</style>