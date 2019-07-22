export function MillisecondToDate(msd) {  
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
export function DateFormate(time){
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
export function DateDiffNow(sDate2) {
    var date1 = new Date()
    var date2 = new Date(sDate2)
    var diff = date2.getTime()-date1.getTime()
    var days=Math.floor(diff/(24*3600*1000))
    return days;  //返回相差天数
}
export function DateDiff(sDate1,sDate2) {
    var date1 = new Date(sDate1)
    var date2 = new Date(sDate2)
    var diff = date2.getTime()-date1.getTime()
    var days = Math.floor(diff/(24*3600*1000))
    return days;  //返回相差天数
}
export function DateChatDiff(sDate1,sDate2) {
    var date1 = new Date(sDate1)
    var date2 = new Date(sDate2)
    var diff = date2.getTime()-date1.getTime()
    var days = Math.floor(diff/(24*3600*1000))
    var leave1 = diff%(24*3600*1000)
    var hours = Math.floor(leave1/(3600*1000))
    var leave2 = leave1%(3600*1000)
    var minutes = Math.floor(leave2/(3600*1000))
    var leave3 = leave2%(60*1000)
    var seconds = Math.round(leave3/1000)

    var h = date1.getHours()
    var m = date1.getMinutes()
    if(m < 10){
        m = '0' + m
    }
    var result = {
        time: h + ':' + m,
        type: ''
    }
    if(days >= 3){
        result.type = '三天前 '
    }
    else if(days == 2){
        result.type = '前天 '
    }
    else if(days == 1){
        result.type = '昨天 '
    }
    return result
}
export function GetDaysOfDate(date){
     var date = new Date(date)
     var year = date.getFullYear()
     var month = date.getMonth() + 1
     var d = new Date(year, month, 0)
     return d.getDate()
}
export function GetDaysOfMonth(year,month){
     var d = new Date(year, month, 0)
     return d.getDate()
}

export function ChatTimeFormate(date){
    var date = new Date(date)
    var fmt = "HH:mm:ss"
    var o = {  
        "H+": date.getHours(), //小时   
        "m+": date.getMinutes(), //分   
        "s+": date.getSeconds(), //秒   
    };  
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));  
    for (var k in o)  
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));  
    return fmt;   
}