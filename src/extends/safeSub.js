import { Rx, hasRx, warn } from '../util'

export default function () {
  const noop = () => undefined
  const isFunction = f => typeof f === 'function'
  if (!hasRx()) {
    return
  }
  if (!Rx.Observable.prototype.catch) {
    warn(
      `No 'catch' operator. ` +
      `safeSub operator requires 'catch' operator. ` +
      `Try import 'rxjs/add/operator/catch' `
    )
    return
  }

  /**
   * Safely subscribe the stream with auto-unsubscribe and stream-continuing feature
   * @see {@link https://github.com/ReactiveX/rxjs/blob/master/doc/operator-creation.md#adding-the-operator-to-observable}
   * @memberof Observable
   * @param {Object} vm - Vue component vm
   * @param {Function} onNext
   * @param {Function} [onError] - Normal stream errors handler
   * @param {Function} [onComplete]
   * @param {Function} [onLethalError] - The handler of lethal error which ending the stream
   * @return {Subscription} subscription
   */
  Rx.Observable.prototype.safeSub = function (vm, onNext, onError, onComplete, onLethalError) {
    onNext = isFunction(onNext) ? onNext : noop
    onError = isFunction(onError) ? onError : noop
    onComplete = isFunction(onComplete) ? onComplete : noop
    onLethalError = isFunction(onLethalError) ? onLethalError : (error) => { throw error }

    const upstream$ = this

    const subscription = upstream$
      .catch(err => {
        onError(err)
        return upstream$
      })
      .subscribe(onNext, onLethalError, onComplete)

    ;(vm._obSubscriptions || (vm._obSubscriptions = [])).push(upstream$)

    return subscription
  }
}
