import { NvsiLayout } from '@/layouts'

/** 业务路由 */
export const asyncRouterMap = [
  {
    path: '/',
    name: 'home',
    component: NvsiLayout,
    meta: {
      title: '首页',
    },
    // 这里没有实现根据角色指定首页
    redirect: '',
    children: [
      // 民政 —— 工作台
      {
        path: '/mcaworkbench',
        name: 'mcaworkbench',
        hidden: true,
        component: () => import('../pages/home/mcaworkbench.vue'),
        meta: { title: '工作台', icon: 'icon-index' },
      },
      // 队伍 —— 工作台
      {
        path: '/teamworkbench',
        name: 'teamworkbench',
        hidden: true,
        component: () => import('../pages/home/teamworkbench.vue'),
        meta: { title: '工作台', icon: 'icon-index' },
      },
      // 民政 —— 账户管理
      {
        path: '/accountManagement',
        name: 'accountManagement',
        redirect: '/accountManagement',
        hidden: true,
        meta: { title: '账户管理', icon: 'icon-index' },
        children: [
          {
            path: '/userInformation',
            name: 'userInformation',
            hidden: true,
            component: () => import('../pages/accountManagement/UserInformation.vue'),
            meta: {
              title: '用户信息',
            },
          },
          {
            path: '/institutionalInfo',
            name: 'institutionalInfo',
            hidden: true,
            component: () => import('../pages/accountManagement/InstitutionalInfo.vue'),
            meta: {
              title: '机构信息',
            },
          },
        ],
      },
      // 网站管理
      {
        path: '/webSiteManagement',
        name: 'webSiteManagement',
        redirect: '/siteList',
        hidden: true,
        meta: { title: '网站管理', icon: 'icon-index' },
        children: [
          {
            path: '/siteList',
            name: 'siteList',
            hidden: true,
            component: () => import('../pages/websiteManagement/WebSite.vue'),
            meta: {
              title: '站点管理列表',
            },
          },
          {
            path: '/resourceList',
            name: 'resourceList',
            hidden: true,
            component: () => import('../pages/websiteManagement/WebResource.vue'),
            meta: {
              title: '网站资源列表',
            },
          },
          {
            path: '/componentList',
            name: 'componentList',
            hidden: true,
            component: () => import('../pages/websiteManagement/WebComponent.vue'),
            meta: {
              title: '网站组件列表',
            },
          },
          {
            path: '/styleList',
            name: 'styleList',
            hidden: true,
            component: () => import('../pages/websiteManagement/WebStyle.vue'),
            meta: {
              title: '网站样式列表',
            },
          },
          {
            path: '/layoutList',
            name: 'layoutList',
            hidden: true,
            component: () => import('../pages/websiteManagement/WebLayout.vue'),
            meta: {
              title: '网站布局列表',
            },
          },
          {
            path: '/newsList',
            name: 'newsList',
            hidden: true,
            component: () => import('../pages/websiteManagement/WebNews.vue'),
            meta: {
              title: '网站新闻列表',
            },
          },
          {
            path: '/publishComponents',
            name: 'publishComponents',
            hidden: true,
            component: () => import('../pages/websiteManagement/compontents/ComponentsEdit.vue'),
            meta: {
              hidden: true,
              title: '新增组件',
            },
          },
          {
            path: '/publishStyles',
            name: 'publishStyles',
            hidden: true,
            component: () => import('../pages/websiteManagement/compontents/StylesEdit.vue'),
            meta: {
              hidden: true,
              title: '新增布局样式',
            },
          },

          {
            path: '/bannersLists',
            name: 'bannersLists',
            hidden: true,
            component: () => import('../pages/websiteManagement/WebSpecialColumn.vue'),
            meta: {
              title: '专题专栏',
            },
          },
          {
            path: '/friendLinkLists',
            name: 'friendLinkLists',
            hidden: true,
            component: () => import('../pages/websiteManagement/WebLinkLists.vue'),
            meta: {
              title: '友情链接',
            },
          },
        ],
      },
      //队伍 —— 时长管理
      {
        path: '/timemanagement',
        name: 'timemanagement',
        redirect: '/timeEntry',
        hidden: true,
        meta: { title: '时长管理', icon: 'icon-index' },
        children: [
          {
            path: '/timeEntry',
            name: 'timeEntry',
            hidden: true,
            component: () => import('../pages/timeManagement/TimeEntryTable.vue'),
            meta: {
              title: '时长录入',
            },
          },
          {
            path: '/timeAudit',
            name: 'timeAudit',
            hidden: true,
            component: () => import('../pages/timeManagement/TimeAuditTable.vue'),
            meta: {
              title: '时长审核',
            },
          },
          {
            path: '/timeRecord',
            name: 'timeRecord',
            hidden: true,
            component: () => import('../pages/timeManagement/TimeRecordTable.vue'),
            meta: {
              title: '时长记录',
            },
          },
          {
            path: '/timeInquiry',
            name: 'timeInquiry',
            hidden: true,
            component: () => import('../pages/timeManagement/TimeInquiry.vue'),
            meta: {
              title: '时长查询',
            },
          },
          {
            path: '/timeStatistics',
            name: 'timeStatistics',
            hidden: true,
            component: () => import('../pages/timeManagement/TimeStatistics.vue'),
            meta: {
              title: '时长统计',
            },
          },
        ],
      },
      //队伍 —— 成员管理
      {
        path: '/membersmanagement',
        name: 'membersmanagement',
        redirect: '/membersmanagement',
        hidden: true,
        meta: { title: '成员管理', icon: 'icon-index' },
        children: [
          {
            path: '/volunteerDetails',
            name: 'volunteerDetails',
            hidden: true,
            component: () => import('../pages/membersManagement/VolunteerDetail.vue'),
            meta: {
              hidden: true,
              title: '志愿者详情',
            },
          },
          {
            path: '/auditMembers',
            name: 'auditMembers',
            hidden: true,
            component: () => import('../pages/membersManagement/AuditMembers.vue'),
            meta: {
              title: '待审核成员',
            },
          },
          {
            path: '/teamMembers',
            name: 'teamMembers',
            hidden: true,
            component: () => import('../pages/membersManagement/TeamMembers.vue'),
            meta: {
              title: '队伍成员',
            },
          },
          {
            path: '/projectMembers',
            name: 'projectMembers',
            hidden: true,
            component: () => import('../pages/membersManagement/ProjectMembers.vue'),
            meta: {
              title: '项目成员',
            },
          },
          {
            path: '/downloadProof',
            name: 'downloadProof',
            hidden: true,
            component: () => import('../pages/membersManagement/DownLoadCard.vue'),
            meta: {
              hidden: true,
              title: '下载证明',
            },
          },
        ],
      },
      //队伍 —— 项目管理
      {
        path: '/projectmanagement',
        name: 'projectmanagement',
        redirect: '/unreleasedProject',
        hidden: true,
        meta: { title: '项目管理', icon: 'icon-index' },
        children: [
          // publishProject
          {
            path: '/publishProject',
            name: 'publishProject',
            hidden: true,
            component: () => import('../pages/projectManagement/ProjectPublish.vue'),
            meta: {
              hidden: true,
              title: '项目详情',
            },
          },
          {
            path: '/unreleasedProject',
            name: 'unreleasedProject',
            hidden: true,
            component: () => import('../pages/projectManagement/ProjectUnreleased.vue'),
            meta: {
              title: '未发布',
            },
          },
          {
            path: '/auditProject',
            name: 'auditProject',
            hidden: true,
            component: () => import('../pages/projectManagement/ProjectAudit.vue'),
            meta: {
              title: '待审核',
            },
          },
          {
            path: '/startedProject',
            name: 'startedProject',
            hidden: true,
            component: () => import('../pages/projectManagement/ProjectStarted.vue'),
            meta: {
              title: '待启动',
            },
          },
          {
            path: '/runningProject',
            name: 'runningProject',
            hidden: true,
            component: () => import('../pages/projectManagement/ProjectRunning.vue'),
            meta: {
              title: '运行中',
            },
          },
          {
            path: '/closedProject',
            name: 'closedProject',
            hidden: true,
            component: () => import('../pages/projectManagement/ProjectClosed.vue'),
            meta: {
              title: '已结项',
            },
          },
          {
            path: '/repairProject',
            name: 'repairProject',
            hidden: true,
            component: () => import('../pages/projectManagement/ProjectRepair.vue'),
            meta: {
              title: '补录',
            },
          },
          {
            path: '/disableProject',
            name: 'disableProject',
            hidden: true,
            component: () => import('../pages/projectManagement/ProjectDisable.vue'),
            meta: {
              title: '停用',
            },
          },
        ],
      },
      //队伍 —— 下属队伍管理
      {
        path: '/subteamManagement',
        name: 'subteamManagement',
        redirect: '/subteamManagement',
        hidden: true,
        meta: { title: '下属队伍管理', icon: 'icon-index' },
        children: [
          {
            path: '/teamInfoView',
            name: 'teamInfoView',
            hidden: true,
            component: () => import('../pages/subteamManagement/TeamInfoView.vue'),
            meta: {
              title: '队伍信息查看',
            },
          },
          {
            path: '/teamDetails',
            name: 'teamDetails',
            hidden: true,
            component: () => import('../pages/subteamManagement/TeamDetails.vue'),
            meta: {
              hidden: true,
              title: '队伍详情',
            },
          },
          {
            path: '/teamRegReview',
            name: 'teamRegReview',
            hidden: true,
            component: () => import('../pages/subteamManagement/TeamRegReview'),
            meta: {
              title: '队伍注册审核',
            },
          },
          {
            path: '/teamChangeReview',
            name: 'teamChangeReview',
            hidden: true,
            component: () => import('../pages/subteamManagement/TeamChangeReview'),
            meta: {
              title: '队伍变更审核',
            },
          },
          {
            path: '/projectReleaseReview',
            name: 'projectReleaseReview',
            hidden: true,
            component: () => import('../pages/subteamManagement/ProjectReleaseReview.vue'),
            meta: {
              title: '项目发布审核',
            },
          },
        ],
      },
      // 队伍 —— 信息管理
      {
        path: '/informationManagement',
        name: 'informationManagement',
        redirect: '/informationManagement',
        hidden: true,
        meta: { title: '信息管理', icon: 'icon-index' },
        children: [
          {
            path: '/infoNoticeAnment',
            name: 'infoNoticeAnment',
            hidden: true,
            component: () => import('../pages/informationManagement/InfoNoticeAnment.vue'),
            meta: {
              title: '通知公告',
            },
          },
          // {
          //   path: '/infoMail',
          //   name: 'infoMail',
          //   hidden: true,
          //   component: () => import('../pages/informationManagement/InfoMail.vue'),
          //   meta: {
          //     title: '站内信'
          //   }
          // },
          {
            path: '/infoTrainingNotice',
            name: 'infoTrainingNotice',
            hidden: true,
            component: () => import('../pages/informationManagement/InfoTrainingNotice.vue'),
            meta: {
              hidden: true,
              title: '培训通知',
            },
          },
          {
            path: '/infoMyEvaluation',
            name: 'infoMyEvaluation',
            hidden: true,
            component: () => import('../pages/informationManagement/InfoMyEvaluation.vue'),
            meta: {
              hidden: true,
              title: '我的评价',
            },
          },
          {
            path: '/infoMyCommendation',
            name: 'infoMyCommendation',
            hidden: true,
            component: () => import('../pages/informationManagement/InfoMyCommendation.vue'),
            meta: {
              hidden: true,
              title: '我的表彰',
            },
          },
          {
            path: '/infoMyComplaint',
            name: 'infoMyComplaint',
            hidden: true,
            component: () => import('../pages/informationManagement/InfoMyComplaint.vue'),
            meta: {
              hidden: true,
              title: '我的投诉',
            },
          },
          {
            path: '/infoMaterialDonation',
            name: 'infoMaterialDonation',
            hidden: true,
            component: () => import('../pages/informationManagement/InfoMaterialDonation.vue'),
            meta: {
              hidden: true,
              title: '物资捐赠',
            },
          },
        ],
      },
      // 管理部门信息管理
      {
        path: '/mcaworkMes',
        name: 'mcaworkMes',
        redirect: '/mcaworkMes',

        hidden: true,
        meta: { title: '信息管理', icon: 'icon-index' },
        children: [
          {
            path: '/mcaworkNotice',
            name: 'mcaworkNotice',
            hidden: true,
            component: () => import('../pages/mcaworkMes/McaworkNotice.vue'),
            meta: {
              title: '通知公告发件箱',
            },
          },
          {
            path: '/mcaworkNoticeResive',
            name: 'mcaworkNoticeResive',
            hidden: true,
            component: () => import('../pages/mcaworkMes/McaworkNoticeResive.vue'),
            meta: {
              title: '通知公告收件箱',
            },
          },
          {
            path: '/mcaworkComplaint',
            name: 'mcaworkComplaint',
            hidden: true,
            component: () => import('../pages/mcaworkMes/McaworkComplaint.vue'),
            meta: {
              hidden: true,
              title: '投诉管理',
            },
          },
          {
            path: '/accountsAllegedly',
            name: 'accountsAllegedly',
            hidden: true,
            component: () => import('../pages/mcaworkMes/AccountsAllegedly.vue'),
            meta: {
              title: '账号申诉',
            },
          },
        ],
      },
      // 队伍设置
      {
        path: '/teamSetting',
        name: 'teamSetting',
        redirect: '/teamProfile',
        hidden: true,
        meta: { title: '队伍设置', icon: 'icon-index' },
        children: [
          {
            path: '/teamProfile',
            name: 'teamProfile',
            hidden: true,
            component: () => import('../pages/teamSetting/TeamProfile.vue'),
            meta: {
              title: '队伍资料',
            },
          },
          {
            path: '/teamRecRangeSet',
            name: 'teamRecRangeSet',
            hidden: true,
            component: () => import('../pages/teamSetting/TeamRecRangeSet.vue'),
            meta: {
              title: '招募范围设置',
            },
          },
          // {
          //   path: '/confFreezeTeam',
          //   name: 'confFreezeTeam',
          //   hidden: true,
          //   component: () => import('../pages/configManagement/ConfFreezeTeam.vue'),
          //   meta: { title: '冻结队伍', hidden: true, icon: 'icon-index' },
          // },
        ],
      },
      // 志愿者管理
      {
        path: '/volunteerManagement',
        name: 'volunteerManagement',
        redirect: '/volunteerManagement',
        hidden: true,
        meta: { title: '志愿者管理', icon: 'icon-index' },
        children: [
          {
            path: '/volunteerNationalInquiry',
            name: 'volunteerNationalInquiry',
            hidden: true,
            component: () => import('../pages/volunteerManagement/NationalVolunteerInquiry.vue'),
            meta: {
              title: '全国志愿者查询',
            },
          },
          {
            path: '/volunteerInquiry',
            name: 'volunteerInquiry',
            hidden: true,
            component: () => import('../pages/volunteerManagement/VolunteerInquiry.vue'),
            meta: {
              title: '志愿者查询',
            },
          },
          {
            path: '/volunteerStatistics',
            name: 'volunteerStatistics',
            hidden: true,
            component: () => import('../pages/volunteerManagement/VolunteerStatistics.vue'),
            meta: {
              // hidden: true,
              title: '志愿者统计',
            },
          },
          {
            path: '/volunteerRealnameAudit',
            name: 'volunteerRealnameAudit',
            hidden: true,
            component: () => import('../pages/volunteerManagement/VolunteerRealnameAudit.vue'),
            meta: {
              title: '志愿者实名审核',
            },
          },
          {
            path: '/volunteerCmsDetails',
            name: 'volunteerCmsDetails',
            hidden: true,
            component: () => import('../pages/membersManagement/VolunteerDetail.vue'),
            meta: {
              hidden: true,
              title: '志愿者详情',
            },
          },
        ],
      },
      // 志愿项目管理
      {
        path: '/volunteerProManagement',
        name: 'volunteerProManagement',
        redirect: '/volunteerProManagement',

        hidden: true,
        meta: { title: '志愿项目管理', icon: 'icon-index' },
        children: [
          {
            path: '/projectNationalQuery',
            name: 'projectNationalQuery',
            hidden: true,
            component: () => import('../pages/volunteerProManagement/NationalProjectQuery.vue'),
            meta: {
              title: '全国项目查询',
            },
          },
          {
            path: '/projectNationalStatistics',
            name: 'projectNationalStatistics',
            hidden: true,
            component: () => import('../pages/volunteerProManagement/NationalProjectStatistics.vue'),
            meta: {
              title: '全国项目统计',
            },
          },
          {
            path: '/projectQuery',
            name: 'projectQuery',
            hidden: true,
            component: () => import('../pages/volunteerProManagement/ProjectQuery.vue'),
            meta: {
              title: '项目查询',
            },
          },
          {
            path: '/projectStatistics',
            name: 'projectStatistics',
            hidden: true,
            component: () => import('../pages/volunteerProManagement/ProjectStatistics.vue'),
            meta: {
              title: '项目统计',
            },
          },
          {
            path: '/publishCmsProject',
            name: 'publishCmsProject',
            hidden: true,
            component: () => import('../pages/projectManagement/ProjectPublish.vue'),
            meta: {
              hidden: true,
              title: '项目详情',
            },
          },
        ],
      },
      // 志愿队伍管理
      {
        path: '/volunteerTeamManagement',
        name: 'volunteerTeamManagement',
        redirect: '/volunteerTeamManagement',
        hidden: true,
        meta: { title: '志愿队伍管理', icon: 'icon-index' },
        children: [
          // {
          //   path: '/teamNationalQuery',
          //   name: 'teamNationalQuery',
          //   hidden: true,
          //   component: () => import('../pages/volunteerTeamManagement/NationalTeamQuery.vue'),
          //   meta: {
          //     title: '全国队伍查询',
          //   },
          // },
          // {
          //   path: '/teamNationalStatistics',
          //   name: 'teamNationalStatistics',
          //   hidden: true,
          //   component: () => import('../pages/volunteerTeamManagement/NationalTeamStatistics.vue'),
          //   meta: {
          //     title: '全国队伍统计',
          //   },
          // },
          {
            path: '/teamQuery',
            name: 'teamQuery',
            hidden: true,
            component: () => import('../pages/volunteerTeamManagement/TeamQuery.vue'),
            meta: {
              title: '队伍查询',
            },
          },
          {
            path: '/teamStatistics',
            name: 'teamStatistics',
            hidden: true,
            component: () => import('../pages/volunteerTeamManagement/TeamStatistics.vue'),
            meta: {
              title: '队伍统计',
            },
          },
          {
            path: '/teamSubManagement',
            name: 'teamSubManagement',
            hidden: true,
            component: () => import('../pages/volunteerTeamManagement/SubTeamManagement.vue'),
            meta: {
              title: '队伍审核',
            },
          },
          {
            path: '/teamSameLevel',
            name: 'teamSameLevel',
            hidden: true,
            component: () => import('../pages/volunteerTeamManagement/SameLevelTeam.vue'),
            meta: {
              // hidden: true,
              title: '本级队伍',
            },
          },
          {
            path: '/teamRecommend',
            name: 'teamRecommend',
            hidden: true,
            component: () => import('../pages/volunteerTeamManagement/RecommendTeam.vue'),
            meta: {
              title: '推荐队伍',
            },
          },
          {
            path: '/teamCmsDetails',
            name: 'teamCmsDetails',
            hidden: true,
            component: () => import('../pages/subteamManagement/TeamDetails.vue'),
            meta: {
              hidden: true,
              title: '队伍详情',
            },
          },
        ],
      },
      // 数据维护
      {
        path: '/admin',
        name: 'admin',
        redirect: '/wechat',

        hidden: true,
        meta: { title: '管理后台', icon: 'icon-index' },
        children: [
          {
            path: '/wechat',
            name: 'wechat',
            hidden: true,
            component: () => import('../pages/admin/wechat/WeChatListTable.vue'),
            meta: { title: '微信账号', icon: 'icon-index' },
          },
          {
            path: '/area',
            name: 'area',
            hidden: true,
            component: () => import('../pages/admin/area/index.vue'),
            meta: { title: '区域缓存', icon: 'icon-index' },
          },
        ],
      },
      // 配置管理
      {
        path: '/configManagement',
        name: 'configManagement',
        redirect: '/configManagement',
        hidden: true,
        meta: { title: '配置管理', icon: 'icon-index' },
        children: [
          {
            path: '/confServiceDomain',
            name: 'confServiceDomain',
            hidden: true,
            component: () => import('../pages/configManagement/ConfServiceDomain.vue'),
            meta: { title: '服务领域配置', icon: 'icon-index' },
          },
          {
            path: '/confServiceType',
            name: 'confServiceType',
            hidden: true,
            component: () => import('../pages/configManagement/ConfServiceType.vue'),
            meta: { title: '服务类型配置', icon: 'icon-index' },
          },
          {
            path: '/fileSourceMap',
            name: 'fileSourceMap',
            hidden: true,
            component: () => import('../pages/configManagement/FileSourceMap.vue'),
            meta: { title: '资源文件查找', icon: 'icon-index' },
          },
        ],
      },
      // 新闻内容
      {
        path: '/front',
        name: 'front',
        redirect: '/front',
        hidden: true,
        meta: { title: '新闻内容', icon: 'icon-index', hidden: true },
        children: [
          {
            path: '/frontContent',
            name: 'frontContent',
            hidden: true,
            component: () => import('../pages/front/FrontContent.vue'),
            meta: { title: '新闻内容', icon: 'icon-index' },
          },
          {
            path: '/frontLayout',
            name: 'frontLayout',
            hidden: true,
            component: () => import('../pages/front/FrontLayout.vue'),
            meta: { title: '网站布局', icon: 'icon-index' },
          },
          {
            path: '/frontResource',
            name: 'frontResource',
            hidden: true,
            component: () => import('../pages/front/FrontResource.vue'),
            meta: { title: '网站资源', icon: 'icon-index' },
          },
        ],
      },
      // 保险推送机制以及功能清单
      {
        path: '/insurance',
        name: 'insurance',
        redirect: '/propellingPlan',
        hidden: true,
        meta: { title: '保险配置', icon: 'icon-index', hidden: true },
        children: [
          {
            path: '/propellingPlan',
            name: 'propellingPlan',
            hidden: true,
            component: () => import('../pages/insurance/PropellingPlan.vue'),
            meta: { title: '推送计划', icon: 'icon-index' },
          },
          {
            path: '/whiteListManagement',
            name: 'whiteListManagement',
            hidden: true,
            component: () => import('../pages/insurance/WhiteListManagement'),
            meta: { title: '白名单管理', icon: 'icon-index' },
          },
          {
            path: '/whiteListMenu',
            name: 'whiteListMenu',
            hidden: true,
            component: () => import('../pages/insurance/WhiteListMenu'),
            meta: { title: '白名单清单', icon: 'icon-index' },
          },
          {
            path: '/publishInsProject',
            name: 'publishInsProject',
            hidden: true,
            component: () => import('../pages/projectManagement/ProjectPublish.vue'),
            meta: { hidden: true, title: '活动详情' },
          },
        ],
      },

      //稿件管理
      {
        path: '/webManuscriptManagement',
        name: 'webManuscriptManagement',
        redirect: '/manuscriptList',
        hidden: true,
        meta: { title: '稿件管理', icon: 'icon-index' },
        children: [
          {
            path: '/manuscriptList',
            name: 'manuscriptList',
            hidden: true,
            component: () => import('../pages/webManuscriptManagement/WebManuscript.vue'),
            meta: {
              title: '稿件列表',
            },
          },
          {
            path: '/teamManuscriptList',
            name: 'teamManuscriptList',
            hidden: true,
            component: () => import('../pages/webManuscriptManagement/TeamManuscript.vue'),
            meta: {
              title: '队伍稿件列表',
            },
          },
        ],
      },
    ],
  },
]
