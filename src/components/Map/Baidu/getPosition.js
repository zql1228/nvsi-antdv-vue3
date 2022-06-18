//  center: {
//         lng: '', // 经度
//         lat: '', // 维度
//       }

// 浏览器定位
export const getGeolocation = (BMap) => {
  return new Promise((resolve, reject) => {
    // 浏览器定位 优先调用浏览器H5定位接口，如果失败会调用IP定位
    const geolocation = new BMap.Geolocation()
    geolocation.getCurrentPosition(function(r) {
      if (this.getStatus() === 0 && r.point) {
        resolve(r.point)
      } else {
        resolve({ code: -1 })
      }
    })
  })
}

// Ip定位
export const getIpLocation = (BMap) => {
  return new Promise((resolve, reject) => {
    // ip 定位
    const myCity = new BMap.LocalCity()
    myCity.get((result) => {
      if (result.center) {
        resolve({
          lat: result.center.lat,
          lng: result.center.lng,
        })
      } else {
        resolve({ code: -1 })
      }
    })
  })
}

export default async function(BMap, centerPoint) {
  let center
  if (Object.values(centerPoint).filter((item) => Boolean(item)).length > 0) {
    center = centerPoint
    return new BMap.Point(center.lat, center.lng)
  } else {
    const [resGo, resIpGo] = await Promise.all([getGeolocation(BMap), getIpLocation(BMap)])
    if (!resGo.code) {
      center = resGo
    } else if (!resIpGo.code) {
      center = resIpGo
    } else {
      center = { lng: 39.915, lat: 116.404 }
    }
    return new BMap.Point(center.lng, center.lat)
  }
}
