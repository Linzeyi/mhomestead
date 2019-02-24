<template>
  <div class="modal fade" id="new_notebook_pop" tabindex="-1" role="dialog" aria-labelledby="newNotebookTitle">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="newNotebookTitle">新的笔记本</h4>
        </div>
        <div class="modal-body">
          <div class="modal-panel title-panel">
            <span class="title-content">
              笔记本名：
            </span>
            <div class="input-content">
              <input class="plc-color" :class="{'error': checkTitle}" type="text" placeholder="自定义笔记本名" v-model="newNotebookObj.notebook_title">
              <span class="error-font" v-if="checkTitle">{{error}}</span>
            </div>
          </div>
          <div class="modal-panel" v-if="checkError">
            <p class="error-font">{{errorInfo.error}}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="addNewNotebook()">提交</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TagsSelector from "../utils/tagsSelector.vue"
  export default{
    data: function(){
      props: [
      ]
      return {
        newNotebookObj: {
          'notebook_title': '',
          'notebook_detail': ''
        },
        errorInfo: {
          error: '',
          type: ''
        }
      }
    },
    computed: {
      checkTitle: function(){
        if(this.errorInfo.error != '' && this.errorInfo.type == 'title'){
          return true
        }
        else {
          return false
        }
      },
      checkError: function(){
        if(this.errorInfo.error != '' && this.errorInfo.type != 'title'){
          return true
        }
        else {
          return false
        }
      }
    },
    watch: {
      'newNotebookObj.notebook_title': function(){
        if(this.newNotebookObj.notebook_title != ''){
          this.errorInfo = {
            error: '',
            type: ''
          }
        }
      }
    },
    methods: {
      addNewNotebook: function(){
        if(this.newNotebookObj.notebook_title == ''){
          this.errorInfo.error = "笔记本名不能为空！"
          this.errorInfo.type = "title"
        }
        else{
          this.newNotebookObj.notebookbook = this.notebookbook
          this.$store.dispatch('notebook/AddNewNotebook',this.newNotebookObj).then((res) => {
            // console.log(res.data)
            this.$emit('handleNewNotebook')
            this.newNotebookObj = {
              'notebook_title': '',
              'notebook_detail': ''
            }
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
  #new_notebook_pop{
    text-align: left;
    z-index: 10;
    position: relative;
    height: 100%;
    overflow-y: auto;
  } 
  #new_notebook_pop.in{
    z-index: 100;
  }
  #new_notebook_pop .modal-body .modal-panel{
    padding: 8px 10px;
    margin: 8px 0;
  }
  #new_notebook_pop .modal-body .modal-panel p{
    line-height: 30px;
  }
  #new_notebook_pop .modal-body .modal-panel .title-content{
    font-size: 14px;
    font-weight: 600;
    color: #555;
    display: inline-block;
    width: 80px;
    text-align: right;
  }
  #new_notebook_pop .modal-body .modal-panel .input-content{
    display: inline-block;
    width: calc(100% - 100px);
    line-height: 30px;
  }
  #new_notebook_pop .modal-body .modal-panel .input-content input{
    border-radius: 2px;
    border: 1px solid #ddd;
    width: 60%;
    text-indent: 10px;
    font-size: 13px;
    color: #888;
  }
  #new_notebook_pop .modal-body .modal-panel .input-content input.error{
    border-color: #d9534f;
  }
  #new_notebook_pop .modal-body .modal-panel .area-content{
    display: inline-block;
    width: calc(100% - 100px);
    vertical-align: top;
  }
  #new_notebook_pop .modal-body .modal-panel .area-content textarea{
    border: 1px solid #ddd;
    border-radius: 2px;
    box-shadow: none;
    color: #888;
    font-size: 13px;
    resize: none;
  }
  #new_notebook_pop .modal-body .modal-panel .error-font{
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