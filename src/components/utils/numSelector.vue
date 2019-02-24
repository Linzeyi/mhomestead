<template>
  <div id="numSelector">
    <div class="btn-group year-group">
      <p class="drop-title" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click="scrollTo()">{{getDataTitle()}}</p>
      <ul class="dropdown-menu">
        <vue-scroll ref="numScroll">
          <p v-for="(item,index) in dataArr" :class="{'active': getData() == item}" :name="item" @click="select(item,index)">{{item}}</p>
        </vue-scroll>
      </ul>
    </div>
  </div>
</template>

<script>
  export default{
    props: [
      'type',
      'numDataInfo',
      'yearLength'
    ],
    data: function(){
      return {
        'dataArr': [],
        'currentIndex': 0
      }
    },
    created: function(){
      this.setArr()
    },
    watch: {
      numDataInfo: {
        handler: function (val, oldVal) {
          this.setArr()
          console.log(val)
        },
        deep: true 
      }
    },
    methods: {
      setArr: function(){
        if(this.type == 'years'){
          this.setYearsArr()
        }
        else if(this.type == 'months'){
          this.setMonthsArr()
        }
        else if(this.type == 'days'){
          this.setDaysArr()
        }
      },
      setYearsArr: function(){
        var length = 30
        if(this.yearLength) length = this.yearLength
        var end = length + 10
        var distance = new Date().getFullYear() - this.numDataInfo.numData.getFullYear()
        if(distance >= 10){
          end = length + distance + 10
        }
        var date = new Date(this.numDataInfo.numData).getFullYear() - length
        this.dataArr = []
        for (var i = 0; i < end; i++) {
          this.dataArr.push(date)
          date += 1;
        }
        this.currentIndex = length
      },
      setMonthsArr: function(){
        this.dataArr = []
        for (var i = 1; i <= 12; i++) {
          this.dataArr.push(i)
        }
        this.currentIndex = this.getData()
      },
      setDaysArr: function(){
        var days = this.GetDaysOfDate(this.numDataInfo.numData)
        this.dataArr = []
        for (var i = 1; i <= days; i++) {
          this.dataArr.push(i)
        }
        this.currentIndex = this.getData() - 1
      },
      getData: function(){
        if(this.type == 'years'){
          return this.numDataInfo.numData.getFullYear()
        }
        else if(this.type == 'months'){
          return this.numDataInfo.numData.getMonth() + 1
        }
        else if(this.type == 'days'){
          return this.numDataInfo.numData.getDate()
        }
      },
      setData: function(item){
        if(this.type == 'years'){
          this.numDataInfo.numData.setFullYear(item)
          this.$emit('on-change',this.numDataInfo.numData.getTime())
        }
        else if(this.type == 'months'){
          this.numDataInfo.numData.setMonth(item-1)
          this.$emit('on-change',this.numDataInfo.numData.getTime())
        }
        else if(this.type == 'days'){
          this.numDataInfo.numData.setDate(item)
          this.$emit('on-change',this.numDataInfo.numData.getTime())
        }
      },
      getDataTitle: function(){
        if(this.type == 'years'){
          return this.numDataInfo.numData.getFullYear() + ' 年'
        }
        else if(this.type == 'months'){
          return this.numDataInfo.numData.getMonth() + 1 + ' 月'
        }
        else if(this.type == 'days'){
          return this.numDataInfo.numData.getDate() + ' 日'
        }
      },
      select: function(item){
        this.setData(item)
        this.setArr()
      },
      scrollTo: function(){
        var ratio = parseInt(this.currentIndex * 100 / this.dataArr.length) + '%'
        this.$nextTick(() => {
          this.$refs['numScroll'].scrollTo({
            y: ratio
          })
        })
      }
    }
  }
</script>

<style>
#numSelector {
  display: inline-block;
}
#numSelector .btn-group{
  font-size: 12px;
  color: #aaa;
  height: 38px;
  /*padding-left: 4px;*/
  font-weight: normal;
  position: relative;
}
#numSelector .btn-group .drop-title{
  height: 30px;
  line-height: 30px;
  margin: 4px 0;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  color: #aaa;
}
#numSelector .btn-group .drop-title:hover{
  text-decoration: none;
  color: #bbb;
}
#numSelector .btn-group.year-group{
  width: 100%;
}
#numSelector .btn-group .dropdown-menu{
  position: absolute;
  /*top: 0;*/
  min-width: 0;
  width: calc(100% + 8px);
  height: 240px;
  margin: 0;
  padding: 0;
}
#numSelector .btn-group .dropdown-menu p{
  height: 30px;
  width: 100%;
  text-align: center;
  cursor: pointer;
}
#numSelector .btn-group .dropdown-menu p:hover{
  background-color: #eee;
}
#numSelector .btn-group .dropdown-menu p.active{
  background-color: #ccc;
  color: #fff;
}
</style>