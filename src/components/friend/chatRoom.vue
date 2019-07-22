<template>
  <div id="chatRoom" :class="{'male':friendInfo.friend_sex,'female':!friendInfo.friend_sex}">
    <div class="bg-color"></div>
    <div class="row">
      <div class="col-md-9">
        <div class="chatRoom-wrap">
          <div class="chatRoom-header">
            <div class="row">
              <div class="col-md-8 align-left">
                <p>
                  <i class="iconfont icon-male">&#xe659;</i>
                  <i class="iconfont icon-female">&#xe657;</i>
                  <span class="friend-name">{{friendInfo.friend_name}}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="chatRoom-body">
            <div class="chat-content" ref="chat_content_el">
              <div  v-for="(item,index) in computedChatList" :class="{'chat-item':item.type != 'date','date-item': item.type == 'date','me':item.sender_id == userInfo.user_id}">
                <p class="date-font">
                  <span>{{item.content}}</span>
                </p>
                <div class="content">
                  <div class="chat-box">
                    <p class="text-content" v-if="item.type == 'text'">
                      {{item.content}}
                    </p>
                    <div class="note-content" v-if="item.type == 'note'">
                      <a href="#" @click="toNote(item.content.note_id)">
                        <i class="iconfont icon-note">&#xe61a;</i>
                        <span>{{item.content.note_title}}</span>
                      </a>
                    </div>
                    <p class="send-time">{{getChatTime(item.send_time)}}</p>
                  </div>
                  
                  
                </div>
              </div>
            </div>
            <div class="chat-option-box">
              <div class="ipt-panel" v-if="shareItemList.length == 0">
                <input type="text" placeholder="输入聊天信息..." class="chat-ipt" v-model="msg" @keyup.enter="handleChat">
              </div>
              <div class="share-panel" v-else>
                <div class="inner-panel">
                  <p>
                    <span v-for="(item,index) in shareItemList">
                      <i class="iconfont icon-note" v-if="item.type == 'note'">&#xe61a;</i>
                      {{item.title}}
                      <i class="iconfont icon-cancel" @click="deleteShareItem(index)">&#xe614;</i>
                    </span>
                  </p>
                </div>
              </div>
              <ul class="ipt-option-list row">
                <li class="col-md-4">
                  <i class="iconfont icon-file">&#xe62d;</i>
                </li>
                <li class="col-md-4">
                  <i class="iconfont icon-emoji">&#xe658;</i>
                </li>
                <li class="col-md-4">
                  <i class="iconfont icon-send" @click="handleChat">&#xe734;</i>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="option-sidebar-wrap">
          <div class="option-sidebar-title">
            <p><i class="iconfont icon-share">&#xe61d;</i>分享列表</p>
          </div>
          <div class="option-navbar-list">
            <div class="row">
              <div 
              class="navbar-li" 
              v-for="(item,index) in shareTypeList" 
              :class="[{'on': item.type == selectedShareType},'col-md-' + 12/shareTypeList.length]" 
              @click="selectedShareType = item.type">{{item.title}}</div>
            </div>
          </div>
          <ul class="option-list" v-for="(item,index) in shareTypeList" v-if="item.type == selectedShareType" :class="item.listClass">
            <li v-if="item.type == 'note'" class="note-li" v-for="(subItem,subIndex) in noteList" :class="{'on': subItem.isSelected}">
              <div class="title-box">
                <p class="note-title">
                  <i class="iconfont icon-note">&#xe6c1;</i>
                  <i class="iconfont icon-note-open">&#xe67c;</i>
                  {{subItem.note_title}}
                </p>
                <i class="iconfont icon-share" @click="pushShareItem(subItem)">&#xe621;</i>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: [
      'userInfo',
      'friendInfo'
    ],
    data: function(){
      return {
        msg: '',
        selectedShareType: 'note',
        shareTypeList: [
          {
            'type': 'note',
            'title': '笔记',
            'listClass': 'share-note-list'
          },
          {
            'type': 'document',
            'title': '文件'
          }
        ],
        chatList: [],
        noteList: [],
        size: 15,
        shareItemList: []
      }
    },
    mounted: function(){
      this.init()
    },
    computed: {
      listenWsMsg: function(){
        return this.$store.getters['webSocket/msg']
      },
      computedChatList: function(){
        var list = this.chatList
        var last = 0
        var resArr = []
        for(let i = 0; i < list.length; i++){

          if(list[i].type == 'note'){
            list[i].content = JSON.parse(list[i].content)
          }

          let result = this.datetime.DateChatDiff(list[i].send_time,new Date())
          if(last != result.time){
            resArr.push({
              content: result.type + result.time,
              type: 'date'
            })
            last = result.time
          }
          resArr.push(list[i])
        }
        return resArr
      },
      getChatTime: function(){
        return function(time){
            return this.datetime.ChatTimeFormate(time)
        }
      }
    },
    watch: {
      chatList: {
        handler: function(){
          this.size = this.chatList.length
          if(this.size < 15){
            this.size = 15
          }
        },
        deep: true
      },
      friendInfo: {
        handler: function(){
          this.getChatList()
        },
        deep: true
      },
      listenWsMsg: {
        handler: function(val,oldVal){
          var msgData = JSON.parse(val)
          if(msgData.type == "newChat"){
            this.getChatList()
          }
        },
        deep: true
      }
    },
    methods: {
      init: function(){
        this.shareItem = ''
        this.getChatList()
        this.getUserNotes()
      },
      toNote: function(note_id){
        this.$router.push({
          path: '/note',
          query: {
            note_id: note_id
          }
        })
      },
      pushShareItem: function(item){
        if(item.hasOwnProperty('note_id')){
          let shareItem = {
            type: 'note',
            title: item.note_title,
            share_id: item.note_id
          }
          this.shareItemList.push(shareItem)
        }
      },
      deleteShareItem: function(index){
        this.shareItemList.splice(index,1)
      },
      setReadStatus: function(){
        for(let i = 0;i < this.chatList.length;i++){
          this.chatList[i].isRead = true
        }
      },
      getUserNotes: function(){
        this.$store.dispatch('note/GetUserNotes').then((res) => {
          console.log("获取用户已有的笔记列表：")
          console.log(res.data)
          this.noteList = res.data.data
          this.isAllNotes = true
        }).catch((e) => {
          console.log("error:" + e)
        })
      },
      getChatList: function(){
        let size = this.size
        let friend_id = this.friendInfo.friend_id
        this.$store.dispatch('chat/GetChatList',{size,friend_id}).then((res) => {
          console.log("获取与好友【" + this.friendInfo.friend_name + "】的聊天记录：")
          console.log(res.data)
          this.chatList = res.data.data
          this.setReadStatus()
          this.toBottom()

        }).catch((e) => {
          console.log('error:' + e)
        })
      },
      handleChat: function(){

        if(this.shareItemList.length == 0 && this.msg.length != 0){
          this.postChat(this.msg,'text')
        }
        else {
          for(let i = 0; i < this.shareItemList.length; i++){
            this.postChat(this.shareItemList[i].share_id,this.shareItemList[i].type)
          }
        }
      },
      postChat: function(content,type){
        var  chatItem = {
          'chat_id': '',
          'receiver_id': this.friendInfo.friend_id,
          'send_time': this.datetime.DateFormate(new Date()),
          'content': '',
          'type': 'text'
        }
        chatItem.content = content
        chatItem.type = type
        this.$store.dispatch('chat/HandleChat',chatItem).then((res) => {
          console.log("提交聊天信息：")
          console.log("当前发送的信息格式为：" + (type == 'text'?"文本":"笔记资源"))
          console.log(res.data)
          console.log("发起socket实时通讯，提醒对方来消息了。")
          this.overHandleChat(res.data.data)
        }).catch((e) => {
          console.log('error:' + e)
        })
      },
      overHandleChat: function(chatItem){
        let msgData = {
          "send_sid": chatItem.receiver_id,
          "type": "newChat",
          "content": chatItem.content
        }
        this.$store.dispatch('webSocket/Send',msgData)
        this.msg = ''
        this.shareItemList = []
        this.getChatList()
      },
      toBottom: function(){
        let _this = this
        this.$nextTick(function(){
          let h = _this.$refs.chat_content_el.scrollHeight
          _this.$refs.chat_content_el.scrollTop = h
        })
      }
    }
  };
</script>

<style>
  #chatRoom{
    height: 100%;
    width: 100%;
    background-color: #7088a0;
    position: relative;
  }
  #chatRoom .row{
    height: 100%;
  }
  #chatRoom .row div[class^="col-md"]{
    height: 100%;
    padding-left: 15px;
    padding-right: 0px;
  }
  #chatRoom .row div[class^="col-md"]:last-child{
    padding-right: 15px;
  }
  #chatRoom .bg-color{
    position: absolute;
    width: 100%;
    height: 70%;
    bottom: 0px;
    left: 0px;
    background-color: #ecf0f5;
  }
  #chatRoom .chatRoom-wrap{
    position: relative;
    top: 15px;
    height: calc(100% - 30px);
    width: 100%;
    background-color: #d6dbe0;
    border-radius: 4px;
    overflow: hidden;
  }
  #chatRoom .chatRoom-header{
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid rgba(0,0,0,0.07);
    background-color: #fff;
  }
  #chatRoom .chatRoom-header .row{
    margin: 0;
    height: 100%;
  }
  #chatRoom .chatRoom-header .row p{
    color: #707070;
    font-size: 14px;
    font-weight: 600;
    height: 60px;
  }
  #chatRoom .chatRoom-header .row .iconfont{
    display: none;
    margin-right: 2px;
    font-size: 30px;
  }
  #chatRoom.male .chatRoom-header .row .iconfont.icon-male{
    display: inline-block;
  }
  #chatRoom.female .chatRoom-header .row .iconfont.icon-female{
    display: inline-block;
  }
  #chatRoom .chatRoom-header .row .iconfont,
  #chatRoom .chatRoom-header .row .friend-name{
    color: #6b7987;
  }
  
  #chatRoom .chatRoom-header .row .friend-name{
    vertical-align: top;
    line-height: 60px;
    display: inline-block;
    height: 60px;
  }

  #chatRoom .chatRoom-body{
    width: 100%;
    height: calc(100% - 60px);
    float: left;
  }
  #chatRoom .chatRoom-body .chat-content{
    height: calc(100% - 60px);
    width: 100%;
    overflow-y: auto;
    padding: 20px 20px;
  }
  #chatRoom .chatRoom-body .chat-content .chat-item{
    padding: 8px 0px;
    text-align: left;
    width: 100%;
    overflow: auto; 
    font-size: 12px;
  }
  #chatRoom .chatRoom-body .chat-content .chat-item p.date-font{
    display: none;
  }
  #chatRoom .chatRoom-body .chat-content .date-item{
    padding: 10px 0 15px 0;
    margin: 30px 0;
    text-align: center;
    width: 100%;
  }
  #chatRoom .chatRoom-body .chat-content .date-item .content{
    display: none;
  }
  #chatRoom .chatRoom-body .chat-content .date-item p.date-font{
    width: 100%;
    text-align: center;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
  }
  #chatRoom .chatRoom-body .chat-content .date-item p.date-font:before,
  #chatRoom .chatRoom-body .chat-content .date-item p.date-font:after{
    content: '';
    -webkit-box-flex: 1;
    flex: 1 1 0%;
    border-top: 1px solid rgba(0,0,0,0.07);
    box-sizing: border-box;
  }
  #chatRoom .chatRoom-body .chat-content .date-item p.date-font span{
    min-width: 10px;
    display: inline-block;
    white-space: nowrap;
    vertical-align: middle;    
    padding: 2px 7px;
    font-size: 12px;
    font-weight: 500;
    color: #a5a5a5;
    background-color: #fff;
    border-radius: 12px;
    text-align: center;
  }
  #chatRoom .chatRoom-body .chat-content .chat-item .content{
    float: left;
    max-width: 60%;
  }
  #chatRoom .chatRoom-body .chat-content .chat-item.me .content{
    float: right;
  }
  #chatRoom .chatRoom-body .chat-content .chat-item .content .chat-box{
    padding: 7px 12px;
    margin-bottom: 2px;
    border-radius: 4px;
    font-size: 13px;
    line-height: 1.6em;
    color: #575757;
    text-align: left;
    background-color: #fff;
  }
  #chatRoom .chatRoom-body .chat-content .chat-item.me .content .chat-box{
    background-color: #03a9f4;
    color: #fff;
  }
  #chatRoom .chatRoom-body .chat-content .chat-item.me .content .chat-box a{
    color: #fff;
  }
  #chatRoom .chatRoom-body .chat-content .chat-item .content p.send-time{
    display: block;
    margin-top: 4px;
    font-weight: 300;
    text-align: left;
    opacity: 0.9;
  }
  #chatRoom .chatRoom-body .chat-content .chat-item.me .content p.send-time{
    text-align: right;
  }
  #chatRoom .chatRoom-body .chat-option-box{
    height: 60px;
    width: 100%;
    padding: 0 10px;
    background-color: #fff;
    font-size: 0px;
  }
  #chatRoom .chatRoom-body .chat-option-box *{
    font-size: 12px;
    vertical-align: top;
  }
  #chatRoom .chatRoom-body .chat-option-box .ipt-panel{
    height: 100%;
    width: 82%;
    padding: 15px;
    text-align: left;
    display: inline-block;
  }
  #chatRoom .chatRoom-body .chat-option-box .ipt-panel input{
    font-size: 12px;
    line-height: 24px;
    width: 100%;
    height: 100%;
    border: none;
    text-indent: 5px;
  }
  #chatRoom .chatRoom-body .chat-option-box .ipt-option-list{
    display: inline-block;
    width: 18%;
    height: 100%;
    line-height: 60px;
  }
  #chatRoom .chatRoom-body .chat-option-box .ipt-option-list li{
    padding: 0 8px;
  }
  #chatRoom .chatRoom-body .chat-option-box .ipt-option-list .iconfont{
    font-size: 18px;
    color: #7a878e;
    cursor: pointer;
    transition: all 0.2s;
    -moz-transition: all 0.2s; /* Firefox 4 */
    -webkit-transition: all 0.2s; /* Safari and Chrome */
    -o-transition: all 0.2; /* Opera */
  }
  #chatRoom .chatRoom-body .chat-option-box .ipt-option-list .iconfont:hover{
    font-size: 20px;
  }

  #chatRoom .chatRoom-body .chat-option-box .share-panel{
    height: 100%;
    width: 82%;
    padding: 10px 15px;
    display: inline-block;
    position: relative;
    text-align: left;
  }
  #chatRoom .chatRoom-body .chat-option-box .share-panel .inner-panel{
    height: 100%;
    width: 100%;
    border-radius: 2px;
    padding: 6px 0;
  }
  #chatRoom .chatRoom-body .chat-option-box .share-panel .inner-panel p{
    height: 100%;
    line-height: 40px;
    color: #fff;
  }
  #chatRoom .chatRoom-body .chat-option-box .share-panel .inner-panel p span{
    display: inline-block;
    padding: 0px 6px;
    line-height: 28px;
    background-color: #8b97a2;
    border-radius: 4px;
    position: relative;
    margin-right: 5px;
    cursor: default;
  }
  #chatRoom .chatRoom-body .chat-option-box .share-panel .inner-panel p span .iconfont{
    font-size: 14px;
  }
  #chatRoom .chatRoom-body .chat-option-box .share-panel .inner-panel p span:hover > .icon-cancel{
    display: inline-block;
  }
  #chatRoom .chatRoom-body .chat-option-box .share-panel .inner-panel p span .icon-cancel{
    display: none;
    font-size: 12px;
    line-height: 12px;
    color: red;
    position: absolute;
    right: -5px;
    top: -4px;
    cursor: pointer;
  }

  #chatRoom .option-sidebar-wrap {
    position: relative;
    top: 15px;
    width: 100%;
    height: calc(100% - 30px);
    text-align: left;
    border-radius: 4px;
    background-color: #fff;
    overflow: hidden;
  }
  #chatRoom .option-sidebar-wrap .option-sidebar-title{
    line-height: 30px;
    font-size: 13px;
    font-weight: 600;
    padding: 5px 10px;
    background-color: #fff;
    box-shadow: 0px 0px 2px #aaa;
    position: relative;
    z-index: 555;
  }
  #chatRoom .option-sidebar-wrap .option-sidebar-title p{
    color: #828282;
  }
  #chatRoom .option-sidebar-wrap .option-sidebar-title .icon-share{
    margin-right: 8px;
  }
  #chatRoom .option-sidebar-wrap .option-navbar-list{
    width: 100%;
    background-color: #eaeaea;
    box-shadow: 0px 0px 2px #bbb;
  }
  #chatRoom .option-sidebar-wrap .option-navbar-list .navbar-li{
    line-height: 28px;
    font-size: 12px;
    border-bottom: 2px solid #f7f7f7;
    background-color: #f7f7f7;
    color: #888;
    cursor: default;
    text-align: center;
  }
  #chatRoom .option-sidebar-wrap .option-navbar-list .navbar-li:hover{
    color: #999;
  }
  #chatRoom .option-sidebar-wrap .option-navbar-list .navbar-li.on{
    border-color: #25476a
  }
  #chatRoom .option-sidebar-wrap .option-navbar-list .navbar-li.on:hover{
    color: #888;
  }

  #chatRoom .option-sidebar-wrap .option-list {
    list-style: none;
  }
  #chatRoom .option-sidebar-wrap .option-list.share-note-list {
  }
  #chatRoom .option-sidebar-wrap .option-list.share-note-list li{
    padding: 5px 2px;
    cursor: default;
    border-bottom: 1px solid #eee;
  }
  #chatRoom .option-sidebar-wrap .option-list.share-note-list li:hover{
    background-color: #efefef;
  }
  #chatRoom .option-sidebar-wrap .option-list.share-note-list li:hover .icon-note{
    display: none;
  }
  #chatRoom .option-sidebar-wrap .option-list.share-note-list li:hover .icon-note-open{
    display: inline-block;
  }
  #chatRoom .option-sidebar-wrap .option-list.share-note-list li .title-box{
    width: 100%;
    font-size: 12px;
    color: #757575;
    line-height: 28px;
    position: relative;
  }
  #chatRoom .option-sidebar-wrap .option-list.share-note-list li .title-box p{
    width: 80%;
    display: inline-block;
    transform: scale(0.9);
  }
  #chatRoom .option-sidebar-wrap .option-list.share-note-list li p .iconfont{
    display: inline-block;
    margin-right: 6px;
  }
  #chatRoom .option-sidebar-wrap .option-list.share-note-list li p .icon-note-open{
    display: none;
  }
  #chatRoom .option-sidebar-wrap .option-list.share-note-list li .title-box .icon-share{
    cursor: pointer;
    color: #959595;
  }
  #chatRoom .option-sidebar-wrap .option-list.share-note-list li .title-box .icon-share:hover{
    color: #757575;
  }

</style>