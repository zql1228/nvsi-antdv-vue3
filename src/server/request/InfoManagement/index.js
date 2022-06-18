import { rpcPost } from '../../conf'
export default {
  /**
     * @Description 通知公告 志愿服务队伍查询未读通知
     * @Author liyb
     * @Date 2021/12/13 16:04
     * bean  包含
     * @Param areaid  当前账号登录区划
     * @Param level  当前账号级别 省1 市2 区3
     * @Param userid  当前账号的id
     * @Param read  1已读 0未读
    
    public Result getAllBulletinNoReadOrReadOnTeam(EntityBean bean)
    */
  getAllBulletinNoReadOrReadOnTeam(bean) {
    if (!bean) {
      bean = {
        areaid: '',
        level: '',
        userid: '',
        read: '',
      }
    }
    return rpcPost('getAllBulletinNoReadOrReadOnTeam', bean)
  },

  /**
     * @Description 通知公告 单个标注为已读
     * @Author liyb
     * @Date 2021/12/13 16:04
     * @Param userid  当前账号的id
     * @Param bulletinid  通知公告这条记录id
    
    public Result updateSingleBulletinOnRead(EntityBean bean) 
     */
  updateSingleBulletinOnRead(bean) {
    return rpcPost('updateSingleBulletinOnRead', { bean })
  },

  // 删除通知通告
  deleteBulletin(bean) {
    return rpcPost('deleteBulletin', { bean })
  },

  // 批量删除
  deleteManyBulletin(beans) {
    return rpcPost('deleteManyBulletin', { bean: { beans } })
  },
  /**
     * @Description 通知公告 批量标注为已读
     * @Author liyb
     * @Date 2021/12/13 16:04
     * @Param entityBeans  userid 当前账号的id bulletinid  通知公告这条记录id

    public Result updateManyBulletinOnRead(EntityBean[] entityBeans)
     */
  updateManyBulletinOnRead(beans) {
    return rpcPost('updateManyBulletinOnRead', { bean: { beans } })
  },

  /**
     * @Description 通知公告 获取已阅未阅人数
     * @Author liyb
     * @Date 2021/12/13 16:04
     * @Param entityBeans  userid 当前账号的id bulletinid  通知公告这条记录id
    
    public Result getReadAndNoReadNum(EntityBean bean)
     */

  /**
     * @Description 通知公告本级其他人员查询
     * @Author liyb
     * @Date 2021/12/13 16:04
     * @Param positionid
    public Result getPositionOtherPeople(EntityBean entityBean)
    */

  /**
     * @Description 通知公告指定志愿服务队伍
     * @Author liyb
     * @Date 2021/12/13 16:04
     * @Param positionid
    
    public Result getPositionOtherTeam(EntityBean entityBean)
     */

  // 查询团体培训通知
  getTeamTrainingNoticeFortis(bean) {
    if (!bean) {
      bean = {
        teamId: '', //团体id
        albx0282: '', //培训主题 (可选)
        albx0297: '', // 类型 1 未开始 2 进行中 3 已结束
        PageNum: '', //当前页
        PageSize: '', //页面条数
      }
    }
    return rpcPost('teamTrainingNoticeFortis', { bean })
  },

  // 新增团体培训
  addTeamTrainingNoticeFortis(bean) {
    if (!bean) {
      bean = {
        albx0282: '', //	是	培训主题
        albx0283: '', //	是	培训内容
        albx0284: '', //	是	培训开始时间
        albx0285: '', //	是	培训结束时间
        albx0286: '', //	是	培训区域
        albx0287: '', //	是	详细地址
        albx0288: '', //	是	培训学时
        albx0289: '', //	是	联系人
        albx0290: '', //	是	联系人手机
        albx0291: '', //	是	培训类型
        albx0292: '', //	是	培训方式
        albx0293: '', //	是	培训组织者
        albx0298: '', //	是	经度
        alb0x299: '', //	是	纬度
        albx0301: '', //	是	团体名称
      }
    }
    return rpcPost('addTeamTrainingNoticeFortis', { bean })
  },

  // 团体修改培训
  updateTeamTrainingNoticeFortis(bean) {
    return rpcPost('updateTeamTrainingNoticeFortis', { bean })
  },

  // 团体删除培训
  delTeamTrainingNoticeFortis(bean) {
    if (!bean) {
      bean = {
        lbx16id: '', // 培训列表id
      }
    }
    return rpcPost('delTeamTrainingNoticeFortis', { bean })
  },

  // 团体发布培训
  releaseTeamTrainingNoticeFortis(bean) {
    return rpcPost('releaseTeamTrainingNoticeFortis', { bean })
  },

  // 培训添加志愿者
  teamTrainingNoticeAddVol(bean) {
    return rpcPost('teamTrainingNoticeAddVol', { bean })
  },
  // 培训志愿者列表
  TrainingNoticeVolListFortis(bean) {
    return rpcPost('TrainingNoticeVolListFortis', { bean })
  },
  // 培训删除志愿者
  TrainingNoticeDelVolListFortis(bean) {
    return rpcPost('TrainingNoticeDelVolListFortis', { bean })
  },
  // 我的评价列表
  getTeamEvaluationListFortis(bean) {
    return rpcPost('teamEvaluationListFortis', { bean })
  },

  // 团体删除志愿者评价
  delTeamEvaluationVolFortis(bean) {
    return rpcPost('delTeamEvaluationVolFortis', { bean })
  },

  // 团体修改志愿者评价
  updateTeamEvaluationVolFortis(bean) {
    return rpcPost('updateTeamEvaluationVolFortis', { bean })
  },
  // 我的表彰列表
  getRecognitionList(bean) {
    return rpcPost('recognitionList', { bean })
  },

  // 新增或更新物资
  insertOrUpdateSuppliesFortis(bean) {
    if (!bean) {
      bean = {
        albe1802: '测试物资名称', //	是	物资名称
        albe1808: '11111', //	是	捐赠数量
        albe1804: '件', //	是	物资单位
        albe1803: '1111', //	是	库存
        albe1812: '1', //	是	物资类型（1：一次性物资  2：可持续物资）
        albe1805: '罗千', //	是	物资捐赠者名称
        albe1806: '13211223311', //	是	捐赠者手机号
        albe1807: '', //	是	捐赠日期
        albe1809: '', //	否	图片
        albe1810: '', //	否	备注
        albe1811: '', //	是	队伍id
        id: '', //	否	新增不传，更新传
      }
    }
    return rpcPost('insertOrUpdateSuppliesFortis', { bean })
  },

  // 新增或更新物资
  deleteSuppliesFortis(bean) {
    return rpcPost('deleteSuppliesFortis', { bean })
  },

  /*
    我的投诉 start
    */
  complaintDel(bean) {
    return rpcPost('complaintDel', { bean })
  },

  // 查询投诉详情
  getComplaintDetails(bean) {
    return rpcPost('complaintDetails', { bean })
  },

  // 我的投诉标记为已处理
  complaintChangeDetails(bean) {
    return rpcPost('complaintChangeDetails', { bean })
  },

  // 添加表彰
  recognitionAdd(bean) {
    return rpcPost('recognitionAdd', { bean })
  },

  // 发布及删除表彰
  recognitionDel(bean) {
    return rpcPost('recognitionDel', { bean })
  },

  // 编辑表彰
  recognitionUpdate(bean) {
    return rpcPost('recognitionUpdate', { bean })
  },
}
