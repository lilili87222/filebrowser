const TIME_OUT = 1000 * 60 * 5 // 设置超时时间
const PREFIX = '/api'
const IPA_PREFIX = '/ipa'
let BASE_URL = ''

if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'prodcution'
) {
  BASE_URL = process.env.VUE_APP_BASE_URL
}

export { TIME_OUT, PREFIX, IPA_PREFIX, BASE_URL }
