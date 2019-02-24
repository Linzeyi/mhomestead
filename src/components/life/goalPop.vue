<template>
  <div class="model fade" id="goal_detail_option_pop" tabindex="-1" role="dialog" aria-labelledby="goalPopTitle">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="goalPopTitle">目标详情</h4>
        </div>
        <div class="modal-body">
          <div class="modal-panel title-panel">
            <h3>{{currentGoal.goal_title}}
              <span class="label label-default" v-if="!currentGoal.is_achieve">未完成</span>
              <span class="label label-success" v-else>已完成</span>
            </h3>
          </div>
          <div class="modal-panel detail-panel">
            <p>{{currentGoal.goal_detail}}</p>
          </div>
          <div class="cutting-line"></div>
          <div class="modal-panel">
            <p>
              <span class="modal-title">
                <i class="iconfont icon-create">&#xe677;</i>创建：
              </span>{{currentGoal.add_time}}
            </p>
          </div>
          <div class="modal-panel" v-if="currentGoal.is_achieve">
            <p>
              <span class="modal-title">
                <i class="iconfont icon-create">&#xe677;</i>终结：
              </span>{{currentGoal.achieve_time}}
            </p>
          </div>
          <div class="modal-panel">
            <p>
              <span class="modal-title">
                <i class="iconfont icon-date">&#xe645;</i>期限：
              </span>
              <span class="modal-date">
                最早
                <span class="start-time">{{DateFormate(currentGoal.start_time)}}</span>
                <span class="sub-line"></span>最晚
                <span class="end-time">{{DateFormate(currentGoal.end_time)}}</span>
              </span>
            </p>
          </div>
          <div class="modal-panel">
            <p>
              <span class="modal-title">
                <i class="iconfont icon-date">&#xe61b;</i>标签：
              </span>
              <tags-selector :current-data="currentGoal" :owner="currentGoal"></tags-selector>
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">返回</button>
            <button type="button" class="btn btn-primary" @click="changeGoalStatus(1,currentGoal)" v-if="!currentGoal.is_achieve">已完成！！</button>
            <button type="button" class="btn btn-danger" @click="changeGoalStatus(0,currentGoal)" v-if="currentGoal.is_achieve">还没做好呢...</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TagsSelector from "../utils/tagsSelector.vue"
  export default {
    props: [
      'currentGoal'
    ],
    data: function(){
      return {

      }
    },
    mounted: function(){

    },
    computed: {
      getDays: function(){
        var days 
        if(this.currentGoal.is_achieve){
          days = this.DateDiff(this.currentGoal.destination_time,this.currentGoal.achieve_time)
          if(days < 0){
            return '提前' + -days + '天完成'
          }
          else if(days == 0){
            return '准时完成'
          }
          else {
            return '延期' + days + '天完成'
          }
        }
        else {
          days = this.DateDiffNow(this.currentGoal.destination_time)
          if(days < 0){
            return '延期' + -days + '天'
          }
          else if(days == 0){
            return '今天'
          }
          else {
            return days + '天'    
          }
        }
      }
    },
    methods: {
      changeGoalStatus: function(flag,item){
        this.$emit('changeGoalStatus',flag,item)
      }
    },
    components: {
      'tagsSelector' : TagsSelector
    }
  }
</script>

<style>
  #goal_detail_option_pop{
    text-align: left;
    z-index: 10;
    position: relative;
    height: 100%;
    overflow-y: auto;
  } 
  #goal_detail_option_pop.in{
    z-index: 100;
  }
  #goal_detail_option_pop .modal-body .modal-panel{
    padding: 8px 10px;
  }
  #goal_detail_option_pop .modal-body .modal-panel.title-panel{
    margin-bottom: 8px;
  }
  #goal_detail_option_pop .modal-body .modal-panel.title-panel span.label{
    margin-left: 2px;
    position: relative;
    top: -2px;
    font-size: 72%;
    padding: .3em .6em 0.3em;
  }
  #goal_detail_option_pop .modal-body .modal-panel.detail-panel{
    max-height: 400%;
  }
  #goal_detail_option_pop .modal-body .modal-panel .modal-title{
    display: inline-block;
    min-width: 76px;
    text-align: left;
    color: #b1b1b1;
    font-weight: 0;
  }
  #goal_detail_option_pop .modal-body .modal-panel p{
    line-height: 30px;
  }
  #goal_detail_option_pop .modal-body .modal-panel .modal-date{
    font-size: 13px;
    color: #444;
    position: relative;
  }
  #goal_detail_option_pop .modal-body .modal-panel .modal-date .sub-line{
    display: inline-block;
    width: 20px;
    height: 1px;
    position: relative;
    top: -4px;
    margin: 0px 12px;
    border-bottom: 1px solid #666;
  }
  #goal_detail_option_pop .modal-body .modal-panel .start-time{
    /*margin-right: 6px;*/
  }
  #goal_detail_option_pop .modal-body .modal-panel .end-time{
    /*margin-left: 4px;*/
  }
  #goal_detail_option_pop .modal-body .modal-panel .modal-title .iconfont{
    margin-right: 4px;
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 18px;
  }
  #goal_detail_option_pop .modal-body .modal-panel .days-tag{
    margin-left: 7px;
    position: relative;
    top: -1px;
  }
</style>