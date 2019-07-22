<template>
  <div id="pdfView">
    <div class="pdf-wrap">
      <div class="pdf-show-wrap">
        <div class="pdf-show" v-show="openCanvas">
          <canvas ref="pdf_canvas"></canvas>
        </div>
        <div class="no-pdf" v-show="!openCanvas">
          <p>加载中...</p>
        </div>
      </div>
      <div class="btn-wrap">
        <div class="btn-panel float-left">
          <i class="iconfont" @click="fullPdf" v-if="!thePdf.isFull">&#xe65b;</i>
          <i class="iconfont" @click="closeFullPdf" v-if="thePdf.isFull">&#xe65c;</i>
          <i class="iconfont" @click="magnifyPdf">&#xe6f0;</i>
          <i class="iconfont" @click="shrinkPdf">&#xe70d;</i>
        </div>
        <div class="title-panel">
          <span class="pdf-title">{{ thePdf.pdfName }}</span>
        </div>
        <div class="btn-panel float-right">
          <i id="prev" @click="onPrevPage" class="iconfont">&#xe65e;</i>
          <span ref="page_num"></span><span>/</span><span ref="page_count"></span>
          <i id="next" @click="onNextPage" class="iconfont">&#xe65d;</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import PDFJS from 'pdfjs-dist/build/pdf.js'
  export default {
    props: [
      'pdfItem'
    ],
    data: function(){
        return {
          thePdf:{
            type: 'pdf',
            pdfName: null,
            data: null,
            pdfDoc: null,
            pageNum: 1,
            pageRendering: false,
            pageNumPending: null,
            scale: 1,
            desiredWidth: null,
            isFull: false
          },
          openCanvas: true
        }
    },
    mounted: function(){
      this.showPdf()
    },
    methods: {
      showPdf: function(){
        this.openCanvas = false
        var _this = this
        this.thePdf.pdfName = this.pdfItem.doc_name
        this.thePdf.data = this.pdfItem.doc_content

        console.log("获取pdf：")
        PDFJS.getDocument(process.env.ossURL + _this.thePdf.data).then(function(pdfDoc_) {
          console.log(pdfDoc_)
          _this.thePdf.pdfDoc = pdfDoc_
          _this.$refs.page_count.textContent = _this.thePdf.pdfDoc.numPages

          // Initial/first page rendering
          _this.renderPage(_this.thePdf.pageNum)
        })
      },
      renderPage: function(num){
        var _this = this
        
        var ctx = _this.$refs.pdf_canvas.getContext('2d')
        _this.thePdf.pageRendering = true
        // Using promise to fetch the page
        _this.thePdf.pdfDoc.getPage(num).then(function(page) {
          var viewport = page.getViewport(_this.thePdf.scale)
          _this.$refs.pdf_canvas.height = viewport.height
          _this.$refs.pdf_canvas.width = viewport.width

          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: ctx,
            viewport: viewport
          }
          var renderTask = page.render(renderContext)

          // Wait for rendering to finish
          renderTask.promise.then(function() {
            _this.thePdf.pageRendering = false
            if (_this.thePdf.pageNumPending !== null) {
              // New page rendering is pending
              _this.renderPage(_this.thePdf.pageNumPending)
              _this.thePdf.pageNumPending = null
            }
            _this.openCanvas = true
          })
        })
        _this.$refs.page_num.textContent = num
      },
      queueRenderPage: function(num){
        if (this.thePdf.pageRendering) {
          this.thePdf.pageNumPending = num
        } else {
          this.renderPage(num)
        }
      },
      onPrevPage: function(){
        if (this.thePdf.pageNum <= 1) {
          return
        }
        this.thePdf.pageNum--
        this.queueRenderPage(this.thePdf.pageNum)
      },
      onNextPage: function(){
        if (this.thePdf.pageNum >= this.thePdf.pdfDoc.numPages) {
          return
        }
        this.thePdf.pageNum++
        this.queueRenderPage(this.thePdf.pageNum)
      },
      fullPdf: function(){
        this.thePdf.isFull = true
        this.$emit('fullevent',this.thePdf.isFull)
      },
      closeFullPdf: function(){
        this.thePdf.isFull = false
        this.$emit('fullevent',this.thePdf.isFull)
      },
      magnifyPdf: function(){
        if (this.thePdf.scale < 2) {
          this.thePdf.scale +=0.2
          this.showPdf(this.pdfItem)
        }else{
          return
        }
      },
      shrinkPdf: function(){
        if (this.thePdf.scale > 0.6) {
          this.thePdf.scale -= 0.2
          this.showPdf(this.pdfItem)
        }else{
          return
        }
      }
    }
  }
</script>

<style>
  #pdfView{
    width: 100%;
    height: 100%;
    background-color: #efefef;
  }
  .pdf-wrap{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .pdf-wrap .btn-wrap{
    height: 60px;
    line-height: 60px;
    width: 100%;
    background-color: #f9f9f9;
    border: none;
    box-shadow: none;
    box-shadow: 0px 0px 5px 0px #d5d5d5;
  }
  .pdf-wrap .btn-wrap .title-panel{
    display: inline-block;
  }
  .pdf-wrap .btn-wrap .btn-panel{
    display: inline-block;
    height: 60px;
    margin: 0 20px;
    vertical-align: top;
  }
  .pdf-wrap .btn-wrap .btn-panel.right {
    
  }
  .pdf-wrap .btn-wrap .btn-panel i{
    font-size: 18px;
    margin: 0 5px;
    cursor: pointer;
    color: #626262;
  }
  .pdf-wrap .btn-wrap .btn-panel i:hover{
    color: #2c2c2c;
  }
  .pdf-wrap .btn-wrap .btn-panel span{
    position: relative;
    top: -2px;
    font-size: 12px;
    color: #626262;
  }
  .pdf-wrap .pdf-show-wrap{
    height: calc(100% - 60px);
  }
  .pdf-wrap .pdf-show-wrap .pdf-show{
    height: 100%;
    width: 100%;
    overflow: auto;
  }
  .pdf-wrap .pdf-show-wrap canvas{
    position: relative;
     padding: 10px 0;
  }
  .pdf-wrap .pdf-show-wrap .no-pdf{
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
  }
  .pdf-wrap .pdf-show-wrap .no-pdf p{
    font-size: 12px;
    color: #999;
  }
</style>