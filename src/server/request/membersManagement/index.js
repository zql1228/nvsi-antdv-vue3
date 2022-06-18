import { rpcPost } from '../../conf'
export default {
  // 根据身份证查询志愿者 //查询志愿者详情
  getVolunteerInfo(bean) {
    return new Promise((resolve) => {
      rpcPost('getVolunteerInfo', { bean }).then((res) => {
        let dataSource = null
        if (res.code == 0 && res.data) {
          dataSource = res.data
        } else {
          dataSource = {}
        }
        resolve(dataSource)
      })
    })
  },
  // 下载志愿者证的连接
  produceVolunteerServiceCard(bean) {
    return rpcPost('refreshVolunteerCardHandleFortis', { bean })
  },

  //队伍成员添加
  addManyTeamMember(bean) {
    return new Promise((resolve) => {
      rpcPost('addManyTeamMember', { bean }).then((res) => {
        let dataSource = null
        // console.log(res)
        if (res.code == '0' && res.data) {
          dataSource = res.data
        } else {
          dataSource = ''
        }
        resolve(dataSource)
      })
    })
  },
  //队伍成员删除
  delManyTeamMemberFortis(bean) {
    return new Promise((resolve, reject) => {
      rpcPost('delManyTeamMemberFortis', { bean })
        .then((res) => {
          let dataSource = null
          if (res) {
            dataSource = res
          }
          resolve(dataSource)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  //成员管理-队伍成员批量导出
  exportTeamVolExcelFortis(bean) {
    return new Promise((resolve) => {
      rpcPost('exportTeamVolExcelFortis', { bean }).then((res) => {
        let dataSource = null
        console.log(res)
        if (res.code === 0 && res.data) {
          dataSource = res.data
        }
        resolve(dataSource)
      })
    })
  },
  //成员管理-待审核队伍-批量同意拒绝
  agreeOrRefuseJoinTeam(bean) {
    return new Promise((resolve) => {
      rpcPost('agreeOrRefuseJoinTeam', { bean }).then((res) => {
        let dataSource = null
        console.log(res, 'rrrr')
        if (res.message) {
          dataSource = res.message
        }
        resolve(dataSource)
      })
    })
  },

  // 成员管理-待审核队伍-批量同意拒绝
  agreeOrRefuseJoinTeamNew(bean) {
    return rpcPost('agreeOrRefuseJoinTeam', { bean })
  },

  // 成员管理-待审核项目-批量同意拒绝
  agreeOrRefuseJoinProjectNew(bean) {
    return rpcPost('agreeOrRefuseJoinProject', { bean })
  },

  //成员管理-待审核项目-批量同意拒绝
  agreeOrRefuseJoinProject(bean) {
    return new Promise((resolve) => {
      rpcPost('agreeOrRefuseJoinProject', { bean }).then((res) => {
        let dataSource = null
        if (res.message) {
          dataSource = res.message
        }
        resolve(dataSource)
      })
    })
  },
  //成员管理-待审核项目-弹出详情
  getVolunteerInfoOnProject(bean) {
    return new Promise((resolve) => {
      rpcPost('getVolunteerInfoOnProject', { bean }).then((res) => {
        let dataSource = null
        if (res.code === 0 && res.data) {
          dataSource = res.data
        }
        resolve(dataSource)
      })
    })
  },
  // 成员管理-队伍成员-修改手机号
  updateTeamVolPhoneFortis(bean) {
    return new Promise((resolve) => {
      rpcPost('updateTeamVolPhoneFortis', { bean }).then((res) => {
        let dataSource = null
        if (res.message) {
          dataSource = res.message
        }
        resolve(dataSource)
      })
    })
  },
  //// 成员管理-队伍成员-修改手机号-操作记录
  queryOperationRecordFortis(bean) {
    return new Promise((resolve) => {
      rpcPost('queryOperationRecordFortis', { bean }).then((res) => {
        let dataSource = null
        if (res.code === 0 && res.data) {
          dataSource = res.data
        }
        resolve(dataSource)
      })
    })
  },
  //成员管理-项目成员-更换岗位
  mostVolChangeJobFortis(bean) {
    return new Promise((resolve) => {
      rpcPost('mostVolChangeJobFortis', { bean }).then((res) => {
        let dataSource = null
        if (res.message) {
          dataSource = res.message
        }
        resolve(dataSource)
      })
    })
  },
  //通用查询岗位
  commonChangeJobFortis(bean) {
    return new Promise((resolve) => {
      rpcPost('commonChangeJobFortis', { bean }).then((res) => {
        let dataSource = null
        if (res.code === 0 && res.data) {
          dataSource = res.data
        }
        resolve(dataSource)
      })
    })
  },
  //成员管理-项目成员-删除成员
  delProjectVol(bean) {
    return rpcPost('delProjectVol', { bean })
  },
  // delProjectVol(bean) {
  //   return new Promise((resolve) => {
  //     rpcPost('delProjectVol', { bean }).then((res) => {
  //       console.log(res, 'res')
  //       let dataSource = null
  //       if (res.code === 0 && res.message) {
  //         dataSource = res.message
  //       }
  //       resolve(dataSource)
  //     })
  //   })
  // },
  //查询队伍下的下级队伍
  queryNextTeamPage(bean) {
    return new Promise((resolve) => {
      rpcPost('queryNextTeamPage', { bean }).then((res) => {
        let dataSource = null
        if (res.code == 0 && res.data) {
          dataSource = res.data
        }
        resolve(dataSource)
      })
    })
  },
  //邀请本队伍成员加入项目
  addGroupVolInProject(bean) {
    return new Promise((resolve) => {
      rpcPost('addGroupVolInProject', { bean }).then((res) => {
        let dataSource = null
        if (res) {
          dataSource = res
        }
        resolve(dataSource)
      })
    })
  },
  //邀请队伍外成员加入项目
  addManyProjectMember(bean) {
    return new Promise((resolve) => {
      rpcPost('addManyProjectMember', { bean }).then((res) => {
        let dataSource = null
        if (res) {
          dataSource = res
        }
        resolve(dataSource)
      })
    })
  },
  //邀请系统外成员加入项目
  addOutsideTheSystem(bean) {
    return new Promise((resolve) => {
      rpcPost('addOutsideTheSystem', { bean }).then((res) => {
        let dataSource = null
        if (res) {
          dataSource = res
        }
        resolve(dataSource)
      })
    })
  },
  //填写评价提交评价
  projectEvaluationVolFortis(bean) {
    return new Promise((resolve) => {
      rpcPost('projectEvaluationVolFortis', { bean }).then((res) => {
        let dataSource = null
        if (res.message) {
          dataSource = res.message
        }
        resolve(dataSource)
      })
    })
  },
  //批量取消邀请
  cancelInvitationsInBulkVolFortis(bean) {
    return new Promise((resolve) => {
      rpcPost('cancelInvitationsInBulkVolFortis', { bean }).then((res) => {
        let dataSource = null
        if (res.message) {
          dataSource = res.message
        }
        resolve(dataSource)
      })
    })
  },
  //批量删除记录
  deleteRejectionRecordsInBulkFortis(bean) {
    return new Promise((resolve) => {
      rpcPost('deleteRejectionRecordsInBulkFortis', { bean }).then((res) => {
        let dataSource = null
        if (res.message) {
          dataSource = res.message
        }
        resolve(dataSource)
      })
    })
  },
  // 查询志愿者详情
  queryVolunteerInfor(bean) {
    return new Promise((resolve) => {
      rpcPost('queryVolunteerInfor', { bean }).then((res) => {
        let dataSource = null
        if (res.code == 0 && res.data) {
          dataSource = res.data
        }
        resolve(dataSource)
      })
    })
  },

  // 志愿者详情
  // getVolunteerInfo(bean) {
  //   return new Promise((resolve) => {
  //     rpcPost('getVolunteerInfo', { bean }).then((res) => {
  //       let dataSource = {}
  //       if (res.code == 0 && res.data) {
  //         dataSource = res.data
  //       }
  //       resolve(dataSource)
  //     })
  //   })
  // },
  //志愿者是否实名通过
  checkTeamVolRealNameFortis(bean) {
    return new Promise((resolve) => {
      rpcPost('checkTeamVolRealNameFortis', { bean }).then((res) => {
        let dataSource = []
        // if (res.code === 0 && res.data) {
        if (res) {
          dataSource = res.data
        }
        resolve(dataSource)
      })
    })
  },
  //删除评价
  delEvaluationVolFortis(bean) {
    return new Promise((resolve) => {
      rpcPost('delEvaluationVolFortis', { bean }).then((res) => {
        let dataSource = null
        // if (res.code === 0 && res.data) {
        if (res) {
          dataSource = res.message
        }
        resolve(dataSource)
      })
    })
  },
  //修改评价
  updateEvaluationVolFortis(bean) {
    return new Promise((resolve) => {
      rpcPost('updateEvaluationVolFortis', { bean }).then((res) => {
        let dataSource = null
        // if (res.code === 0 && res.data) {
        if (res) {
          dataSource = res.message
        }
        resolve(dataSource)
      })
    })
  },
  //查询系统外的志愿者列表
  getOutVolListFortis(bean) {
    return new Promise((resolve) => {
      rpcPost('getOutVolListFortis', { bean }).then((res) => {
        let dataSource = null
        // console.log(res)
        if (res.code === 0 && res.data) {
          if (res) {
            dataSource = res.data
          }
          resolve(dataSource)
        }
      })
    })
  },
  //修改评价时查询志愿者详情
  projectEvaluationDetailsFortis(bean) {
    return new Promise((resolve) => {
      rpcPost('projectEvaluationDetailsFortis', { bean }).then((res) => {
        let dataSource = null
        if (res.code == 0 && res.data) {
          if (res) {
            dataSource = res.data
          }
          resolve(dataSource)
        }
      })
    })
  },
  //查询待审核队伍下的志愿者
  getVerifyTeamMember(bean) {
    return new Promise((resolve) => {
      rpcPost('getVerifyTeamMember', { bean }).then((res) => {
        let dataSource = null
        // console.log(res)
        if (res.code == 0 && res.data) {
          if (res) {
            dataSource = res.data
          }
          resolve(dataSource)
          // callback(dataSource)
        }
      })
    })
  },
  //查询所有省级区划
  listProvinceArea() {
    return new Promise((resolve) => {
      rpcPost('listProvinceArea', {}).then((res) => {
        let dataSource = null
        if (res) {
          if (res.length > 0) {
            dataSource = res
          }
          resolve(dataSource)
        }
      })
    })
  },
  //邀请队伍外成员加入队伍的相关判断返回接口
  getAndCheckTeamNumberFortis(bean) {
    return new Promise((resolve) => {
      rpcPost('getAndCheckTeamNumberFortis', { bean }).then((res) => {
        if (res) {
          resolve(res)
        }
      })
    })
  },
  //邀请队伍外成员加入项目查询志愿者
  getVolunteerAndProjectInfo(bean) {
    console.log(bean)
    return new Promise((resolve) => {
      rpcPost('getVolunteerAndProjectInfo', { bean }).then((res) => {
        if (res.code == 0 && res.data) {
          resolve(res.data)
        } else {
          resolve(res)
        }
      })
    })
  },
  //下载证明
  nvsi_getVolServicePDF2(bean) {
    return new Promise((resolve, reject) => {
      rpcPost('nvsi_getVolServicePDF2', { bean }).then((res) => {
        if (res.code == 0 && res.data) {
          resolve(res.data)
        } else {
          reject(res)
        }
      })
    })
  },
  //解密身份证号
  getcardno(bean) {
    return new Promise((resolve) => {
      rpcPost('cardno2', { bean }).then((res) => {
        //console.log(res)
        if (res.code == 0 && res.data) {
          resolve(res.data)
        }
      })
    })
  },
}
