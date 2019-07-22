let SetRGBShade = function(rgb1,rgb2,level){
  var colorGroup = []
  rgb1 = rgb1.replace(/rgb|\)|\(/g,'').split(',')
  rgb2 = rgb2.replace(/rgb|\)|\(/g,'').split(',')
  var R = parseInt(rgb1[0])
  var G = parseInt(rgb1[1])
  var B = parseInt(rgb1[2])
  var MR = parseInt(rgb2[0])
  var MG = parseInt(rgb2[1])
  var MB = parseInt(rgb2[2])
  while(level--){
    colorGroup.push( 'rgb(' + R +','+ G + ',' + B + ')')
    R += parseInt((MR - R)/level)
    G += parseInt((MG - G)/level) 
    B += parseInt((MB - B)/level)
  }
  return colorGroup
}

export {
  SetRGBShade
}