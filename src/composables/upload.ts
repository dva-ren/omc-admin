import client from './client'

function getImageSize(file: File) {
  return new Promise((resolve, reject) => {
    if (!file.type.includes('image')) {
      resolve({})
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target!.result as string
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        })
      }
    }
    reader.readAsDataURL(file)
  })
}
// 上传文件
export async function upload(filePath: string, file: File): Promise<any> {
  if (!filePath.endsWith('/'))
    filePath = `${filePath}/`
  const imageInfo = await getImageSize(file)
  return new Promise((resolve, reject) => {
    // 上传OSS
    try {
    // 随机命名
      const random_name
      = `${filePath
      + random_string(6)
      }_${
      Date.now()
      }w_${
        imageInfo.width || ''
      }x${
        imageInfo.height || ''
      }_.${
      file.name ? file.name.split('.').pop() : '_null.png'}`
      // // 上传文件
      client.put(random_name, file).then((result) => {
        resolve(result)
      })
    }
    catch (error) {
      console.error(error)
      // eslint-disable-next-line no-console
      console.log('上传失败')
      reject(error)
    }
  })
}

// 随机生成文件名
function random_string(len = 32) {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz12345678'
  const maxPos = chars.length
  let pwd = ''
  for (let i = 0; i < len; i++)
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  return pwd
}
