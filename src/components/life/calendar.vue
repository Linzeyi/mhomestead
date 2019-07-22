<template>
  <div id="calendar" @mouseover.stop="mouseover()">
    <div class="sidebar-nav">
      <div class="head">
        <span class="glyphicon glyphicon-th-list"></span>目标列表
        <p class="color-info-panel">
          <span v-for="(item,index) in colorInfo" :class="item.name" :data-toggle="'tooltip' + index" data-placement="bottom" :title="item.detail">
            <!-- <div class="pop-box">
              <p>{{item.detail}}</p>
            </div> -->
          </span>
        </p>
      </div>
      <div class="goals-list-box">
        <ul ref="goals_list_el">
          <li 
          v-for="(item,index) in goalsList" 
          @mouseenter="goalElEnter(index)" 
          @mouseleave="goalElLeave(index)"
           :ref="('goal_list_li_el_' + index)">
            <p class="li-title">
              <span class="iconfont icon-select" v-if="!item.is_achieve" @click="changeGoalStatus(1,item)"></span>
              <span class="iconfont icon-select" v-else @click="changeGoalStatus(0,item)">&#xe63d;</span>
              <a @click="popGoalDetailModal(item)">{{item.goal_title}}</a>
            </p>
            <i class="iconfont icon-delete" @click="deleteGoal(item)">&#xe6dc;</i>
          </li>
          <div class="new-goal">
            <p @click="popNewGoalModal"><span class="iconfont icon-add">&#xe673;</span>新建目标</p>
          </div>
        </ul>
      </div>
    </div>
    <div class="calendar-box">
      <div class="option-nav">
        <span class="left-btn">
          <i 
            class="iconfont icon-left" 
            @click="prevYear()">&#xe714;</i>
        </span>
        <p class="year-span">历程表：{{year}}年<span v-if="checkYear()">（今年）</span><span v-if="!checkYear()">（当前年份：2018）</span></p>
        <span class="right-btn">
          <i 
          class="iconfont icon-right" 
          @click="nextYear()">&#xe713;</i>
        </span>
        </span>
      </div>
      <div class="date-content">
          <span class="left-btn">
            <i 
            class="iconfont icon-left" 
            @mousedown.stop="scrollLeft()" 
            @mouseup.stop="mouseup()">&#xe600;</i>
          </span>
        <div class="wrap-x" ref="calendar_x_el">
          <div class="wrap-y" ref="calendar_y_el">
            <ul class="item-container">
              <li 
              class="mask-panel" 
              v-for="(l_item,l_index) in goalsList" 
              :ref="('goal_mask_el_' + l_index)"
              @mouseenter="goalElEnter(l_index)" 
              @mouseleave="goalElLeave(l_index)">
                <div 
                class="item-wrap"
                :class="{'overtime': checkTimeOut(l_item.end_time,new Date()),'achieve': l_item.is_achieve}"
                :style="'left:' + getItemPosition(l_item) + ';width:' + getWrapWidth(l_item) + 'px'">
                  <span 
                  class="item-content" 
                  @click="popGoalDetailModal(l_item)"
                  :style="'width:' + getItemWidth(l_item) + 'px'">
                    <p>{{new Date(l_item.start_time).getMonth() + 1}}月{{new Date(l_item.start_time).getDate()}}日 —— {{new Date(l_item.end_time).getMonth() + 1}}月{{new Date(l_item.end_time).getDate()}}日<span class="un-achieve">（未完成）</span></p>
                  </span>
                  <span 
                  class="item-overtime-content" 
                  v-if="l_item.is_achieve"
                  @click="popGoalDetailModal(l_item)"
                  :style="'left:' + getOverItemPosition(l_item) + ';width:' + getOverItemWidth(l_item) + 'px'">
                    <p v-if="checkTimeOut(l_item.achieve_time,l_item.start_time)">提前完成</p>
                    <p v-if="checkTimeOut(l_item.end_time,l_item.achieve_time)">超时完成</p>
                  </span>
                </div>
              </li>
              <li class="mask-panel mask-new-panel"></li>
            </ul>
          </div>
          <div class="head-box" ref="head_el">
            <div class="days-wrap">
              <div class="month-panel" v-for="m_index in 12">
                <span class="day-box title-box">
                  <div class="day-head">{{m_index}}月</div>
                  <div class="day-path"></div>
                </span>
                <span class="day-box" 
                v-for="d_index in getDaysOfMonth(m_index)" 
                :class="{'today': checkToday(m_index,d_index)}">
                  <div class="day-head" v-if="!checkToday(m_index,d_index)">{{d_index}}</div>
                  <div class="day-head" v-else>今</div>
                  <div class="day-path"></div>    
                </span>
              </div>
              <div class="month-panel"><span class="day-box"></span></div>
            </div>
          </div>
        </div>
        <span class="right-btn">
          <i 
          class="iconfont icon-right" 
          @mousedown.stop="scrollRight()" 
          @mouseup.stop="mouseup()">&#xe601;</i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import GoalPop from './goalPop.vue'
  export default {
    props: [
      'currentPath',
      'goalsList'
    ],
    data: function(){
      return {
        'year': new Date().getFullYear(),
        'month': new Date().getMonth()+1,
        'days': new Date().getDate(),
        'timer': null,
        'colorInfo': [
          {
            'name': 'red',
            'color': '#c75151',
            'detail': "已超时（无论完成与否）"
          },
          {
            'name': 'green',
            'color': '#5cb85c',
            'detail': "已完成（无论超时与否）"
          },
          {
            'name': 'blue',
            'color': '#468bc7',
            'detail': "在期限内或提前完成"
          }
        ]
      }
    },
    watch: {
      // 'year': function(){
      //   this.$refs.calendar_y_el.$forceUpdate()
      // }
    },
    mounted: function() {
      //监听页面滚动事件
      var _this = this
      var goals_list_el = this.$refs.goals_list_el
      var calendar_x_el = this.$refs.calendar_x_el
      var calendar_y_el = this.$refs.calendar_y_el
      var head_el = this.$refs.head_el
      this.$nextTick(function(){
        calendar_y_el.addEventListener('scroll', () => {
          goals_list_el.scrollTo(0,calendar_y_el.scrollTop)
        }, false)
        goals_list_el.addEventListener('scroll', () => {
          calendar_y_el.scrollTo(0,goals_list_el.scrollTop)
        }, false)
        calendar_y_el.style.width = head_el.clientWidth + 'px'
        calendar_x_el.scrollBy(_this.getTodayPosition(),0)

        for(let i = 0;i < _this.colorInfo.length;i++){
          $('[data-toggle="tooltip'+i+'"]').tooltip()
        }
      })
    },
    methods: {
      changeGoalStatus: function(flag,item){
        this.$emit('changeGoalStatus',flag,item)
      },
      deleteGoal: function(item){
        this.$emit('popDeleteGoalModal',item)
      },
      popGoalDetailModal: function(item){
        this.$emit('popGoalDetailModal',item)
      },
      popNewGoalModal: function(){
        this.$emit('popNewGoalModal')
      },
      goalElEnter: function(index){
        this.$refs['goal_mask_el_' + index][0].style.background = "rgba(103, 103, 103, 0.1)"
        this.$refs['goal_list_li_el_' + index][0].style.background = "rgb(246, 246, 246)"
      },
      goalElLeave: function(index){
        this.$refs['goal_mask_el_' + index][0].style.background = "transparent"
        this.$refs['goal_list_li_el_' + index][0].style.background = "transparent"
      },
      getDaysOfMonth: function(month){
        return this.datetime.GetDaysOfMonth(this.year,month) //month = 0,1,2...
      },
      getTodayPosition: function(){
        var s_time = new Date(new Date().getFullYear(),0,1)
        var now = new Date()
        var diff = this.datetime.DateDiff(s_time,now)
        return diff * 40
      },
      getItemTop: function(index){
        return 35 + 45 * index
      },
      getWrapWidth: function(item){
        var s_time = new Date(item.start_time)
        var e_time = new Date(item.end_time)
        var a_time = new Date(item.achieve_time)
        var width1 = this.getItemWidth(item)
        var width2 = this.getOverItemWidth(item)
        return width1 + width2 + 10
      },
      getItemWidth: function(item){
        var s_time = new Date(item.start_time)
        var e_time = new Date(item.end_time)
        if(e_time.getFullYear() == s_time.getFullYear() && this.year == e_time.getFullYear()){
          var diff = this.datetime.DateDiff(s_time,e_time) + 1
          var s_month = new Date(s_time).getMonth()
          var e_month = new Date(e_time).getMonth()
          var m_diff = e_month - s_month
          return  40 * (diff + m_diff) -10
        }
        else{
          if(e_time.getFullYear() == s_time.getFullYear()){
            return 0
          }
          else if(s_time.getFullYear() == this.year){ // 当前视窗处在目标最前一段
            var y_e_time = new Date(this.year,11,31)
            var diff = this.datetime.DateDiff(s_time,y_e_time)
            var s_month = new Date(s_time).getMonth()
            var m_diff = 12 - s_month + 1
            return 40 * (diff + m_diff) -10
          }
          else if(e_time.getFullYear() == this.year){// 当前视窗处在目标最后一段
            var y_s_time = new Date(this.year,0,1)
            var diff = this.datetime.DateDiff(y_s_time,e_time) + 1
            var e_month = new Date(e_time).getMonth()
            var m_diff = e_month - 0 + 1
            return 40 * (diff + m_diff) -10
          }
          else if(this.year > s_time.getFullYear() && this.year < e_time.getFullYear()){
            return 40 * (365 + 12) -10
          }
          else return 0
        }
        
      },
      getOverItemWidth: function(item){
        var s_time = new Date(item.start_time)
        var e_time = new Date(item.end_time)
        var a_time = new Date(item.achieve_time)
        // console.log(" —————————————————超时完成板块宽度——--————————————")
        // console.log(item.goal_title)
        // 实现时间晚于结束时间
        if(this.datetime.DateDiff(e_time,a_time) >= 0){
          if(a_time.getFullYear() == e_time.getFullYear() && this.year == e_time.getFullYear()){
            var diff = this.datetime.DateDiff(e_time,a_time)
            var e_month = new Date(e_time).getMonth()
            var a_month = new Date(a_time).getMonth()
            var m_diff = a_month - e_month
            // console.log("实现时间与结束时间同年较晚且今年是结束时间：" + 40 * (diff + m_diff))
            return 40 * (diff + m_diff)
          }
          else{
            if(a_time.getFullYear() == e_time.getFullYear()){
            // console.log("实现时间与结束时间同年较晚且今年不是结束时间：0")
              return 0
            }
            else if(this.year == a_time.getFullYear()){
              var y_s_time = new Date(this.year,0,1)
              var diff = this.datetime.DateDiff(y_s_time,a_time)
              var a_month = new Date(a_time).getMonth()
              var m_diff = a_month + 1
              // console.log("实现时间与结束时间不同年较晚且今年是实现时间：" + 40 * (diff + m_diff) + 30)
              return 40 * (diff + m_diff) + 30;
            } 
            else if(this.year < a_time.getFullYear() && this.year >= s_time.getFullYear()){
              // console.log("实现时间与结束时间不同年较晚且今年与实现时间不同年较早且")
              if(e_time.getFullYear() == this.year){
                var y_e_time = new Date(this.year,11,31)
                var diff = this.datetime.DateDiff(e_time,y_e_time)
                var e_month = new Date(e_time).getMonth()
                var m_diff = 12 - e_month + 1
                // console.log("今年是结束时间：" + 40 * (diff + m_diff) - 10)
                return 40 * (diff + m_diff) - 10
              }
              else{
                // console.log("今年不是结束时间：" + 40 * (365 + 12) - 10)
                return 40 * (365 + 12) - 10
              } 
            }
            else{
              // console.log("实现时间与结束时间不同年较晚且今年与实现时间不同年较晚：0")
              return 0
            }
          }
        }
        // 实现时间早于开始时间
        else if(this.datetime.DateDiff(s_time,a_time) < 0){
          if(a_time.getFullYear() == s_time.getFullYear() && this.year == s_time.getFullYear()){
            var diff = this.datetime.DateDiff(a_time,s_time) + 1
            var s_month = new Date(s_time).getMonth()
            var a_month = new Date(a_time).getMonth()
            var m_diff = s_month - a_month
            // console.log("实现时间与开始时间同年较早且今年是开始时间：" + 40 * (diff + m_diff))
            return  40 * (diff + m_diff)
          }
          else{
            if(a_time.getFullYear() == s_time.getFullYear()){
              // console.log("实现时间与开始时间同年较早且今年不是开始时间：0")
              return 0
            }
            else if(this.year == a_time.getFullYear()){
              var y_e_time = new Date(this.year,11,31)
              var diff = this.datetime.DateDiff(a_time,y_e_time)
              var a_month = new Date(a_month).getMonth()
              var m_diff =  11 - a_month
              // console.log("实现时间与开始时间不同年较早且今年是实现时间：" + 40 * (diff + m_diff) -5)
              return 40 * (diff + m_diff) -5;
            }
            else{
              // console.log("实现时间与开始时间不同年较早且今年不是实现时间：" + 40 * (365 + 12) -10)
              return 40 * (365 + 12) -10
            }
          }
        }
        else return 0
      },
      getItemPosition: function(item){
        var y_s_time = new Date(this.year,0,1)
        var s_time = new Date(item.start_time)
        var e_time = new Date(item.end_time)
        if(e_time.getFullYear() == s_time.getFullYear() && this.year == s_time.getFullYear()){
          var month = s_time.getMonth() + 1
          var diff = this.datetime.DateDiff(y_s_time,s_time)
          // console.log(item.goal_title + ':' + diff)
          return 40 * (diff + month) + 31 + 'px'
        }
        else{
          return 30 + 'px'
        }
      },
      getOverItemPosition: function(item){
        var s_time = new Date(item.start_time)
        var e_time = new Date(item.end_time)
        var a_time = new Date(item.achieve_time)
        if(this.datetime.DateDiff(s_time,a_time) < 0){
          return -(this.getOverItemWidth(item)) + 5 + 'px'
        }
        else {
          if(this.datetime.DateDiff(e_time,a_time) < 0){
            var diff = this.datetime.DateDiff(s_time,a_time)
            return diff * 40 + 5 + 'px'
          }
          else {
            return this.getItemWidth(item) + 5 + 'px'
          }
        }
      },
      checkYear: function(){
        if(this.year == new Date().getFullYear()){
          return true
        }
        else {
          return false
        }
      },
      checkTimeOut: function(time,c_time){
        var _c_time = new Date(c_time)
        var _time = new Date(time)
        var diff = this.datetime.DateDiff(_time,_c_time)
        return (diff >= 0) ? true : false
      },
      checkToday: function(_month,_days){
        var now = new Date()
        var year = now.getFullYear()
        var month = now.getMonth() + 1
        var days = now.getDate()
        if(year == this.year && month == _month && days == _days){  
          return true
        }
        else return false
      },
      scrollLeft: function(){
        var _this = this
        clearInterval(this.timer)
        this.$nextTick(function () {
          _this.timer = setInterval(function() {
            if(_this.$refs.calendar_x_el.scrollLeft <= 0){
              clearInterval(_this.timer)
            }
            _this.$refs.calendar_x_el.scrollBy(-2,0)
          }, 2)
        })
      },
      scrollRight: function(){
        var _this = this
        clearInterval(this.timer)
        this.$nextTick(function () {
          _this.timer = setInterval(function() {
            if(_this.$refs.calendar_x_el.scrollLeft >= _this.$refs.calendar_x_el.scrollWidth){
              clearInterval(_this.timer)
            }
            _this.$refs.calendar_x_el.scrollBy(2,0)
          }, 2)
        })
      },
      mouseup: function(){
        clearInterval(this.timer)
      },
      mouseover: function(){
        clearInterval(this.timer)
      },
      prevYear: function(){
        this.year--
        this.$nextTick(function(){
          this.$refs.calendar_x_el.scroll(15000,0)
        })
      },
      nextYear: function(){
        this.year++
        this.$nextTick(function(){
          this.$refs.calendar_x_el.scroll(0,0)
        })
      }
    },
    components: {
      GoalPop
    }
  };
</script>

<style>
  #calendar{
    width: 100%;
    height: 100%;
    /*position: relative;*/
  }
  #calendar .sidebar-nav{
    position: absolute;
    z-index: 60;
    left: 0px;
    top: 0px;
    bottom: 0px;
    width: 200px;
    box-shadow: 0px 0px 2px 0 #b6a8a2;
    background-color: #fefefe;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    overflow: hidden;
  }
  #calendar .sidebar-nav .head{
    height: 60px;
    line-height: 60px;
    color: #927a7a;
    box-shadow: 0px 0px 2px 0 #b6a8a2;
    font-weight: 800;
    text-align: left;
    padding: 0 20px;
    font-size: 13px;
    cursor: default;
  }
  #calendar .sidebar-nav .head .glyphicon{
    margin-right: 5px;
  }
  #calendar .sidebar-nav .head .color-info-panel{
    display: inline-block;
    vertical-align: middle;
    height: 60px;
    line-height: 60px;    
    font-size: 0px;
    float: right;
  }
  #calendar .sidebar-nav .head .color-info-panel span{
    display: inline-block;
    vertical-align: middle;
    height: 8px;
    width: 8px;
    margin: 0 4px;
    cursor: pointer;
    border-radius: 10px;
    position: relative;
  }
  #calendar .sidebar-nav .head .color-info-panel span.red{
    background-color: #c75151;
  }
  #calendar .sidebar-nav .head .color-info-panel span.green{
    background-color: #5cb85c;
  }
  #calendar .sidebar-nav .head .color-info-panel span.blue{
    background-color: #468bc7;
  }
  #calendar .sidebar-nav .head .color-info-panel span div.pop-box{
    position: absolute;
    line-height: 28px;
    width: 65px;
    padding: 0 4px;
    bottom: -40px;
    left: -40px;
    color: #fff;
    background-color: #444;
    border-radius: 4px;
    font-size: 12px;
    z-index: 999;
    display: none
  }
  #calendar .sidebar-nav .head .color-info-panel span div.pop-box p{
    text-align: center;
  }
  #calendar .sidebar-nav .head .color-info-panel span:hover > div.pop-box{
    display: inline-block;
  }

  #calendar .sidebar-nav .goals-list-box{
    height: calc(100% - 60px);
  }
  #calendar .sidebar-nav .goals-list-box ul{
    list-style: none;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 5px 0px;
    text-align: left;
  }
  #calendar .sidebar-nav .goals-list-box ul li{
    position: relative;
    margin: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 10px 20px 10px 10px;
    height: 40px;
    cursor: pointer;
    color: #8b8b8b;
  }
  #calendar .sidebar-nav .goals-list-box ul li:hover {
    background-color: #f6f6f6;
  }
  #calendar .sidebar-nav .goals-list-box ul li:hover>.icon-delete{
    display: block;
  }
  #calendar .sidebar-nav .goals-list-box ul li .icon-delete{
    display: none;
    position: absolute;
    font-size: 15px;
    width: 15px;
    height: 15px;
    line-height: 16px;
    color: #e89797;
    top: 11px;
    right: 7px;
  }
  #calendar .sidebar-nav .goals-list-box ul li p{
    line-height: 20px;
    height: 20px;
    font-size: 12px;
    max-width: 70%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap; 
  }
  #calendar .sidebar-nav .goals-list-box ul li p a{
    color: #8b8b8b;
    width: 100%;
    display: inline-block;
  }
  #calendar .sidebar-nav .goals-list-box ul li p a:hover{
    text-decoration: none;
  }
  #calendar .sidebar-nav .goals-list-box ul li p .icon-select{
    height: 18px;
    width: 18px;
    margin-right: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    color: #ff9e9e;
    user-select:none;
  }
  #calendar .sidebar-nav .goals-list-box ul .new-goal{
    height: 40px;
    margin: 5px 10px;
    padding: 10px 20px;
    font-size: 12px;
    color: #dba6a6;
    cursor: pointer;
  }
  #calendar .sidebar-nav .goals-list-box ul .new-goal:hover{
    color: #dd9595;
  }
  #calendar .sidebar-nav .goals-list-box ul .new-goal .icon-add{
    margin-right: 5px;
  }


  #calendar .calendar-box{
    position: absolute;
    left: 200px;
    top: 0px;
    bottom: 0px;
    width: calc(100% - 200px);
    z-index: 11;
  }
  #calendar .calendar-box .option-nav{
    height: 30px;
    line-height: 30px;
    width: 100%;
  }
  #calendar .calendar-box .option-nav .year-span{
    margin: 0 auto;
    font-size: 12px;
    color: #777;
    text-align: center;
  }
  #calendar .calendar-box .date-content{
    position: absolute;
    top: 30px;
    left: 0;
    right: 0;
    bottom: 0;
  }  
  #calendar .calendar-box .wrap-x .wrap-y::-webkit-scrollbar {/*滚动条整体样式*/
    width: 0px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 5px;
    position: fixed;
  }
  #calendar .calendar-box .wrap-x{
    position: relative;
    width: 100%;
    height: calc(100% - 35px);
    padding-top: 35px;
    padding-bottom: 0px;
    padding-right: 0px;
    overflow-x: auto;
    overflow-y: hidden;
    box-sizing: content-box;
    z-index: 10px;
  }
  #calendar .calendar-box .wrap-x .wrap-y{
    height: calc(100% + 5px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0;
  }
  #calendar .calendar-box .wrap-x .wrap-y .item-container{
    padding: 0;
    padding-bottom: 5px;
    list-style: none;
  }
  #calendar .calendar-box .wrap-x .wrap-y .item-container .mask-panel{
    width: 100%;
    height: 40px;
    margin: 5px 0;
    box-sizing: border-box;
    cursor: default;
    background-color: transparent;
  }
  #calendar .calendar-box .wrap-x .wrap-y .item-container .mask-panel:hover{
    background-color: rgba(103, 103, 103, 0.1);
  }
  #calendar .calendar-box .wrap-x .wrap-y .item-container .mask-panel.mask-new-panel:hover{
    background-color: transparent;
  }
  #calendar .calendar-box .wrap-x .wrap-y .item-container .mask-panel .item-wrap{
    height: 100%;
    width: 100px;
    padding: 10px 5px;
    position: relative;
    left: 30px;
  }
  #calendar .calendar-box .wrap-x .wrap-y .item-container .mask-panel .item-wrap .item-content{
    height: 100%;
    width: 100%;
    display: inline-block;
    float: left;
    background-color: #468bc7;
    cursor: pointer;
  }
  #calendar .calendar-box .wrap-x .wrap-y .item-container .mask-panel .item-wrap .item-overtime-content{
    height: 100%;
    width: 100%;
    display: inline-block;
    float: left;
    background-color: #468bc7;
    cursor: pointer;
    position: absolute;
    height: 20px;
  }
  #calendar .calendar-box .wrap-x .wrap-y .item-container .mask-panel .item-wrap.achieve .un-achieve{
    display: none
  }
  #calendar .calendar-box .wrap-x .wrap-y .item-container .mask-panel .item-wrap.overtime .item-content{
    background-color: #c75151;
  }
  #calendar .calendar-box .wrap-x .wrap-y .item-container .mask-panel .item-wrap.achieve .item-content{
    background-color: #5cb85c;
  }
  #calendar .calendar-box .wrap-x .wrap-y .item-container .mask-panel .item-wrap.overtime.achieve .item-overtime-content{
    background-color: #c75151;
  }
  #calendar .calendar-box .wrap-x .wrap-y .item-container .mask-panel .item-wrap .item-content p,
  #calendar .calendar-box .wrap-x .wrap-y .item-container .mask-panel .item-wrap .item-overtime-content p{
    font-size: 12px;
    line-height: 20px;
    height: 20px;
    /*transform: calc(0.8);*/
    color: #fff;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }

  #calendar .calendar-box .head-box{
    height: 100%;
    margin-left: 30px;
    position: absolute;
    top: 0;
    z-index: -1;
  }
  #calendar .calendar-box .days-wrap{
    white-space: nowrap;
    display: inline-flex;
    height: 100%;
    border-top: 1px solid #eee;
  }
  #calendar .calendar-box .days-wrap .month-panel{
    font-size: 0px;
    height: 30px;
    line-height: 30px;
    height: 100%;
  }
  #calendar .calendar-box .days-wrap .month-panel:first-child{
    border-left: 1px solid #eee;
  }
  #calendar .calendar-box .days-wrap .day-box{
    display: inline-block;
    width: 40px;
    height: 100%;
    border-left: 1px solid #eee;
    text-align: center;
    padding: 0;
    margin: 0;
    font-size: 12px;
    user-select:none;
  }
  #calendar .calendar-box .days-wrap .day-box.title-box .day-head{
    color: #ff6969;
    font-weight: 500;
  }
  #calendar .calendar-box .days-wrap .day-box.title-box .day-path{
    background-image: url("../../assets/img/虚线.png");
    background-repeat: repeat;
  }
  #calendar .calendar-box .days-wrap .day-box:last-child{
    border-right: 1px solid #eee;
  }
  #calendar .calendar-box .days-wrap .day-box:first-child{
    border-left: none;
  }
  #calendar .calendar-box .days-wrap .day-box .day-head{
    width: 100%;
    height: 29px;
    line-height: 30px;
    color: #606060;
    border-bottom: 1px solid #eee;
    cursor: default;
  }
  #calendar .calendar-box .days-wrap .day-box .day-path{
    width: 100%;
    height: calc(100% - 30px);
  }
  #calendar .calendar-box .days-wrap .day-box.today .day-head{
    background-color: rgba(104, 167, 224);
    color: #fff;
  }
  #calendar .calendar-box .days-wrap .day-box.today .day-path{
    background-color: rgba(104, 167, 224, 0.2);
  }


  #calendar .calendar-box .left-btn,
  #calendar .calendar-box .right-btn{
    display: inline-block;
    position: absolute;
    top: 0px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 20px;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    color: #aaa;
    font-weight: 400;
    background-color: #f6f6f6;
    cursor: pointer;
    user-select:none;
    z-index: 50;
  }
  #calendar .calendar-box .left-btn{
    left: 0px;
  }
  #calendar .calendar-box .right-btn{
    right: 0px;
  }
 
</style>