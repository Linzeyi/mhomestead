<template>
  <div id="note">
    <div class="container-fluid">
      <div class="sidebar-wrap" :class="{'white': currentNote == ''}">
        <div class="top-wrap">
          <div class="top-box">
            <button class="add-btn-box"  ref="new_note_pop_el" data-toggle="modal" data-target="#new_note_pop">
              <i class="iconfont icon-add">&#xe64e;</i>
            </button>
          </div>
          <!-- <div class="v-line"></div> -->
        </div>
        <div class="search-box">
          <input type="text" placeholder="搜索笔记..." v-model="searchVal">
          <i class="iconfont icon-search">&#xe61e;</i>
        </div>
        <ul class="sidebar-list">
          <li class="sidebar-li" @click="toAllNotes()" :class="{'on': isAllNotes}">
            <p><i class="iconfont icon-all">&#xe61a;</i>全部笔记</p>
          </li>
          <li class="notebook-li" :class="{'on': isOpenNotebook}">
            <p class="notebook-li-head" @click="isOpenNotebook = !isOpenNotebook">
              <i class="iconfont icon-arrow" v-if="!isOpenNotebook">&#xe642;</i>
              <i class="iconfont icon-arrow" v-else>&#xe646;</i>
              <i class="iconfont icon-notebooks">&#xe605;</i>笔记本
            </p>
            <div class="list-box" v-if="isOpenNotebook">
              <ul class="sub-list">
                <li v-for="(item,index) in notebookList" @click="selectNotebook(item)" :class="{'on': currentNotebook.notebook_id == item.notebook_id}">
                  <p><i class="iconfont icon-notebook">&#xe652;</i><i class="iconfont icon-open-notebook">&#xe67c;</i>{{item.notebook_title}}</p>
                </li>
                <li class="new-li" ref="new_notebook_pop_el" data-toggle="modal" data-target="#new_notebook_pop">
                  <p><i class="iconfont icon-add">&#xe673;</i>新建笔记本</p>
                </li>
              </ul>
            </div>
          </li>
          <li class="sidebar-li" @click="toCollectedNotes()" :class="{'on': isCollectedNotes}">
            <p><i class="iconfont icon-collect">&#xe6c1;</i>我收藏的</p>
          </li>
          <li class="sidebar-li">
            <p><i class="iconfont icon-tags">&#xe61b;</i>标签</p>
          </li>
        </ul>
      </div>
      <div class="content-wrap">
        <div class="content" v-if="noteList.length != 0 || currentNotebook != '' || isCollectedNotes">
          <div class="content-sidebar-wrap">
            <div class="top-box">
              <p class="notebook-title" v-if="currentNotebook != ''">{{currentNotebook.notebook_title}}</p>
              <p class="notebook-title" v-if="isAllNotes">全部笔记</p>
              <p class="notebook-title" v-if="isCollectedNotes">我收藏的</p>
              <div class="row">
                <div class="col-md-5">
                  <p class="num-span">{{noteList.length}} 条笔记</p>
                </div>
                <div class="col-md-7">
                  <i v-if="!isAllNotes" class="iconfont icon-tags">&#xe6c1;</i>
                  <i  v-if="currentNotebook != ''" ref="delete_notebook_pop_el" class="iconfont icon-delete" data-toggle="modal" data-target="#delete_notebook_pop">&#xe6dc;</i>
                </div>
              </div>
            </div>
            <div class="note-list-wrap">
              <ul class="note-list">
                <li v-for="(item,index) in searchNoteList" @click="selectNote(item)" :class="{'on': currentNote.note_id == item.note_id}">
                  <div class="li-content-box row">
                    <div class="col-md-8">
                      <p class="note-title">{{item.note_title}}</p>
                      <div class="note-desc">{{item.note_detail}}</div>
                    </div>
                    <div class="col-md-4">
                      <div class="img-box">
                        <div class="img"></div>
                      </div>
                    </div>
                  </div>
                  <div class="li-bottom-box">
                    <p class="row">
                      <span class="col-md-6 add-time">{{item.add_time}}</span>
                      <span class="col-md-6 icon-group">
                        <i class="iconfont icon-collect" v-if="!item.is_collected" @click="collectNote(item)">&#xe647;</i>
                        <i class="iconfont icon-collect" v-if="item.is_collected" @click="collectNote(item)">&#xe649;</i>
                        <i class="iconfont icon-delete" @click="handleDeleteNote(item)">&#xe615;</i>
                      </span>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <note-context v-if="currentNote != ''" ref="note_context_el" :currentNote="currentNote" @changeEditStatus="changeEditStatus" @setCurrentNote="setCurrentNote"></note-context> 
          

          <div class="content-default" v-else>
            <div class="default-font-box">
              <div class="font-panel">
                <p class="font-title">NOTE<font style="fontSize: 50px">.笔记区</font></p>
                <p class="note-font">当前未选中任意笔记</p>
              </div>
            </div>
          </div>


          <new-notebook-pop @handleNewNotebook="handleNewNotebook"></new-notebook-pop>
          <new-note-pop @handleNewNote="handleNewNote" :currentNotebook="currentNotebook"></new-note-pop>

          <button ref="change_note_pop_el" class="notePopLink" data-toggle="modal" data-target="#change_note_pop"></button>
          <div 
          id="change_note_pop" 
          class="modal fade bs-example-modal-sm" 
          tabindex="-1" 
          role="dialog" 
          aria-labelledby="changeNotePopTitle">
            <div class="modal-dialog modal-sm" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <h4 class="modal-title" id="changeNotePopTitle">警告</h4>
                </div>
                <div class="modal-body">
                  <p>您的笔记尚未保存，离开当前笔记会造成编辑内容丢失。</p>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">好的</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" @click="continueTo()">仍要继续！</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div 
          id="delete_notebook_pop" 
          class="modal fade bs-example-modal-sm" 
          tabindex="-1" 
          role="dialog" >
            <div class="modal-dialog modal-sm" role="document">
              <div class="modal-content">
                <div class="modal-body">
                  <h3>确定删除该笔记本？</h3>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click="deleteNotebook()">确定</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button ref="delete_note_pop_el" class="notePopLink" data-toggle="modal" data-target="#delete_note_pop"></button>
          <div 
          id="delete_note_pop" 
          class="modal fade bs-example-modal-sm" 
          tabindex="-1" 
          role="dialog" >
            <div class="modal-dialog modal-sm" role="document">
              <div class="modal-content">
                <div class="modal-body">
                  <h3>确定删除该笔记？</h3>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click="deleteNote()">确定</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import noteContext from '../components/note/noteContext.vue'
  import newNotePop from '../components/note/newNotePop.vue'
  import newNotebookPop from '../components/note/newNotebookPop.vue'

  export default{
    data: function(){
      return {
        'currentNote': '',
        'notebookList': [],
        'noteList': [],
        'currentNotebook': '',
        'isOpenNotebook': false,
        'isChangeNote': false,
        'isAllNotes': true,
        'isCollectedNotes': false,
        'editInfo': {
          'item': '',
          'type': ''
        },
        'searchVal': ''
      }
    },
    mounted: function(){
      // this.isOpenNotebook = true
      this.changeEditStatus(false)
      this.getUserNotes()
      this.getUserNotebooks()
    },
    computed: {
      searchNoteList: function(){
        var _this = this
        var NewItems = []
        this.noteList.map(function(item) {
          if (item.note_title.search(_this.searchVal) != -1) {
            NewItems.push(item)
          }
        })
        return NewItems
      }
    },
    watch: {
      'currentNotebook': function(){
        // console.log(this.currentNotebook)
      }
    },
    beforeRouteLeave: function(to, from, next) {
      if(!this.$store.getters.isEdit){
        next()
      }
      else{
        this.editInfo.item = to.path
        this.editInfo.type = 'route'
        this.$refs.change_note_pop_el.click()
        next(false)
      }
    },
    methods: {
      collectNote: function(item){
        item.is_collected = !item.is_collected
        this.$store.dispatch('note/UpdateNote',item).then((res) => {
          // console.log(res.data.data)
          
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      toCollectedNotes: function(){
        this.checkEditStatus()
        if(!this.$store.getters.isEdit){
          this.initSidebarType()
          this.getCollectedNotes()
          this.changeEditStatus(false)
        }
        else{
          this.editInfo.item = ''
          this.editInfo.type = 'collectedNotes'
          this.$refs.change_note_pop_el.click()
        }
      },
      getCollectedNotes: function(){
        this.$store.dispatch('note/GetCollectedNotes').then((res) => {
          // console.log(res.data)
          this.noteList = res.data.data
          this.isCollectedNotes = true
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      toAllNotes: function(){
        this.checkEditStatus()
        if(!this.$store.getters.isEdit){
          this.initSidebarType()
          this.getUserNotes()
          this.changeEditStatus(false)
        }
        else{
          this.editInfo.item = ''
          this.editInfo.type = 'allNotes'
          this.$refs.change_note_pop_el.click()
        }
      },
      getUserNotes: function(){
        this.$store.dispatch('note/GetUserNotes').then((res) => {
          // console.log(res.data)
          this.noteList = res.data.data
          this.isAllNotes = true
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      getUserNotebooks: function(){
        this.$store.dispatch('notebook/GetUserNotebooks').then((res) => {
          // console.log(res.data)
          this.notebookList = res.data.data
          // this.isOpenNotebook = true
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      getNotebookNotes: function(notebook_id){
        this.$store.dispatch('note/GetNotebookNotes',notebook_id).then((res) => {
          // console.log(res.data)
          this.noteList = res.data.data
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      handleDeleteNote: function(item){
        this.currentNote = item
        this.$refs.delete_note_pop_el.click()
      },
      deleteNote: function(){
        this.$store.dispatch('note/DeleteNote',this.currentNote.note_id).then((res) => {
          // console.log(res.data)
          if(this.currentNotebook != ''){
            this.getNotebookNotes(this.currentNotebook.notebook_id)
          }
          else if(this.isAllNotes){
            this.getUserNotes()
          }
          else if(this.isCollectedNotes){
            this.getCollectedNotes()
          }
          this.currentNote = this.noteList[0]
          this.$refs.delete_note_pop_el.click()
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      handleNewNote: function(){
        if(this.currentNotebook != ''){
          this.getNotebookNotes(this.currentNotebook.notebook_id)
        }
        else{
          this.getUserNotes()
        }
        this.$refs.new_note_pop_el.click()
      },
      handleNewNotebook: function(){
        this.getUserNotebooks()
        this.$refs.new_notebook_pop_el.click()
      },
      deleteNotebook: function(){
        this.$store.dispatch('notebook/DeleteNotebook',this.currentNotebook.notebook_id).then((res) => {
          // console.log(res.data)
          this.getUserNotebooks()
          this.selectNotebook(this.notebookList[0])
          this.$refs.delete_notebook_pop_el.click()
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      selectNotebook: function(item){
        this.checkEditStatus()
        if(!this.$store.getters.isEdit){
          this.currentNotebook = item
          this.getNotebookNotes(item.notebook_id)
          this.currentNote = ''
          this.isOpenNotebook = true
          this.isAllNotes = false
          this.isCollectedNotes = false
        }
        else {
          this.editInfo.item = item
          this.editInfo.type = 'notebook'
          this.$refs.change_note_pop_el.click()
        }
      },
      selectNote: function(item){
        this.checkEditStatus()
        if(!this.$store.getters.isEdit){
          this.currentNote = item
          this.changeEditStatus(false)
        }
        else {
          this.editInfo.item = item
          this.editInfo.type = 'note'
          this.$refs.change_note_pop_el.click()
        }
      },
      checkNoteEdit: function(){
        this.$store.dispatch('note/CheckNoteEdit',this.currentNote).then((res) => {
          return res.data.data
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      initEditInfo: function(){
        this.editInfo = {
          'item': '',
          'type': ''
        }
      },
      continueTo: function(){
        if(this.editInfo.type == 'note'){
          this.currentNote = this.editInfo.item
          this.changeEditStatus(false)
          if(this.currentNotebook != ''){
            this.getNotebookNotes(this.currentNotebook.notebook_id)
          }
          else if(this.isAllNotes){
            this.getUserNotes()
          }
          else if(this.isCollectedNotes){
            this.getCollectedNotes()
          }
          this.initEditInfo()
        }
        else if(this.editInfo.type == 'notebook'){
          this.initSidebarType()
          this.currentNotebook = this.editInfo.item
          this.getNotebookNotes(this.currentNotebook.notebook_id)
          this.changeEditStatus(false)
          this.initEditInfo()
        }
        else if(this.editInfo.type == 'allNotes'){
          this.initSidebarType()
          this.getUserNotes()
          this.changeEditStatus(false)
          this.initEditInfo()
        }
        else if(this.editInfo.type == 'collectedNotes'){
          this.initSidebarType()
          this.getCollectedNotes()
          this.changeEditStatus(false)
          this.initEditInfo()
        }
        else if(this.editInfo.type == 'route'){
          this.changeEditStatus(false)
          this.$router.push(this.editInfo.item)
          
        }
      },
      setCurrentNote: function(obj){
        this.currentNote.note_title = obj.note_title
        this.currentNote.note_detail = obj.note_detail
        this.currentNote.note_content = obj.note_content
      },
      initSidebarType: function(){
        this.currentNotebook = ''
        this.currentNote = ''
        this.isOpenNotebook = false
        this.isCollectedNotes = false
        this.isAllNotes = false
      },
      changeEditStatus: function(flag){
        this.$store.dispatch('SetIsEdit',flag)
      },
      checkEditStatus: function(){
        if(this.currentNote != ''){
          this.$refs.note_context_el.checkEditStatus()
        }
      }
    },
    components: {
      noteContext,
      newNotePop,
      newNotebookPop
    }
  }
</script>

<style>
  #note{
    background-image: url("../assets/img/bg-13.jpg");
    background-size: 100%;
    background-position:50% 20%;
    height: calc(100% - 70px);
    width: 100%;
  }
  #note:after{
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    background-color: black;
    opacity: 0.05;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
  #note .container-fluid{
    height: 100%;
    width: 90%;
    position: relative;
    padding: 0;
    border-right: 1px solid #888; 
  }
  #note .container-fluid .sidebar-wrap{
    padding: 25px 0px;
    height: 100%;
    position: absolute;
    width:190px;
    background-color: rgba(35, 35, 35, 0.9);
    z-index: 40;
    overflow-y: auto;
  }
    #note .container-fluid .sidebar-wrap .top-wrap{
    height: 100px;
    padding: 0 15px;
    padding-bottom: 20px;
    margin-bottom: 10px;
  }
  #note .container-fluid .sidebar-wrap .top-wrap:hover,
  #note .container-fluid .sidebar-wrap .search-box:hover{
    background-color: transparent;
  }
  #note .container-fluid .sidebar-wrap .top-wrap .top-box{
    height: 100px;
    width: 100%;
    border-bottom: 1px solid #fff;
  }
  #note .container-fluid .sidebar-wrap .top-wrap .top-box .add-btn-box{
    width: 70px;
    height: 70px;
    margin: 0 auto;
    padding: 0;
    border-radius: 70px;
    background-color: #fff;
    color: #404448;    
    cursor: pointer;
    box-sizing: content-box;
    border: 5px solid #fff;
    transition: all 0.2s;
    -moz-transition: all 0.2s; /* Firefox 4 */
    -webkit-transition: all 0.2s; /* Safari 和 Chrome */
    -o-transition: all 0.2s; /* Opera */
  }
  #note .container-fluid .sidebar-wrap .top-wrap .top-box .add-btn-box .icon-add{
    border-radius: 70px;
    line-height: 70px;
    font-size: 45px;
    font-weight: 600;    
    margin: 0 auto;
    user-select: none;
  }
  #note .container-fluid .sidebar-wrap .top-wrap .top-box .add-btn-box:hover{
    color: #555;
    box-shadow: 0px 1px 10px 2px #000;
    border: 5px solid #aaa;
  }
  #note .container-fluid .sidebar-wrap .top-wrap .top-box .add-btn-box:active{
    color: #888;
    box-shadow: 0px 1px 16px 4px #000;
    border: 5px solid #444;
  }
  #note .container-fluid .sidebar-wrap .search-box{
    height: 50px;
    padding: 5px 20px;
    margin-bottom: 6px;
    position: relative;
  }
  #note .container-fluid .sidebar-wrap .search-box input{
    height: 40px;
    line-height: 40px;
    width: 100%;
    border: 1px solid #c0c0c0;
    background-color: transparent;
    color: #fff;
    text-indent: 10px;
    font-size: 12px;
    border-radius: 2px;
  }
  #note .container-fluid .sidebar-wrap .search-box input:focus{
    border-color: #fff;
  }
  #note .container-fluid .sidebar-wrap .search-box .icon-search{
    font-size: 17px;
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    position: absolute;
    color: #c0c0c0;
    right: 24px;
    top: 10px;
    cursor: default;
    user-select: none;
  }
  #note .container-fluid .sidebar-wrap .search-box .icon-search:hover{
    color: #fff;
  }

  #note .container-fluid .sidebar-wrap .sidebar-list{
    width: 100%;
    height: calc(100% - 180px);
    padding: 0;
    list-style: none;
    margin: 0;
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li{
    font-size: 13px;
    font-weight: 600;
    width: 100%;
    position: relative;
    /*color: #e0e0e4;*/
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li.sidebar-li{
    height: 40px;
    line-height: 40px;
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li.sidebar-li.on p,
  #note .container-fluid .sidebar-wrap .sidebar-list li.notebook-li.on p.notebook-li-head{
    color: #fff;
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li p{
    padding-left: 25px;
    height: 40px;
    line-height: 40px;
    color: #c0c0c0;
    text-align: left;
    cursor: pointer;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    user-select: none;
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li p:hover{
    color: #e1e1e1;
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li p .iconfont{
    font-size: 16px;
    margin-right: 8px;  
    vertical-align: top;
    position: relative;
    top: -1px;
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li p .icon-arrow{
    font-size: 12px;
    position: absolute;
    left: 8px;
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li .list-box{
    /*padding-left: 20px;*/
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li .list-box .sub-list{
    list-style: none;
    padding-bottom: 10px;
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li .list-box .sub-list li{
    height: 35px;
    line-height: 35px;
    font-size: 12px;
    font-weight: 400;
    text-align: left;
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li .list-box .sub-list li p{
    padding-left: 40px; 
    line-height: 35px;
    height: 100%;
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li .list-box .sub-list li p:hover{
    /*background-color: rgba(97, 97, 97, 0.4);*/
    color: #fff;
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li .list-box .sub-list li.on p{
    background-color: rgba(97, 97, 97, 0.4);
    color: #fff;
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li .list-box .sub-list li p .iconfont{
    font-size: 13px;
    margin-right: 6px;  
    vertical-align: top;
    position: relative;
    top: 0px;
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li .list-box .sub-list li p .iconfont.icon-notebook{
    display: inline-block;
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li .list-box .sub-list li p .iconfont.icon-open-notebook{
    display: none;
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li .list-box .sub-list li.on p .iconfont.icon-notebook{
    display: none;
  }
  #note .container-fluid .sidebar-wrap .sidebar-list li .list-box .sub-list li.on p .iconfont.icon-open-notebook{
    display: inline-block;
  }

  #note .container-fluid .content-wrap{
    width: calc(100% - 190px);
    height: 100%;
    position: absolute;
    left: 190px;
    z-index: 30;
    background-color: rgba(255,255,255,0.8);
  }
  #note .container-fluid .content-wrap .content{
    width: 100%;
    height: 100%;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap{
    width: 300px;
    height: 100%;
    position: absolute;
    left: 0;
    background-color: rgba(241, 241, 241, 0.8);
    overflow-x: hidden;
    /*border-right: 1px solid #aaa;*/
    /*box-shadow: 1px 0 1px 0 #999;*/
    border-right: 1px solid #888; 
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .top-box{
    height: 90px;
    width: 100%;
    padding: 10px 20px;
    border-bottom: 1px solid #888;
    /*box-shadow: 0 0px 10px 0px #b1b1b1; */
    background-color: rgba(255, 255, 255, 0.8);
    text-align: left;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .top-box .notebook-title{
    font-size: 25px;
    font-weight: 600;
    color: #555;
    height: 40px;
    line-height: 50px;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .top-box .row{
    height: 30px;
    line-height: 30px;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .top-box .row .num-span{
    font-size: 12px;
    color: #777;
    text-indent: 4px;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .top-box .row .col-md-7{
    text-align: right;
    user-select: none;
    height: 30px;
    line-height: 30px;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .top-box .row .col-md-7 .iconfont{
    font-size: 14px;
    color: #777;
    margin: 0 3px;
    cursor: pointer;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .top-box .row .col-md-7 .iconfont:hover{
    color: #3c3c3c;
  }

  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap{
    overflow-y: auto;
    padding: 3px 0;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list{
    list-style: none;
    height: 100%;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li{
    padding: 10px 20px 5px 20px;
    font-size: 13px;
    color: #666;
    text-align: left;
    background-color: #efefef;
    /*border-bottom: 1px solid #c0c0c0;*/
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li:hover{
    background-color: #f6f6f6;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li.on{

    background-color: #fff;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li .li-content-box{
    padding: 0;
    margin: 0;
    height: 80px;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li .li-content-box div{
    padding: 0;
    margin: 0;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li .li-content-box p{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    margin: 0;
    padding: 0;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li .li-content-box p.note-title{
    font-size: 16px;
    font-weight: 600;
    height: 30px;
    line-height: 30px;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li .li-content-box .note-desc{
    overflow: hidden;
    display: -webkit-box;
    text-overflow:ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 12px;
    line-height: 20px;
    font-weight: 400;
    color: #777;
    height: 40px;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li .li-content-box .col-md-4{
    text-align: right;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li .li-content-box .img-box{
    width: 60px;
    height: 60px;
    overflow: hidden;
    display: inline-block;
    margin-top: 8px;
    margin-right: 3px;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li .li-content-box .img-box .img{
    background-image: url(../assets/img/bg.jpg);
    background-size: 100%;
    background-position:50% 20%;
    height: 100%;
    width: 100%;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li .li-bottom-box{
    line-height: 30px;
    font-size: 12px;
    /*padding-bottom: 10px;*/
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li .li-bottom-box p.row{
    margin: 0;
    padding: 0;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li .li-bottom-box p span{
    padding: 0;
    margin: 0;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li .li-bottom-box p .add-time{
    color: #959595;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li .li-bottom-box p span.icon-group{
    text-align: right;
    user-select: none;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li .li-bottom-box p span .iconfont{
    font-size: 14px;
    color: #888;
    margin: 0 1px;
    cursor: pointer;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list li .li-bottom-box p span .iconfont:hover{
    color: #999;
  }

  #note .container-fluid .content-wrap .content-default{
    opacity: 0.7;
    position: absolute;
    left: 300px;
    height: 100%;
    overflow: hidden;
    width: calc(100% - 300px);
    padding: 0 80px;
    /*box-shadow: 0px 0 4px 2px #777 inset;*/
    /*background-color: #3e3e3e;*/
    /*background-image: url(../assets/img/bg-17.jpg);*/
    background-size: 100%;
    background-position:50% 20%;
    transition: all 0.3s;
    -moz-transition: all 0.3s; /* Firefox 4 */
    -webkit-transition: all 0.3s; /* Safari 和 Chrome */
    -o-transition: all 0.3s; /* Opera */
  }
  #note .container-fluid .content-wrap .content-default:hover{
    opacity: 1;
    background-color: rgba(100,100,100,0.1);
  }
  #note .container-fluid .content-wrap .content-default:after{
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    background-color: black;
    opacity: 0.15;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
  #note .container-fluid .content-wrap .content-default .default-font-box{
    width: 100%;
    height: 100%;
    text-align: center;
    position: relative;
  }
  #note .container-fluid .content-wrap .content-default .default-font-box .font-panel{
    display: inline-block;
    position: absolute;
    top: 50%; 
    left: 0;
    width: 100%;
    margin-top: -100px;
    vertical-align: top;
    height: 200px;
    z-index: 2;
    user-select: none;
  }
  #note .container-fluid .content-wrap .content-default .default-font-box p.font-title{
    line-height: 70px;
    font-size: 80px;
    width: 100%;
    border-bottom: 1px solid #fff;
    font-weight: 600;
    color: #fff;
  }
  #note .container-fluid .content-wrap .content-default .default-font-box p.note-font{
    margin-top: 20px;
    line-height: 20px;
    font-size: 20px;
    width: 100%;
    color: #fff;
    font-weight: 600;
  }


  #note .notePopLink{
    position: absolute;
    opacity: 0;
    top: -20px;
  }
  #note #change_note_pop,
  #note #delete_note_pop,
  #note #delete_notebook_pop{
    top: 60px;
  }
  #note #change_note_pop .modal-header{
    text-align: left;
  }
  #note #change_note_pop .modal-body p{
    padding: 10px 0 20px 0;
    line-height: 24px;
  }
</style>