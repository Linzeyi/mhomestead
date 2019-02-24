<template>
  <div class="ztree_content_wrap">
    <div class="zTreeDemoBackground left">
      <ul class="ztree">
        <ztree-item v-for='(item,index) in treeDataSource' :key="index" :model="item" :num='index' root='0' :nodes='treeDataSource.length' :callback='func' :expandfunc='expand' :cxtmenufunc='contextmenu' :trees='treeDataSource'></ztree-item>
      </ul>
    </div>
  </div>
</template>

<script>
export default{
  data () {
    return {
      treeDataSource:[]
    }
  },
  props:{
    // 树数据
    list:{
      type:Array,
      twoWay:true
    },
    // 点击节点回调
    func:{
      type:Function,
      default:null
    },
    // 点击展开回调
    expand:{
      type:Function,
      default:null
    },
    // 右击事件
    contextmenu:{
      type:Function,
      default:function(){
        console.log("defalt click contextmenu");
      }
    },
    // 是否展开
    isOpen:{
      type:Boolean,
      default:false
    }
  },
  methods:{
    initTreeData(){
      var tempList = JSON.parse(JSON.stringify(this.list))
      // console.log(tempList)

      // 递归操作，增加删除一些属性。比如: 展开/收起
      var recurrenceFunc = (data) => {
        data.forEach((m)=>{
          m.clickNode = m.hasOwnProperty("clickNode") ? m.clickNode : false;
          m.children = m.children || [];

          if(m.children.length>0){
            m.isFolder =  m.hasOwnProperty("open") ? m.open : this.isOpen;
            m.isExpand =  m.hasOwnProperty("open") ? m.open : this.isOpen;
            m.loadNode = 0; 
            recurrenceFunc(m.children);
          }else{
            delete m.children;
          }

        })
      };
      recurrenceFunc(tempList);

      this.treeDataSource = tempList;
    }
  },
  components:{
    // 组件
    ztreeItem:{
      name: 'ztreeItem',
      props: {
        model:{
          type:Object,
          twoWay:true
        },
        num:{
          type:Number,
          twoWay:true
        },
        nodes:{
          type:Number,
          twoWay:true,
          default:0
        },
        trees:{
          type:Array,
          twoWay:true,
          default:[]
        },
        root:{
          type:String,
          twoWay:true
        },
        callback:{
          type:Function
        },
        expandfunc:{
          type:Function
        },
        cxtmenufunc:{
          type:Function
        }
      },
      methods:{
        Func(m){
          if(typeof this.callback == "function") {
            this.callback.call(null,m);
          }
          // 查找点击的子节点
          var recurFunc = (data) => {
            data.forEach(function(i){
              if(i.id==m.id){
                // console.log(i)
                i.clickNode = true;
              }else {
                i.clickNode = false;
              }

              if(i.children){
                recurFunc(i.children);
              }
            })
          }

          recurFunc(this.trees);
        },
        open(m){
          //
          m.isExpand = !m.isExpand;

          if(typeof this.expandfunc == "function" && m.isExpand) {

            if(m.loadNode!=2) {
              //
              this.expandfunc.call(null,m);
            }else {
              m.isFolder = !m.isFolder;
            }
          } else {

            m.isFolder = !m.isFolder;
          }
        }
      },
      computed:{
    // 给（根 和 子树）赋值不同的样式
        rootClass(){
          var strRootClass = '';
          // 根判断
          if(this.root=='0'){
            strRootClass =  (this.num==0 && !this.model.children) ? "roots_docu" : (this.nodes==1) || (this.num==0 && this.nodes!=this.num+1) ? 
              "root_" : (this.nodes == this.num+1) ? "bottom_" : "center_";

          // 子树判断
          }else if(this.root=='1') {

            strRootClass =  this.nodes>1 && this.model.children && this.nodes!=this.num+1
            ? "center_" : 
            (this.num == 0 && this.nodes>1) || (this.nodes!=this.num+1) ? "center_docu" : 
            this.nodes == 1&&this.num!=0 || (this.nodes==this.num+1 && this.model.children)   ? "bottom_" : "bottom_docu";
          }
          return  strRootClass
        },
        // 是否有儿子节点
        isChildren(){
          return this.num+1 != this.nodes;
        },
        // 展开/收起
        prefixClass(){
          var returnChar = "";
          if(this.rootClass.indexOf("docu")==-1){
            if(this.model.isFolder){
              returnChar = "open";
            }else {
              returnChar = 'close'
            }
          }
          if(!this.model.children && this.rootClass.indexOf("docu")==-1){
            returnChar = 'docu'
          }
          return returnChar;
        },
        liClassVal(){
          return "level"+this.num;
        },
        spanClassVal(){
          return  this.model.clickNode ? "button level" + this.num + " switch "+this.rootClass+this.prefixClass + ' curSelectedNode':"button level" + this.num + " switch "+this.rootClass+this.prefixClass;
        },
        aClassVal(){
          return this.model.clickNode ? "level"+this.num+' curSelectedNode':"level"+this.num;
        },
        ulClassVal(){
          return this.isChildren && this.model.children ?"level"+this.num+' line':"level"+this.num;
        }
      },
      template: 
          `<li :class="liClassVal">
          <span :class="spanClassVal" @click='open(model)'></span>
          <a :class="aClassVal" @click='Func(model)' @contextmenu.prevent='cxtmenufunc'>
          <span :class="{loadSyncNode:model.loadNode==1}" v-if='model.loadNode==1'></span>
          <span :class='model.iconClass' v-show='model.iconClass' v-else></span>
          <span class="node_name">{{model.name}}</span>
          </a>
          <ul :class="ulClassVal" v-show='model.isFolder'>
          <ztree-item v-for="(item,index) in model.children" :key="index" :callback='callback' :expandfunc='expandfunc' :model="item" :cxtmenufunc='cxtmenufunc' :num='index' root='1' :nodes='model.children.length' :trees='trees'></ztree-item>
          </ul>
          </li>`
        }
      },
      mounted: function(){
        this.initTreeData();
      }
    }
    </script>

<style>
div.ztree_content_wrap
{
  height: calc(100% - 30px);
  font-size: 12px;
  font-weight: 500;
}

div.ztree_content_wrap div.left
{
  float: left;
  width: 100%;
}

div.zTreeDemoBackground
{
  width: 100%;
  height: 100%;
  text-align: left;
}

.expendIcon
{
  background-position: -74px -36px;
  line-height: 0;
  margin: 0;
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  border: 0 none;
  cursor: pointer;
  outline: none;
  position: absolute;
  top: 4px;
  background-color: transparent;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-image: url("../../assets/img/zTreeImg/ztree/zTreeStandard.png");
}

ul.ztree
{
  /*border:1px solid #ddd;*/
  /*background: #ffffff;*/
  width: 100%;
  padding: 8px 25px 0 25px;
  overflow-x: auto;
  overflow: hidden;
}

.ztree *
{
  padding: 0;
  margin: 0;
}

.ztree
{
  margin: 0;
  padding: 5px;
}

.ztree li
{
  position: relative;
  padding: 0;
  margin: 0;
  list-style: none;
  line-height: 24px;
  text-align: left;
  white-space: nowrap;
  outline: 0;
  user-select: none;

}

.ztree li ul
{
  margin: 0;
  padding: 0 0 0 24px
}

.ztree li ul.line
{
  background: url('../../assets/img/zTreeImg/ztree/line_conn.gif') 0 0 repeat-y;
}

.ztree li a
{
  padding: 2px 3px 0 2px;
  margin: 0;
  cursor: pointer;
  line-height: 24px;
  color: #999;
  background-color: transparent;
  text-decoration: none;
  vertical-align: top;
  display: inline-block
}

.ztree li a:hover
{
  text-decoration: underline;
  color: #555;
}

.ztree li a.curSelectedNode
{
  color: #444;
  opacity: 0.8;
}

.ztree li span
{
  line-height: 16px;
  margin-right: 2px;
  top: 3px;
  display: inline-block;
}

.ztree li span.button
{
  line-height: 0;
  margin: 0;
  width: 15px;
  height: 15px;
  line-height: 25px;
  display: inline-block;
  vertical-align: middle;
  border: 0 none;
  cursor: pointer;
  outline: none;
  background-size: 100%; 
  background-image: url("../../assets/img/zTreeImg/ztree/document-solid.png");
}
.ztree li span.button.curSelectedNode{ 
  background-image: url("../../assets/img/zTreeImg/ztree/document-solid-on.png");
}

.ztree li span.button.chk
{
  width: 13px;
  height: 13px;
  margin: 0 3px 0 0;
  cursor: auto;
}

.ztree li span.button.center_docu{
  background-image: url("../../assets/img/zTreeImg/ztree/document-solid.png");
}
.ztree li span.button.center_docu:hover,
.ztree li span.button.center_docu.curSelectedNode
{
  background-image: url("../../assets/img/zTreeImg/ztree/document-solid-on.png");
}

.ztree li span.button.center_open,
.ztree li span.button.bottom_open
{
  background-image: url("../../assets/img/zTreeImg/ztree/folder-open-right.png");
}
.ztree li span.button.center_open:hover,
.ztree li span.button.bottom_open:hover,
.ztree li span.button.center_open.curSelectedNode,
.ztree li span.button.bottom_open.curSelectedNode
{
  background-image: url("../../assets/img/zTreeImg/ztree/folder-open-right-on.png");
}

.ztree li span.button.center_close,
.ztree li span.button.bottom_close
{
  background-image: url("../../assets/img/zTreeImg/ztree/folder-close-right.png");
}
.ztree li span.button.center_close:hover,
.ztree li span.button.bottom_close:hover,
.ztree li span.button.center_close.curSelectedNode,
.ztree li span.button.bottom_close.curSelectedNode
{
  background-image: url("../../assets/img/zTreeImg/ztree/folder-close-right-on.png");
}
</style>