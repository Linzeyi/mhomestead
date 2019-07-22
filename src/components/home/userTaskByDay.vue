<template>
  <div id="userTaskByDay">
    <div class="top-content-heading">
      <div class="row">
        <div class="col-md-8 scroll-body">
          <span class="head-title">{{wrapTitle}}</span>
          <num-selector :type="'years'" :numDataInfo="numDataInfo" @on-change="onChange"></num-selector>
          <num-selector :type="'months'" :numDataInfo="numDataInfo" @on-change="onChange"></num-selector>
          <num-selector :type="'days'" :numDataInfo="numDataInfo" @on-change="onChange"></num-selector>
        </div>
        <div class="col-md-4">
          <span class="head-right-btn float-right">
            更多
          </span>
        </div>
      </div>
    </div>
    <div class="top-content-body">
<!--         <draggable v-model="userTaskList" :move="getdata" @update="datadragEnd">
        <transition-group> -->
          <div class="list-panel" v-for="(item,index) in userTaskList" :key="index">
            <div class="list-content-panel" :class="{'is-achieve': item.is_achieve}">
              <div class="check-panel">
                <span class="check-task" @click="changeTaskStatus(item)">
                  <i class="iconfont icon-task-check" v-if="item.is_achieve">&#xe644;</i>
                </span>
              </div> 
              <div class="font-panel">
                <div class="title-panel" :ref="['taskList_title_el' + index]">
                  <span class="list-title">{{item.task_title}}</span>
                </div>
                <div class="detail-panel" :ref="['taskList_detail_el' + index]" :style="'width:calc(100% - ' + getDetailWidth(item,index) + ')'">
                  <a 
                    tabindex="0"
                    role="button"
                    :data-toggle="'popover'+index" 
                    :title="item.task_title" 
                    :data-content="item.task_detail"
                    data-trigger="focus"
                    data-placement="bottom">
                      {{item.task_detail}}
                    </a>
                </div>
                <div class="achieve-line"></div>
              </div>
            </div>
            <div class="option-panel">
              <a class="glyphicon glyphicon-tasks" data-toggle="modal" data-target="#task_detail_option_pop" @click="popTaskDetailModal(item)"></a>
            </div>
          </div>
<!--           </transition-group>
      </draggable> -->
    </div>
    <div class="top-content-bottom">
      
    </div>
    <task-pop :current-task="currentTask" ></task-pop>
  </div>
</template>

<script>
import TaskPop from '../utils/taskPop.vue'
import NumSelector from '../utils/numSelector.vue'

  export default {
    props:[
      'wrapTitle'
    ],
    data: function(){
      return {
        'currentTask': {},
        'userTaskList': [],
        'taskPageInfo': {
          'pageNum': 0,
          'pageSize': 6
        },
        'numDataInfo': {
          'numData' : new Date(),
          'data': new Date().getTime()
        }
      }
    },
    created: function(){
      this.init()
      
    },
    watch: {
      
    },
    methods: {
      init: function(){
        this.$store.dispatch('task/GetUserTasks',this.taskPageInfo).then((res) => {
          var _this = this
          // console.log("任务列表获取成功：")
          // console.log(res.data)
          this.userTaskList = res.data.data
          this.taskPageInfo = res.data.pageInfo
          this.$nextTick(function () {
            for(let i = 0;i< _this.userTaskList.length;i++){
              // console.log($('[data-toggle="popover'+i+'"]'))
              $('[data-toggle="popover'+i+'"]').popover()
            }
          })
          this.userTaskList = this.sortUtil.TaskAchieveSort(this.userTaskList)
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      getdata: function(e){
        console.log(e.draggedContext.element.id)
      },
      datadragEnd: function(e){
        console.log('拖动前的索引 :' + e.oldIndex)
        console.log('拖动后的索引 :' + e.newIndex)
        console.log(this.userTaskList)
      },
      changeTaskStatus: function(item){
        item.is_achieve = !item.is_achieve
        if (item.is_achieve) {
          item.achieve_time = this.datetime.DateFormate(new Date())
        }
        else {
          item.achieve_time = null
        }
        this.userTaskList = this.sortUtil.TaskAchieveSort(this.userTaskList)
      },
      popTaskDetailModal: function(item){
        this.currentTask = item
      },
      getDetailWidth: function(item,index){
        var titleEl = 'taskList_title_el' + index
        var detailEl = 'taskList_detail_el' + index
        this.$nextTick(function () {
          let w = this.$refs[titleEl][0].clientWidth + 10 + 'px'
          this.$refs[detailEl][0].style.width = 'calc(100% - ' + w + ')'
        })
      },
      onChange: function(val){
        this.$set(this.numDataInfo,"data",val)
      }
    },
    components: {
      TaskPop,
      NumSelector
    }
  };
</script>

<style>
#userTaskByDay .top-content-heading{
  font-size: 1.1em;
  line-height: 38px;
  color: #bf7d7d;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  padding: 4px 10px 2px 10px;
  margin-bottom: 4px;
}
#userTaskByDay .top-content-heading .scroll-body{
  height: 38px;
}
#userTaskByDay .top-content-heading .scroll-body .head-title{
  margin-right: 4px;
}
#userTaskByDay .top-content-heading .head-right-btn{
  font-size: 12px;
  color: #aaa;
  cursor: pointer;
}
#userTaskByDay .top-content-heading .head-right-btn:hover{
  text-decoration: underline;
}
#userTaskByDay .top-content-body{
  padding: 6px 10px;
  /*max-height: 300px;
  overflow-y: scroll;*/
}
#userTaskByDay .top-content-body .list-panel{
  color: #6f6f6f;
  cursor: default;
  padding: 4px 0;
  /*position: relative;*/
}
#userTaskByDay .top-content-body .list-panel a{
  text-decoration: none;
  color: #6f6f6f;
  cursor: default;
}
#userTaskByDay .top-content-body .list-panel .list-content-panel{
  display: inline-block;
  font-size: 12px;
  line-height: 32px;
  height: 32px;
  width: 90%;
  margin-bottom: 0px;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
  /*vertical-align: top;*/
}
#userTaskByDay .top-content-body .list-panel .list-content-panel .check-panel{
  display: inline-block;
  height: 32px;
  width: 18px;
  line-height: 32px;
  margin-right: 6px;

}
#userTaskByDay .top-content-body .list-panel .list-content-panel .check-panel .check-task{
  display: inline-block;
  height: 18px;
  width: 18px;
  line-height: 18px;
  border: 1px solid #ddd;
  box-sizing: border-box;
  border-radius: 4px;
  cursor: pointer;
  color: #aaa;
  text-align: center;
  vertical-align: text-bottom;
}
#userTaskByDay .top-content-body .list-panel .is-achieve.list-content-panel .check-task{
  border-color: #2893f3;
  color: #2893f3;
}
#userTaskByDay .top-content-body .list-panel .is-achieve.list-content-panel .font-panel a,
#userTaskByDay .top-content-body .list-panel .is-achieve.list-content-panel .font-panel span{
  color: #bbb;
}
#userTaskByDay .top-content-body .list-panel:hover > div.list-content-panel .check-task{
  border-color: #aaa;
  color: #aaa;
}
#userTaskByDay .top-content-body .list-panel:hover > div.is-achieve .check-task{
  border-color: #0f6fc5;
  color: #0f6fc5;
  box-shadow:0px 0px 2px #2893f3;
}
#userTaskByDay .top-content-body .list-panel .list-content-panel .check-task .iconfont{
  font-size: 1.2em;
  margin: 0 auto;
  display: inline-block;
}
#userTaskByDay .top-content-body .list-panel .list-content-panel .font-panel{
  vertical-align: middle;
  display: inline-block;
  height: 32px;
  width: calc(100% - 28px);
  line-height: 32px;
  display: flex;
  flex-flow: row;
  float: right;
  position: relative;
}
#userTaskByDay .top-content-body .list-panel .list-content-panel .title-panel{
  display: inline-block;
  height: 32px;
  line-height: 32px;
  margin-right: 10px;
}
#userTaskByDay .top-content-body .list-panel .list-content-panel .title-panel .list-title{
  display: inline;
  height: 100%;
  width: 100%;
  font-size: 1.1em;
  font-weight: bold;
  color: #707070;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
#userTaskByDay .top-content-body .list-panel .list-content-panel .detail-panel {
  display: inline;
  height: 32px;
  line-height: 32px;
}
#userTaskByDay .top-content-body .list-panel .list-content-panel .detail-panel a{
  display: inline-block;
  width: 100%;
  text-overflow:ellipsis;
  white-space: nowrap;
  overflow: hidden; 
}
#userTaskByDay .top-content-body .list-panel .list-content-panel .popover{
  z-index: 99999;
  font-size: 12px;
}
#userTaskByDay .top-content-body .list-panel .list-content-panel .popover .popover-title{
  font-size: 12px;
  font-weight: bold;
}
#userTaskByDay .top-content-body .list-panel .list-content-panel .achieve-line{
  position: absolute;
  height: 1px;
  display: block;
  width: 98%;
  border-bottom: 1px solid transparent;
  top: 50%;
  box-sizing: border-box;
}
#userTaskByDay .top-content-body .list-panel .list-content-panel.is-achieve .achieve-line{
  border-color: #aaa;
}
#userTaskByDay .top-content-body .list-panel .option-panel{
  width: 8%;
  vertical-align: top;
  height: 32px;
  line-height: 32px;
  display: inline-block;
  text-align: right;
}
#userTaskByDay .top-content-body .list-panel .option-panel .glyphicon-tasks{
  display: inline-block;
  line-height: 32px;
  cursor: pointer;
  color: #bfbfbf;
}
#userTaskByDay .top-content-body .list-panel .option-panel .glyphicon-tasks:hover{
  color: #aaa;
}   
</style>