<template>
  <div class="modal fade" id="path_pop" tabindex="-1" role="dialog" aria-labelledby="PathPopTitle">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="PathPopTitle">路线详情编辑</h4>
        </div>
        <div class="modal-body">
          <div class="modal-panel title-panel">
            <span class="title-content">
              路线主题：
            </span>
            <div class="input-content">
              <input class="plc-color" :class="{'error': error != ''}" type="text" placeholder="定义目标名称" v-model="pathTitle">
              <span class="error-font" v-if="error != ''">{{error}}</span>
            </div>
          </div>
          <div class="modal-panel">
            <span class="title-content">
              路线描述：
            </span>
            <div class="area-content">
              <textarea class="plc-color form-control" rows="3" placeholder="添加路线描述" v-model="pathDetail"></textarea>
            </div>
          </div>
          <div class="modal-panel">
            <span class="title-content">
              是否紧急：
            </span>
            <div class="select-content">
              <div class="switch-box" :class="{'hurry':hurryStatus}">
                <div class="circle"></div>
                <p>
                  <span class="common" @click="switchStatus(0)"></span>
                  <span class="hurry" @click="switchStatus(1)"></span>
                </p>
              </div>
              <span class="switch-font">
                <font class="hurry" v-if="hurryStatus">紧急</font>  
                <font class="common" v-else>正常</font>  
              </span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updatePath()">修改</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    props: [
      'currentPath'
    ],
    data: function(){
      return {
        'hurryStatus': false,
        'error': '',
        'pathTitle': '',
        'pathDetail': ''
      }
    },
    watch: {
      'currentPath.path_id': function(){
        this.pathTitle = this.currentPath.path_title
        this.pathDetail = this.currentPath.path_detail
        this.hurryStatus = this.currentPath.is_hurry
      }
    },
    created: function(){

    },  
    methods: {
      updatePath:function(){
        let path = {
          path_title: this.pathTitle,
          path_detail: this.pathDetail,
          is_hurry: this.hurryStatus
        }
        this.$emit('handleUpdatePath',path)
      },
      switchStatus: function(flag){
        if(flag){
          this.hurryStatus = true
        }
        else {
          this.hurryStatus = false
        }
      }
    }
  }
</script>

<style>
  #path_pop{
    text-align: left;
    z-index: 10;
    position: relative;
    height: 100%;
    overflow-y: auto;
  } 
  #path_pop.in{
    z-index: 100;
  }
  #path_pop .modal-body .modal-panel{
    padding: 8px 10px;
    margin: 8px 0;
  }
  #path_pop .modal-body .modal-panel p{
    line-height: 30px;
  }
  #path_pop .modal-body .modal-panel .title-content{
    font-size: 14px;
    font-weight: 600;
    color: #555;
    display: inline-block;
    width: 80px;
    text-align: right;
  }
  #path_pop .modal-body .modal-panel .input-content{
    display: inline-block;
    width: calc(100% - 100px);
    line-height: 30px;
  }
  #path_pop .modal-body .modal-panel .input-content input{
    border-radius: 2px;
    border: 1px solid #ddd;
    width: 60%;
    text-indent: 10px;
    font-size: 13px;
    color: #444;
  }
  #path_pop .modal-body .modal-panel .input-content input.error{
    border-color: #d9534f;
  }
  #path_pop .modal-body .modal-panel .area-content{
    display: inline-block;
    width: calc(100% - 100px);
    vertical-align: top;
  }
  #path_pop .modal-body .modal-panel .area-content textarea{
    border: 1px solid #ddd;
    border-radius: 2px;
    box-shadow: none;
    color: #444;
    font-size: 13px;
    resize: none;
  }
  #path_pop .modal-body .modal-panel .select-content{
    display: inline-block;
    width: calc(100% - 100px);
    vertical-align: top;
    font-size: 13px;
    margin-bottom: 20px;
  }
  #path_pop .modal-body .modal-panel .select-content .switch-box{
    position: relative;
    width: 48px;
    height: 15px;
    vertical-align: middle;
    border: 1px solid #ddd;
    border-radius: 10px;
    display: inline-block;
  }
  #path_pop .modal-body .modal-panel .select-content .switch-box .circle{
    position: absolute;
    width: 28px;
    height: 28px;
    top: -8px;
    left: -2px;
    border: 1px solid #ddd;
    border-radius: 50px;
    background-color: #fff;
    transition: all 0.2s;
    -moz-transition: all 0.2s; /* Firefox 4 */
    -webkit-transition: all 0.2s; /* Safari 和 Chrome */
    -o-transition: all 0.2s; /* Opera */
  }
  #path_pop .modal-body .modal-panel .select-content .switch-box.hurry{
    /*border-color: #a52626;*/
  }
  #path_pop .modal-body .modal-panel .select-content .switch-box.hurry .circle{
    left: 20px;
    /*border-color: #a52626;*/
  }
  #path_pop .modal-body .modal-panel .select-content .switch-box p{
    width: 0px;
    height: 100%;
    line-height: 15px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    font-size: 0px;
    overflow: hidden;
    background-color: #b96262;
    transition: all 0.3s;
    -moz-transition: all 0.3s; /* Firefox 4 */
    -webkit-transition: all 0.3s; /* Safari 和 Chrome */
    -o-transition: all 0.3s; /* Opera */
  }
  #path_pop .modal-body .modal-panel .select-content .switch-box.hurry p{
    width: 50%;
  }
  #path_pop .modal-body .modal-panel .select-content .switch-box p span{
    display: inline-block;
    height: 100%;
    width: 50%;
    cursor: pointer;
    position: absolute;
  }
  #path_pop .modal-body .modal-panel .select-content .switch-box p span.common{
    left: 0px;
  }
  #path_pop .modal-body .modal-panel .select-content .switch-box p span.hurry{
    right: 0;
  }
  #path_pop .modal-body .modal-panel .select-content .switch-font{
    display: inline-block;
    margin-left: 4px;
    vertical-align: middle;
    font-size: 12px;
    height: 15px;
    line-height: 15px;
    font-weight: 500;
    color: #aaa;
  }
  #path_pop .modal-body .modal-panel .select-content .switch-font .hurry{
    color: #b96262;
  }
  #path_pop .modal-body .modal-panel .error-font{
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