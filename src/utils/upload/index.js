import { getActionUrl as upload } from './upload.js'

const checkFileType = (file) => {
  const type = file.name.substring(file.name.lastIndexOf('.') + 1)
  const fileTypeArr = ['doc', 'docx', 'pdf', 'txt', 'ppt', 'pptx', 'xls', 'xlsx', 'jpg', 'png', 'jpeg', 'zip', 'dat']
  if (fileTypeArr.indexOf(type) === -1) {
    return false
  }
  return true
}

//验证文件格式大小 最大为10M
const checkUpload = function(file) {
  if (file.size / 1024 > 10000) {
    return false
  }
  return true
}

const defaultDef = {
  uploadpath: 'Abc', // 管道名称
  maxsize: 102400,
  pathreg: '{date}', // 存放文件名称 date 是按照时间分目录
  namereg: '{uuid}', // 文件名称 filename 使用文件的名称，可能会重名  uuid 系统命名
}

const uploadHandle = (options, def) => {
  const { file, onSuccess, onError } = options
  return upload(Object.assign(defaultDef, def), file, onSuccess, onError)
}

export { uploadHandle, checkFileType, checkUpload }
