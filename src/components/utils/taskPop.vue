<template>
  <div id="task_pop">
    <div class="modal fade" id="task_detail_option_pop" tabindex="-1" role="dialog" aria-labelledby="taskPopTitle">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="taskPopTitle">事务详情</h4>
          </div>
          <div class="modal-body">
            <div class="modal-panel title-panel">
              <h3>{{currentTask.task_title}}
                <span class="label label-default" v-if="!currentTask.is_achieve">未完成</span>
                <span class="label label-success" v-else>已完成</span>
              </h3>
            </div>
            <div class="modal-panel detail-panel">
              {{currentTask.task_detail}}
            </div>
            <div class="cutting-line"></div>
            <div class="modal-panel">
              <p>
                <span class="modal-title">
                  <i class="iconfont icon-create">&#xe677;</i>创建：
                </span>{{currentTask.add_time}}
              </p>
            </div>
            <div class="modal-panel">
              <p>
                <span class="modal-title">
                  <i class="iconfont icon-date">&#xe645;</i>日期：
                </span>{{currentTask.destination_time}}
                <span class="days-tag label label-danger" v-if="!currentTask.is_achieve">{{getDays}}</span>
              </p>
            </div>
            <div class="modal-panel" v-if="currentTask.is_achieve">
              <p>
                <span class="modal-title">
                  <i class="iconfont icon-date">&#xe655;</i>完成：
                </span>{{currentTask.achieve_time}}
                <span class="days-tag label label-success" v-if="currentTask.is_achieve">{{getDays}}</span>
              </p>
            </div>
            <div class="modal-panel">
              <p>
                <span class="modal-title">
                  <i class="iconfont icon-date">&#xe61b;</i>标签：
                </span>
                <tags-selector :current-data="currentTask"></tags-selector>
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">返回</button>
            <button type="button" class="btn btn-primary" @click="performTask" v-if="!currentTask.is_achieve">我已完成！</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TagsSelector from './tagsSelector.vue'

  export default {
    name: 'taskPop',
    props: [
      'currentTask'
    ],
    data: function(){
      return {

      }
    },  
    computed: {
      getDays: function(){
        var days 
        if(this.currentTask.is_achieve){
          days = this.datetime.DateDiff(this.currentTask.destination_time,this.currentTask.achieve_time)
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
          days = this.datetime.DateDiffNow(this.currentTask.destination_time)
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
    created: function(){
    },
    mounted: function(){
    },
    methods: {
      performTask: function(){
        
      }
    },
    components: {
      'tagsSelector': TagsSelector
    }
  }
</script>

<style>
  #task_pop .modal-body .modal-panel{
    padding: 4px 10px;
  }
  #task_pop .modal-body .modal-panel.title-panel{
    margin-bottom: 8px;
  }
  #task_pop .modal-body .modal-panel.title-panel span.label{
    margin-left: 2px;
    position: relative;
    top: -2px;
    font-size: 72%;
    padding: .3em .6em 0.3em;
  }
  #task_pop .modal-body .modal-panel.detail-panel{
    max-height: 400%;
  }
  #task_pop .modal-body .modal-panel .modal-title{
    display: inline-block;
    min-width: 76px;
    text-align: left;
    color: #b1b1b1;
    font-weight: 0;
  }
  #task_pop .modal-body .modal-panel .modal-title .iconfont{
    margin-right: 4px;
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 18px;
  }
  #task_pop .modal-body .modal-panel .days-tag{
    margin-left: 7px;
    position: relative;
    top: -1px;
  }
</style>