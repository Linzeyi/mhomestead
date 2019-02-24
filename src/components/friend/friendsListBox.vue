<template>
  <div id="friendsListBox">
    <div class="friendsList-header">
      <div class="row">
        <div class="col-md-8 right-panel">
          <p>
            <i class="iconfont icon-people">&#xe6c3;</i>推荐列表
            <span class="type-font" v-if="recommendType == 'friendNum'">（共同好友）</span>
            <span class="type-font" v-if="recommendType == 'interest'">（共同兴趣）</span>
            <span class="my-interest" v-if="recommendType == 'interest'">我的兴趣：{{userInfo.interest}}</span></p>
        </div>
        <div class="col-md-4 icon-group">
          <p>
            <span class="group-title">推荐条件:</span>
            <span 
            class="group-icon" 
            v-for="(typeItem,typeIndex) in selectTypeArr" 
            :class="[typeItem.class,typeItem.class == recommendType?'active':'']"
            @click="selectType(typeItem)">{{typeItem.name}}</span>
            <button class="change-btn" @click="changePeople"><i class="iconfont icon-change">&#xe616;</i>换一批</button>
          </p>
        </div>
      </div>
    </div>
    <div class="friendsList-body">
      <div class="row" v-for="rowIndex in objGroupNum">
        <div class="col-md-2" v-for="(item,index) in rowObjGroup(rowIndex)" >
          <div class="item-box" :class="{'male': item.people_sex,'female': !item.people_sex}">
            <div class="portrait-box">
              <i class="iconfont icon-male">&#xe659;</i>
              <i class="iconfont icon-female">&#xe657;</i>
            </div>
            <p class="name">{{item.people_name}}</p>
            <p class="num" v-if="recommendType == 'friendNum'">{{item.weight}}位共同好友</p>
            <p class="interest" v-if="recommendType == 'interest'">
              <span class="interest-item" v-for="interest in item.people_interest">{{interest}}</span>
            </p>
            <p class="btn-p">
              <button class="addFriend-btn" @click="handleAddNewFriend(item)">添加好友</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  export default{
    props: [
      'userInfo',
      'peopleList',
      'recommendType'
    ],
    data: function(){
      return {
        'selectTypeArr':[
          {
            name: '友',
            content: '共同好友',
            class: 'friendNum'
          },
          {
            name: '趣',
            content: '共同兴趣',
            class: 'interest'
          }
        ]
      }
    },
    computed: {
      objGroupNum: function(){
        if (this.peopleList.length == 0) {
          return 1
        }
        else {
          if(this.peopleList.length % 6 != 0){
            return parseInt(this.peopleList.length / 6) + 1
          }
          else{
            return parseInt(this.peopleList.length / 6)
          }
        }
      },
      rowObjGroup: function(){
        return function (rowIndex) {
          var array = Object.assign([], this.peopleList)
          console.log(rowIndex)
          return array.slice((rowIndex - 1) * 6,rowIndex * 6)
        }
      }
    },
    methods: {
      selectType: function(item){
        for(let i = 0;i< this.selectTypeArr.length;i++){
          this.selectTypeArr[i].is_selected = 0
        }
        item.is_selected = 1
        this.$emit('changeType',item.class)
      },  
      changePeople: function(){
        this.$emit('changePeople')
      },
      handleAddNewFriend: function(item){
        this.$emit('handleAddNewFriend',item)
      }
    }
  }
</script>

<style>
  #friendsListBox{
    width: 100%;
    height: 100%;
  }
  #friendsListBox .friendsList-header{
    height: 80px;
    border-bottom: 1px solid #eee;
  }
  #friendsListBox .friendsList-header .row{
    margin: 0;
    height: 100%;
  }
  #friendsListBox .friendsList-header .row .right-panel{
    text-align: left;
  }
  #friendsListBox .friendsList-header .row .right-panel p{
    color: #707070;
    font-size: 25px;
    line-height: 80px;
    font-weight: 600;
  }
  #friendsListBox .friendsList-header .row .right-panel p .iconfont{
    margin-left: 15px;
    margin-right: 8px;
  }
  #friendsListBox .friendsList-header .row .right-panel p .type-font{
    font-size: 16px;
    vertical-align: top;
    display: inline-block;
    line-height: 85px;
    height: 80px;
    color: #d16969;
  }
  #friendsListBox .friendsList-header .row .right-panel p .my-interest{
    display: inline-block;
    width: 60%;
    font-size: 14px;
    color: #999;
    font-weight: 500;
    line-height: 85px;
    height: 80px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    vertical-align: top;
  }

  #friendsListBox .friendsList-header .row .icon-group p{
    text-align: right;
    padding: 0 25px;
    line-height: 80px;
    color: #777;
    font-size: 14px;
    font-weight: 500;
  }
  #friendsListBox .friendsList-header .row .icon-group p span.group-title{
    margin-right: 5px;
  }
  #friendsListBox .friendsList-header .row .icon-group p span.group-icon{
    height: 30px;
    width: 30px;
    border-radius: 5px;
    display: inline-block;
    line-height: 26px;
    margin: 0 2px;  
    border: 2px solid #888;
    text-align: center;
    font-size: 12px;
    color: #777;
    cursor: pointer;
  }
  #friendsListBox .friendsList-header .row .icon-group p span.group-icon.active{
    border-color: #da6b6b;
    color: #da6b6b;
  }
  #friendsListBox .friendsList-header .row .icon-group p .change-btn{
    display: inline-block;
    height: 38px;
    line-height: 25px;
    width: 100px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    color: #fff;
    margin-left: 10px;
    transition: all 0.3s;
    -moz-transition: all 0.3s; /* Firefox 4 */
    -webkit-transition: all 0.3s; /* Safari 和 Chrome */
    -o-transition: all 0.3s; /* Opera */
    background-color: #ca6262;
    box-shadow: 0px 1px 2px 0px #824242;
  }
  #friendsListBox .friendsList-header .row .icon-group p .change-btn:hover{
    background-color: #c35a5a;
    box-shadow: 0px 1px 3px 0px #562929;
  }
  #friendsListBox .friendsList-header .row .icon-group p .change-btn:active{
    background-color: #b74646;
    box-shadow: 0px 1px 4px 0px #2d0e0e;
  }
  #friendsListBox .friendsList-header .row .icon-group p .change-btn .icon-change{
    margin-right: 5px;
    display: inline-block;
    font-size: 20px;
    position: relative;
    top: 3px;
    font-weight: 500;
  }



  #friendsListBox .friendsList-body{
    width: 100%;
    height: calc(100% - 80px);
    overflow-y: auto;
    padding: 15px 0 0;
  }
  #friendsListBox .friendsList-body .row{
    margin: 0;
    padding: 10px 20px;
  }
  #friendsListBox .friendsList-body .row .col-md-2{
    padding: 0px 15px;
  }
  #friendsListBox .friendsList-body .row .item-box{
    background-color: #fff;
    border: 1px solid #e7e7e7;
    border-radius: 4px;
    padding: 15px 0px;
  }
  #friendsListBox .friendsList-body .row .item-box .portrait-box{
    height: 50px;
    width: 50px;
    line-height: 50px;
    margin: 0 auto;
  }
  #friendsListBox .friendsList-body .row .item-box .portrait-box .iconfont{
    font-size: 40px;
    display: none;  
    margin: 0 auto;
  }
  #friendsListBox .friendsList-body .row .item-box.male .portrait-box .icon-male{
    display: inline-block;
    color: #6783ad;
  }
  #friendsListBox .friendsList-body .row .item-box.female .portrait-box .icon-female{
    display: inline-block;
    color: #da6b6b;
  }
  #friendsListBox .friendsList-body .row .item-box p{
    
    
  }
  #friendsListBox .friendsList-body .row .item-box p.account{
    font-size: 12px;
    color: #999;
    height: 26px;
    line-height: 26px;
  }
  #friendsListBox .friendsList-body .row .item-box p.name{
    font-size: 13px;
    font-weight: 500;
    color: #777;
    height: 28px;
    line-height: 28px;
  }
  #friendsListBox .friendsList-body .row .item-box p.num{
    font-size: 12px;
    color: #999;
    height: 26px;
    line-height: 26px;
  }
  #friendsListBox .friendsList-body .row .item-box p.interest{
    min-height: 30px;
    width: 100%;
    font-size: 12px;
    color: #999;
    padding: 0 4px;
  }
  #friendsListBox .friendsList-body .row .item-box p.interest .interest-item{
    padding: 0px 6px;
    height: 28px;
    line-height: 28px;
    border: none;
    background-color: #e8e8e8;
    margin: 4px 2px;
    display: inline-block;
    vertical-align: top;
  }
  #friendsListBox .friendsList-body .row .item-box p.btn-p{
    height: 50px;
    padding: 10px 0;
  }
  #friendsListBox .friendsList-body .row .item-box p.btn-p .addFriend-btn{
    height: 30px;
    line-height: 30px;
    width: 70px;
    font-size: 12px;
    border-radius: 4px;
    border: none;
    color: #fff;
    transition: all 0.3s;
    -moz-transition: all 0.3s; /* Firefox 4 */
    -webkit-transition: all 0.3s; /* Safari 和 Chrome */
    -o-transition: all 0.3s; /* Opera */
  }
  #friendsListBox .friendsList-body .row .item-box.male p.btn-p .addFriend-btn{
    background-color: #6783ad;
    box-shadow: 0px 1px 2px 0px #375786;
  }
  #friendsListBox .friendsList-body .row .item-box.male p.btn-p .addFriend-btn:hover{
    background-color: #5072a5;
    box-shadow: 0px 1px 3px 0px #1d2f4a;
  }
  #friendsListBox .friendsList-body .row .item-box.male p.btn-p .addFriend-btn:active{
    background-color: #3d5b88;
    box-shadow: 0px 1px 4px 0px #1a2b46;
  }
  #friendsListBox .friendsList-body .row .item-box.female p.btn-p .addFriend-btn{
    background-color: #ca6262;
    box-shadow: 0px 1px 2px 0px #824242;
  }
  #friendsListBox .friendsList-body .row .item-box.female p.btn-p .addFriend-btn:hover{
    background-color: #c35a5a;
    box-shadow: 0px 1px 3px 0px #562929;
  }
  #friendsListBox .friendsList-body .row .item-box.female p.btn-p .addFriend-btn:active{
    background-color: #b74646;
    box-shadow: 0px 1px 4px 0px #2d0e0e;
  }

</style>