let TaskAchieveSort = function(arr){
  var arr1 = [],arr2 = []
  for(var i=0; i<arr.length;i++){
    if(arr[i].is_achieve){
      arr1.push(arr[i])
    }
    else arr2.push(arr[i])
  }
  return arr2.concat(arr1)
}

export{
  TaskAchieveSort
}