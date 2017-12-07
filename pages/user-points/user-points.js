define([
        'http',
        'config',
        'util',
        'extension'
    ], function (http, config, util, $$) {
        return {
            name: 'user-points',
            init: function () {
                // 分页配置
                var pageOptions = {
                    page: 1,
                    rows: 10,
                    userOid: '',
                    orderType: '',
                    direction: '',
                    beginTime: '',
                    endTime: ""
                };

                // 初始化数据表格
                var tableConfig = {
                    ajax: function (origin) {
                        http.post(config.api.userPoints.list, {
                            data: {
                                page: pageOptions.page,
                                rows: pageOptions.rows,
                                userOid: pageOptions.userOid,
                                direction: pageOptions.direction,
                                orderType: pageOptions.orderType,
                                beginTime: pageOptions.beginTime,
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
                    idField: 'oid',
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
                            field: 'orderNo'

                        }, {
                            width: 50,
                            field: 'userOid'

                        }, {
                            width: 50,
                            field: 'orderType', //	 * 01：签到，02：卡券，03：充值，04：消费，05：过期， 06：撤单
                            formatter: function (val, row, index) {
                                switch (row.orderType) {
                                    case '01':
                                        return '签到';
                                    case '02':
                                        return '卡券';
                                    case '03':
                                        return '充值';
                                    case '04':
                                        return '消费';
                                    case '05':
                                        return '过期';
                                    case '06':
                                        return '撤单';
                                    default:
                                        return '-'
                                }
                            }

                        }, {
                            width: 50,
                            field: 'orderDesc'
                        },
                        {
                            width: 50,
                            field: 'direction',
                            formatter: function (val, row, index) {
                                switch (row.direction) {
                                    case 'ADD':
                                        return '增加';
                                    case 'REDUCE':
                                        return '减少';
                                    default:
                                        return '-'
                                }
                            }
                        },
                        {
                            width: 50,
                            field: 'orderPoint'
                        }, {
                            width: 50,
                            field: 'balance'
                        }, {
                            width: 50,
                            field: 'transAccountNo'
                        }, {
                            width: 50,
                            field: 'createTime'
                        }, {
                            width: 50,
                            field: 'remark'
                        }, {
                            width: 50,
                            formatter: function (val, row, index) {
                                var buttons = [{
                                    text: '详情',
                                    type: 'button',
                                    class: 'item-update',
                                    isRender: true
                                }];
                                return util.table.formatter.generateButton(buttons, 'goods_Table');
                            },
                            events: {
                                'click .item-update': updateChannel
                            }
                        }
                    ]
                };

                function direction(row) {
                    switch (row.direction) {
                        case 'ADD':
                            return '增加';
                        case 'REDUCE':
                            return '减少';
                        default:
                            return '-'
                    }
                }

                function orderType(row) {
                    switch (row.orderType) {
                        case '01':
                            return '签到';
                        case '02':
                            return '卡券';
                        case '03':
                            return '充值';
                        case '04':
                            return '消费';
                        case '05':
                            return '过期';
                        case '06':
                            return '撤单';
                        default:
                            return '-'
                    }
                }

                //获取详情
                function updateChannel(e, value, row) {
                    $("#update-oid").html(row.oid);
                    $("#update-requestNo").html(row.requestNo);
                    $("#update-systemSource").html(row.systemSource);
                    $("#update-orderNo").html(row.orderNo);
                    $("#update-userOid").html(row.userOid);
                    $("#update-orderType").html(orderType(row));
                    $("#update-relationProductCode").html(row.relationProductCode);
                    $("#update-relationProductName").html(row.relationProductName);
                    $("#update-accountType").html(row.accountType);
                    $("#update-accountName").html(row.accountName);
                    $("#update-orderDesc").html(row.orderDesc);
                    $("#update-direction").html(direction(row));
                    $("#update-orderPoint").html(row.orderPoint);
                    $("#update-point").html(row.point);
                    $("#update-transAccountNo").html(row.transAccountNo);
                    $("#update-financeMark").html(row.financeMark);
                    $("#update-remark").html(row.remark);
                    $("#update-isDelete").html(row.isDelete);
                    $("#update-createTime").html(row.createTime);
                    $("#update-updateTime").html(row.updateTime);
                    $('.attModify').modal('show');
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


            }
        }
    }
)
