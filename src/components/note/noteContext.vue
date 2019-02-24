<template>
  <div id="noteContext">
    <div class="context-wrap">
      <div class="option-nav">
        <div class="nav-content">
          <div class="top-box">
            <p class="tags-wrap">
              <i class="iconfont icon-tags">&#xe660;</i>
              <i 
              class="iconfont icon-arrow icon-arrow-left" 
              @click="prevPageTag()"
              v-if="checkPrevTagPage">&#xe64a;</i>
              <span class="tag" v-for="(item,index) in pageTags" :style="{backgroundColor: item.tags_color}">{{item.tags_name}}<i class="iconfont icon-delete" @click="deleteTag(item)">&#xe6f6;</i></span>
              <span class="add-tag">
                <i class="iconfont icon-add" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click="popNewTag">&#xe64d;</i>
                <ul class="dropdown-menu" v-if="isNewTagPop">
                  <div class="pop-li" data-stopPropagation="true">
                    <input :class="{'error': error != ''}" type="text" placeholder="新标签名" v-model="newTag.tags_name">
                  </div>
                  <div class="pop-li" data-stopPropagation="true">
                    <input class="color-ipt" type="text" v-model="newTag.tags_color">
                    <colorPicker v-model="newTag.tags_color" />
                  </div>
                  <div class="pop-li error-li" v-if="error != ''" data-stopPropagation="true">
                    {{error}}
                  </div>
                  <div class="pop-li btn-li" data-stopPropagation="true">
                    <button @click="cancelTagPop">取消</button>
                    <button class="add-btn" @click.stop="addNewTag">添加</button>
                  </div>
                </ul>
              </span>
              <i 
              class="iconfont icon-arrow icon-arrow-right"
              @click="nextPageTag()"
              v-if="checkNextTagPage">&#xe642;</i>
            </p>
          </div>
          <div class="bottom-box">
            <span class="add-time">创建日期：{{currentNote.add_time}}</span>
            <span class="last-time">修改日期：<font v-if="currentNote.last_time != null">{{currentNote.last_time}}</font><font v-else>{{currentNote.add_time}}</font></span>
          </div>
        </div>
      </div>
      <div class="context-content">
        <div class="content-title-box">
          <input type="text" v-model="noteContentObj.note_title">
        </div>
        <div class="content-detail-box">
          <textarea v-model="noteContentObj.note_detail" rows="3"  maxlength="100" onchange="this.value=this.value.substring(0, 100)" onkeydown="this.value=this.value.substring(0, 100)" onkeyup="this.value=this.value.substring(0, 100)" ></textarea>
        </div>
        <!-- <div class="content-box" v-for="(item,index) in currentNoteContexts">{{item.note_context_content}}</div> -->
        <quill-editor 
          v-if="isShowContent"
          v-model="noteContentObj.note_content" 
          ref="myQuillEditor" 
          :options="editorOption" 
          @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
          @change="onEditorChange($event)">
        </quill-editor>
      </div>
      <div class="context-option-wrap">
        <button class="save-btn btn btn-primary" @click="saveNote()">保存</button>
      </div>
      <button ref="save_note_pop_el" class="notePopLink" data-toggle="modal" data-target="#save_note_pop"></button>
      <div 
      id="save_note_pop" 
      class="modal fade bs-example-modal-sm" 
      tabindex="-1" 
      role="dialog" >
        <div class="modal-dialog modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-body">
              <h3>笔记保存成功。</h3>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">好的</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    props: [
      'currentNote'
    ],
    data: function(){
      return {
        'tags': [],
        'newTag': {
          'tags_name': '',
          'tags_color': '#000'
        },
        'isNewTagPop': false,
        'error': '',
        'tagPageInfo': {
          'total': 0,
          'num': 0,
          'size': 8,
          'pageNum': 0,
        },
        'editorOption':{
          'modules':{
            'toolbar':[
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              ['blockquote', 'code-block'],
              ['image']
            ]
          }
        },
        'isShowContent': true,
        'noteContentObj': {}
      }
    },
    mounted: function(){
      this.getNoteTags()
      this.setCopyData()
    },
    computed: {
      pageTags: function(){
        return this.tags.slice((this.tagPageInfo.pageNum * this.tagPageInfo.size),((this.tagPageInfo.pageNum + 1) * this.tagPageInfo.size))
      },
      checkPrevTagPage: function(){
        if(this.tagPageInfo.total > this.tagPageInfo.size && this.tagPageInfo.pageNum !=0){
          return true
        }
        else return false
      },
      checkNextTagPage: function(){
        if(this.tagPageInfo.total > this.tagPageInfo.size && this.tagPageInfo.pageNum != this.tagPageInfo.num){
          return true
        }
        else return false
      }
    },
    watch: {
      'currentNote.note_id': function(){
        this.setCopyData()
        this.isShowContent = false
        var _this = this
        setTimeout(function(){
          _this.isShowContent = true
        },1)
        this.getNoteTags()
      },
      'newTag.tags_name': function(){
        this.error = ''
      }
    },
    methods: {
      setCopyData: function(){
        this.noteContentObj = Object.assign({}, this.currentNote)
      },
      prevPageTag: function(){
        if(this.tagPageInfo.pageNum != 0){
          this.tagPageInfo.pageNum--
        }
      },
      nextPageTag: function(){
        if(this.tagPageInfo.pageNum != this.tagPageInfo.num){
          this.tagPageInfo.pageNum++
        }
      },
      getNoteTags: function(){
        this.$store.dispatch('tag/GetNoteTags',this.currentNote.note_id).then((res) => {
          // console.log(res.data)
          this.tags = res.data.data
          this.tagPageInfo.total = this.tags.length
          this.tagPageInfo.num = parseInt((this.tagPageInfo.total - 1)/this.tagPageInfo.size)
          this.tagPageInfo.pageNum = 0
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      deleteTag: function(item){
        this.$store.dispatch('tag/DeleteTag',item.tags_id).then((res) => {
          this.$store.dispatch('tag/GetNoteTags',this.currentNote.note_id).then((res) => {
            // console.log(res.data)
            this.tags = res.data.data
            this.tagPageInfo.total = this.tags.length
            this.tagPageInfo.num = parseInt((this.tagPageInfo.total - 1)/this.tagPageInfo.size)
            if(this.tagPageInfo.pageNum != this.tagPageInfo.num){
              this.tagPageInfo.pageNum--
            }
          }).catch((e) => {
            console.log("error:" + e)
          })
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      addNewTag: function(){
        if(this.newTag.tags_name != ''){
          this.error = ''
          this.newTag.note = this.currentNote
          this.$store.dispatch('tag/SaveTag',this.newTag).then((res) => {
            // console.log(res.data)
            this.$store.dispatch('tag/GetNoteTags',this.currentNote.note_id).then((res) => {
              // console.log(res.data)
              this.tags = res.data.data
              this.tagPageInfo.total = this.tags.length
              this.tagPageInfo.num = parseInt((this.tagPageInfo.total - 1)/this.tagPageInfo.size)
              if(this.tagPageInfo.pageNum != this.tagPageInfo.num){
                this.tagPageInfo.pageNum++
              }
            }).catch((e) => {
              console.log("error:" + e)
            })
            this.isNewTagPop = false
          }).catch((e) => {
            console.log("error:" + e)
          })
        }
        else{
          this.error = "标签名不能为空！"
        }
      },
      saveNote: function(){
        this.$emit("setCurrentNote",this.noteContentObj)
        this.$store.dispatch('note/UpdateNote',this.currentNote).then((res) => {
          // console.log(res.data.data)
          this.$emit('changeEditStatus',false)
          this.$emit("setCurrentNote",res.data.data)
          this.$refs.save_note_pop_el.click()
          this.setCopyData()
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      popNewTag: function(){
        this.isNewTagPop = true
      },
      cancelTagPop: function(){
        this.isNewTagPop = false
      },
      onEditorBlur(e){//失去焦点事件

      },
      onEditorFocus(e){//获得焦点事件
        // console.log(e)
      },
      onEditorChange(e){//内容改变事件
        // this.$emit('changeEditStatus',true)
        this.checkEditStatus()
      },
      checkEditStatus: function(){
        if(!this.checkString(this.noteContentObj.note_title,this.currentNote.note_title)  ||  !this.checkString(this.noteContentObj.note_detail,this.currentNote.note_detail)  ||  !this.checkString(this.noteContentObj.note_content,this.currentNote.note_content)){
        // if(this.noteContentObj.note_title.split('\t').join('') != this.currentNote.note_title.split('\t').join('') || this.noteContentObj.note_detail.split('\t').join('') != this.currentNote.note_detail.split('\t').join('') || this.noteContentObj.note_content.split('\t').join('') != this.currentNote.note_content.split('\t').join('')){
          this.$emit('changeEditStatus',true)
        }
        else{
          this.$emit('changeEditStatus',false)
        }
      },
      checkString: function(str1,str2){
        var s1,s2
        if(str1 != null){
          s1 = str1.split('\t').join('')
        }
        else{
          s1 = null
        }
        if(str2 != null){
          s2 = str2.split('\t').join('')
        }
        else{
          s2 = null
        }
        return s1 == s2
      }
    }
  }
</script>

<style>
  #noteContext{
    position: absolute;
    left: 300px;
    height: 100%;
    width: calc(100% - 300px);
    background-color: #fff;
    text-align: left;
  }
  #noteContext .context-wrap{
    height: 100%;
    width: 100%;
  }
  #noteContext .context-wrap .option-nav{
    padding: 0px 20px;
    height: 70px;
    width: 100%;
  }
  #noteContext .context-wrap .option-nav .nav-content{
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #ccc;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box{
    height: 35px;
    line-height: 45px;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap {
    width: 60%;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .icon-tags{
    font-size: 16px;
    position: relative;
    top: 2px;
    color: #888;
    user-select: none;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .icon-arrow{
    margin: 0 2px;
    font-size: 13px;
    cursor: pointer;
    color: #afafaf;
    position: relative;
    top: 1px;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .icon-arrow:hover{
    color: #555;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .tag{
    font-size: 12px;
    color: #fff;
    padding: 2px 5px;
    border-radius: 2px;
    margin: 0 2px;
    cursor: default;
    position: relative;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .tag .icon-delete{
    font-size: 12px;
    transform: scale(0.8);
    position: absolute;
    top: -6px;
    right: -8px;
    color: #ec0700;
    /*border-radius: 10px;*/
    display: none;
    height: 12px;
    width: 15px;
    line-height: 12px;
    cursor: pointer;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .tag:hover>.icon-delete{
    display: block;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .add-tag{
    color: #afafaf;
    margin-left: 3px;
    cursor: pointer;
    position: relative;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .add-tag:hover{
    color: #555;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .add-tag .icon-add{
    font-size: 14px;
    position: relative;
    top: 1px;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu{
    position: absolute;
    z-index: 100000;
    width: 140px;
    background-color: #fff;
    border-radius: 3px;
    padding: 5px;
    top: 0px;
    left: 20px;
    /*box-shadow: 0px 1px 5px 0px #888888;*/
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li{
    padding: 5px;
    width: 100%;
    line-height: 30px;
    font-size: 12px;
    color: #777;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li input{
    width: 100%;
    height: 34px;
    text-indent: 5px;
    border: 1px solid #ddd;
    border-radius: 2px;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li input.error{
    border-color: #d9534f;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li input.error:focus{
    border-color: #d9534f;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li input:focus{
    border-color: #aaa;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li input.color-ipt{
    width: calc(100% - 35px);
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li.btn-li{
    margin: 0 auto;
    cursor: default;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li button{
    display: inline-block;
    vertical-align: top;
    width: 48%;
    height: 30px;
    line-height: 26px;
    border: 1px solid #ddd;
    border-radius: 2px;
    transition: all 0.2s;
    -moz-transition: all 0.2s; /* Firefox 4 */
    -webkit-transition: all 0.2s; /* Safari 和 Chrome */
    -o-transition: all 0.2s; /* Opera */
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li button:hover{
    border-color: #aaa;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li button.add-btn{
    background-color: #337ab7;
    border-color: #337ab7;
    color: #fff;
    float: right;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li button.add-btn:hover{
    background-color: #196eb6;
    border-color: #196eb6;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li.error-li{
    color: #d9534f;
    font-size: 12px;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li .m-colorPicker{
    padding: 5px;
    vertical-align: middle;
    font-size: 12px;
    color: #777;
    font-weight: 400;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li .m-colorPicker .defaultColor{
    color: #777;
    font-weight: 400;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li .m-colorPicker .defaultColor:hover{
    border-color: #aaa;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li .m-colorPicker h3{
    font-size: 12px;
    margin-bottom: 8px;
    color: #777;
    font-weight: 400;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li .m-colorPicker h3:last-child{
    cursor: pointer;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li .m-colorPicker .colorBtn{
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  #noteContext .context-wrap .option-nav .nav-content .top-box .tags-wrap .dropdown-menu .pop-li .m-colorPicker .box{
    width: 212px;
    top: -5px;
    left: 35px;
    margin-bottom: 10px;
  }


  #noteContext .context-wrap .option-nav .nav-content .bottom-box{
    height: 35px;
    line-height: 35px;
    font-size: 12px;
    color: #888;
  }
  #noteContext .context-wrap .option-nav .nav-content .bottom-box span{
    margin-right: 2px;
    display: inline-block;
    transform: scale(0.9);
    transform-origin: left center;
  }

  #noteContext .context-wrap .context-content{
    padding: 10px 20px;
    font-size: 13px;
    font-weight: normal;
    height: calc(100% - 130px);
  }
  #noteContext .context-wrap .context-content .content-title-box{
    padding: 22px 0px 5px 0px;
    border-bottom: 1px solid #e1e1e1;
    /*margin-bottom: 10px;*/
  }
  #noteContext .context-wrap .context-content .content-title-box input{
    border: none;
    font-size: 30px;
    line-height: 40px;
    padding-bottom: 10px;
    font-weight: 600;
    color: #666;
    width: 100%;
    /*border-bottom: 1px solid #ddd;*/
  }
  #noteContext .context-wrap .context-content .content-detail-box{
    padding: 15px 0;
  }
  #noteContext .context-wrap .context-content .content-detail-box textarea{
    padding: 0 5px;
    width: 80%;
    border: none;
    resize: none;
    line-height: 25px;
    color: #777;
  }
  #noteContext .context-wrap .context-content .content-box{

  }
  #noteContext .context-wrap .context-content .quill-editor{
    height: calc(100% - 170px);
  }
  #noteContext .context-wrap .context-content .quill-editor .ql-toolbar.ql-snow{
    border: none;
    padding: 8px 0;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
  #noteContext .context-wrap .context-content .quill-editor .ql-container.ql-snow{
    border: none;
  }
  #noteContext .context-wrap .context-content .quill-editor .ql-container.ql-snow .ql-editor{
    padding: 15px 5px;
    font-size: 14px;
    color: #777;
    line-height: 30px;
  }
  #noteContext .context-wrap .context-content .quill-editor .ql-container{
    height: calc(100% - 50px);
  }

  #noteContext .context-wrap .context-option-wrap {
    height: 60px;
    padding: 12px 20px;
    text-align: right;
  }
  #noteContext .context-wrap .context-option-wrap button{
    display: inline-block;
    text-align: center;
    padding: 6px 18px;
    height: 100%;
  }
  #noteContext .context-wrap .context-option-wrap button.save-btn{
    background-color: 
  }


  #noteContext #save_note_pop{
    top: 60px;
    text-align: center;
  }
  #noteContext #save_note_pop .modal-sm .modal-footer{
    text-align: center;
  }

</style>