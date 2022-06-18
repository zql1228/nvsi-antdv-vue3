import { request } from '@/server/conf/index'
!(function(window, document) {
  var __als11 = ['province', 'city', 'county', 'street', 'community', 'team']
  var hashtable = function() {
    this.keys = {}
  }

  hashtable._k_ = 'key'
  hashtable.prototype.contains = function(d) {
    if (this.count == 0) {
      return false
    }
    if (d != null && !(typeof d == 'string' && d.startsWith(hashtable._k_))) {
      d = 'key_' + d
    }
    return Object.prototype.hasOwnProperty.call(this.keys, d)
  }
  hashtable.prototype.count = 0
  hashtable.prototype.size = function() {
    return this.count
  }
  hashtable.prototype.getkey = function(d) {
    if (d.startsWith(hashtable._k_ + '_')) {
      return d.substring(4)
    }
  }
  hashtable.prototype.add = function(d, g) {
    if (d != null && !(typeof d == 'string' && d.startsWith(hashtable._k_))) {
      d = 'key_' + d
    }
    if (this.contains(d)) {
      return this
    }
    this.keys[d] = g
    this.count++
    return this
  }
  hashtable.prototype.getvalue = function(d) {
    if (d != null && !(typeof d == 'string' && d.startsWith(hashtable._k_))) {
      d = 'key_' + d
    }
    return this.keys[d]
  }
  hashtable.prototype.replace = function(g, d) {
    if (g != null && !(typeof g == 'string' && g.startsWith(hashtable._k_))) {
      g = 'key_' + g
    }
    if (this.contains(g)) {
      this.keys[g] = d
    }
    return this
  }
  hashtable.prototype.remove = function(d) {
    if (d != null && !(typeof d == 'string' && d.startsWith(hashtable._k_))) {
      d = 'key_' + d
    }
    if (!this.contains(d)) {
      return false
    }
    try {
      this.count = this.count - 1
      this.keys[d] = null
    } finally {
      delete this.keys[d]
    }
    return this
  }
  hashtable.prototype.saferemove = function(d) {
    if (d != null && !(typeof d == 'string' && d.startsWith(hashtable._k_))) {
      d = 'key_' + d
    }
    delete this.keys[d]
    this.count--
    return this
  }
  hashtable.prototype.clear = function() {
    this.keys = null
    this.keys = {}
    this.count = 0
  }
  hashtable.prototype.clone = function() {
    var h = this.keys
    var g = new hashtable()
    for (var d in h) {
      g.add(d, this.getvalue(d))
    }
    return g
  }

  var commfields = {
    instance: 'instance',
    ggc: '___global_GC_Flage',
    gcfs: '[_GC=',
    gcfe: ']',
    gcf: '_GCA',
    gco: new hashtable(),
    string: 'string',
    idpre: '#',
    value: 'value',
    ct: 'ct',
    cttype: 'cttype',
    ht: 'ht',
    ctf: 'ctf',
    ctg: 'ctg',
    tpof: 'tpof',
    tag: 'tagName',
    bindfiled: 'bindfiled_',
    bl: '&nbsp',
    vv: '@v',
    vn: '@n',
    vid: '@i',
    bt: 'bt',
    md: 'md',
    _value: '_value',
    c: 1,
    tpo:
      "<a ctf='table_tpo' style='font-size:12px' href='javascript:void(0)' tpof='@v'>@n</a>",
    tpos: '|',
    tpos2: ':',
    rsccv: '___codevalue___',
    sncel:
      "<input class='LC_form-input' ctf='table_chk' type='checkbox' name='i' id='i1'><span></span><i>@sn</i>",
    pge:
      "@pageNum<font style='color: #001693;font-weight: bold;text-align:center;width:8px;'>/</font>@pageCount页 共@count条",
    rsc: 'com.longrise.LEAP.Base.Objects.ResultSet',
    addflag:
      "<DIV class='lgimgselbtn lgimg_delete'  ctf='table_deleterow' title='删除'></DIV>",
  }

  function QueryParameters() {}
  QueryParameters.prototype.javaClass =
    'com.longrise.LEAP.Base.Objects.QueryParameter'
  QueryParameters.prototype.setGroup = function(d) {
    if (String.isEmpty(d)) {
      this.group = null
    } else {
      d += ''
      d = d.Trim().toLowerCase()
      this.group = d
    }
  }

  var SearchParameters = function() {}
  SearchParameters.prototype.javaClass =
    'com.longrise.LEAP.Base.Objects.SearchParameters'
  var JavaDate = function() {}
  JavaDate.prototype.javaClass = 'java.util.Date'
  SearchParameters.prototype.setExtendQuery = function(d) {
    if (d != null) {
      this.extendQuery = d
    }
  }
  SearchParameters.prototype.setPrefixParameter = function(d) {
    if (d != null) {
      this.prefixParameter = d
    }
  }
  SearchParameters.prototype.addParameter = function(g, l, d, h) {
    if (this.parameters == null) {
      this.parameters = []
    }
    var j = new QueryParameters()
    j.name = g
    j.value = l
    if (d != null) {
      j.flag = d
    }
    if (h != null) {
      j.type = h
    }
    this.parameters.push(j)
    return j
  }
  SearchParameters.prototype.getParameter = function(g) {
    if (this.parameters == null) {
      return
    }
    var d = this.parameters.length
    for (var h = d - 1; h > -1; h--) {
      var j = this.parameters[h]
      if (j.name == g) {
        return j
      }
    }
  }
  SearchParameters.prototype.get = function(d) {
    return this.getParameter(d)
  }
  SearchParameters.prototype.add = function(g, j, d, h) {
    return this.addParameter(g, j, d, h)
  }
  SearchParameters.prototype.setGroupLogic = function(h, g) {
    if (h == null) {
      return
    }
    h += ''
    h = h.toLowerCase().Trim()
    if (g == 'or' || g == '2' || g == 2) {
      g = 2
    } else {
      g = 1
    }
    if (this.groups == null) {
      this.groups = []
    }
    if (this.groups.length > 0) {
      var d = this.groups.length
      for (var j = 0; j < d; j++) {
        if (this.groups[j].name == h) {
          return
        }
      }
    }
    this.groups.add({
      name: h,
      logic: g,
    })
  }
  SearchParameters.prototype.removeParameter = function(g) {
    if (this.parameters == null) {
      return
    }
    var d = this.parameters.length
    for (var h = d - 1; h > -1; h--) {
      var j = this.parameters[h]
      if (j.name == g) {
        this.parameters.remove(j)
      }
    }
  }
  SearchParameters.prototype.addField = function(d) {
    if (this.fields == null) {
      this.fields = []
    }
    if (d != null) {
      if (this.fields.indexOf(d) == -1) {
        this.fields.push(d)
      }
    }
  }
  SearchParameters.prototype.setOrder = function(d) {
    this.order = d
  }
  SearchParameters.prototype.getOrder = function() {
    return this.order
  }
  SearchParameters.prototype.setPageModule = function(d) {
    this.pageModule = d
  }
  SearchParameters.prototype.getPageModule = function() {
    return this.pageModule
  }
  SearchParameters.prototype.setDsConfig = function(d) {
    this.dsConfig = d
  }
  SearchParameters.prototype.getDsConfig = function() {
    return this.dsConfig
  }
  SearchParameters.prototype.setDesFields = function(d) {
    this.desFields = d
  }
  SearchParameters.prototype.getDesFields = function() {
    return this.desFields
  }
  SearchParameters.prototype.setCloseDes = function(d) {
    this.closeDes = d
  }
  SearchParameters.prototype.getCloseDes = function(d) {
    return this.closeDes
  }
  SearchParameters.prototype.setName = function(d) {
    this.name = d
  }
  SearchParameters.prototype.clone = function() {
    var j = new SearchParameters()
    j.name = this.name
    j.order = this.order
    j.pageModule = this.pageModule
    if (this.parameters != null && this.parameters.length > 0) {
      var d = this.parameters.length
      for (var g = 0; g < d; g++) {
        var h = this.parameters[g]
        j.addParameter(h.name, h.value, h.flag, h.type)
      }
    }
    if (this.fields != null && this.fields.length > 0) {
      var d = this.fields.length
      for (var g = 0; g < d; g++) {
        var h = this.fields[g]
        j.addField(h)
      }
    }
    if (this.groups != null && this.groups.length > 0) {
      var d = this.groups.length
      for (var g = 0; g < d; g++) {
        var h = this.groups[g]
        j.setGroupLogic(h.name, h.logic)
      }
    }
    return j
  }

  function request2(j) {
    return new Promise((resolve, reject) => {
      request({
        url: `?service=leap&callService=leap&returnJSON=true&method=${j.name}`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          Accept: '*/*',
          GETLID: '1',
          'Accept-Language': 'zh-Hans-CN,zh-Hans;q=0.5',
          'Data-Type': '2',
          'Post-Type': '1',
        },
        data: j.par,
      })
        .then((res) => {
          if (res && res.result) {
            resolve(res.result)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  var __colonyname = null

  function getCodeValue(r, g, q) {
    if (r == null || r == '') {
      return
    }
    var p = '__codetype_' + r.toLowerCase()
    if (g) {
      g = g.toString()
    }
    if (g != null && g.trim() != '') {
      var n = parsenum(g)
      if (n != null) {
        p += '__parentcode__' + n
      } else {
        p += '__parentcode__' + g
      }
    }
    var l = commfields.gco.getvalue(p)
    if (l == null) {
      var u = null
      var j = null
      if (__colonyname != null) {
        if (g == null || g.Trim() == '') {
          j = {
            name: 'LDA_getCodeValues2',
            par: {
              name: __colonyname,
              c: r,
            },
          }
        } else {
          j = {
            name: 'LDA_getCodeValuesByParentValue',
            par: {
              name: __colonyname,
              c: r,
              p: g,
            },
          }
        }
      } else {
        if (g == null || g.trim() == '') {
          j = {
            name: 'getCodeValues2',
            par: {
              c: r,
            },
          }
        } else {
          j = {
            name: 'getCodeValuesByParentValue',
            par: {
              c: r,
              p: g,
            },
          }
        }
      }
      if (q) {
        j.router = q
      }
      if (__als11.indexOf(r.toLowerCase().trim()) > -1) {
        j.router = 'leap'
      }

      return request2(j)
    }
  }

  var parsenum = function(g) {
    if (g == null || g == undefined || isNaN(g)) {
      return null
    }
    var d = Number(g)
    if (isNaN(d)) {
      return null
    }
    return d
  }
  window.QueryParameters = QueryParameters
  window.SearchParameters = SearchParameters
  window.getCodeValue = getCodeValue
})(window, document)
