/* global Vue, Rx */

import { install } from './util'
import rxMixin from './mixin'
import streamDirective from './directives/stream'
import watchAsObservable from './methods/watchAsObservable'
import fromDOMEvent from './methods/fromDOMEvent'
import subscribeTo from './methods/subscribeTo'
import eventToObservable from './methods/eventToObservable'
import extendSafeSub from './extends/safeSub'

export default function VueRx (Vue, Rx, extendRx) {
  install(Vue, Rx)
  Vue.mixin(rxMixin)
  Vue.directive('stream', streamDirective)
  Vue.prototype.$watchAsObservable = watchAsObservable
  Vue.prototype.$fromDOMEvent = fromDOMEvent
  Vue.prototype.$subscribeTo = subscribeTo
  Vue.prototype.$eventToObservable = eventToObservable

  if (extendRx) {
    extendSafeSub()
  }
}

// auto install
if (typeof Vue !== 'undefined' && typeof Rx !== 'undefined') {
  Vue.use(VueRx, Rx)
}
