<template>
  <div  class="modal fade" id="new_goal_pop" tabindex="-1" role="dialog" aria-labelledby="newGoalTitle">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="newGoalTitle">新建目标</h4>
        </div>
        <div class="modal-body">
          <div class="modal-panel title-panel">
            <span class="title-content">
              目标标题：
            </span>
            <div class="input-content">
              <input class="plc-color" :class="{'error': error != ''}" type="text" placeholder="定义目标名称" v-model="newGoalObj.goal_title">
              <span class="error-font" v-if="error != ''">{{error}}</span>
            </div>
          </div>
          <div class="modal-panel">
            <span class="title-content">
              目标描述：
            </span>
            <div class="area-content">
              <textarea class="plc-color form-control" rows="3" placeholder="添加目标描述" v-model="newGoalObj.goal_detail"></textarea>
            </div>
          </div>
          <div class="modal-panel">
            <span class="title-content">
              实现期限：
            </span>
            <div class="date-content">
              <div class="date-content">
                <vue-datepicker-local v-model="range" range-separator="至"></vue-datepicker-local>
              </div>
            </div>
          </div>
          <div class="modal-panel">
            <span class="title-content">
              标签集：
            </span>
            <tags-selector :current-data="newGoalObj" :owner="newGoalObj"></tags-selector>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="addNewGoal()">提交</button>
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
      'path'
    ],
    data: function(){
      return {
        'newGoalObj': {
          'goal_title': '',
          'goal_detail': '',
          'start_time': '',
          'end_time': ''
        },
        'range': [new Date(),new Date()],
        'error': '',
      }
    },
    watch: {
      'newGoalObj.goal_title': function(){
        if(this.newGoalObj.goal_title != ''){
          this.error = ''
        }
      }
    },
    methods: {
      addNewGoal: function(){
        if(this.newGoalObj.goal_title == ''){
          this.error = "标题不能为空！"
        }
        else{
          this.newGoalObj.start_time = this.DateFormate(this.range[0])
          this.newGoalObj.end_time = this.DateFormate(this.range[1])
          this.newGoalObj.path = this.path
          this.$store.dispatch('goal/AddNewGoal',this.newGoalObj).then((res) => {
            // console.log(res.data)
            this.$emit('handleNewGoal')
            this.newGoalObj = {
              'goal_title': '',
              'goal_detail': '',
              'start_time': '',
              'end_time': ''
            }
            this.range = [new Date(),new Date()]
          }).catch((e) => {
            console.log("error:" + e)
          })
        }
      }
    },
    components: {
      'tagsSelector' : TagsSelector
    }
  }
</script>

<style>
  #new_goal_pop{
    text-align: left;
    z-index: 10;
    position: relative;
    height: 100%;
    overflow-y: auto;
  } 
  #new_goal_pop.in{
    z-index: 100;
  }
  #new_goal_pop .modal-body .modal-panel{
    padding: 8px 10px;
    margin: 8px 0;
  }
  #new_goal_pop .modal-body .modal-panel p{
    line-height: 30px;
  }
  #new_goal_pop .modal-body .modal-panel .title-content{
    font-size: 14px;
    font-weight: 600;
    color: #555;
    display: inline-block;
    width: 80px;
    text-align: right;
  }
  #new_goal_pop .modal-body .modal-panel .input-content{
    display: inline-block;
    width: calc(100% - 100px);
    line-height: 30px;
  }
  #new_goal_pop .modal-body .modal-panel .input-content input{
    border-radius: 2px;
    border: 1px solid #ddd;
    width: 60%;
    text-indent: 10px;
    font-size: 13px;
    color: #888;
  }
  #new_goal_pop .modal-body .modal-panel .area-content{
    display: inline-block;
    width: calc(100% - 100px);
    vertical-align: top;
  }
  #new_goal_pop .modal-body .modal-panel .area-content textarea{
    border: 1px solid #ddd;
    border-radius: 2px;
    box-shadow: none;
    color: #888;
    font-size: 13px;
    resize: none;
  }
  #new_goal_pop .modal-body .modal-panel .date-content{
    display: inline-block;
    width: calc(100% - 100px);
  }
  #new_goal_pop .modal-body .modal-panel .date-content input{
    border-radius: 2px;
    border: 1px solid #ddd;
    font-size: 13px;
    color: #888;
  }
  #new_goal_pop .modal-body .modal-panel .input-content input.error,
  #new_goal_pop .modal-body .modal-panel .date-content.error input{
    border-color: #d9534f;
  }
  #new_goal_pop .modal-body .modal-panel .date-content .datepicker-popup{
    width: 415px;
    border-radius: 2px;
  }
  #new_goal_pop .modal-body .modal-panel .error-font{
    font-size: 12px;
    color: #d9534f;
  }
  .plc-color::-webkit-input-placeholder{
    color: #888;
  }
  .plc-color::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color: #888;
  }
  .plc-color:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color: #888;
  }
  .plc-color:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
    color: #888;
  }
</style>