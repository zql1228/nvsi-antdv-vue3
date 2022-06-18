export const municipality = ['10', '11', '12', '31', '50', '71', '81', '82']

export const isMunicipality = (areaId) => {
  const province = areaId.substring(0, 2)
  return municipality.includes(province)
}

export const checkAreaLevel = (areaId) => {
  const province = areaId.substring(0, 2)
  if (province === '00') {
    return 0
  }
  const city = areaId.substring(2, 4)
  if (city === '00') {
    return 1
  }
  const county = areaId.substring(4, 6)
  if (county === '00') {
    return 2
  }
  const street = areaId.substring(6, 9)
  if (street === '000') {
    return 3
  }
  const community = areaId.substring(9, 12)
  if (community === '000') {
    return 4
  }
  const other = areaId.substring(12, 15)
  if (other === '000') {
    return 5
  }
  return -1
}

export const replaceCity = (areaId) => {
  return `${areaId.substring(0, 2)}01${areaId.substring(4, 18)}`
}

export const getMunicipalityAreaId = (areaId) => {
  const directlyCity = isMunicipality(areaId)
  let areaIdData = areaId
  if (directlyCity) {
    if (checkAreaLevel(areaId) === 1) {
      areaIdData = replaceCity(areaId)
    }
  }
  return { areaIdData, directlyCity }
}
