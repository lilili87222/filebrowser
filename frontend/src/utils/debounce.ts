interface IOptions {
  immediate: boolean
}

export default function debounce(
  cb: (...args: any[]) => any,
  delay = 200,
  options: IOptions = {
    immediate: false
  }
) {
  let timer: any = null,
    isInvoke = true
  const { immediate } = options
  function _(...arg: any[]) {
    if (timer) clearTimeout(timer)
    if (immediate && isInvoke) {
      cb(...arg)
      isInvoke = false
      timer = null
    } else {
      timer = setTimeout(() => {
        cb(...arg)
        timer = null
        isInvoke = true
      }, delay)
    }
  }
  _.close = function () {
    clearTimeout(timer)
  }
  return _
}
