import {MillisecondToDate,DateFormate,DateDiff,DateDiffNow,GetDaysOfDate,GetDaysOfMonth} from '@/utils/datatime.js'

import {TaskAchieveSort} from '@/utils/sort.js'

export default{
    install (Vue,options){
        Vue.prototype.millisecondToDate = MillisecondToDate
        Vue.prototype.DateFormate = DateFormate
        Vue.prototype.DateDiff = DateDiff
        Vue.prototype.DateDiffNow = DateDiffNow
        Vue.prototype.TaskAchieveSort = TaskAchieveSort
        Vue.prototype.GetDaysOfDate = GetDaysOfDate
        Vue.prototype.GetDaysOfMonth = GetDaysOfMonth
    }
    
}