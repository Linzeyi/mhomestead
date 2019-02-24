<template>
  <div id="tagsSelector">
    <div class="tags-body">
      <div class="tags-panel">
        <div class="tag-box" v-for="(item,index) in tags">
          <span class="label" :style="{backgroundColor: item.tags_color}">{{item.tags_name}}</span>
          <i class="iconfont icon-delete" @click="deleteTag(item)">&#xe6f6;</i>
        </div>  
        <div class="tag-box" v-if="tags.length == 0">
          <span class="label label-default">暂无标签</span>
        </div>
        <div class="tag-box tag-add-box btn-group">
          <span class="iconfont icon-add" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click="popNewTag">&#xe629;</span>
          <ul class="dropdown-menu" v-if="isNewTagPop">
            <div class="pop-li" data-stopPropagation="true">
              <input type="text" placeholder="新标签名" v-model="newTag.tags_name">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
 export default{
  name: 'tagsSelector',
  props:[
    'currentData',
    'owner'
  ],
  data: function(){
    return {
      tags: [],
      newTag: {
        'tags_name': '',
        'tags_color': '#000000',
      },
      error: '',
      isNewTagPop: false
    }
  },
  mounted: function(){
    this.init()
  },
  watch: {
    'currentData.task_id': function(){
      this.getTaskTags()
    },
    'currentData.goal_id': function(){
      this.getGoalTags()
    },
    'newTag.tags_name': function(){
      this.error = ''
    }
  },
  methods: {
    init: function(){
      if(this.owner != null){
        if(this.owner.hasOwnProperty('task_id')){
          this.getTaskTags()
        }
        else if(this.owner.hasOwnProperty('goal_id')){
          this.getGoalTags()
        }
      }
      else{
        console.log(null)
      }
    },
    getTaskTags: function(){
      this.$store.dispatch('tag/GetTaskTags',this.currentData.task_id).then((res) => {
        // console.log(res.data)
        this.tags = res.data.data
        console.log(this.tags)
      }).catch((e) => {
        console.log("error:" + e)
      })
    },
    getGoalTags: function(){
      this.$store.dispatch('tag/GetGoalTags',this.currentData.goal_id).then((res) => {
        // console.log(res.data)
        this.tags = res.data.data
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
    deleteTag: function(item){
      this.$store.dispatch('tag/DeleteTag',item.tags_id).then((res) => {
        this.getGoalTags()
      }).catch((e) => {
        console.log("error:" + e)
      })
    },
    addNewTag: function(){
      if(this.newTag.tags_name != ''){
        if(this.owner.hasOwnProperty('task_id')){
          // console.log(this.owner)
        }
        else if(this.owner.hasOwnProperty('goal_id')){
          this.newTag.goal = this.owner
          this.$store.dispatch('tag/SaveTag',this.newTag).then((res) => {
            // console.log(res.data)
            this.getGoalTags()
          }).catch((e) => {
            console.log("error:" + e)
          })
        }
        else{
          this.tags.push(this.newTag)
          this.newTag = {
            'tags_name': '',
            'tags_color': '#000000',
          }
        }
        this.isNewTagPop = false
      }
      else {
        this.error = "标签名不能为空！"
      }
    }
  }
 } 
</script>

<style>
  #tagsSelector {
    display: inline-block;
    min-height: 30px;
    width: calc(100% - 85px);
    line-height: 30px;
    vertical-align: middle;
  }
  #tagsSelector .tags-body .tags-panel .tag-box{
    position: relative;
    display: inline-block;
    margin-right: 5px;
    cursor: default;
  }
  #tagsSelector .tags-body .tags-panel .tag-box:hover>.icon-delete{
    display: block;
  }
  #tagsSelector .tags-body .tags-panel .tag-box .icon-delete{
    transform: scale(0.8);
    position: absolute;
    top: -2px;
    right: -6px;
    color: #ec0700;
    /*border-radius: 10px;*/
    display: none;
    height: 12px;
    width: 15px;
    line-height: 12px;
    cursor: pointer;
  }
  #tagsSelector .tags-body .tags-panel .empty-text {
    font-size: 13px;
    color: #aaa;
  }
  #tagsSelector .tags-body .tags-panel .label-default{
    background-color: #999999;
  }
  #tagsSelector .tags-body .tags-panel .icon-add{
    color: #777777;
    margin-right: 10px;
    font-size: 16px;
    font-weight: 300;
    display: inline-block;
    height: 30px;
    vertical-align: middle;
    cursor: pointer;
  }
  #tagsSelector .tags-body .tags-panel .icon-add:hover{
    color: #666666;
  }
  #tagsSelector .tags-body .tags-panel .tag-add-box{
    position: relative;
  }
  #tagsSelector .tags-body .tags-panel .dropdown-menu{
    position: absolute;
    z-index: 100000;
    width: 140px;
    background-color: #fff;
    border-radius: 3px;
    padding: 5px;
    top: 0px;
    left: 30px;
    /*box-shadow: 0px 1px 5px 0px #888888;*/
  }
  #tagsSelector .tags-body .tags-panel .dropdown-menu .pop-li{
    padding: 5px;
    width: 100%;
    font-size: 12px;
    color: #777;
  }
  #tagsSelector .tags-body .tags-panel .dropdown-menu .pop-li input{
    width: 100%;
    height: 34px;
    text-indent: 5px;
    border: 1px solid #ddd;
    border-radius: 2px;
  }
  #tagsSelector .tags-body .tags-panel .dropdown-menu .pop-li input:focus{
    border-color: #aaa;
  }
  #tagsSelector .tags-body .tags-panel .dropdown-menu .pop-li input.color-ipt{
    width: calc(100% - 35px);
  }
  #tagsSelector .tags-body .tags-panel .dropdown-menu .pop-li.btn-li{
    margin: 0 auto;
    cursor: default;
  }
  #tagsSelector .tags-body .tags-panel .dropdown-menu .pop-li button{
    display: inline-block;
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
  #tagsSelector .tags-body .tags-panel .dropdown-menu .pop-li button:hover{
    border-color: #aaa;
  }
  #tagsSelector .tags-body .tags-panel .dropdown-menu .pop-li button.add-btn{
    background-color: #337ab7;
    border-color: #337ab7;
    color: #fff;
    float: right;
  }
  #tagsSelector .tags-body .tags-panel .dropdown-menu .pop-li button.add-btn:hover{
    background-color: #196eb6;
    border-color: #196eb6;
  }
  #tagsSelector .tags-body .tags-panel .dropdown-menu .pop-li.error-li{
    color: #d9534f;
    font-size: 12px;
  }
  #tagsSelector .tags-body .tags-panel .dropdown-menu .pop-li .m-colorPicker{
    padding: 5px;
    vertical-align: middle;
    font-size: 12px;
    color: #777;
    font-weight: 400;
  }
  #tagsSelector .tags-body .tags-panel .dropdown-menu .pop-li .m-colorPicker .defaultColor{
    color: #777;
    font-weight: 400;
  }
  #tagsSelector .tags-body .tags-panel .dropdown-menu .pop-li .m-colorPicker .defaultColor:hover{
    border-color: #aaa;
  }
  #tagsSelector .tags-body .tags-panel .dropdown-menu .pop-li .m-colorPicker h3{
    font-size: 12px;
    margin-bottom: 8px;
    color: #777;
    font-weight: 400;
  }
  #tagsSelector .tags-body .tags-panel .dropdown-menu .pop-li .m-colorPicker h3:last-child{
    cursor: pointer;
  }
  #tagsSelector .tags-body .tags-panel .dropdown-menu .pop-li .m-colorPicker .colorBtn{
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  #tagsSelector .tags-body .tags-panel .dropdown-menu .pop-li .m-colorPicker .box{
    width: 212px;
    top: -5px;
    left: 35px;
    margin-bottom: 10px;
  }
</style>