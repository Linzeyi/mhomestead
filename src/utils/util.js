import * as datetime from '@/utils/datetime.js'

import * as sortUtil from '@/utils/sort.js'

import * as colorFunc from '@/utils/colorFunc.js'

export default {
  install(Vue, options) {
    Vue.prototype.datetime = datetime
    Vue.prototype.sortUtil = sortUtil
    Vue.prototype.colorFunc = colorFunc
  }

}
