<script>
  import { Line } from 'vue-chartjs'

  export default {
    extends: Line,
    props: [
      'data','options'
    ],
    mounted: function(){
      this.renderChart(this.data,this.options)
    }
  }
</script>