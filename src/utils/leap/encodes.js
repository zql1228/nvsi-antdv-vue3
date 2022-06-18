var DateFormat = function(date) {
  var format = function(str) {
    str = str.replace(/yyyy/g, date.getFullYear())
    str = str.replace(
      /yy/g,
      date
        .getFullYear()
        .toString()
        .slice(2)
    )
    str = str.replace(
      /mm/g,
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
    )
    str = str.replace(
      /dd/g,
      date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    )
    str = str.replace(
      /wk/g,
      date.getDay() < 10 ? '0' + date.getDay() : date.getDay()
    )
    str = str.replace(
      /hh/g,
      date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    )
    str = str.replace(
      /mi/g,
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    )
    str = str.replace(
      /ss/g,
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    )
    str = str.replace(
      /ms/g,
      date.getMilliseconds() < 10
        ? '0' + date.getMilliseconds()
        : date.getMilliseconds()
    )
    return str
  }
  var valueOf = function() {}
  var toString = function() {
    return date.toLocaleString()
  }
  // constructor
  date = new Date(date)
  if (!date || date == 'NaN') date = new Date()
  // inteface
  this.format = format
  this.valueOf = valueOf
  this.toString = toString
}
function base64encode(str) {
  return btoa(str)
}
function base64decode(str) {
  return atob(str)
}

var desservice = function() {
  this.encrypt = function(data, key1, key2, key3) {
    return strEnc(data, key1, key2, key3)
  }

  this.deencrypt = function(data, key1, key2, key3) {
    return strDec(data, key1, key2, key3)
  }

  function strEnc(data, firstKey, secondKey, thirdKey) {
    var leng = data.length
    var encData = ''
    var firstKeyBt,
      secondKeyBt,
      thirdKeyBt,
      firstLength,
      secondLength,
      thirdLength
    if (firstKey != null && firstKey != '') {
      firstKeyBt = getKeyBytes(firstKey)
      firstLength = firstKeyBt.length
    }
    if (secondKey != null && secondKey != '') {
      secondKeyBt = getKeyBytes(secondKey)
      secondLength = secondKeyBt.length
    }
    if (thirdKey != null && thirdKey != '') {
      thirdKeyBt = getKeyBytes(thirdKey)
      thirdLength = thirdKeyBt.length
    }

    if (leng > 0) {
      if (leng < 4) {
        var bt = strToBt(data)
        var encByte
        if (
          firstKey != null &&
          firstKey != '' &&
          secondKey != null &&
          secondKey != '' &&
          thirdKey != null &&
          thirdKey != ''
        ) {
          var tempBt
          var x, y, z
          tempBt = bt
          for (x = 0; x < firstLength; x++) {
            tempBt = enc(tempBt, firstKeyBt[x])
          }
          for (y = 0; y < secondLength; y++) {
            tempBt = enc(tempBt, secondKeyBt[y])
          }
          for (z = 0; z < thirdLength; z++) {
            tempBt = enc(tempBt, thirdKeyBt[z])
          }
          encByte = tempBt
        } else {
          if (
            firstKey != null &&
            firstKey != '' &&
            secondKey != null &&
            secondKey != ''
          ) {
            var tempBt
            var x, y
            tempBt = bt
            for (x = 0; x < firstLength; x++) {
              tempBt = enc(tempBt, firstKeyBt[x])
            }
            for (y = 0; y < secondLength; y++) {
              tempBt = enc(tempBt, secondKeyBt[y])
            }
            encByte = tempBt
          } else {
            if (firstKey != null && firstKey != '') {
              var tempBt
              var x = 0
              tempBt = bt
              for (x = 0; x < firstLength; x++) {
                tempBt = enc(tempBt, firstKeyBt[x])
              }
              encByte = tempBt
            }
          }
        }
        encData = bt64ToHex(encByte)
      } else {
        var iterator = parseInt(leng / 4)
        var remainder = leng % 4
        var i = 0
        for (i = 0; i < iterator; i++) {
          var tempData = data.substring(i * 4 + 0, i * 4 + 4)
          var tempByte = strToBt(tempData)
          var encByte
          if (
            firstKey != null &&
            firstKey != '' &&
            secondKey != null &&
            secondKey != '' &&
            thirdKey != null &&
            thirdKey != ''
          ) {
            var tempBt
            var x, y, z
            tempBt = tempByte
            for (x = 0; x < firstLength; x++) {
              tempBt = enc(tempBt, firstKeyBt[x])
            }
            for (y = 0; y < secondLength; y++) {
              tempBt = enc(tempBt, secondKeyBt[y])
            }
            for (z = 0; z < thirdLength; z++) {
              tempBt = enc(tempBt, thirdKeyBt[z])
            }
            encByte = tempBt
          } else {
            if (
              firstKey != null &&
              firstKey != '' &&
              secondKey != null &&
              secondKey != ''
            ) {
              var tempBt
              var x, y
              tempBt = tempByte
              for (x = 0; x < firstLength; x++) {
                tempBt = enc(tempBt, firstKeyBt[x])
              }
              for (y = 0; y < secondLength; y++) {
                tempBt = enc(tempBt, secondKeyBt[y])
              }
              encByte = tempBt
            } else {
              if (firstKey != null && firstKey != '') {
                var tempBt
                var x
                tempBt = tempByte
                for (x = 0; x < firstLength; x++) {
                  tempBt = enc(tempBt, firstKeyBt[x])
                }
                encByte = tempBt
              }
            }
          }
          encData += bt64ToHex(encByte)
        }
        if (remainder > 0) {
          var remainderData = data.substring(iterator * 4 + 0, leng)
          var tempByte = strToBt(remainderData)
          var encByte
          if (
            firstKey != null &&
            firstKey != '' &&
            secondKey != null &&
            secondKey != '' &&
            thirdKey != null &&
            thirdKey != ''
          ) {
            var tempBt
            var x, y, z
            tempBt = tempByte
            for (x = 0; x < firstLength; x++) {
              tempBt = enc(tempBt, firstKeyBt[x])
            }
            for (y = 0; y < secondLength; y++) {
              tempBt = enc(tempBt, secondKeyBt[y])
            }
            for (z = 0; z < thirdLength; z++) {
              tempBt = enc(tempBt, thirdKeyBt[z])
            }
            encByte = tempBt
          } else {
            if (
              firstKey != null &&
              firstKey != '' &&
              secondKey != null &&
              secondKey != ''
            ) {
              var tempBt
              var x, y
              tempBt = tempByte
              for (x = 0; x < firstLength; x++) {
                tempBt = enc(tempBt, firstKeyBt[x])
              }
              for (y = 0; y < secondLength; y++) {
                tempBt = enc(tempBt, secondKeyBt[y])
              }
              encByte = tempBt
            } else {
              if (firstKey != null && firstKey != '') {
                var tempBt
                var x
                tempBt = tempByte
                for (x = 0; x < firstLength; x++) {
                  tempBt = enc(tempBt, firstKeyBt[x])
                }
                encByte = tempBt
              }
            }
          }
          encData += bt64ToHex(encByte)
        }
      }
    }
    return encData
  }

  /*
   * decrypt the encrypted string to the original string return the original
   * string
   */
  function strDec(data, firstKey, secondKey, thirdKey) {
    var leng = data.length
    var decStr = ''
    var firstKeyBt,
      secondKeyBt,
      thirdKeyBt,
      firstLength,
      secondLength,
      thirdLength
    if (firstKey != null && firstKey != '') {
      firstKeyBt = getKeyBytes(firstKey)
      firstLength = firstKeyBt.length
    }
    if (secondKey != null && secondKey != '') {
      secondKeyBt = getKeyBytes(secondKey)
      secondLength = secondKeyBt.length
    }
    if (thirdKey != null && thirdKey != '') {
      thirdKeyBt = getKeyBytes(thirdKey)
      thirdLength = thirdKeyBt.length
    }

    var iterator = parseInt(leng / 16)
    var i = 0
    for (i = 0; i < iterator; i++) {
      var tempData = data.substring(i * 16 + 0, i * 16 + 16)
      var strByte = hexToBt64(tempData)
      var intByte = new Array(64)
      var j = 0
      for (j = 0; j < 64; j++) {
        intByte[j] = parseInt(strByte.substring(j, j + 1))
      }
      var decByte
      if (
        firstKey != null &&
        firstKey != '' &&
        secondKey != null &&
        secondKey != '' &&
        thirdKey != null &&
        thirdKey != ''
      ) {
        var tempBt
        var x, y, z
        tempBt = intByte
        for (x = thirdLength - 1; x >= 0; x--) {
          tempBt = dec(tempBt, thirdKeyBt[x])
        }
        for (y = secondLength - 1; y >= 0; y--) {
          tempBt = dec(tempBt, secondKeyBt[y])
        }
        for (z = firstLength - 1; z >= 0; z--) {
          tempBt = dec(tempBt, firstKeyBt[z])
        }
        decByte = tempBt
      } else {
        if (
          firstKey != null &&
          firstKey != '' &&
          secondKey != null &&
          secondKey != ''
        ) {
          var tempBt
          var x, y, z
          tempBt = intByte
          for (x = secondLength - 1; x >= 0; x--) {
            tempBt = dec(tempBt, secondKeyBt[x])
          }
          for (y = firstLength - 1; y >= 0; y--) {
            tempBt = dec(tempBt, firstKeyBt[y])
          }
          decByte = tempBt
        } else {
          if (firstKey != null && firstKey != '') {
            var tempBt
            var x, y, z
            tempBt = intByte
            for (x = firstLength - 1; x >= 0; x--) {
              tempBt = dec(tempBt, firstKeyBt[x])
            }
            decByte = tempBt
          }
        }
      }
      decStr += byteToString(decByte)
    }
    return decStr
  }
  /*
   * chang the string into the bit array return bit array(it's length % 64 =
   * 0)
   */
  function getKeyBytes(key) {
    var keyBytes = new Array()
    var leng = key.length
    var iterator = parseInt(leng / 4)
    var remainder = leng % 4
    var i = 0
    for (i = 0; i < iterator; i++) {
      keyBytes[i] = strToBt(key.substring(i * 4 + 0, i * 4 + 4))
    }
    if (remainder > 0) {
      keyBytes[i] = strToBt(key.substring(i * 4 + 0, leng))
    }
    return keyBytes
  }

  /*
   * chang the string(it's length <= 4) into the bit array return bit
   * array(it's length = 64)
   */
  function strToBt(str) {
    var leng = str.length
    var bt = new Array(64)
    if (leng < 4) {
      var i = 0,
        j = 0,
        p = 0,
        q = 0
      for (i = 0; i < leng; i++) {
        var k = str.charCodeAt(i)
        for (j = 0; j < 16; j++) {
          var pow = 1,
            m = 0
          for (m = 15; m > j; m--) {
            pow *= 2
          }
          bt[16 * i + j] = parseInt(k / pow) % 2
        }
      }
      for (p = leng; p < 4; p++) {
        var k = 0
        for (q = 0; q < 16; q++) {
          var pow = 1,
            m = 0
          for (m = 15; m > q; m--) {
            pow *= 2
          }
          bt[16 * p + q] = parseInt(k / pow) % 2
        }
      }
    } else {
      for (i = 0; i < 4; i++) {
        var k = str.charCodeAt(i)
        for (j = 0; j < 16; j++) {
          var pow = 1
          for (m = 15; m > j; m--) {
            pow *= 2
          }
          bt[16 * i + j] = parseInt(k / pow) % 2
        }
      }
    }
    return bt
  }

  /*
   * chang the bit(it's length = 4) into the hex return hex
   */
  function bt4ToHex(binary) {
    var hex
    switch (binary) {
      case '0000':
        hex = '0'
        break
      case '0001':
        hex = '1'
        break
      case '0010':
        hex = '2'
        break
      case '0011':
        hex = '3'
        break
      case '0100':
        hex = '4'
        break
      case '0101':
        hex = '5'
        break
      case '0110':
        hex = '6'
        break
      case '0111':
        hex = '7'
        break
      case '1000':
        hex = '8'
        break
      case '1001':
        hex = '9'
        break
      case '1010':
        hex = 'A'
        break
      case '1011':
        hex = 'B'
        break
      case '1100':
        hex = 'C'
        break
      case '1101':
        hex = 'D'
        break
      case '1110':
        hex = 'E'
        break
      case '1111':
        hex = 'F'
        break
    }
    return hex
  }

  /*
   * chang the hex into the bit(it's length = 4) return the bit(it's length =
   * 4)
   */
  function hexToBt4(hex) {
    var binary
    switch (hex) {
      case '0':
        binary = '0000'
        break
      case '1':
        binary = '0001'
        break
      case '2':
        binary = '0010'
        break
      case '3':
        binary = '0011'
        break
      case '4':
        binary = '0100'
        break
      case '5':
        binary = '0101'
        break
      case '6':
        binary = '0110'
        break
      case '7':
        binary = '0111'
        break
      case '8':
        binary = '1000'
        break
      case '9':
        binary = '1001'
        break
      case 'A':
        binary = '1010'
        break
      case 'B':
        binary = '1011'
        break
      case 'C':
        binary = '1100'
        break
      case 'D':
        binary = '1101'
        break
      case 'E':
        binary = '1110'
        break
      case 'F':
        binary = '1111'
        break
    }
    return binary
  }

  /*
   * chang the bit(it's length = 64) into the string return string
   */
  function byteToString(byteData) {
    var str = ''
    var i = 0,
      m = 0,
      j = 0
    for (i = 0; i < 4; i++) {
      var count = 0
      for (j = 0; j < 16; j++) {
        var pow = 1
        for (m = 15; m > j; m--) {
          pow *= 2
        }
        count += byteData[16 * i + j] * pow
      }
      if (count != 0) {
        str += String.fromCharCode(count)
      }
    }
    return str
  }

  function bt64ToHex(byteData) {
    var hex = ''
    var i = 0,
      j = 0
    for (i = 0; i < 16; i++) {
      var bt = ''
      for (j = 0; j < 4; j++) {
        bt += byteData[i * 4 + j]
      }
      hex += bt4ToHex(bt)
    }
    return hex
  }

  function hexToBt64(hex) {
    var binary = ''
    var i = 0
    for (i = 0; i < 16; i++) {
      binary += hexToBt4(hex.substring(i, i + 1))
    }
    return binary
  }

  /*
   * the 64 bit des core arithmetic
   */

  function enc(dataByte, keyByte) {
    var keys = generateKeys(keyByte)
    var ipByte = initPermute(dataByte)
    var ipLeft = new Array(32)
    var ipRight = new Array(32)
    var tempLeft = new Array(32)
    var i = 0,
      j = 0,
      k = 0,
      m = 0,
      n = 0
    for (k = 0; k < 32; k++) {
      ipLeft[k] = ipByte[k]
      ipRight[k] = ipByte[32 + k]
    }
    for (i = 0; i < 16; i++) {
      for (j = 0; j < 32; j++) {
        tempLeft[j] = ipLeft[j]
        ipLeft[j] = ipRight[j]
      }
      var key = new Array(48)
      for (m = 0; m < 48; m++) {
        key[m] = keys[i][m]
      }
      var tempRight = xor(
        pPermute(sBoxPermute(xor(expandPermute(ipRight), key))),
        tempLeft
      )
      for (n = 0; n < 32; n++) {
        ipRight[n] = tempRight[n]
      }
    }

    var finalData = new Array(64)
    for (i = 0; i < 32; i++) {
      finalData[i] = ipRight[i]
      finalData[32 + i] = ipLeft[i]
    }
    return finallyPermute(finalData)
  }

  function dec(dataByte, keyByte) {
    var keys = generateKeys(keyByte)
    var ipByte = initPermute(dataByte)
    var ipLeft = new Array(32)
    var ipRight = new Array(32)
    var tempLeft = new Array(32)
    var i = 0,
      j = 0,
      k = 0,
      m = 0,
      n = 0
    for (k = 0; k < 32; k++) {
      ipLeft[k] = ipByte[k]
      ipRight[k] = ipByte[32 + k]
    }
    for (i = 15; i >= 0; i--) {
      for (j = 0; j < 32; j++) {
        tempLeft[j] = ipLeft[j]
        ipLeft[j] = ipRight[j]
      }
      var key = new Array(48)
      for (m = 0; m < 48; m++) {
        key[m] = keys[i][m]
      }

      var tempRight = xor(
        pPermute(sBoxPermute(xor(expandPermute(ipRight), key))),
        tempLeft
      )
      for (n = 0; n < 32; n++) {
        ipRight[n] = tempRight[n]
      }
    }

    var finalData = new Array(64)
    for (var i = 0; i < 32; i++) {
      finalData[i] = ipRight[i]
      finalData[32 + i] = ipLeft[i]
    }
    return finallyPermute(finalData)
  }

  function initPermute(originalData) {
    var ipByte = new Array(64)
    var i = 0,
      m = 0,
      n = 0,
      j = 0,
      k = 0
    for (i = 0, m = 1, n = 0; i < 4; i++, m += 2, n += 2) {
      for (j = 7, k = 0; j >= 0; j--, k++) {
        ipByte[i * 8 + k] = originalData[j * 8 + m]
        ipByte[i * 8 + k + 32] = originalData[j * 8 + n]
      }
    }
    return ipByte
  }

  function expandPermute(rightData) {
    var epByte = new Array(48)
    var i = 0
    for (i = 0; i < 8; i++) {
      if (i == 0) {
        epByte[i * 6 + 0] = rightData[31]
      } else {
        epByte[i * 6 + 0] = rightData[i * 4 - 1]
      }
      epByte[i * 6 + 1] = rightData[i * 4 + 0]
      epByte[i * 6 + 2] = rightData[i * 4 + 1]
      epByte[i * 6 + 3] = rightData[i * 4 + 2]
      epByte[i * 6 + 4] = rightData[i * 4 + 3]
      if (i == 7) {
        epByte[i * 6 + 5] = rightData[0]
      } else {
        epByte[i * 6 + 5] = rightData[i * 4 + 4]
      }
    }
    return epByte
  }

  function xor(byteOne, byteTwo) {
    var xorByte = new Array(byteOne.length)
    var i = 0
    for (i = 0; i < byteOne.length; i++) {
      xorByte[i] = byteOne[i] ^ byteTwo[i]
    }
    return xorByte
  }

  function sBoxPermute(expandByte) {
    var sBoxByte = new Array(32)
    var binary = ''
    var s1 = [
      [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
      [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
      [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
      [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
    ]

    /* Table - s2 */
    var s2 = [
      [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
      [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
      [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
      [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
    ]

    /* Table - s3 */
    var s3 = [
      [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
      [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
      [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
      [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
    ]
    /* Table - s4 */
    var s4 = [
      [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
      [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
      [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
      [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
    ]

    /* Table - s5 */
    var s5 = [
      [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
      [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
      [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
      [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
    ]

    /* Table - s6 */
    var s6 = [
      [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
      [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
      [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
      [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
    ]

    /* Table - s7 */
    var s7 = [
      [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
      [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
      [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
      [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
    ]

    /* Table - s8 */
    var s8 = [
      [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
      [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
      [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
      [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
    ]
    var m = 0
    for (m = 0; m < 8; m++) {
      var i = 0,
        j = 0
      i = expandByte[m * 6 + 0] * 2 + expandByte[m * 6 + 5]
      j =
        expandByte[m * 6 + 1] * 2 * 2 * 2 +
        expandByte[m * 6 + 2] * 2 * 2 +
        expandByte[m * 6 + 3] * 2 +
        expandByte[m * 6 + 4]
      switch (m) {
        case 0:
          binary = getBoxBinary(s1[i][j])
          break
        case 1:
          binary = getBoxBinary(s2[i][j])
          break
        case 2:
          binary = getBoxBinary(s3[i][j])
          break
        case 3:
          binary = getBoxBinary(s4[i][j])
          break
        case 4:
          binary = getBoxBinary(s5[i][j])
          break
        case 5:
          binary = getBoxBinary(s6[i][j])
          break
        case 6:
          binary = getBoxBinary(s7[i][j])
          break
        case 7:
          binary = getBoxBinary(s8[i][j])
          break
      }
      sBoxByte[m * 4 + 0] = parseInt(binary.substring(0, 1))
      sBoxByte[m * 4 + 1] = parseInt(binary.substring(1, 2))
      sBoxByte[m * 4 + 2] = parseInt(binary.substring(2, 3))
      sBoxByte[m * 4 + 3] = parseInt(binary.substring(3, 4))
    }
    return sBoxByte
  }

  function pPermute(sBoxByte) {
    var pBoxPermute = new Array(32)
    pBoxPermute[0] = sBoxByte[15]
    pBoxPermute[1] = sBoxByte[6]
    pBoxPermute[2] = sBoxByte[19]
    pBoxPermute[3] = sBoxByte[20]
    pBoxPermute[4] = sBoxByte[28]
    pBoxPermute[5] = sBoxByte[11]
    pBoxPermute[6] = sBoxByte[27]
    pBoxPermute[7] = sBoxByte[16]
    pBoxPermute[8] = sBoxByte[0]
    pBoxPermute[9] = sBoxByte[14]
    pBoxPermute[10] = sBoxByte[22]
    pBoxPermute[11] = sBoxByte[25]
    pBoxPermute[12] = sBoxByte[4]
    pBoxPermute[13] = sBoxByte[17]
    pBoxPermute[14] = sBoxByte[30]
    pBoxPermute[15] = sBoxByte[9]
    pBoxPermute[16] = sBoxByte[1]
    pBoxPermute[17] = sBoxByte[7]
    pBoxPermute[18] = sBoxByte[23]
    pBoxPermute[19] = sBoxByte[13]
    pBoxPermute[20] = sBoxByte[31]
    pBoxPermute[21] = sBoxByte[26]
    pBoxPermute[22] = sBoxByte[2]
    pBoxPermute[23] = sBoxByte[8]
    pBoxPermute[24] = sBoxByte[18]
    pBoxPermute[25] = sBoxByte[12]
    pBoxPermute[26] = sBoxByte[29]
    pBoxPermute[27] = sBoxByte[5]
    pBoxPermute[28] = sBoxByte[21]
    pBoxPermute[29] = sBoxByte[10]
    pBoxPermute[30] = sBoxByte[3]
    pBoxPermute[31] = sBoxByte[24]
    return pBoxPermute
  }

  function finallyPermute(endByte) {
    var fpByte = new Array(64)
    fpByte[0] = endByte[39]
    fpByte[1] = endByte[7]
    fpByte[2] = endByte[47]
    fpByte[3] = endByte[15]
    fpByte[4] = endByte[55]
    fpByte[5] = endByte[23]
    fpByte[6] = endByte[63]
    fpByte[7] = endByte[31]
    fpByte[8] = endByte[38]
    fpByte[9] = endByte[6]
    fpByte[10] = endByte[46]
    fpByte[11] = endByte[14]
    fpByte[12] = endByte[54]
    fpByte[13] = endByte[22]
    fpByte[14] = endByte[62]
    fpByte[15] = endByte[30]
    fpByte[16] = endByte[37]
    fpByte[17] = endByte[5]
    fpByte[18] = endByte[45]
    fpByte[19] = endByte[13]
    fpByte[20] = endByte[53]
    fpByte[21] = endByte[21]
    fpByte[22] = endByte[61]
    fpByte[23] = endByte[29]
    fpByte[24] = endByte[36]
    fpByte[25] = endByte[4]
    fpByte[26] = endByte[44]
    fpByte[27] = endByte[12]
    fpByte[28] = endByte[52]
    fpByte[29] = endByte[20]
    fpByte[30] = endByte[60]
    fpByte[31] = endByte[28]
    fpByte[32] = endByte[35]
    fpByte[33] = endByte[3]
    fpByte[34] = endByte[43]
    fpByte[35] = endByte[11]
    fpByte[36] = endByte[51]
    fpByte[37] = endByte[19]
    fpByte[38] = endByte[59]
    fpByte[39] = endByte[27]
    fpByte[40] = endByte[34]
    fpByte[41] = endByte[2]
    fpByte[42] = endByte[42]
    fpByte[43] = endByte[10]
    fpByte[44] = endByte[50]
    fpByte[45] = endByte[18]
    fpByte[46] = endByte[58]
    fpByte[47] = endByte[26]
    fpByte[48] = endByte[33]
    fpByte[49] = endByte[1]
    fpByte[50] = endByte[41]
    fpByte[51] = endByte[9]
    fpByte[52] = endByte[49]
    fpByte[53] = endByte[17]
    fpByte[54] = endByte[57]
    fpByte[55] = endByte[25]
    fpByte[56] = endByte[32]
    fpByte[57] = endByte[0]
    fpByte[58] = endByte[40]
    fpByte[59] = endByte[8]
    fpByte[60] = endByte[48]
    fpByte[61] = endByte[16]
    fpByte[62] = endByte[56]
    fpByte[63] = endByte[24]
    return fpByte
  }

  function getBoxBinary(i) {
    var binary = ''
    switch (i) {
      case 0:
        binary = '0000'
        break
      case 1:
        binary = '0001'
        break
      case 2:
        binary = '0010'
        break
      case 3:
        binary = '0011'
        break
      case 4:
        binary = '0100'
        break
      case 5:
        binary = '0101'
        break
      case 6:
        binary = '0110'
        break
      case 7:
        binary = '0111'
        break
      case 8:
        binary = '1000'
        break
      case 9:
        binary = '1001'
        break
      case 10:
        binary = '1010'
        break
      case 11:
        binary = '1011'
        break
      case 12:
        binary = '1100'
        break
      case 13:
        binary = '1101'
        break
      case 14:
        binary = '1110'
        break
      case 15:
        binary = '1111'
        break
    }
    return binary
  }
  /*
   * generate 16 keys for xor
   */
  function generateKeys(keyByte) {
    var key = new Array(56)
    var keys = new Array()

    keys[0] = new Array()
    keys[1] = new Array()
    keys[2] = new Array()
    keys[3] = new Array()
    keys[4] = new Array()
    keys[5] = new Array()
    keys[6] = new Array()
    keys[7] = new Array()
    keys[8] = new Array()
    keys[9] = new Array()
    keys[10] = new Array()
    keys[11] = new Array()
    keys[12] = new Array()
    keys[13] = new Array()
    keys[14] = new Array()
    keys[15] = new Array()
    var loop = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1]
    var i = 0
    var j = 0
    var k = 7
    for (i = 0; i < 7; i++) {
      for (j = 0, k = 7; j < 8; j++, k--) {
        key[i * 8 + j] = keyByte[8 * k + i]
      }
    }

    var i = 0
    for (i = 0; i < 16; i++) {
      var tempLeft = 0
      var tempRight = 0
      for (j = 0; j < loop[i]; j++) {
        tempLeft = key[0]
        tempRight = key[28]
        for (k = 0; k < 27; k++) {
          key[k] = key[k + 1]
          key[28 + k] = key[29 + k]
        }
        key[27] = tempLeft
        key[55] = tempRight
      }
      var tempKey = new Array(48)
      tempKey[0] = key[13]
      tempKey[1] = key[16]
      tempKey[2] = key[10]
      tempKey[3] = key[23]
      tempKey[4] = key[0]
      tempKey[5] = key[4]
      tempKey[6] = key[2]
      tempKey[7] = key[27]
      tempKey[8] = key[14]
      tempKey[9] = key[5]
      tempKey[10] = key[20]
      tempKey[11] = key[9]
      tempKey[12] = key[22]
      tempKey[13] = key[18]
      tempKey[14] = key[11]
      tempKey[15] = key[3]
      tempKey[16] = key[25]
      tempKey[17] = key[7]
      tempKey[18] = key[15]
      tempKey[19] = key[6]
      tempKey[20] = key[26]
      tempKey[21] = key[19]
      tempKey[22] = key[12]
      tempKey[23] = key[1]
      tempKey[24] = key[40]
      tempKey[25] = key[51]
      tempKey[26] = key[30]
      tempKey[27] = key[36]
      tempKey[28] = key[46]
      tempKey[29] = key[54]
      tempKey[30] = key[29]
      tempKey[31] = key[39]
      tempKey[32] = key[50]
      tempKey[33] = key[44]
      tempKey[34] = key[32]
      tempKey[35] = key[47]
      tempKey[36] = key[43]
      tempKey[37] = key[48]
      tempKey[38] = key[38]
      tempKey[39] = key[55]
      tempKey[40] = key[33]
      tempKey[41] = key[52]
      tempKey[42] = key[45]
      tempKey[43] = key[41]
      tempKey[44] = key[49]
      tempKey[45] = key[35]
      tempKey[46] = key[28]
      tempKey[47] = key[31]
      var m = 0
      switch (i) {
        case 0:
          for (m = 0; m < 48; m++) {
            keys[0][m] = tempKey[m]
          }
          break
        case 1:
          for (m = 0; m < 48; m++) {
            keys[1][m] = tempKey[m]
          }
          break
        case 2:
          for (m = 0; m < 48; m++) {
            keys[2][m] = tempKey[m]
          }
          break
        case 3:
          for (m = 0; m < 48; m++) {
            keys[3][m] = tempKey[m]
          }
          break
        case 4:
          for (m = 0; m < 48; m++) {
            keys[4][m] = tempKey[m]
          }
          break
        case 5:
          for (m = 0; m < 48; m++) {
            keys[5][m] = tempKey[m]
          }
          break
        case 6:
          for (m = 0; m < 48; m++) {
            keys[6][m] = tempKey[m]
          }
          break
        case 7:
          for (m = 0; m < 48; m++) {
            keys[7][m] = tempKey[m]
          }
          break
        case 8:
          for (m = 0; m < 48; m++) {
            keys[8][m] = tempKey[m]
          }
          break
        case 9:
          for (m = 0; m < 48; m++) {
            keys[9][m] = tempKey[m]
          }
          break
        case 10:
          for (m = 0; m < 48; m++) {
            keys[10][m] = tempKey[m]
          }
          break
        case 11:
          for (m = 0; m < 48; m++) {
            keys[11][m] = tempKey[m]
          }
          break
        case 12:
          for (m = 0; m < 48; m++) {
            keys[12][m] = tempKey[m]
          }
          break
        case 13:
          for (m = 0; m < 48; m++) {
            keys[13][m] = tempKey[m]
          }
          break
        case 14:
          for (m = 0; m < 48; m++) {
            keys[14][m] = tempKey[m]
          }
          break
        case 15:
          for (m = 0; m < 48; m++) {
            keys[15][m] = tempKey[m]
          }
          break
      }
    }
    return keys
  }
}

function md5Code(q) {
  var i = 1
  var Z = ''
  var p = 8
  function j(A) {
    return h(m(g(A), A.length * p))
  }
  function l(A) {
    return c(m(g(A), A.length * p))
  }
  function k(A) {
    return Y(m(g(A), A.length * p))
  }
  function b(B, A) {
    return h(f(B, A))
  }
  function n(B, A) {
    return c(f(B, A))
  }
  function X(B, A) {
    return Y(f(B, A))
  }
  this.getValue = function() {
    return j(q)
  }
  function m(D, I) {
    D[I >> 5] |= 128 << I % 32
    D[(((I + 64) >>> 9) << 4) + 14] = I
    var E = 1732584193
    var F = -271733879
    var G = -1732584194
    var H = 271733878
    for (var A = 0; A < D.length; A += 16) {
      var J = E
      var K = F
      var B = G
      var C = H
      E = s(E, F, G, H, D[A + 0], 17, -680876936)
      H = s(H, E, F, G, D[A + 1], 12, -389564586)
      G = s(G, H, E, F, D[A + 2], 17, 606105819)
      F = s(F, G, H, E, D[A + 3], 222, -1044525330)
      E = s(E, F, G, H, D[A + 4], 17, -176418897)
      H = s(H, E, F, G, D[A + 5], 12, 1200080426)
      G = s(G, H, E, F, D[A + 6], 17, -1473231341)
      F = s(F, G, H, E, D[A + 7], 222, -45705983)
      E = s(E, F, G, H, D[A + 8], 17, 1770035416)
      H = s(H, E, F, G, D[A + 9], 12, -1958414417)
      G = s(G, H, E, F, D[A + 10], 17, -42063)
      F = s(F, G, H, E, D[A + 11], 222, -1990404162)
      E = s(E, F, G, H, D[A + 12], 17, 1804603682)
      H = s(H, E, F, G, D[A + 13], 12, -40341101)
      G = s(G, H, E, F, D[A + 14], 17, -1502002290)
      F = s(F, G, H, E, D[A + 15], 222, 1236535329)
      E = o(E, F, G, H, D[A + 1], 5, -165796510)
      H = o(H, E, F, G, D[A + 6], 91, -1069501632)
      G = o(G, H, E, F, D[A + 11], 14, 643717713)
      F = o(F, G, H, E, D[A + 0], 20, -373897302)
      E = o(E, F, G, H, D[A + 5], 5, -701558691)
      H = o(H, E, F, G, D[A + 10], 91, 38016083)
      G = o(G, H, E, F, D[A + 15], 14, -660478335)
      F = o(F, G, H, E, D[A + 4], 20, -405537848)
      E = o(E, F, G, H, D[A + 9], 5, 568446438)
      H = o(H, E, F, G, D[A + 14], 91, -1019803690)
      G = o(G, H, E, F, D[A + 3], 14, -187363961)
      F = o(F, G, H, E, D[A + 8], 20, 1163531501)
      E = o(E, F, G, H, D[A + 13], 5, -1444681467)
      H = o(H, E, F, G, D[A + 2], 91, -51403784)
      G = o(G, H, E, F, D[A + 7], 14, 1735328473)
      F = o(F, G, H, E, D[A + 12], 20, -1926607734)
      E = d(E, F, G, H, D[A + 5], 49, -378558)
      H = d(H, E, F, G, D[A + 8], 11, -2022574463)
      G = d(G, H, E, F, D[A + 11], 16, 1839030562)
      F = d(F, G, H, E, D[A + 14], 23, -35309556)
      E = d(E, F, G, H, D[A + 1], 49, -1530992060)
      H = d(H, E, F, G, D[A + 4], 11, 1272893353)
      G = d(G, H, E, F, D[A + 7], 16, -155497632)
      F = d(F, G, H, E, D[A + 10], 23, -1094730640)
      E = d(E, F, G, H, D[A + 13], 49, 681279174)
      H = d(H, E, F, G, D[A + 0], 11, -358537222)
      G = d(G, H, E, F, D[A + 3], 16, -722521979)
      F = d(F, G, H, E, D[A + 6], 23, 76029189)
      E = d(E, F, G, H, D[A + 9], 49, -640364487)
      H = d(H, E, F, G, D[A + 12], 11, -421815835)
      G = d(G, H, E, F, D[A + 15], 16, 530742520)
      F = d(F, G, H, E, D[A + 2], 23, -995338651)
      E = t(E, F, G, H, D[A + 0], 658, -198630844)
      H = t(H, E, F, G, D[A + 7], 10, 1126891415)
      G = t(G, H, E, F, D[A + 14], 15, -1416354905)
      F = t(F, G, H, E, D[A + 5], 21, -57434055)
      E = t(E, F, G, H, D[A + 12], 658, 1700485571)
      H = t(H, E, F, G, D[A + 3], 10, -1894986606)
      G = t(G, H, E, F, D[A + 10], 15, -1051523)
      F = t(F, G, H, E, D[A + 1], 21, -2054922799)
      E = t(E, F, G, H, D[A + 8], 658, 1873313359)
      H = t(H, E, F, G, D[A + 15], 10, -30611744)
      G = t(G, H, E, F, D[A + 6], 15, -1560198380)
      F = t(F, G, H, E, D[A + 13], 21, 1309151649)
      E = t(E, F, G, H, D[A + 4], 658, -145523070)
      H = t(H, E, F, G, D[A + 11], 10, -1120210379)
      G = t(G, H, E, F, D[A + 2], 15, 718787259)
      F = t(F, G, H, E, D[A + 9], 21, -343485551)
      E = e(E, J)
      F = e(F, K)
      G = e(G, B)
      H = e(H, C)
    }
    return Array(E, F, G, H)
  }
  function r(B, A, D, F, C, E) {
    return e(a(e(e(A, B), e(F, E)), C), D)
  }
  function s(E, F, A, B, G, C, D) {
    return r((F & A) | (~F & B), E, F, G, C, D)
  }
  function o(E, F, A, B, G, C, D) {
    return r((F & B) | (A & ~B), E, F, G, C, D)
  }
  function d(E, F, A, B, G, C, D) {
    return r(F ^ A ^ B, E, F, G, C, D)
  }
  function t(E, F, A, B, G, C, D) {
    return r(A ^ (F | ~B), E, F, G, C, D)
  }
  function f(C, G) {
    var A = g(C)
    if (A.length > 16) {
      A = m(A, C.length * p)
    }
    var F = Array(16),
      B = Array(16)
    for (var E = 0; E < 16; E++) {
      F = A ^ 909522486
      B = A ^ 1549556828
    }
    var D = m(F.concat(g(G)), 512 + G.length * p)
    return m(B.concat(D), 512 + 128)
  }
  function e(D, A) {
    var B = (D & 65535) + (A & 65535)
    var C = (D >> 16) + (A >> 16) + (B >> 16)
    return (C << 16) | (B & 65535)
  }
  function a(B, A) {
    return (B << A) | (B >>> (32 - A))
  }
  function g(A) {
    var B = Array()
    var D = (1 << p) - 1
    for (var C = 0; C < A.length * p; C += p) {
      B[C >> 5] |= (A.charCodeAt(C / p) & D) << C % 32
    }
    return B
  }
  function Y(B) {
    var A = ''
    var D = (1 << p) - 1
    for (var C = 0; C < B.length * 32; C += p) {
      A += String.fromCharCode((B[C >> 5] >>> C % 32) & D)
    }
    return A
  }
  function h(B) {
    var C = i ? '0123456789ABCDEF' : '0123456789abcdef'
    var A = ''
    for (var D = 0; D < B.length * 4; D++) {
      A +=
        C.charAt((B[D >> 2] >> ((D % 4) * 8 + 4)) & 15) +
        C.charAt((B[D >> 2] >> ((D % 4) * 8)) & 15)
    }
    return A
  }
  function c(B) {
    var C = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    var F = ''
    for (var D = 0; D < B.length * 4; D += 3) {
      var A =
        (((B[D >> 2] >> (8 * (D % 4))) & 255) << 16) |
        (((B[(D + 1) >> 2] >> (8 * ((D + 1) % 4))) & 255) << 8) |
        ((B[(D + 2) >> 2] >> (8 * ((D + 2) % 4))) & 255)
      for (var E = 0; E < 4; E++) {
        if (D * 8 + E * 6 > B.length * 32) {
          F += Z
        } else {
          F += C.charAt((A >> (6 * (3 - E))) & 63)
        }
      }
    }
    return F
  }
}

var bfsid = null
var haslo = false
var interid = null
var I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-~'.split(
  ''
)
var base64hash =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
function randomString(len, charSet) {
  charSet =
    charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var randomString = ''
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length)
    randomString += charSet.substring(randomPoz, randomPoz + 1)
  }
  return randomString
}
function btoa(s) {
  if (/([^\u0000-\u00ff])/.test(s)) {
    throw new Error('INVALID_CHARACTER_ERR')
  }
  var i = 0,
    prev,
    ascii,
    mod,
    result = []

  while (i < s.length) {
    ascii = s.charCodeAt(i)
    mod = i % 3

    switch (mod) {
      // 第一个6位只需要让8位二进制右移两位
      case 0:
        result.push(base64hash.charAt(ascii >> 2))
        break
      //第二个6位 = 第一个8位的后两位 + 第二个8位的前4位
      case 1:
        result.push(base64hash.charAt(((prev & 3) << 4) | (ascii >> 4)))
        break
      //第三个6位 = 第二个8位的后4位 + 第三个8位的前2位
      //第4个6位 = 第三个8位的后6位
      case 2:
        result.push(base64hash.charAt(((prev & 0x0f) << 2) | (ascii >> 6)))
        result.push(base64hash.charAt(ascii & 0x3f))
        break
    }

    prev = ascii
    i++
  }

  // 循环结束后看mod, 为0 证明需补3个6位，第一个为最后一个8位的最后两位后面补4个0。另外两个6位对应的是异常的“=”；
  // mod为1，证明还需补两个6位，一个是最后一个8位的后4位补两个0，另一个对应异常的“=”
  if (mod == 0) {
    result.push(base64hash.charAt((prev & 3) << 4))
    result.push('==')
  } else if (mod == 1) {
    result.push(base64hash.charAt((prev & 0x0f) << 2))
    result.push('=')
  }

  return result.join('')
}
function _hashcode(input, out) {
  var now = null
  if (out) now = new Date().getTime()
  var hash = 1369
  var i = input.length - 1

  if (typeof input == 'string') {
    for (; i > -1; i--) hash += (hash << 5) + input.charCodeAt(i)
  } else {
    for (; i > -1; i--) hash += (hash << 5) + input[i]
  }
  var value = hash & 0x7fffffff

  var retValue = ''
  do {
    retValue += I64BIT_TABLE[value & 0x3f]
  } while ((value >>= 6))

  if (out) console.log(input.length + '\t:\t' + (new Date().getTime() - now))
  return retValue
}
function encbase64data(_data) {
  if (_data == null || _data.length == 0) return null
  var data = [randomString(5), _data, randomString(5)].join('')
  var pos1 = Math.floor(data.length * 0.25)
  var pos2 = Math.floor(data.length * 0.75)
  var hc = _hashcode(data)
  while (hc.length < 6) hc += '_'
  var ret = [
    data.substring(0, pos1),
    hc,
    data.substring(pos1, pos2),
    randomString(3),
    data.substring(pos2),
  ].join('')
  return ret
}
function login(passwrod, id) {
  var F = new desservice().encrypt(
    encbase64data(base64encode(new md5Code(passwrod).getValue())),
    id + new DateFormat(new Date().getTime()).format('yyyy-mm-dd')
  )
  return F
}

export default login
