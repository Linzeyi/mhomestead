<template>
  <div class="modal fade" id="new_doc_pop" tabindex="-1" role="dialog" aria-labelledby="newDocPopTitle">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="newDocPopTitle">新建文件资源</h4>
        </div>
        <div class="modal-body">
          <div class="modal-panel type-panel">
            <span class="panel-title">资源类型:</span>
            <div class="btn-group" role="group" aria-label="...">
              <button type="button" class="btn btn-sm" :class="{'on': docType == 'file'}" @click="toggleFileType('file')">文件</button>
              <button type="button" class="btn btn-sm" :class="{'on': docType == 'folder'}" @click="toggleFileType('folder')">文件夹</button>
            </div>
          </div>
          <div class="modal-panel name-panel">

            <span v-if="docType == 'file'" class="panel-title">文件名:</span>
            <input type="text" class="form-control name-ipt" placeholder="可自定义文件名..." v-if="docType == 'file'" v-model="docName">
            <button v-if="docType == 'file'" class="file-btn" @click="selectDoc"><i class="iconfont">&#xe6b3;</i></button>
            <input 
            type="file" 
            ref="file_ipt_el" 
            class="file-ipt" 
            @change="changeFile" 
            accept="application/pdf">
            
            <blockquote class="bottom-font" v-if="docType == 'file'">
              <footer>{{fileFullName}}</footer>
              <p><span>文件大小:</span>{{fileSize}} KB</p>
              <p><span>文件类型:</span>{{fileType}}</p>
            </blockquote>

            <span v-if="docType == 'folder'" class="panel-title">文件夹名:</span>
            <input type="text" class="form-control" placeholder="请输入新建文件夹名..." v-if="docType == 'folder'" v-model="docName">
            
          </div>
          <div class="modal-panel">
            <span class="panel-title">
              上级目录:
            </span>
            <span>{{currentPath}}/</span>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">返回</button>
          <button type="button" class="btn btn-primary" id="save_doc_btn" @click="saveDocument">创建</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: [
      'currentDoc',
      'currentPath'
    ],
    data: function(){
      return {
        docType: 'file',
        file: {
          name: '',
          size: 0,
          type: ''
        },
        docName: ''
      }
    },
    watch: {
      currentDoc: function(){
      }
    },
    computed: {
      fileName: function(){
        return this.file.name ? this.file.name.split('.')[0] : ''
      },
      fileFullName: function(){
        return this.file.name ? this.file.name : '未选中任何文件资源'
      },
      fileSize: function(){
        return this.file.size ? (this.file.size/1024).toFixed(2) : 0
      },
      fileType: function(){
        return this.file.type ? this.file.type.split('/')[1] : (this.file.name ? this.file.name.split('.')[1] : '无')
      }
    },
    methods: {
      initFile: function(){
        this.file = {
          name: '',
          size: 0,
          type: ''
        }
        this.docName = '',
        this.docType = 'file'
      },
      toggleFileType: function(type){
        this.docType = type
        this.docName = ''
      },
      selectDoc: function(){
        this.$refs.file_ipt_el.click()
      },
      changeFile: function (e) {
        const file = e.target.files[0]
        if(typeof(file) != 'undefined'){
          const reader = new FileReader()
          this.file = file
          this.docName = this.fileName
        }
        
     
        // reader.onload = e => this.$emit('load', e.target.result)
      },
      saveDocument: function(){
        $('#save_doc_btn').attr("disabled",true)
        if(this.file.size == 0 && this.docType == 'file'){
          alert("请选择一个文件上传...")
          $('#save_doc_btn').attr("disabled",false)
        }
        else if(this.docType == 'file'){
          let formData = new FormData()
          formData.append('file',this.file)
          this.$store.dispatch('doc/SaveFile',formData).then((res) => {
            console.log("将文件上传到阿里云OSS对象存储服务器，返回路径：")
            console.log(res.data)
            let doc = {
              doc_name: this.docName,
              doc_type: this.fileType,
              path_index: parseInt(this.currentDoc.path_index) + 1,
              root_id: this.currentDoc.root_id,
              doc_content: res.data.data,
              parent_id: this.currentDoc.doc_id
            }
            this.$store.dispatch('doc/AddDocument',doc).then((res) => {
              console.log("添加" + doc.doc_type + "文件：" + doc.doc_name)
              console.log(res.data)
              this.initFile()
              $('#save_doc_btn').attr("disabled",false)
              this.$emit('newDocumentAdd',res.data.data)
            }).catch((e) => {
              console.log("error:" + e)
            })
            
          }).catch((e) => {
            console.log("error:" + e)
          })
        }
        else if(this.docType == 'folder'){
          let doc = {
            doc_name: this.docName,
            doc_type: 'folder',
            path_index: parseInt(this.currentDoc.path_index) + 1,
            root_id: this.currentDoc.root_id,
            doc_content: '',
            parent_id: this.currentDoc.doc_id
          }
          this.$store.dispatch('doc/AddDocument',doc).then((res) => {
            console.log("新建文件夹：")
            console.log(res.data)
            this.initFile()
            this.docName = ''
            $('#save_doc_btn').attr("disabled",false)
            this.$emit('newDocumentAdd',res.data.data)
          }).catch((e) => {
            console.log("error:" + e)
          })
        }
      }
    }
  }
</script>

<style>
  #new_doc_pop{
    top: 70px;
    text-align: left;
  }
  #new_doc_pop .modal-body .modal-panel {
    padding: 8px 10px;
    font-size: 14px;
  }
  #new_doc_pop .modal-body .modal-panel .panel-title{
    width: 80px;
    margin-right: 10px;
    font-size: 14px;
    text-align: right;
    display: inline-block;
  }
  #new_doc_pop .modal-body .type-panel .btn-group{
  }
  #new_doc_pop .modal-body .type-panel .btn-group button{
    border-color: #d88383;
    color: #d88382;
  }
  #new_doc_pop .modal-body .type-panel .btn-group button:hover{
    color: #bf6463;
    box-shadow: none;
  }
  #new_doc_pop .modal-body .type-panel .btn-group button:focus{
    color: #bf6463;
    box-shadow: none;
  }
  #new_doc_pop .modal-body .type-panel .btn-group button.on{
    background-color: #d88383;
    color: #fff;
    box-shadow: none;
  }
  #new_doc_pop .modal-body .type-panel .btn-group button.on:hover{
    background-color: #d88383;
    color: #fff;
    box-shadow: inset 0 3px 5px #bf6463;
  }
  #new_doc_pop .modal-body .type-panel .btn-group button.on:focus{
    background-color: #d88383;
    color: #fff;
    box-shadow: inset 0 3px 5px #bf6463;
  }
  #new_doc_pop .modal-body .type-panel .btn-group button.on:visited{
    box-shadow: none;
  }

  #new_doc_pop .modal-body .name-panel input{
    min-width: 30%;
    max-width: 70%;
    font-size: 12px;
    display: inline-block;
    margin-right: 10px;
  }
  #new_doc_pop .modal-body .name-panel input.file-ipt{
    opacity: 0;
    position: absolute;
    z-index: -1;
  }
  #new_doc_pop .modal-body .name-panel button.file-btn{
    display: inline-block;
    padding: 2px 5px;
    border: 1px solid #ccc;
    color: #999;
    border-radius: 4px;
    font-size: 12px;
  }
  #new_doc_pop .modal-body .name-panel button.file-btn:hover{
    border-color: #aaa;
    color: #888;
  }

  #new_doc_pop .modal-body .modal-panel blockquote.bottom-font{
    font-size: 0.9em;
    margin: 20px 0px 20px 90px;
  }
  #new_doc_pop .modal-body .modal-panel blockquote p{
    margin-top: 6px;
    font-size: 80%;
    line-height: 1.42857143;
    color: #777;
  }
  #new_doc_pop .modal-body .modal-panel blockquote p span{
    margin-right: 5px;
  }
</style>