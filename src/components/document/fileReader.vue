<template id="fileReader">
 <label class="text-reader">
  <input type="file" @change="loadTextFromFile" />
 </label>
</template>
 
<script>
  export default{
    data: function(){
      return {

      }
    },
    methods: {
      loadTextFromFile: function (e) {
        const file = e.target.files[0]
        const reader = new FileReader()
     
        reader.onload = e => this.$emit('load', e.target.result)
        reader.readAsText(file)
      }
    }
  }
</script>