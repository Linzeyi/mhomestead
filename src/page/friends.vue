<template>
  <div id="friends">
    <div class="container-fluid">
      <div class="header-wrap">
        <div class="row">
          <div class="col-md-6">
            <div class="portrait-box">
              <i class="iconfont icon-male" v-if="getSex">&#xe659;</i>
              <i class="iconfont icon-female" v-else>&#xe657;</i>
            </div>
            <div class="userinfo-box">
              <p class="user-name">{{getName}}</p>
            </div>
          </div>
          <div class="col-md-6 right-panel">
            <div class="option-wrap">
              <div class="search-input-box">
                <input type="text" placeholder="快速查找陌生人(用户名或账号)" v-model="searchPeopleVal">
              </div>
              <button class="recommend-btn" @click="getPeopleList()"><i class="iconfon icon-recommend"></i>好友推荐</button>
            </div>
          </div>
        </div>
      </div>
      <div class="body-wrap">
        <div class="sidebar-wrap">
          <div class="header-box">
            <div class="input-box">
              <input type="text" placeholder="快速查找好友(用户名或账号)" v-model="searchFriendVal">
            </div>
          </div>
          <div class="list-wrap">
            <ul class="friends-list">
              <li class="default-li">
                <p>
                  <i class="iconfont icon-friends">&#xe639;</i>好友列表
                </p>
              </li>
              <li class="friend-li" v-for="(item,index) in searchFriendsList" :class="{'male': item.friend_sex,'female': !item.friend_sex,'on': item.friend_id == currentFriend.friend_id}" @click="selectFriend(item)">
                <div class="portrait-box">
                  <i class="iconfont icon-male">&#xe659;</i>
                  <i class="iconfont icon-female">&#xe657;</i>
                </div>
                <div class="content-box">
                  <p>
                    <span class="friend-name" :title="item.friend_name">{{item.friend_name}}</span>
                    <span class="friend-account" :title="item.friend_account">({{item.friend_account}})</span>
                    <button  class="delete-btn" @click="handleDeleteFriend(item)">删除</button>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="content-wrap">
          <chat-room 
          v-if="currentFriend != '' && !isFriendsListBox"
          :userInfo="userInfo"
          :friendInfo="currentFriend"></chat-room>
          <friendsListBox 
          v-if="isFriendsListBox" 
          :peopleList="searchPeopleList"
          :recommendType="recommendType"
          :userInfo="userInfo"
          @changePeople="changePeople"
          @changeType="changeType"
          @handleAddNewFriend="handleAddNewFriend"></friendsListBox>
          <div class="default-box" v-if="currentFriend == '' && !isFriendsListBox">
            <div class="default-title">
              <p><font class="english">FREIEND</font><font class="chinese">.好友专区</font></p>
              <p class="bottom-font">点击好友推荐，看看系统给你推荐的好友吧！</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button ref="delete_friend_pop_el" class="friendPopLink" data-toggle="modal" data-target="#delete_friend_pop"></button>
    <div 
    id="delete_friend_pop" 
    class="modal fade bs-example-modal-sm" 
    tabindex="-1" 
    role="dialog" >
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">确定删除好友？</h4>
          </div>
          <div class="modal-body">
            <h3>【{{deleteFriendItem.friend_name}}】</h3>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click.stop="deleteFriend()">确定</button>
          </div>
        </div>
      </div>
    </div>

    <button ref="add_friend_pop_el" class="friendPopLink" data-toggle="modal" data-target="#add_friend_pop"></button>
    <div 
    id="add_friend_pop" 
    class="modal fade bs-example-modal-sm" 
    tabindex="-1" 
    role="dialog" >
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">是否添加好友？</h4>
          </div>
          <div class="modal-body">
            <h3>【{{newFriendItem.people_name}}】</h3>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click.stop="addNewFriend()">确定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import friendsListBox from '../components/friend/friendsListBox.vue'
  import chatRoom from '../components/friend/chatRoom.vue'

  export default{
    data: function(){
      return {
        'userInfo': {},
        'friendsList': [],
        'peopleList': [],
        'searchFriendVal': '',
        'searchPeopleVal': '',
        'currentFriend': '',
        'deleteFriendItem': {},
        'newFriendItem': {},
        'isFriendsListBox': false,
        'recommendType': 'friendNum',
      }
    },
    created: function(){
      this.getUserInfo()
      this.getUserFriends()
    },
    mounted: function(){
      
      
    },
    watch: {
      'recommendType': function(){
        this.getPeopleList()
      }
    },
    computed: {
      getSex: function(){
        return this.$store.getters['user/sex']
      },
      getName: function(){
        return this.$store.getters['user/name']
      },
      searchFriendsList: function(){
        var _this = this
        var NewItems = []
        this.friendsList.map(function(item) {
          if (item.friend_name.search(_this.searchFriendVal) != -1 || item.friend_account.search(_this.searchFriendVal) != -1) {
            NewItems.push(item)
          }
        })
        return NewItems
      },
      searchPeopleList: function(){
        var _this = this
        var NewItems = []
        this.peopleList.map(function(item) {
          if (item.people_name.search(_this.searchPeopleVal) != -1 || item.people_account.search(_this.searchPeopleVal) != -1) {
            NewItems.push(item)
          }
        })
        return NewItems
      }
    },
    methods: {
      handleAddNewFriend: function(item){
        this.newFriendItem = item
        this.$refs.add_friend_pop_el.click()
      },
      addNewFriend: function(){
        this.$store.dispatch('friend/AddNewFriend',this.newFriendItem.people_id).then((res) => {
          console.log("添加好友【" + this.newFriendItem.people_name + "】")
          console.log(res)
          this.$refs.add_friend_pop_el.click()
          this.getPeopleList()
          this.getUserFriends()
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      changeType: function(type){
        this.recommendType = type
      },
      changePeople: function(){
        this.getPeopleList()
      },
      getUserInfo: function(){
        this.$store.dispatch('user/GetUserInfo').then((res) => {
          console.log("获取用户基本信息：")
          console.log(res)
          this.userInfo = res.data.data
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      getUserFriends: function(){
        this.$store.dispatch('friend/GetUserFriends').then((res) => {
          console.log("获取用户的好友列表：")
          console.log(res)
          this.friendsList = res.data.data
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      getPeopleList: function(){
        this.$store.dispatch('friend/GetPeopleList',this.recommendType).then((res) => {
          console.log("获取推荐好友列表（陌生人）：")
          console.log("推荐条件为：" + (this.recommendType == 'friendNum'?"共同好友数量":"共同兴趣爱好"))
          console.log(res)
          this.peopleList = res.data.data
          this.isFriendsListBox = true
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      selectFriend: function(item){
        this.currentFriend = item
        this.isFriendsListBox = false
      },
      handleDeleteFriend: function(item){
        this.deleteFriendItem = item
        this.$refs.delete_friend_pop_el.click()
      },
      deleteFriend: function(){
        this.$store.dispatch('friend/DeleteFriend',this.deleteFriendItem.friend_id).then((res) => {
          console.log("删除好友【" + this.deleteFriendItem.friend_name + "】")
          console.log(res.data)
          this.getUserInfo()
          if(this.isFriendsListBox){
            this.getPeopleList()
          }
          if(this.currentFriend.friend_id == this.deleteFriendItem.friend_id){
            this.currentFriend = ''
          }
          this.getUserFriends()
          this.$refs.delete_friend_pop_el.click()
        }).catch((e) => {
          console.log("error:" + e)
        })
      }
    },
    components: {
      friendsListBox,
      chatRoom
    }
  };
</script>

<style>
  #friends{
    background-image: url("../assets/img/bg-14.jpg");
    background-size: 100%;
    background-position:50% 20%;
    height: calc(100% - 70px);
    width: 100%;
  }
  #friends:after{
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    background-color: black;
    opacity: 0.45;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
  #friends .container-fluid{
    height: 95%;
    top: 15px;
    width: 94%;
    position: relative;
    box-shadow: 0px 0px 15px 0px #2f1623;
    border-radius: 4px;
    padding: 0;
    z-index: 2;
    overflow: hidden;
    transition: all 0.3s;
    -moz-transition: all 0.3s; /* Firefox 4 */
    -webkit-transition: all 0.3s; /* Safari 和 Chrome */
    -o-transition: all 0.3s; /* Opera */
  }
  #friends .container-fluid .header-wrap{
    min-height: 80px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0px 1px 2px #cccccc;
    position: relative;
    z-index: 10;
  }
  #friends .container-fluid .header-wrap .row{
    margin: 0;
    text-align: left;
    height: 100%;
  }
  #friends .container-fluid .header-wrap .row .portrait-box{
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    line-height: 35px;
    margin: 0 6px;
    display: inline-block;
    text-align: center;
    border: 3px solid #fff;
    border-radius: 4px;
  }
  #friends .container-fluid .header-wrap .row .portrait-box .iconfont{
    height: 100%;
    width: 100%;
    font-size: 32px;
    color: #fff;
    background-color: #6783ad;
    border-radius: 4px;
  }
  #friends .container-fluid .header-wrap .row .userinfo-box{
    display: inline-block;
    vertical-align: top;
    height: 40px;
    line-height: 40px;
    width: calc(100% - 70px);
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  #friends .container-fluid .header-wrap .row .userinfo-box .user-name{
    font-size: 22px;
    font-weight: 600;
    color: #6783ad;
  }
  #friends .container-fluid .header-wrap .row .right-panel .option-wrap{
    width: 100%;
    height: 40px;
    text-align: right;
  }
  #friends .container-fluid .header-wrap .row .right-panel .option-wrap .search-input-box{
    width: 50%;
    height: 100%;
    padding: 0px 20px;
    display: inline-block;
  }
  #friends .container-fluid .header-wrap .row .right-panel .option-wrap .search-input-box input{
    width: 100%;
    height: 36px;
    margin: 2px 0;
    text-indent: 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 12px;
    background-color: #fff;
  }
  #friends .container-fluid .header-wrap .row .right-panel .option-wrap .search-input-box input:focus{
    border-color: #aaa;
  }
  #friends .container-fluid .header-wrap .row .right-panel .option-wrap button{
    display: inline-block;
    vertical-align: top;
    margin: 2px 0;
    height: 36px;
    font-size: 12px;
    padding: 0 15px;
    background-color: #ca6262;
    border-radius: 4px;
    border: none;
    color: #fff;
    box-shadow: 0px 1px 3px 0px #824242;
    transition: all 0.3s;
    -moz-transition: all 0.3s; /* Firefox 4 */
    -webkit-transition: all 0.3s; /* Safari 和 Chrome */
    -o-transition: all 0.3s; /* Opera */
  }
  #friends .container-fluid .header-wrap .row .right-panel .option-wrap button:hover{
    background-color: #c35a5a;
    box-shadow: 0px 1px 4px 0px #562929;
  }
  #friends .container-fluid .header-wrap .row .right-panel .option-wrap button:active{
    background-color: #b74646;
    box-shadow: 0px 2px 4px 0px #2d0e0e;
  }


  #friends .container-fluid .body-wrap{
    position: relative;
    height: calc(100% - 80px);
    width: 100%;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap{
    position: absolute;
    left: 0;
    width: 210px;
    height: 100%;
    box-sizing: border-box;
    z-index: 9;
    box-shadow: 0 1px 1px #aaa;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .header-box{
    height: 80px;
    padding: 20px 25px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
  }
  #friends.male .container-fluid .body-wrap .sidebar-wrap .header-box{
    background-color: #8394ad;
  }
  #friends.female .container-fluid .body-wrap .sidebar-wrap .header-box{
    background-color: #ecafaf;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .header-box .input-box{
    height: 40px;
    width: 100%;
    line-height: 40px;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .header-box .input-box input{
    height: 100%;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-indent: 8px;
    background-color: #fff;
    font-size: 12px;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .header-box .input-box input:focus{
    border-color: #ccc;
  }
  #friends.male .container-fluid .body-wrap .sidebar-wrap .header-box .input-box input{
    color: #6783ad;
  }
  #friends.female .container-fluid .body-wrap .sidebar-wrap .header-box .input-box input{
    color: #da6b6b;
  }

  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap{
    height: calc(100% - 80px);
    width: 100%;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap{
    background-color: #fff;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap .friends-list{
    height: 100%;
    overflow-y: auto;
    width: 100%;
    list-style-type: none;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap .friends-list li{
    height: 48px;
    width: 100%;
    padding: 0px 15px;
    text-align: left;
    position: relative;
    cursor: default;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap .friends-list li.on{
    background-color: #f5f5f5;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap .friends-list li.friend-li:hover{
    background-color: #eaeaea; 
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap .friends-list li.friend-li:hover>.content-box p button.delete-btn{
    display: inline-block;
  }

  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap .friends-list li.default-li p{
    border-bottom: 1px solid #eee;
    height: 46px;
    line-height: 50px;
    color: #999;
    font-size: 12px;
    user-select: none;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap .friends-list li.default-li .icon-friends{
    font-size: 18px;
    display: inline-block;
    height: 100%;
    width: 34px;
    text-align: center;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap .friends-list li .portrait-box{
    height: 100%;
    width: 30px;
    display: inline-block;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap .friends-list li .portrait-box .iconfont{
    height: 100%;
    width: 30px;
    text-align: center;
    line-height: 48px;
    font-size: 22px;
    display: none;
    user-select: none;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap .friends-list li.male .portrait-box .iconfont.icon-male{
    display: inline-block;
    color: #6683ad;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap .friends-list li.female .portrait-box .iconfont.icon-female{
    display: inline-block;
    color: #da6b6b;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap .friends-list li .content-box {
    display: inline-block;
    width: calc(100% - 34px);
    height: 100%;
    vertical-align: top;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap .friends-list li .content-box p{
    height: 100%;
    line-height: 48px;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap .friends-list li .content-box p span.friend-name{
    font-weight: 600;
    font-size: 13px;
    color: #808080;
    display: inline-block;
    max-width: 100px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap .friends-list li .content-box p span.friend-account{
    font-weight: 400;
    font-size: 12px;
    color: #a1a1a1;
    display: inline-block;
    max-width: 70px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  #friends .container-fluid .body-wrap .sidebar-wrap .list-wrap .friends-list li .content-box p button.delete-btn{
    display: none;
    position: absolute;
    height: 26px;
    width: 46px;
    line-height: 26px;
    color: #fff;
    border-radius: 4px;
    font-size: 12px;
    top: 11px;
    right: 10px;
    background-color: #da6b6b;
    border: none;
  }



  #friends .container-fluid .body-wrap .content-wrap{
    position: absolute;
    left: 210px;
    width: calc(100% - 210px);
    height: 100%;
    background-color: #fff;
  }
  #friends .container-fluid .body-wrap .content-wrap .default-box{
    width: 100%;
    height: 100%;
    background-color: #eee;
    text-align: center;
    position: relative;
    padding: 0 40px;
  }
  #friends .container-fluid .body-wrap .content-wrap .default-box .default-title{
    display: inline-block;
    position: absolute;
    top: 50%; 
    left: 0;
    width: 100%;
    margin-top: -100px;
    vertical-align: top;
    height: 200px;
    z-index: 2;
    user-select: none;
    padding: 0 40px;
  }
  #friends .container-fluid .body-wrap .content-wrap .default-box .default-title p{
    color: #adadaf;
    border-bottom: 1px solid #ddd;
    font-weight: 600;
  }
  #friends .container-fluid .body-wrap .content-wrap .default-box .default-title p .english{
    font-size: 60px;
    line-height: 80px;
  }
  #friends .container-fluid .body-wrap .content-wrap .default-box .default-title p .chinese{
    font-size: 34px;
    line-height: 75px;
  }
  #friends .container-fluid .body-wrap .content-wrap .default-box .default-title p.bottom-font{
    color: #ccc;
    border: none;
    line-height: 56px;
    font-size: 20px;
    font-weight: 400;
  }

  #friends .friendPopLink{
    position: absolute;
    opacity: 0;
    top: -100px;
  }
  #friends #delete_friend_pop,
  #friends #add_friend_pop{
    top: 70px;
  }
  #friends .container-fluid input::-webkit-input-placeholder { /* WebKit browsers */
    color: #d1d1d1;
  }
  #friends .container-fluid input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #d1d1d1;
  }
  #friends .container-fluid input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #d1d1d1;
  }
  #friends .container-fluid input:-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #d1d1d1;
  }


</style>