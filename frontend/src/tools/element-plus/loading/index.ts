import { ElLoading } from 'element-plus'

let loading: { close: () => void }
let loadingNum = 0

// 缓存正在请求的数量

export function startLoading() {
  if (loadingNum == 0) {
    loading = ElLoading.service({
      background: 'initial'
    })
  }
  loadingNum++
}
export function endLoading() {
  //请求数量减1
  loadingNum--
  try {
    if (loadingNum <= 0) {
      loading.close()
      loadingNum = 0
    }
  } catch (error) {
    loadingNum = 0
  }
}
