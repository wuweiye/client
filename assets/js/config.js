/**
 * 配置项，提供全局使用各项配置
 * amd模块，使用requirejs载入
 */
define(function () {
    // this.host = 'http://10.112.88.183'
    // this.host = 'http://api.guohuaigroup.com'
    this.host = '';
    this.system = 'GhTulip';
    return {
        host: this.host,    // 系统地址
        system: this.system,   // 系统代号，做用户权限与登录使用
        /**
         * api 接口提供与服务器异步交互地址
         *
         */
        api: {
            login: this.host + '/operate/admin/login', // 登录服务
            logout: this.host + '/operate/admin/logout', // 登出服务
            userInfo: this.host + '/operate/admin/info', // 登录用户信息服务
            resetPwd: this.host + '/operate/admin/reset/password/form', // 修改密码
            genPwd: this.host + '/operate/admin/reset/password/gen', // 重设密码
            yup: this.host + '/game/image/yup2',
            role: {
                list: this.host + '/operate/admin/ctrl/role/list', // 角色列表
            save: this.host + '/operate/admin/ctrl/role/save', // 新建角色
                update: this.host + '/operate/admin/ctrl/role/update', // 修改角色
                delete: this.host + '/operate/admin/ctrl/role/delete', // 删除角色
                getRoleAuths: this.host + '/operate/admin/ctrl/role/auth/auths', // 获取角色权限
            },
            user: {
                search: this.host + '/operate/admin/search',  // 用户查找
                roles: this.host + '/operate/admin/role/roles', //当前用户角色
                create: this.host + '/operate/admin/create/form', // 添加用户
                update: this.host + '/operate/admin/update',  // 修改用户
                freeze: this.host + '/operate/admin/freeze',  // 冻结用户
                unfreeze: this.host + '/operate/admin/unfreeze' //解冻用户
            },
            auth: {
                list: this.host + '/operate/admin/ctrl/auth/list' // 权限列表
            },
            menu: {
                load: this.host + '/operate/system/menu/2.0/load',  // 菜单-加载菜单数据
            	save: this.host + '/operate/system/menu/2.0/save',  // 菜单-保存菜单数据
                view: this.host + '/operate/system/menu/2.0/view',  // 菜单-用户菜单获取
            },
            //规则属性
            ruleProp: {
                findAllRuleProp: this.host + '/tulip/boot/ruleprop/findAllRuleProp',
                rulepropList: this.host + '/tulip/boot/ruleprop/rulepropList',
                saveRuleProp: this.host + '/tulip/boot/ruleprop/saveRuleProp',
                activeRuleprop: this.host + '/tulip/boot/ruleprop/activeRuleprop',
                getRulePropDetail: this.host + '/tulip/boot/ruleprop/getRulePropDetail',
            },

            library:{
                libraryList : this.host + '/game/data/manage/query',
                libraryAdd: this.host + '/game/data/manage/add',
                libraryUpdate: this.host + '/game/data/manage/update',
                libraryDelete:this.host+'/game/data/manage/delete',
                getLibrary : this.host+'/game/data/manage/get/game'
            },

            label :{
                labelList : this.host + '/game/label/manage/query',
                labelAdd: this.host + '/game/label/manage/add',
                labelUpdate: this.host + '/game/label/manage/update',
                labelDelete:this.host+'/game/label/manage/delete',
                getLabel : this.host +'/game/label/manage/get/label',

                gameLabelList : this.host + '/game/label/manage/game/query',
                gameLabelAdd: this.host + '/game/label/manage/game/add',
                gameLabelUpdate: this.host + '/game/label/manage/game/update',
                gameLabelDelete:this.host+'/game/label/manage/game/delete'

            },
            items : {
                itemsList : this.host + '/game/items/query',
                itemsAdd: this.host + '/game/items/add',
                itemsUpdate: this.host + '/game/items/update',
                itemsDelete:this.host+'/game/items/delete'
            },
            article : {
                articleList : this.host + '/game/article/manage/query',
                articleAdd: this.host + '/game/article/manage/add',
                articleUpdate: this.host + '/game/article/manage/update',
                articleDelete:this.host+'/game/article/manage/delete'
            }



            
        },
        scenePropType: [{
            id: "schedule",
            text: "定时任务",
        }, {
            id: "passive",
            text: "被动任务",
        }],
        //请求类型
        advertorialsActive: [{
            id: "wait",
            text: "待上架",
        }, {
            id: "on",
            text: "已上架",
        }, {
            id: "off",
            text: "已下架",
        }],
        //审批结果
        advertorialsStatus: [{
            id: "pending",
            text: "待审批",
        }, {
            id: "pass",
            text: "通过",
        }, {
            id: "refused",
            text: "驳回",
        }],
        //卡券数值类型
        couponNumberType: [{
            id: "number",
            text: "数值",
        }, {
            id: "percentage",
            text: "百分比",
        }],
        //卡券叠加标志
        overlap: [{
            id: "yes",
            text: "是",
        }, {
            id: "no",
            text: "",
        }],
        //规则属性单位
        rulepropunit: [{
            id: "double",
            text: "浮点",
        }, {
            id: "number",
            text: "数值",
        }, {
            id: "interval",
            text: "数值区间",
        }],
        //规则属性类型
        ruleproptype: [{
            id: "get",
            text: "领用",
        }, {
            id: "use",
            text: "使用",
        }, {
            id: "writeOff",
            text: "核销",
        }],
        //子分类标志
        classify: [{
            id: "scene",
            text: "场景",
        }, {
            id: "constraint",
            text: "约束条件",
        }],
        //权重
        weight: [{
            id: "and",
            text: "全部规则",
        }, {
            id: "or",
            text: "任一规则",
        }],
        //活动场景
        eventType: [{
            id: "investment",
            text: "申购",
        }, {
            id: "authentication",
            text: "实名认证绑卡",
        }, {
            id: "redeem",
            text: "赎回",
        }, {
            id: "register",
            text: "用户注册",
        }, {
            id: "bearer",
            text: "到期兑付",
        }, {
            id: "cash",
            text: "提现",
        }, {
            id: "refund",
            text: "退款",
        }, {
          id: "friend",
          text: "推荐人活动",
        }, {
            id: "schedule",
            text: "派发活动",
        }, {
            id: "custom",
            text: "自定义领取",
        }, {
            id: "birthday",
            text: "用户生日",
        }, {
            id: "sign",
            text: "签到",
        }, {
            id: "firstFriendInvest",
            text: "被推荐人首次投资",
        }, {
            id: "invalidBids",
            text: "流标",
        },{
            id: "recharge",
            text: "充值",
        },{
            id: "bindingCard",
            text: "绑卡",
        },{
            id: "forwarded",
            text: "软文转发",
        },{
            id: "phoneAuthentication",
            text: "手机认证",
        }],
        //用户卡券状态
        userCouponStatus: [{
            id: "notUsed",
            text: "未使用",
        }, {
            id: "used",
            text: "已使用",
        }, {
            id: "expired",
            text: "已过期",
        }, {
            id: "lock",
            text: "锁定中",
        }, {
            id: "writeOff",
            text: "已核销",
        }, {
            id: "invalid",
            text: "作废",
        }],
        //用户卡券类型
        userCouponType: [{
            id: "redPackets",
            text: "红包",
        }, {
            id: "coupon",
            text: "代金券",
        }, {
            id: "rateCoupon",
            text: "加息券",
        }, {
            id: "tasteCoupon",
            text: "体验金",
        }, {
            id: "cashCoupon",
            text: "提现券",
        }, {
            id: "pointsCoupon",
            text: "积分券",
        }],
        disableType: [{
            id: "DAY",
            text: "天",
        }, {
            id: "HOUR",
            text: "时",
        }],
        //订单类型
        orderType: [{
            id: "invest",
            text: "投资",
        }, {
            id: "redeem",
            text: "赎回",
        }, {
            id: "bearer",
            text: "到期兑付",
        }, {
            id: "fastRedeem",
            text: "快赎",
        }, {
            id: "normalRedeem",
            text: "普赎",
        }, {
            id: "clearRedeem",
            text: "清盘普赎",
        }, {
            id: "refund",
            text: "退款",
        }, {
            id: "cash",
            text: "提现",
        }, {
            id: "repayLoan",
            text: "还本",
        }, {
            id: "repayInterest",
            text: "付息",
        }, {
            id: "buy",
            text: "买卖",
        }],
        //订单状态
        orderStatus: [{
            id: "success",
            text: "成功",
        }, {
            id: "fail",
            text: "失败",
        }],
        //渠道类型
        channelType: [{
            id: "referee",
            text: "推广人",
        }, {
            id: "channel",
            text: "渠道",
        }],
        //金额类型
        amountType: [{
            id: "scale",
            text: "比例",
        }, {
            id: "fixed",
            text: "固定",
        }, {
            id: "random",
            text: "随机",
        }],
        isdel: [{
            id: "yes",
            text: "已删除",
        }, {
            id: "no",
            text: "正常",
        }],
        /**
         * 图表所用到的主题颜色
         */
        colors: ['#3c8dbc', '#dd4b39', '#f39c12', '#00a65a', '#00c0ef', '#605ca8', '#ff851b', '#39cccc'],

        gameLibraryStatus :[{
            id:"valid",
            text:"有效",
        },{
            id:"invalid",
            text:"无效",
        },{
            id:"delete",
            text:"已删除"
        }],
    }
})


