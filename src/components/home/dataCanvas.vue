<template> 
  <div id="dataCanvas">
    <div class="row">
      <div class="col-md-12">
        <div class="canvas-nav">
          <div class="row">
            <div class="col-md-4">
              <span>{{wrapTitle}}</span>
              <div class="select-wrap">
                <span type="button" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {{currentChart.title}} <span class="caret"></span>
                </span>
                <ul class="dropdown-menu">
                  <li v-for="(item,index) in chartList"><a @click="currentChart = item">{{item.title}}</a></li>
                </ul>
              </div>
            </div>
            <div class="col-md-8 align-right">
              <ul class="type-list">
                <!-- <li v-for="(item,index) in currentChart.typeList" class="btn" :class="('btn-' + colorType[index])" @click="setTypeChart(item)">{{item.tytle}}</li> -->
                <li 
                v-for="(item,index) in currentChart.typeList" 
                class="type-btn" 
                :class="{'active': currentType.type == item.type}" 
                @click="setTypeChart(item)">{{item.tytle}}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="canvas-body">
          <line-chart :data="canvasData" :options="canvasOptions" style="height: 250px"></line-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import LineChart from '../chart/lineChart.vue'  

  export default {
    name: 'dataCanvas',
    props: [
      'wrapTitle'
    ],
    data: function(){
      return {
        colorType: ['primary','success','info','warning','danger'],
        currentChart: {},
        currentType: {},
        chartList: [
          {
            title: '活动任务',
            typeList: [
              {
                tytle: '折线图',
                type: 'Line'
              },
              {
                tytle: '柱形图',
                type: 'Bar'
              },
              {
                tytle: '点图',
                type: 'Bubble'
              },
              {
                tytle: '饼图',
                type: 'Pie'
              }
            ]
          },
          {
            title: '人生计划'
          },
          {
            title: '笔记'
          }
        ],
        canvasData: {
          labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月','10月','11月','12月'],
          datasets: [
            {
              label: '所有任务',
              backgroundColor: '#f87979',
              fill: false,
              borderWidth: 1,
              borderColor: '#f87979',
              data: [0, 6, 5, 2, 6, 4, 1, 2, 4, 6, 12, 3]
            },
            {
              label: '已完成',
              backgroundColor: '#337ab7',
              fill: false,
              borderWidth: 1,
              borderColor: '#337ab7',
              data: [0, 2, 4, 0, 1, 2, 0, 1, 3, 2, 5, 1]
            }
          ]
        },
        canvasOptions: {
          responsive: true, 
          maintainAspectRatio: false
        }
      }
    },
    mounted: function(){
      this.currentChart = this.chartList[0]
      this.currentType = this.currentChart.typeList[0]
    },
    methods: {
      setTypeChart: function(item){
        this.currentType = item
      }
    },
    components: {
      LineChart
    }
  }
</script>

<style>
#dataCanvas{
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 18px 25px;
}
#dataCanvas .canvas-nav{
  height: 38px;
  line-height: 38px;
  font-size: 1.1em;
  color: #559bca;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  padding: 0px 20px 0px 20px;
  margin-bottom: 15px;
}
#dataCanvas .canvas-nav .row{
  height: 38px;
}
#dataCanvas .canvas-nav .select-wrap{
  /*vertical-align: top;*/
  display: inline-block;
  width: clac(100% - 70px);
  height: 38px;
  position: relative;
}
#dataCanvas .canvas-nav .dropdown-toggle{
  font-size: 0.8em;
  color: #aaa;
  margin-left: 7px;
  cursor: pointer;
}
#dataCanvas .canvas-nav .dropdown-menu{
  font-size: 0.8em;
  color: #ddd;
  border: 1px solid #ddd;
  padding: 6px 0px 4px 0px;
  top: 32px;
  min-width: 0;
}
#dataCanvas .canvas-nav .dropdown-menu a{
  color: #aaa;
  padding: 4px 22px;
  cursor: pointer;
}
#dataCanvas .canvas-nav .type-list{
  display: inline-block;
  height: 38px;
}
#dataCanvas .canvas-nav .type-list li.type-btn{
  display: inline-block;
  font-size: 12px;
  border: 1px solid #fff;
  border-bottom: 1px solid #ddd;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
  color: #ccc;
  font-weight: 400;
  height: 38px;
  padding: 0 8px;
  margin: 0 1px;
}
#dataCanvas .canvas-nav .type-list li.type-btn:hover{
  background-color: #f7f7f7;
  color: #aaa;
  font-weight: 500;
}
#dataCanvas .canvas-nav .type-list li.type-btn.active{
  border: 1px solid #ddd;
  border-bottom: 1px solid #fff;
  color: #aaa;
  font-weight: 500;
  z-index: 999;
}
#dataCanvas .canvas-type-body{
  padding: 0px 20px;
  margin-bottom: 10px;
  height: 34px;
  line-height: 34px;
}
#dataCanvas .canvas-type-body .chart-type-box{
  text-align: center;
  font-size: 0.7em;
  color: #aaa;
}
</style>