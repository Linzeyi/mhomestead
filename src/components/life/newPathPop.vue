<template>
  <div class="modal fade" id="new_path_pop" tabindex="-1" role="dialog" aria-labelledby="newPathTitle">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="newPathTitle">新的规划路线</h4>
        </div>
        <div class="modal-body">
          <div class="modal-panel title-panel">
            <span class="title-content">
              路线主题：
            </span>
            <div class="input-content">
              <input class="plc-color" :class="{'error': error != ''}" type="text" placeholder="定义目标名称" v-model="newPathObj.path_title">
              <span class="error-font" v-if="error != ''">{{error}}</span>
            </div>
          </div>
          <div class="modal-panel">
            <span class="title-content">
              路线描述：
            </span>
            <div class="area-content">
              <textarea class="plc-color form-control" rows="3" placeholder="添加路线描述" v-model="newPathObj.path_detail"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="addNewPath()">提交</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data: function(){
      return {
        newPathObj: {
          'path_title': '',
          'path_detail': ''
        },
        error: ''
      }
    },
    methods: {
      addNewPath: function(){
        if(this.newPathObj.path_title == ''){
          this.error = "标题不能为空！"
        }
        else{
          this.$store.dispatch('path/AddNewPath',this.newPathObj).then((res) => {
            // console.log(res.data)
            this.$emit('handleNewPath')
            this.newPathObj = {
              'path_title': '',
              'path_detail': ''
            }
          }).catch((e) => {
            console.log("error:" + e)
          })
        }
      }
    }
  }
</script>

<style>
  #new_path_pop{
    text-align: left;
    z-index: 10;
    position: relative;
    height: 100%;
    overflow-y: auto;
  } 
  #new_path_pop.in{
    z-index: 100;
  }
  #new_path_pop .modal-body .modal-panel{
    padding: 8px 10px;
    margin: 8px 0;
  }
  #new_path_pop .modal-body .modal-panel p{
    line-height: 30px;
  }
  #new_path_pop .modal-body .modal-panel .title-content{
    font-size: 14px;
    font-weight: 600;
    color: #555;
    display: inline-block;
    width: 80px;
    text-align: right;
  }
  #new_path_pop .modal-body .modal-panel .input-content{
    display: inline-block;
    width: calc(100% - 100px);
    line-height: 30px;
  }
  #new_path_pop .modal-body .modal-panel .input-content input{
    border-radius: 2px;
    border: 1px solid #ddd;
    width: 60%;
    text-indent: 10px;
    font-size: 13px;
    color: #888;
  }
  #new_path_pop .modal-body .modal-panel .input-content input.error{
    border-color: #d9534f;
  }
  #new_path_pop .modal-body .modal-panel .area-content{
    display: inline-block;
    width: calc(100% - 100px);
    vertical-align: top;
  }
  #new_path_pop .modal-body .modal-panel .area-content textarea{
    border: 1px solid #ddd;
    border-radius: 2px;
    box-shadow: none;
    color: #888;
    font-size: 13px;
    resize: none;
  }
  #new_path_pop .modal-body .modal-panel .error-font{
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