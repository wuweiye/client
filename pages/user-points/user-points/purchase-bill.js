/**
 * 积分管理
 */
define([
    'http',
    'config',
    'util',
    'extension'
], function (http, config, util, $$) {
    return {
        name: 'purchase-bill',
        init: function () {
            // 分页配置
            var pageOptions = {
                page: 1,
                rows: 10,
                userOid: '',
                settingOid: "",
                state: "",
                startTime: '',
                endTime: ""
            };

            // 初始化数据表格
            var tableConfig = {
                ajax: function (origin) {
                    http.post(config.api.purchaseBill.list, {
                        data: {
                            page: pageOptions.page,
                            rows: pageOptions.rows,
                            userOid: pageOptions.userOid,
                            settingOid: pageOptions.settingOid,
                            state: pageOptions.state,
                            startTime: pageOptions.startTime,
                            endTime: pageOptions.endTime
                        },
                        contentType: 'form'
                    }, function (rlt) {
                        origin.success(rlt)
                    })
                },
                pageNumber: pageOptions.page,
                pageSize: pageOptions.rows,
                pagination: true,
                sidePagination: 'server',
                pageList: [10, 20, 30, 50, 100],
                queryParams: getQueryParams,
                onLoadSuccess: function () {
                },
                columns: [
                    {
                        width: 30,
                        align: 'center',
                        formatter: function (val, row, index) {
                            return index + 1
                        }
                    },
                    {
                        width: 50,
                        // 用户ID
                        field: 'userOid'

                    }, {
                        width: 50,
                        // 积分产品ID
                        field: 'settingOid'

                    }, {
                        width: 50,
                        // 购买的积分
                        field: 'purchasePoints'

                    }, {
                        width: 50,
                        // 花费的金额
                        field: 'amount'

                    }, {
                        width: 50,
                        // 购买时间
                        field: 'purchaseTime'

                    }, {
                        width: 50,
                        // 状态：0:成功、1:失败
                        field: 'state',
                        formatter: function (val, row, index) {
                            var state = parseInt(row.state);
                            switch (state) {
                                case 0:
                                    return '成功';
                                case 1:
                                    return '失败';
                                default:
                                    return '-'
                            }
                        }
                    },
                    {
                        width: 50,
                        // 创建时间
                        field: 'createTime'
                    },
                    {
                        width: 50,
                        // 更新时间
                        field: 'updateTime'
                    }
                    /*,{
                     width: 50,
                     // 状态
                     field: 'state',
                     formatter: function (val, row, index) {
                     var val = parseInt(val);
                     switch (val) {
                     case 0:
                     return '未上架'
                     case 1:
                     return '已上架'
                     default:
                     return '-'
                     }
                     }
                     }*/
                    , {
                        width: 50
                        /*
                         width: 100,
                         filed: 'update',
                         title: '操作',
                         formatter: function (value, row) {
                         var res = '-';
                         if (row.state == 0) {
                         res = '<a href="javascript:void(0)" class="style-putOn"  data-toggle="modal">上架</a>';
                         }
                         if (row.state == 1) {
                         res = '<a href="javascript:void(0)" class="style-pullOff"  data-toggle="modal">下架</a>';
                         }
                         return res;
                         },
                         events: {
                         'click .style-putOn': function (e, val, row) {

                         },
                         'click .style-pullOff': function (e, val, row) {

                         }
                         }*/
                    }
                ]
            }

            // 初始化数据表格
            $('#goods_Table').bootstrapTable(tableConfig);
            // 搜索表单初始化
            $$.searchInit($('#searchForm'), $('#goods_Table'));

            //搜索
            function getQueryParams(val) {
                var form = document.searchForm;
                $.extend(pageOptions, util.form.serializeJson(form)); //合并对象，修改第一个对象

                pageOptions.rows = val.limit;
                pageOptions.page = parseInt(val.offset / val.limit) + 1;
                return val;
            }

            //清空
            $('#clear').on('click', function (e) {
                e.preventDefault();
                var sform = document.searchForm;
                util.form.reset($(sform));
                $('#goods_Table').bootstrapTable('refresh', pageOptions);
            });
            // 搜索
            $("#goods_search").on("click", function () {

            });

        }
    }
})
