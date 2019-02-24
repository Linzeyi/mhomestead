let MillisecondToDate =  function(msd) {  
    var time = parseFloat(msd)  
    if (null != time && "" != time) {  
        var days = parseInt(msd / (1000 * 60 * 60 * 24))
        if(days == 0){
            days = ''
        }
        else{
            days = days + "天"
        }
        var hours = parseInt((msd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        if(hours == 0){
            hours = ''
        }
        else{
            hours = hours + "小时"
        }
        var minutes = parseInt((msd % (1000 * 60 * 60)) / (1000 * 60))
        if(minutes == 0){
            minutes = ''
        }
        else{
            minutes = minutes + "分钟"
        }
        var seconds = parseInt((msd % (1000 * 60)) / 1000)
        if(seconds == 0){
            seconds = ''
        }
        else{
            seconds = seconds + "秒"
        }
        time = days + hours + minutes + seconds; 
    }  
    return time;  
} 
let DateFormate = function(time){
    var date = new Date(time)//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var fmt = "yyyy-MM-dd HH:mm:ss"
    var o = {  
        "M+": date.getMonth() + 1, //月份   
        "d+": date.getDate(), //日   
        "H+": date.getHours(), //小时   
        "m+": date.getMinutes(), //分   
        "s+": date.getSeconds(), //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds() //毫秒   
    };  
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));  
    for (var k in o)  
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));  
    return fmt;   
}
let DateDiffNow = function(sDate2) {
    var date1 = new Date()
    var date2 = new Date(sDate2)
    var date3 = date2.getTime()-date1.getTime()
    var days=Math.floor(date3/(24*3600*1000))
    return days;  //返回相差天数
}
let DateDiff = function(sDate1,sDate2) {
    var date1 = new Date(sDate1)
    var date2 = new Date(sDate2)
    var date3 = date2.getTime()-date1.getTime()
    var days=Math.floor(date3/(24*3600*1000))
    return days;  //返回相差天数
}
let GetDaysOfDate = function(date){
     var date = new Date(date)
     var year = date.getFullYear()
     var month = date.getMonth() + 1
     var d = new Date(year, month, 0)
     return d.getDate()
}
let GetDaysOfMonth = function(year,month){
     var d = new Date(year, month, 0)
     return d.getDate()
}


export{
    MillisecondToDate,
    DateFormate,
    DateDiffNow,
    DateDiff,
    GetDaysOfDate,
    GetDaysOfMonth
}