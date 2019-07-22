<template>
  <div id="life">
    <div class="sidebar-wrap">
      <div class="sidebar-nav">
        <div class="row">
          <div class="col-md-2"></div>
          <div class="col-md-8">
            <div class="btn-group">
              <button type="button" class="nav-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{currentType.type_title}} <span class="caret"></span>
              </button>
              <ul class="dropdown-menu">
                <li v-for="(item,index) in pathTypeList">
                  <a @click="currentType = item">{{item.type_title}}<i v-if="currentType.type_title == item.type_title" class="iconfont icon-ok">&#xe63d;</i></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-md-2"></div>
        </div>
      </div>
      <ul class="sidebar-list">
        <li v-for="(item,index) in pathList" :class="{'on':currentPath.path_id == item.path_id,'hurry':item.is_hurry}" @click="selectPath(item)">
          <p class="path-title">
            <i class="iconfont icon-hurry">&#xe620;</i>
            <span>{{item.path_title}}</span>
            <i class="iconfont icon-edit" @click="popEditPathModal">&#xe661;</i>
            <i class="iconfont icon-delete" @click="popDeletePathModal">&#xe656;</i>
          </p>
        </li>
        <li ref="new_path_pop_el" class="new-path" data-toggle="modal" data-target="#new_path_pop">
          <p><i class="iconfont icon-add">&#xe673;</i></p>
          <p class="path-title">新建</p>
        </li>
      </ul>
    </div>
    <div class="content-wrap">
      <div class="nav row">
        <div class="col-md-6 align-left">
          <span class="wrap-title">规划版图</span>
          <span class="nav-title" v-if="currentPath != ''">【 {{currentPath.path_title}} 】</span>
          <div class="hurry-box" :class="{'hurry': currentPath.is_hurry}" v-if="currentPath != ''">
            <span class="common" @click="setPathStatus(0)">常</span>
            <span class="hurry" @click="setPathStatus(1)">急</span>
          </div>
          <div class="opt-box">
            <span class="glyphicon glyphicon-cog"></span>
            <span class="opt-font">设置</span>
          </div>
        </div>
        <div class="col-md-6 align-right">
          <span class="glyphicon glyphicon-question-sign"></span>
        </div>
      </div>
      <div class="content" v-if="currentPath != ''">
        <calendar 
        :current-path="currentPath" 
        :goals-list="goalsList" 
        @popGoalDetailModal="popGoalDetailModal"
        @popNewGoalModal="popNewGoalModal"
        @popDeleteGoalModal="popDeleteGoalModal"
        @changeGoalStatus="changeGoalStatus"></calendar>
      </div>
      <div class="content-default" v-else>
        <div class="left-box">
          <h1 class="text-uppercase text-title">Li<span style="color:#d77b7b">f</span>e</h1>
          <h1 class="text-uppercase sub-title">planning</h1>
          <div class="cutting-line"></div>
          <p>在人生版图里，规划您的人生路线</p>
        </div>
        <div class="right-box"></div>
      </div>
    </div>

    <button ref="goal_pop_el" class="goalPopLink" data-toggle="modal" data-target="#goal_detail_option_pop"></button>
    <button ref="path_pop_el" class="pathPopLink" data-toggle="modal" data-target="#path_pop"></button>
    <button ref="new_goal_pop_el" class="goalPopLink" data-toggle="modal" data-target="#new_goal_pop"></button>
    <button ref="delete_goal_pop_el" class="goalPopLink" data-toggle="modal" data-target="#delete_goal_pop"></button>
    <button ref="delete_path_pop_el" class="goalPopLink" data-toggle="modal" data-target="#delete_path_pop"></button>

    <goal-pop :current-goal="currentGoal" @changeGoalStatus="changeGoalStatus" v-if="isGoalPop"></goal-pop>
    <path-pop :current-path="currentPath" @handleUpdatePath="handleUpdatePath"></path-pop>
    <new-goal-pop @handleNewGoal="handleNewGoal" :path="currentPath"></new-goal-pop>
    <new-path-pop @handleNewPath="handleNewPath"></new-path-pop>
    <div 
    id="delete_goal_pop" 
    class="modal fade bs-example-modal-sm" 
    tabindex="-1" 
    role="dialog" 
    aria-labelledby="删除">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">确认删除该目标？</h4>
          </div>
          <div class="modal-body">
          
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary"  @click="deleteGoal">删除</button>
          </div>
        </div>
      </div>
    </div>
    <div 
    id="delete_path_pop" 
    class="modal fade bs-example-modal-sm" 
    tabindex="-1" 
    role="dialog" 
    aria-labelledby="删除">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">确认删除该路线？</h4>
          </div>
          <div class="modal-body">
            <div class="modal-panel" v-if="checkGoals()">
              <p>检测到您在该路线内含有目标任务</p>
              <p>请先将其全部清除，再进行路线删除</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary disabled" v-if="checkGoals()">删除</button>
            <button type="button" class="btn btn-primary" v-else @click="deletePath">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import GoalPop from '../components/life/goalPop.vue'
  import PathPop from '../components/life/pathPop.vue'
  import NewGoalPop from '../components/life/newGoalPop.vue'
  import NewPathPop from '../components/life/newPathPop.vue'
  import calendar from '../components/life/calendar.vue'

  export default {
    data: function(){
      return {
        'pathList': [
          {
            'path_id': 1,
            'path_title': '学业规划',
            'type': '学业'
          },
          {
            'path_id': 2,
            'path_title': '工作规划',
            'type': '工作'
          },
          {
            'path_id': 3,
            'path_title': '家庭规划',
            'type': '家庭'
          },
          {
            'path_id': 4,
            'path_title': '旅行计划',
            'type': '旅行'
          }
        ],
        'currentPath': '',
        'pathTypeList': [
          {
            'type_title': '全部计划',
            'type': 'all'
          },
          {
            'type_title': '紧急规划',
            'type': 'hurry'
          }
        ],
        'currentType': '',
        'goalsList': [],
        'currentGoal': {},
        'isGoalPop': false,
      }
    },
    mounted: function(){
      this.currentType = this.pathTypeList[0]
      this.getUserPaths()
    },
    watch: {
      'currentType': function(){
        if(this.currentType.type == 'all'){
          this.getUserPaths()
        }
        else if(this.currentType.type == 'hurry'){
          this.getUserHurryPaths()
        }
      }
    },
    methods: {
      setPathStatus: function(flag){
        this.currentPath.is_hurry = flag
        this.updatePath()
      },
      updatePath: function(){
        this.$store.dispatch('path/UpdatePath',this.currentPath).then((res) => {
          console.log("编辑后的路线信息已被存储：")
          console.log(res.data)
          if(this.currentType.type == 'all'){
            this.getUserPaths()
          }
          else if(this.currentType.type == 'hurry'){
            this.getUserHurryPaths()
          }
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      getUserPaths: function(){
        var _this = this
        this.$store.dispatch('path/GetUserPaths').then((res) => {
          // console.log("获取用户所有路线：")
          // console.log(res.data)
          this.pathList = res.data.data
          // this.currentPath = this.pathList[0]
          if(this.currentPath != ''){
            this.getPathGoals(this.currentPath.path_id)
          }
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      getUserHurryPaths: function(){
        var _this = this
        this.$store.dispatch('path/GetUserHurryPaths').then((res) => {
          // console.log(res.data)
          this.pathList = res.data.data
          if(!this.currentPath.is_hurry){
            this.currentPath = this.pathList[0]
          }
          // this.currentPath = this.pathList[0]
          this.getPathGoals(this.currentPath.path_id)
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      getPathGoals: function(path_id){
        this.$store.dispatch('goal/GetPathGoals',path_id).then((res) => {
          console.log("获取路线 " + this.currentPath.path_title + " 下的所有目标：")
          console.log(res.data)
          if(res.data.data === undefined || res.data.data.length == 0){
            this.goalsList = []
          }
          else this.goalsList = res.data.data
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      selectPath: function(item){
        this.currentPath = item
        this.getPathGoals(item.path_id)
      },
      popEditPathModal: function(){
        this.$refs.path_pop_el.click()
      },
      handleUpdatePath: function(path){
        this.currentPath.path_title = path.path_title
        this.currentPath.path_detail = path.path_detail
        this.currentPath.is_hurry = path.is_hurry
        this.updatePath()
        this.$refs.path_pop_el.click()
      },
      popDeletePathModal: function(){
        this.$refs.delete_path_pop_el.click()
      },
      deletePath: function(){
        this.$store.dispatch('path/DeletePath',this.currentPath.path_id).then((res) => {
          console.log("路线 " + this.currentPath.path_title + " 已被删除。")
          console.log(res.data)
          this.selectPath(this.pathList[0])
          this.$refs.delete_path_pop_el.click()
          this.getUserPaths()
          if(this.currentPath.path_id == path_id){
            this.currentPath = ''
          }
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      popGoalDetailModal: function(item){
        this.currentGoal = item
        this.isGoalPop = true
        this.$nextTick(function(){
          this.$refs.goal_pop_el.click()
        })
      },
      popNewGoalModal: function(){
        this.$nextTick(function(){
          this.$refs.new_goal_pop_el.click()
        })
      },
      handleNewGoal: function(){
        this.getPathGoals(this.currentPath.path_id)
        this.$refs.new_goal_pop_el.click()
      },
      handleNewPath: function(){
        this.getUserPaths()
        this.$refs.new_path_pop_el.click()
      },
      popDeleteGoalModal: function(item){
        this.$nextTick(function(){
          this.$refs.delete_goal_pop_el.click()
          this.currentGoal = item
        })
      },
      checkGoals: function(){
        if(this.goalsList === undefined || this.goalsList.length == 0){
          return false
        }
        else {
          return true
        } 
      },
      deleteGoal: function(){
        this.$store.dispatch('goal/DeleteGoal',this.currentGoal.goal_id).then((res) => {
          console.log(this.currentGoal.goal_title + " 目标已被删除。")
          console.log(res.data)
          this.getPathGoals(this.currentGoal.path.path_id)
          this.$refs.delete_goal_pop_el.click()
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      changeGoalStatus: function(flag,item){
        this.currentGoal = item
        this.currentGoal.is_achieve = flag
        if(flag){
          this.currentGoal.achieve_time = this.datetime.DateFormate(new Date())
        }
        this.updateGoal()
      },
      updateGoal: function(){
        this.$store.dispatch('goal/UpdateGoal',this.currentGoal).then((res) => {
          console.log("目标状态已更新：")
          console.log(res.data)
          this.getPathGoals(this.currentGoal.path.path_id)
        }).catch((e) => {
          console.log("error:" + e)
        })
      }
    },
    components: {
      calendar,
      GoalPop,
      PathPop,
      NewGoalPop,
      NewPathPop
    }
  };
</script>

<style>
  #life {
    background-image: url("../assets/img/bg-5.jpg");
    background-size:100%;
    height: calc(100% - 70px);
    width: 100%;
  }
  #life:after{
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
  #life .sidebar-wrap{
    border-top-left-radius: 2px;
    position: absolute;
    z-index: 61;
    top: 100px;
    bottom: 0px;
    left: 30px;
    width: 240px;
    padding: 0px 0px;
    background: rgba(0, 0, 0, 0.6);
  }
  #life .sidebar-wrap:hover{
    /*background: rgba(250, 250, 250, 0.5);*/
    /*box-shadow: 1px 1px 2px 0px #858585;*/
  }
  #life .sidebar-wrap .sidebar-nav{
    margin-top: 10px;
    height: 60px;
    line-height: 60px;
  }
  #life .sidebar-wrap .sidebar-nav .row{
    padding: 0 20px;
    height: 60px;
  }
  #life .sidebar-wrap .sidebar-nav .row>div{
    height: 60px;
  }
  #life .sidebar-wrap .sidebar-nav .btn-group{
    height: 60px;
  }
  #life .sidebar-wrap .sidebar-nav .btn-group button{
    background: none;
    border: none;
    color: #d1d1d1;
    font-size: 13px;
    font-weight: 500;
    height: 60px;
    line-height: 60px;
  }
  #life .sidebar-wrap .sidebar-nav .btn-group button:hover{
    color: #fff;
  }
  #life .sidebar-wrap .sidebar-nav .btn-group .dropdown-menu{
    min-width: 120px;
    border-radius: 4px;
    background-color: #fff;
    top: 80%;
    left: -30%;
  }
  #life .sidebar-wrap .sidebar-nav .btn-group .dropdown-menu li a{
    font-size: 12px;
    color: #807878;
    height: 35px;
    line-height: 35px;
    padding: 0px 20px;
    cursor: default;
  }
  #life .sidebar-wrap .sidebar-nav .btn-group .dropdown-menu li a .icon-ok{
    float: right;
    font-size: 14px;
    color: #e29898;
    line-height: 35px;
  }
  #life .sidebar-wrap .sidebar-list{
    padding: 0px 15px;
    height: calc(100% - 70px);
    overflow-y: auto;
    width: 100%;
  }
  #life .sidebar-wrap .sidebar-list li{
    position: relative;
    z-index: 50;
    list-style: none;
    height: 70px;
    line-height: 70px;
    padding: 0px 20px;
    width: 100%;
    background: rgba(145, 145, 145, 0.6);
    color: #f0f0f0;
    /*box-shadow: 1px 1px 3px 0px #c3c3c3;*/
    border-radius: 2px;
    /*cursor: pointer;*/
    transition: all 0.2s;
    -moz-transition: all 0.2s; /* Firefox 4 */
    -webkit-transition: all 0.2s; /* Safari 和 Chrome */
    -o-transition: all 0.2s; /* Opera */
    margin-top: 8px;
  }
  #life .sidebar-wrap .sidebar-list li *{
    user-select: none;
  }
  #life .sidebar-wrap .sidebar-list li:hover{
    background: rgba(176, 176, 176, 0.8);
    box-shadow: 0px 3px 5px 0px #373737;
    color: #f9faf9;
  }
  #life .sidebar-wrap .sidebar-list li.on{
    background: rgba(238, 238, 238, 0.8);
    color: #646262;
    /*box-shadow: 0px 2px 4px 0px #9c8c8c;*/
  }
  #life .sidebar-wrap .sidebar-list li.on:hover{
    box-shadow: none;
  }
  #life .sidebar-wrap .sidebar-list li p{
    padding-left: 20px;
    font-size: 0.9em;
    text-align: left;
    font-weight: 600;
  }
  #life .sidebar-wrap .sidebar-list li p span{
    max-width: 78%;
    height: 35px;
    line-height: 35px;
    vertical-align: middle;
    display: inline-block;
  }
  #life .sidebar-wrap .sidebar-list li i.icon-hurry{
    position: absolute;
    display: none;
    font-size: 16px;
    /*right: 14px;*/
    left: 15px;
    top: -1px;
  }
  #life .sidebar-wrap .sidebar-list li.hurry i.icon-hurry{
    display: block;
  }
  #life .sidebar-wrap .sidebar-list li .icon-delete,
  #life .sidebar-wrap .sidebar-list li .icon-edit{
    font-size: 18px;
    width: 18px;
    height: 20px;
    line-height: 20px;
    display: none;
    position: absolute;
    right: 10px;
    cursor: pointer;
    top: 24px;
  }
  #life .sidebar-wrap .sidebar-list li .icon-edit{
    right: 34px;
    font-size: 17px;
    top: 25px;
  }
  #life .sidebar-wrap .sidebar-list li:hover> p .icon-delete,
  #life .sidebar-wrap .sidebar-list li:hover> p .icon-edit{
    display: block;
  }
  #life .sidebar-wrap .sidebar-list li.new-path{
    background: transparent;
    color: #f4f4f4;
    box-shadow: none;
    cursor: pointer;
  }
  #life .sidebar-wrap .sidebar-list li.new-path:hover{
    color: #fff;
    box-shadow: 1px 2px 6px 1px #161616;
  }
  #life .sidebar-wrap .sidebar-list li.new-path p{
    height: 30px;
    line-height: 30px;
    padding-left: 0;
    text-align: center;
  }
  #life .sidebar-wrap .sidebar-list li.new-path p .icon-add{
    font-size: 20px;
    font-weight: 400;
    height: 40;
    line-height: 40px;
    display: inline-block;
    position: relative;
    top: 5px;
  }
  #life .sidebar-wrap .sidebar-list li.new-path p.path-title{
    font-size: 12px;
    font-weight: 400;
    line-height: 35px;
  }


  #life .content-wrap{
    position: absolute;
    width: calc(100% - 300px);
    z-index: 50;
    top: 100px;
    bottom: 0px;
    left: 270px;
    margin: 0 auto;
    border-top-right-radius: 2px;
    background: rgba(14, 14, 14, 0.4);
  }
  #life .content-wrap:hover{
    /*background: rgba(255, 255, 255, 0.45);*/
    /*box-shadow: 0px 2px 8px 0px #9a9a9a;*/
  }
  #life .content-wrap .nav{
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    margin: 0;
    font-size: 14px;
    color: #fff;
    cursor: default;
  }
  #life .content-wrap .nav>div{
    height: 60px;
  }
  #life .content-wrap .nav .wrap-title{
    padding: 0 0px 0 5px;
    font-size: 16px;
    font-weight: 700;
    display: inline-block;
    height: 60px;
    line-height: 60px;
  }
  #life .content-wrap .nav .nav-title{
    font-weight: 700;
    color: #eee;
    display: inline-block;
    height: 60px;
    line-height: 60px;
  }
  #life .content-wrap .nav .opt-box{
    width: 40px;
    height: 20px;
    line-height: 20px;
    position: relative;
    vertical-align: middle;
    display: inline-block;
    margin-left: 5px;
    cursor: pointer;
  }
  #life .content-wrap .nav .opt-box *{
    transition: all 0.8s;
    -moz-transition: all 0.8s; /* Firefox 4 */
    -webkit-transition: all 0.8s; /* Safari 和 Chrome */
    -o-transition: all 0.8s; /* Opera */
  }
  #life .content-wrap .nav .opt-box .opt-font{
    opacity: 0;
    font-size: 12px;
    color: #ececec;
    vertical-align: middle;
    position: absolute;
    left: 0px;
    top: -1px;
    /*font-weight: 600;*/
  }
  #life .content-wrap .nav .opt-box:hover >.opt-font{
    opacity: 0.8;
    transform: translate(19px, 0px);
    -webkit-transform: translate(19px, 0px);
    -moz-transform: translate(19px, 0px);
    -o-transform: translate(19px, 0px);
    -ms-transform: translate(19px, 0px);
    /*display: inline-block;*/
  }
  #life .content-wrap .nav .opt-box:hover >.glyphicon{
    transform: rotate(200deg);
    -webkit-transform: rotate(200deg);
    -moz-transform: rotate(200deg);
    -o-transform: rotate(200deg);
    -ms-transform: rotate(200deg);
  }
  #life .content-wrap .nav .hurry-box{
    width: 45px;
    height: 20px;
    line-height: 20px;
    position: relative;
    vertical-align: middle;
    top: -2px;
    border: 1px solid #ddd;
    box-sizing: content-box;
    border-radius: 2px;
    background-color: transparent;
    display: inline-block;
    font-size:0px;
  }
  #life .content-wrap .nav .hurry-box span{
    display: inline-block;
    width: 50%;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
    color: #666;
    background-color: #ececec;
    transition: all 0.2s;
    -moz-transition: all 0.2s; /* Firefox 4 */
    -webkit-transition: all 0.2s; /* Safari 和 Chrome */
    -o-transition: all 0.2s; /* Opera */
    user-select: none;
  }
  #life .content-wrap .nav .hurry-box span.hurry{
    background-color: transparent;
    color: #ececec;
    cursor: pointer;
    opacity: 0.8;
  }
  #life .content-wrap .nav .hurry-box span.hurry:hover{
    opacity: 1;
    color: #f1f1f1;
  }
  #life .content-wrap .nav .hurry-box.hurry span.hurry{
    background-color: #ececec;
    color: #666;
    cursor: default;
    opacity: 1;
  }
  #life .content-wrap .nav .hurry-box.hurry span.hurry:hover{
    color: #666;
  }
  #life .content-wrap .nav .hurry-box.hurry span.common{
    background-color: transparent;
    color: #ececec;
    cursor: pointer;
    opacity: 0.8;
  }
  #life .content-wrap .nav .hurry-box.hurry span.common:hover{
    opacity: 1;
    color: #f1f1f1;
  }
  #life .content-wrap .nav .glyphicon{
    color: #ececec;
    font-size: 14px;
  }
  #life .content-wrap .nav .glyphicon:hover{
    color: #fff;
  }
  #life .content-wrap .nav .glyphicon.glyphicon-question-sign{
    font-size: 18px;
    position: relative;
    vertical-align: middle;  
    display: inline-block;
  }

  #life .content-wrap .content,
  #life .content-wrap .content-default{
    position: relative;
    width: 96%;
    z-index: 60;
    height: calc(100% - 80px);
    margin: 0px auto;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 1px 3px 7px 0px #3f3f3f;
    border-radius: 3px;
    opacity: 0.9;    
    transition: all 0.2s;
    -moz-transition: all 0.2s; /* Firefox 4 */
    -webkit-transition: all 0.2s; /* Safari 和 Chrome */
    -o-transition: all 0.2s; /* Opera */
    overflow: hidden;
  }
  #life .content-wrap .content:hover,
  #life .content-wrap .content-default:hover{
    box-shadow: 2px 4px 11px 0px #3f3f3f;
    opacity: 1;
  }

  #life .content-wrap .content-default{
    text-align: left;
    padding: 0px;
    position: relative;
  }
  #life .content-wrap .content-default .left-box{
    display: inline-block;
    width: 49%;
    text-align: right;
    padding: 120px 20px;
    height: 100%;
    float: left;
  }
  #life .content-wrap .content-default .left-box h1.text-title {
    font-size: 172px;
    font-weight: 100;
    cursor: default;
    user-select:none;
    margin-top: 5px;
    margin-bottom: -30px;
  }
  #life .content-wrap .content-default .left-box h1.sub-title{
    position: relative;
    right: 0;
    margin-top: 0px;
    font-size: 71px;
    font-weight: 300;
    cursor: default;
    user-select:none;
    margin-bottom: -5px;
  } 
  #life .content-wrap .content-default .left-box .cutting-line{
    width: 71%;
    border-color: #000000;
    display: inline-block;
    margin: 0px 2px 6px 0;
  }
  #life .content-wrap .content-default .left-box p{
    font-size: 23px;
    font-weight: 300;
  }
  #life .content-wrap .content-default .right-box{
    display: inline-block;
    width: 51%;
    text-align: left;
    height: 100%;
    float: right;
    background-image: url("../assets/img/bg-11.jpg");
    background-size:100%;
  }
  #life .content-wrap .content-default .right-box:after{
    position: absolute;
    top: 0;
    right: 0;
    content: "";
    background-color: #fff;
    opacity: 0.1;
    z-index: 1;
    width: 51%;
    height: 100%;
  }

  #life .goalPopLink,
  #life .pathPopLink{
    position: absolute;
    opacity: 0;
  }

  #life #delete_goal_pop,
  #life #delete_path_pop{
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
  }
  #life #delete_path_pop .modal-panel{
    padding: 10px 0;
  }
  #life #delete_path_pop .modal-panel p{
    font-size: 12px;
    line-height: 20px;
    padding: 2px 10px;
  }
  #life #delete_goal_pop .modal-footer,
  #life #delete_path_pop .modal-footer{
    text-align: center;
  }
  #life #delete_path_pop .modal-footer button.disabled{
    cursor: not-allowed;
    filter: alpha(opacity=65);
    -webkit-box-shadow: none;
    box-shadow: none;
    opacity: .65;
  }
</style>