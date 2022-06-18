# 1. 志愿服务系统

## 2. 技术选型与项目搭建

vue3 + antd + axios + vueRouter + vuex

## 3. 项目目录

- assets 静态资源目录
- components 公共组件
- layout 页面布局
- pages 项目主模块的页面
- plugins 插件(antd 按需引入、 antd 图标库、 vuerouter 进度条、 vue 自定义指令(按钮防抖+ modal 对话框移动))
- router 路由,全局异步路由,
- server 全局请求, conf:请求拦截器封装, request: 各个模块内部的请求
- store 全局状态管理
- utils 全局工具类
  （codeValue 代码值, bus:EventBus 事件总线, Cache: 内存缓存, LocalStorage: 封装的处理本地缓存数据的方法, upload：文件上传, config：全局上下文, publicMethods: 公共校验方法）
- permission 权限过滤
- main.js 项目入口文件

## 4. 关于项目的整体概述

1. components:公共组件主要涉及到 主页面的 page 框架,全国区划组件,百度地图组件,tab 栏目切换,全局表格
   主要难点:
   (1)全国区划组件回显，由于区划是异步加载向下选择,对处理回显暂时没有找到好的解决办法, 所以是通过 props 条件进行逆推, 将 child 节点加到父节点上
   (2)table 表格对返回值的处理：由于后期需求更改,通过 findType 参数进行两次查询，所以在请求数据之前做过参数处理,将 service 参数做成可配置的,
   (3) 百度地图：点击地图添加锚点，获取地图定位。具体 Api 参考百度地图开发者工具 javascriptApi，
2. layout: 主页面的快捷键配置项
   难点：某些组件是用 jsx 渲染的 node, 需要了解 jsx 使用规则及方法
3. plugins：主要目的是对 icon 的按需引入以及对自定义指令的一些封装。主要目的是为了减少资源请求和防抖节流的代码优化, 防抖节流暂时还在开发中,
4. router+permission 角色权限过滤
   主要难点:
   (1). 通过不同角色返回的 page 列表做权限过滤,递归添加路由,据 roles 权限生成可访问的路由表。vue3Router 动态路由是一个一个进行添加的,添加的 obj。但也是因为这个原因，导致路由携带参数会丢失,所以对一些必须要携带的参数比如志愿者信息,队伍信息，项目信息等会查询再进行本地存储，然后通过一些条件进行清除掉。
5. server 全局请求
   主要难点: leap 服务的 rpc 请求
   (1). 针对不同请求所使用的 rpc 远程服务调用,主要是登录,验证码和其他服务请求,在本项目中针对接口加密的一部分是已经处理好的，通过 sm4 等将参数序列化再进行加密,(对称或者非对称:不是很了解), 再通过 axios 请求拦截器进行数据拦截
   (2). 对全局的 rpc 请求，由于不同模块开发的人员不一致，有的模块是直接引入 rpc(url,params)进行请求, 有的模块是引入对 rpc 的封装, 对请求响应处理的方式也不一致
6. store: 全局状态管理：项目中用到的不是很多
7. utils:
   (1). 主要是对 codeValue 代码值的处理,

## 5. pages 主要业务

1. 队伍，参照老版业务系统需求处理，注意：没有流程的细节，针对那个角色那个字段所展示的不同内容。大致是：组织 > 其他法人组织 > 团体
   对不同的角色的队伍，组织可以挂靠联络组织
2. 时长，这一块主要是代码层面不是很好，代码耦合度太高
3. 主要 bug：后台服务业务逻辑修改和数据产生的 bug

##  6. 6-16参数修改

albe0001 albe2601 ,
albe0066  albe2602 ,
id  albe2603,
albe0012  albe2604,
albe0003  albe2605,
albe0026  albe2606,
albe0007  albe2607,
albe0002  albe2608, 
albe0046 albe2609,
albe0056 albe2610,
albe0055 albe2611,
albp0052  albe2612,
albe0004  albe2613,
albe0069  albe2614,
albe0091  albe2615