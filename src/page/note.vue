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
          <input type="text" placeholder="搜索笔记..." v-model="searchNoteVal">
          <i class="iconfont icon-search">&#xe61e;</i>
        </div>
        <ul class="sidebar-list">
          <li class="sidebar-li" @click="toAllNotes()" :class="{'on': pageType == 'allNotes'}">
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
          <li class="sidebar-li" @click="toShareNotes()" :class="{'on': pageType == 'shareNotes'}">
            <p><i class="iconfont icon-share">&#xe767;</i>分享笔记</p>
          </li>
          <li class="sidebar-li" @click="toCollectedNotes()" :class="{'on': pageType == 'collectedNotes'}">
            <p><i class="iconfont icon-collect">&#xe6c1;</i>我收藏的</p>
          </li>
          <li class="sidebar-li" @click="toTagsNotes()" :class="{'on': pageType == 'tagsNotes'}">
            <p><i class="iconfont icon-tags">&#xe61b;</i>标签</p>
          </li>
        </ul>
      </div>
      <div class="content-wrap">
        <div class="content">
          <div class="content-sidebar-wrap">
            <div class="top-box">
              <p class="notebook-title" v-if="pageType == 'notebook'">{{currentNotebook.notebook_title}}<span class="font"><i class="iconfont icon-notebooks">&#xe652;</i> 笔记本</span></p>
              <p class="notebook-title" v-if="pageType == 'allNotes'">全部笔记</p>
              <p class="notebook-title" v-if="pageType == 'shareNotes'">分享笔记</p>
              <p class="notebook-title" v-if="pageType == 'collectedNotes'">我收藏的</p>
              <p class="notebook-title" v-if="pageType == 'tagsNotes'">标签分类</p>
              <div class="row">
                <div class="col-md-5">
                  <p class="num-span" v-if="pageType != 'tagsNotes'">{{noteList.length}} 条笔记</p>
                  <p class="num-span" v-else>{{tagsList.length}} 项标签</p>
                </div>
                <div class="col-md-7">
                  <i v-if="pageType == 'notebook'" class="iconfont icon-tags">&#xe6c1;</i>
                  <i  v-if="pageType == 'notebook'" ref="delete_notebook_pop_el" class="iconfont icon-delete" data-toggle="modal" data-target="#delete_notebook_pop">&#xe6dc;</i>
                </div>
              </div>
            </div>
            <div class="tag-list-wrap" v-if="pageType == 'tagsNotes'">
              <div class="tag-input-box">
                <span class="input-title">标签检索：</span>
                <input type="text" placeholder="输入标签名..." v-model="searchTagVal">
                <i class="iconfont icon-search">&#xe61e;</i>
              </div>
              <ul class="tags-list" v-if="searchTagsList.length">
                <li v-for="(item,index) in searchTagsList"  
                :class="{'on': currentTagInfo.tags_name == item.tags_name}"
                :style="{backgroundColor: item.tags_color}" 
                @click="getNotesByTagName(item,0)">
                  <p>
                    <span>{{item.tags_name}}</span>
                  </p>
                </li>
              </ul>
              <!-- <p class="note-font" v-if="searchTagsList.length">点击标签查看相应笔记</p> -->
              <p class="tag-font" v-if="!searchTagsList.length && searchTagVal == ''">您还没有为笔记设置任何标签</p>
              <p class="tag-font" v-if="!searchTagsList.length && searchTagVal != ''">没有名为 “{{searchTagVal}}” 的标签</p>
            </div>
            <div class="tag-info-panel" v-if="pageType == 'tagsNotes'" :style="{backgroundColor: currentTagInfo.tags_color}">
              <p>
                <span class="tag-info-title">当前选中标签：</span>
                <span class="tag-info-content" v-if="currentTagInfo.tags_name != ''">[{{currentTagInfo.tags_name}}]</span>
                <span v-else>无</span>
              </p>
              <span class="tag-note-num">（包含{{currentTagInfo.notes_size}}份笔记）</span>
            </div>
            <div class="note-list-wrap">
              <ul class="note-list">
                <p class="note-default-font" v-if="(!searchNoteList.length && searchNoteVal != '' && pageType != 'tagsNotes' ) || (!searchNoteList.length && searchNoteVal != '' && currentTagInfo.tags_name != '')">没有搜索到标题为 “{{searchNoteVal}}” 的笔记</p>
                <p class="note-default-font" v-if="searchNoteVal == '' && !searchNoteList.length && (pageType == 'allNotes' || currentNotebook != '') ">尚无任何笔记，<span class="create-note-btn" @click="createNewNote()">我要创建</span></p>
                <p class="note-default-font" v-if="searchNoteVal == '' && !searchNoteList.length && !(pageType == 'allNotes' || currentNotebook != '') ">尚无任何笔记</p>
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
                      <span class="col-md-6 add-time">{{item.last_time}}</span>
                      <span class="col-md-6 icon-group">
                        <i class="iconfont icon-edit" v-if="isViewWrap" @click="toggleViewWrap()">&#xe686;</i>
                        <i class="iconfont icon-view" v-if="!isViewWrap" @click="toggleViewWrap()">&#xe610;</i>
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
          <div class="noteWrap-toggle-plugin" v-show="currentNote != ''">
            <div class="line"></div>
            <div class="toggle-button-box" @click="toggleViewWrap()">
              <span v-if="isViewWrap">视图</span>
              <span v-else>编辑</span>
            </div>
          </div>
          <div class="content-body" v-if="currentNote != ''">
            
            <note-view-wrap v-show="isViewWrap" :currentNote="currentNote"></note-view-wrap>
            <note-context v-show="!isViewWrap" ref="note_context_el" :currentNote="currentNote" @changeEditStatus="changeEditStatus" @setCurrentNote="setCurrentNote"></note-context> 
          </div>

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
          class="modal fade bs-example-modal-sm pop-wrap" 
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
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">好的</button>
                  <button type="button" class="btn btn-primary" data-dismiss="modal" @click="continueTo()">仍要继续！</button>
                </div>
              </div>
            </div>
          </div>

          <div 
          id="delete_notebook_pop" 
          class="modal fade bs-example-modal-sm pop-wrap" 
          tabindex="-1" 
          role="dialog" >
            <div class="modal-dialog modal-sm" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <h4 class="modal-title">确定删除该笔记本？</h4>
                </div>
                <div class="modal-body">
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                  <button type="button" class="btn btn-primary" @click="deleteNotebook()">确定</button>
                </div>
              </div>
            </div>
          </div>

          <button ref="delete_note_pop_el" class="notePopLink" data-toggle="modal" data-target="#delete_note_pop"></button>
          <div 
          id="delete_note_pop" 
          class="modal fade bs-example-modal-sm pop-wrap" 
          tabindex="-1" 
          role="dialog" >
            <div class="modal-dialog modal-sm" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <h4 class="modal-title">确定删除该笔记？</h4>
                </div>
                <div class="modal-body">
                
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                  <button type="button" class="btn btn-primary" @click="deleteNote()">确定</button>
                </div>
              </div>
            </div>
          </div>


          <button ref="note_unEdit_pop_el" class="notePopLink" data-toggle="modal" data-target="#note_unEdit_pop"></button>
          <div 
          id="note_unEdit_pop" 
          class="modal fade bs-example-modal-sm pop-wrap" 
          tabindex="-1" 
          role="dialog" >
            <div class="modal-dialog modal-sm" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 class="modal-title align-left">无法进入编辑界面！</h4>
                </div>
                <div class="modal-body align-left">
                  <p>该笔记属于他人分享笔记，您无权进行编辑。</p>
                  <p>您可以：<mark>点击<strong>导入</strong>按钮，将笔记的副本存入自己的笔记本内，即可在自己的笔记本内进行再编辑。</mark></p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary" data-dismiss="modal">知道啦</button>
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
  import noteViewWrap from '../components/note/noteViewWrap.vue'

  export default{
    data: function(){
      return {
        'currentNote': '',
        'notebookList': [],
        'noteList': [],
        'currentNotebook': '',
        'isOpenNotebook': false,
        'isViewWrap': true,
        'pageType': 'allNotes',
        'tagsList': [],
        'editInfo': {
          'item': '',
          'type': ''
        },
        'searchNoteVal': '',
        'searchTagVal': '',
        'currentTagInfo': {
          'tags_name': '',
          'tags_color': '#888888',
          'notes_size': 0
        }
      }
    },
    mounted: function(){
      this.changeEditStatus(false)
      this.getUserNotes()
      this.getUserNotebooks()
      this.checkNoteId()
    },
    computed: {
      searchNoteList: function(){
        var _this = this
        var NewItems = []
        this.noteList.map(function(item) {
          if (item.note_title.search(_this.searchNoteVal) != -1) {
            NewItems.push(item)
          }
        })
        return NewItems
      },
      searchTagsList: function(){
        var _this = this
        var NewItems = []
        this.tagsList.map(function(item){
          if(item.tags_name.search(_this.searchTagVal) != -1){
            NewItems.push(item)
          }
        })
        return NewItems
      }
    },
    watch: {
      'currentNotebook': function(){
        if(this.currentNotebook){
          this.pageType = 'notebook'
        }
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
      toggleViewWrap: function(){
        if(this.pageType != 'shareNotes'){
          this.isViewWrap = !this.isViewWrap
        }
        else{
          this.$refs.note_unEdit_pop_el.click()
        }
      },
      checkNoteId: function(){
        var noteId = this.$route.query.note_id
        var flag = false
        
        if(noteId){
          this.$store.dispatch('note/GetUserNotes').then((res) => {
            console.log("获取用户全部笔记：")
            console.log(res.data)
            var noteList = res.data.data
            for(let i = 0; i < noteList.length; i++){
              if(noteId == noteList[i].note_id){
                this.currentNote = noteList[i]
                this.pageType = 'allNotes'
                flag = true
                this.getUserNotes()
              }
            }
            if(!flag){
              this.$store.dispatch('note/GetNoteById',noteId).then((res) => {
                console.log("根据分享id获取分享笔记：")
                console.log(res.data)
                this.currentNote = res.data.data
                this.isViewWrap = true
                this.pageType = 'shareNotes'
                this.getShareNotes()
              }).catch((e) => {
                console.log("error:" + e)
              })
            }
          }).catch((e) => {
            console.log("error:" + e)
          })
          
        }
           
      },
      collectNote: function(item){
        item.is_collected = !item.is_collected
        this.$store.dispatch('note/UpdateNote',item).then((res) => {
          console.log("笔记收藏状态已更新入数据库")
          console.log(res.data)
          
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      toCollectedNotes: function(){
        this.checkEditStatus()
        if(!this.$store.getters.isEdit){
          if(this.pageType != 'collectedNotes'){
            this.initSidebarType()
          }
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
          console.log("获取被收藏的笔记列表：")
          console.log(res.data)
          this.noteList = res.data.data
          this.pageType = 'collectedNotes'
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      toTagsNotes: function(){
        if(!this.$store.getters.isEdit){
          if(this.pageType != 'tagsNotes'){
            this.initSidebarType()
            if(this.currentTagInfo.tags_name == ''){
              this.noteList = []
            }
            else{
              this.getNotesByTagName(this.currentTagInfo,true)
            }
          }
          this.getAllNoteTags()
          this.changeEditStatus(false)
        }
        else{
          this.editInfo.item = ''
          this.editInfo.type = 'tagsNotes'
          this.$refs.change_note_pop_el.click()
        }
      },
      toShareNotes: function(){
        if(!this.$store.getters.isEdit){
          if(this.pageType != 'shareNotes'){
            this.initSidebarType()
          }
          this.getShareNotes()
          this.changeEditStatus(false)
        }
        else{
          this.editInfo.item = ''
          this.editInfo.type = 'shareNotes'
          this.$refs.change_note_pop_el.click()
        }
      },
      getShareNotes: function(){
        this.$store.dispatch('note/GetShareNotes').then((res) => {
          console.log("获取用户被分享的笔记列表：")
          console.log(res.data)
          this.noteList = res.data.data
          this.pageType = 'shareNotes'
          this.isViewWrap = true
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      getAllNoteTags: function(){
        this.$store.dispatch('tag/GetAllTagsByType','note').then((res) => {
          console.log("获取用户所有笔记里的全部标签：")
          console.log(res.data)
          this.tagsList = res.data.data
          this.pageType = 'tagsNotes'
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      getNotesByTagName: function(tag,switchFlag){
        if(this.currentTagInfo.tags_name != tag.tags_name || switchFlag){
          this.$store.dispatch('note/GetNotesByTagName',tag.tags_name).then((res) => {
            console.log("获取带有标签【" + tag.tags_name + "】的笔记列表：")
            console.log(res.data)
            this.currentTagInfo.tags_name = tag.tags_name
            this.currentTagInfo.tags_color = tag.tags_color
            this.currentTagInfo.notes_size = res.data.data.length
            this.noteList = res.data.data
            this.pageType = 'tagsNotes'
          }).catch((e) => {
            console.log("error:" + e)
          })
        }
        else{
          this.currentTagInfo = {
            'tags_name': '',
            'tags_color': '#888888',
            'notes_size': 0
          }
          this.noteList = []
        }
      },  
      toAllNotes: function(){
        this.checkEditStatus()
        if(!this.$store.getters.isEdit){
          if(this.pageType = 'allNotes'){
            this.initSidebarType()
          }
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
          console.log("获取用户全部笔记：")
          console.log(res.data)
          this.noteList = res.data.data
          this.pageType = 'allNotes'
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      getUserNotebooks: function(){
        this.$store.dispatch('notebook/GetUserNotebooks').then((res) => {
          console.log("获取用户笔记本列表：")
          console.log(res.data)
          this.notebookList = res.data.data
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      getNotebookNotes: function(notebook_id){
        this.$store.dispatch('note/GetNotebookNotes',notebook_id).then((res) => {
          console.log("获取id为 " + notebook_id + " 的笔记本下存放的的所有笔记")
          console.log(res.data)
          this.noteList = res.data.data
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      createNewNote: function(){
        this.$refs.new_note_pop_el.click()
      }, 
      handleDeleteNote: function(item){
        this.currentNote = item
        this.$refs.delete_note_pop_el.click()
      },
      deleteNote: function(){
        this.$store.dispatch('note/DeleteNote',this.currentNote.note_id).then((res) => {
          console.log("删除笔记 " + this.currentNote.note_title)
          console.log(res.data)
          if(this.pageType == 'notebook'){
            this.getNotebookNotes(this.currentNotebook.notebook_id)
          }
          else if(this.pageType == 'allNotes'){
            this.getUserNotes()
          }
          else if(this.pageType == 'collectedNotes'){
            this.getCollectedNotes()
          }
          this.currentNote = this.noteList[0]
          this.$refs.delete_note_pop_el.click()
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      handleNewNote: function(){
        if(this.pageType == 'notebook'){
          this.getNotebookNotes(this.currentNotebook.notebook_id)
        }
        else{
          this.getUserNotes()
        }
        this.$refs.new_note_pop_el.click()
      },
      handleNewNotebook: function(newNotebook){
        this.currentNotebook = newNotebook
        this.getUserNotebooks()
        this.getNotebookNotes(newNotebook.notebook_id)
        this.$refs.new_notebook_pop_el.click()
      },
      deleteNotebook: function(){
        this.$store.dispatch('notebook/DeleteNotebook',this.currentNotebook.notebook_id).then((res) => {
          console.log("删除笔记本 " + this.currentNotebook.notebook_title)
          console.log(res.data)
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
          this.initSidebarType()
          this.currentNotebook = item
          this.getNotebookNotes(item.notebook_id)
          this.isOpenNotebook = true
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
          this.$router.push('note')
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
          console.log("在跳转前，检测笔记是否有未保存的内容")
          console.log(res.data)
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
          else if(this.pageType == 'allNotes'){
            this.getUserNotes()
          }
          else if(this.pageType == 'collectedNotes'){
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
        else if(this.editInfo.type == 'tagsNotes'){
          this.initSidebarType()
          this.changeEditStatus(false)
          this.initEditInfo()
        }
        else if(this.editInfo.type == 'shareNotes'){
          this.initSidebarType()
          this.getShareNotes()
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
      },
      changeEditStatus: function(flag){
        this.$store.dispatch('SetIsEdit',flag)
      },
      checkEditStatus: function(){
        if(this.currentNote != '' && !this.isViewWrap){
          this.$refs.note_context_el.checkEditStatus()
        }
      }
    },
    components: {
      noteContext,
      newNotePop,
      newNotebookPop,
      noteViewWrap
    }
  };
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
    border-right: 1px solid #959595; 
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
    z-index: 50;
    background-color: rgba(241, 241, 241, 0.8);
    overflow-x: hidden;
    /*border-right: 1px solid #aaa;*/
    box-shadow: 1px 0 1px 0 #959595;
    /*border-right: 1px solid #888; */
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .top-box{
    height: 90px;
    width: 100%;
    padding: 10px 20px;
    /*border-bottom: 1px solid #888;*/
    position: relative;
    z-index: 50;
    box-shadow: 0 1px 4px 0px #959595;
    /*box-shadow: 0 0px 10px 0px #b1b1b1; */
    background-color: rgba(255, 255, 255, 0.8);
    text-align: left;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .top-box .row div[class^='col-md']{
    padding-left: 0px;
    padding-right: 0px;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .top-box .notebook-title{
    font-size: 25px;
    font-weight: 600;
    color: #555;
    height: 40px;
    line-height: 50px;
    position: relative;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .top-box .notebook-title .font{
    display: inline-block;
    position: absolute;
    top: 12px;
    right: -5px;
    font-size: 12px;
    height: 24px;
    line-height: 24px;
    padding: 0 10px;
    text-align: center;
    background-color: #b2b2b2;
    border-radius: 2px;
    color: #fff;
    transform: scale(0.8);
    user-select: none;
    font-weight: 400;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .top-box .row{
    height: 30px;
    line-height: 30px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
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
    padding: 0;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list{
    list-style: none;
    height: 100%;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list .note-default-font{
    font-size: 12px;
    line-height: 60px;
    padding: 0 20px;
    /*text-align: left;*/
    color: #aaa;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list .note-default-font .create-note-btn{
    color: #777;
    cursor: pointer;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .note-list-wrap .note-list .note-default-font .create-note-btn:hover{
    text-decoration: underline;
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
    margin: 0 2px;
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
  
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .tag-list-wrap {
    padding: 0px;
    width: 100%;
    /*border-bottom: 1px solid #aaa;*/
    position: relative;
    z-index: 40;
    /*box-shadow: 0 0px 3px 0px #c1c1c1;*/
    background: rgba(221, 221, 221, 0.1);
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .tag-input-box{
    width: 100%;
    padding: 0 20px;
    height: 50px;
    background: rgba(221, 221, 221, 0.6);
    position: relative;
    font-size: 0;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .tag-input-box .input-title{
    display: inline-block;
    width: 60px;
    color: #828282;
    font-weight: 500;
    font-size: 12px;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .tag-input-box input{
    width: calc(100% - 60px);
    display: inline-block;
    height: 36px;
    color: #555;
    border: 1px solid #ddd;
    /*background-color: rgba(255,255,255,0.5);*/
    border-radius: 4px;
    font-size: 12px;
    text-indent: 10px;
    margin-top: 7px;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .tag-input-box i.icon-search{
    position: absolute;
    right: 28px;
    color: #999;
    top: 15px;
    font-size: 14px;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .tag-info-panel{
    font-size: 12px;
    font-weight: 400;
    text-align: left;
    padding: 0px 20px;
    line-height: 30px;
    color: #fff;
    background-color: rgba(40,40,40,0.6);
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .tag-info-panel p{
    transform: scale(0.8);
    transform-origin: 0 50% 0;
    display: inline-block;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .tag-info-panel p .tag-info-content{
    font-weight: 600;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .tag-info-panel .tag-note-num{
    transform: scale(0.8);
    transform-origin: 100% 50% 0;
    display: inline-block;
    float: right;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .tag-list-wrap .tags-list{
    list-style: none;
    margin: 10px auto;
    padding: 0px 20px;
    position: relative;
    text-align: left;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .tag-list-wrap .tags-list li{
    /*float: left;*/
    display: inline-block;
    padding: 2px 5px;
    margin: 3px 3px;
    font-size: 12px;
    color: #fff;
    border-radius: 2px; 
    opacity: 0.9;
    cursor: pointer;
    user-select: none;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .tag-list-wrap .tags-list li span{
    transform: scale(0.9);
    display: inline-block;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .tag-list-wrap .tags-list li:hover{
    opacity: 1;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .tag-list-wrap .tags-list li.on{
    border: 2px solid #aaa;
    /*box-shadow: 0 0 3px 1px #aaa;*/
    padding: 2px 8px;
  }
  #note .container-fluid .content-wrap .content .content-sidebar-wrap .tag-list-wrap .tag-font{
    line-height: 45px;
    padding: 0 8px;
    transform: scale(0.9);
    font-size: 12px;
    color: #777;
    text-align: center;
    /*text-indent: 10px;*/
  }
  
  #note .container-fluid .content-wrap .content .content-body{
    position: absolute;
    left: 300px;
    top: 0px;
    right: 0px;
    bottom: 0px;
  }
  #note .container-fluid .content-wrap .content  .noteWrap-toggle-plugin{
    width: 50px;
    height: 60px;
    position: absolute;
    z-index: 88;
    top: 0px;
    right: 5%;
    transition: all 0.2s;
    -moz-transition: all 0.2s; /* Firefox 4 */
    -webkit-transition: all 0.2s; /* Safari and Chrome */
    -o-transition: all 0.2; /* Opera */
  }
  #note .container-fluid .content-wrap .content  .noteWrap-toggle-plugin .line{
    width: 1px;
    height: 100%;
    position: absolute;
    top: 0px;
    left: calc(50% - 1px);
    border-left: 2px solid #5d4040;
  }
  #note .container-fluid .content-wrap .content  .noteWrap-toggle-plugin .toggle-button-box{
    width: 50px;
    height: 50px;
    color: #fff;
    border-radius: 50px;
    background-color: #5d4040;
    border: 2px solid #f1f1f1;
    cursor: pointer;
    position: absolute;
    bottom: 0px;
    transition: all 0.2s;
    -moz-transition: all 0.2s; /* Firefox 4 */
    -webkit-transition: all 0.2s; /* Safari and Chrome */
    -o-transition: all 0.2; /* Opera */
  }
  #note .container-fluid .content-wrap .content .noteWrap-toggle-plugin .toggle-button-box:hover{
    color: #fff;
    border-color: #fff;
    background-color: #634b4b;
    box-shadow: 0 0 6px 0px #351313;
  }
  #note .container-fluid .content-wrap .content .noteWrap-toggle-plugin .toggle-button-box:active,
  #note .container-fluid .content-wrap .content .noteWrap-toggle-plugin .toggle-button-box:focus{
    color: #f3f3f3;
    border-color: #f1f1f1;
    background-color: #5d4040;
    box-shadow: 0 0 7px 3px #756060;
  }
  #note .container-fluid .content-wrap .content .noteWrap-toggle-plugin:hover{
    height: 62px;
  }
  #note .container-fluid .content-wrap .content .noteWrap-toggle-plugin:active,
  #note .container-fluid .content-wrap .content .noteWrap-toggle-plugin:focus{
    height: 64px;
  }
  #note .container-fluid .content-wrap .content .noteWrap-toggle-plugin .toggle-button-box span{
    height: 100%;
    width: 100%;
    font-size: 13px;
    font-weight: 500;
    line-height: 46px;
    user-select: none;
    cursor: pointer;
    display: inline-block;
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
  #note .pop-wrap{
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