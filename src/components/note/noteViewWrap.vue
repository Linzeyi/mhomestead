<template>
  <div id="noteViewWrap">
    <div class="note-view-wrap">
      <div class="option-nav">
        <div class="row">
          <div class="col-md-8">
            <div class="nav-content">
              <div class="top-box">
                <p class="tags-wrap">
                  <i class="iconfont icon-tags">&#xe660;</i>
                  <i 
                  class="iconfont icon-arrow icon-arrow-left" 
                  @click="prevPageTag()"
                  v-if="checkPrevTagPage">&#xe64a;</i>
                  <span class="default-font" v-if="tags.length == 0">暂无标签...</span>
                  <span class="tag" v-for="(item,index) in pageTags" :style="{backgroundColor: item.tags_color}">{{item.tags_name}}</span>
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
          <div class="col-md-4">
          </div>
        </div>
      </div>
      <div class="view-content">
        <div class="content-title-box">
          <h2>{{currentNote.note_title}}</h2>
        </div>
        <div class="content-detail-box">
          <p>{{currentNote.note_detail}}</p>
          <p v-if="currentNote.note_detail.length == 0" class="default-font">没有简介内容...</p>
        </div>
        <div class="content-page" v-html="currentNote.note_content?currentNote.note_content:'<p class=\'default-font\'>没有正文内容...</p>'">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: [
      'currentNote'
    ],
    data: function(){
      return {
        'tags': [],
        'tagPageInfo': {
          'total': 0,
          'num': 0,
          'size': 8,
          'pageNum': 0,
        },
      }
    },
    mounted: function(){
      this.getNoteTags()
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
        this.getNoteTags()
      }
    },
    methods: {
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
      }
    }
  }
</script>

<style>
  #noteViewWrap {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background-color: #fff;
    text-align: left;
  }
  #noteViewWrap .note-view-wrap{
    width: 100%;
  }
  #noteViewWrap .note-view-wrap .option-nav{
    padding: 0px 20px;
    height: 70px;
    width: 100%;
  }
  #noteViewWrap .note-view-wrap .option-nav .row{
    border-bottom: 1px solid #ccc;
    height: 100%;
  }
  #noteViewWrap .note-view-wrap .option-nav .row div[class^='col-md']{
    height: 100%;
  }
  #noteViewWrap .note-view-wrap .option-nav .nav-content{
    width: 100%;
    height: 100%;
  }
  #noteViewWrap .note-view-wrap .option-nav .nav-content .top-box{
    height: 35px;
    line-height: 45px;
  }
  #noteViewWrap .note-view-wrap .option-nav .nav-content .top-box .tags-wrap span{
    font-size: 12px;
  }
  #noteViewWrap .note-view-wrap .option-nav .nav-content .top-box .tags-wrap .icon-tags{
    font-size: 16px;
    position: relative;
    top: 2px;
    color: #888;
    user-select: none;
  }
  #noteViewWrap .note-view-wrap .option-nav .nav-content .top-box .tags-wrap .icon-arrow{
    margin: 0 2px;
    font-size: 13px;
    cursor: pointer;
    color: #afafaf;
    position: relative;
    top: 1px;
  }
  #noteViewWrap .note-view-wrap .option-nav .nav-content .top-box .tags-wrap .icon-arrow:hover{
    color: #555;
  }
  #noteViewWrap .note-view-wrap .option-nav .nav-content .top-box .tags-wrap .tag{
    font-size: 12px;
    color: #fff;
    padding: 2px 5px;
    border-radius: 2px;
    margin: 0 2px;
    cursor: default;
    position: relative;
  }
  #noteViewWrap .note-view-wrap .option-nav .nav-content .top-box .tags-wrap .tag .icon-delete{
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
  #noteViewWrap .note-view-wrap .option-nav .nav-content .bottom-box{
    height: 35px;
    line-height: 35px;
    font-size: 12px;
    color: #888;
  }
  #noteViewWrap .note-view-wrap .option-nav .nav-content .bottom-box span{
    margin-right: 2px;
    display: inline-block;
    transform: scale(0.9);
    transform-origin: left center;
  }


  #noteViewWrap .note-view-wrap .view-content{
    padding: 10px 20px;
    font-weight: normal;
    height: calc(100% - 130px);
    color: #5d5d5d;
  }
  #noteViewWrap .note-view-wrap .view-content *:not(h2){
    line-height: 28px;
    font-size: 13px;
  }
  #noteViewWrap .note-view-wrap .view-content .content-title-box{
    padding: 5px 8px 5px 8px;
    border-bottom: 1px solid #e1e1e1;
  }
  #noteViewWrap .note-view-wrap .view-content .content-detail-box{
    padding: 15px 8px;
    border-bottom: 1px solid #e1e1e1;
  }
  #noteViewWrap .note-view-wrap .view-content .content-detail-box p{
    width: 80%;
  }
  #noteViewWrap .note-view-wrap .view-content p{
    line-height: 28px;
  }
  #noteViewWrap .note-view-wrap .view-content .content-page{
    padding: 15px 8px;
  }
  #noteViewWrap .note-view-wrap .view-content .content-page > *{
    margin: 8px 0;
  }
  #noteViewWrap .note-view-wrap .view-content .content-page pre{
    background-color: #23241f;
    color: #f8f8f2;
    overflow: visible;
    white-space: pre-wrap;
    margin-bottom: 5px;
    margin-top: 5px;
    padding: 5px 10px;
    border-radius: 3px;
  }
  #noteViewWrap .note-view-wrap .view-content .content-page img{
    max-width: 100%;
    margin: 8px 0;
  }

  #noteViewWrap .default-font{
    color: #999;
  }
</style>