// import { useFileStore } from '@/store/file'
// import { ref } from 'vue'

import { useGlobalStore } from '@/store'

export default function () {
  const gbStore = useGlobalStore()
  // const { getFileList } = useFileStore()
  // const currentFiles = ref()
  // getFileList({'path': ''})
  return { gbStore }
}
