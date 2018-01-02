// 载入所需模块
define([
        'http',
        'config',
        'util',
        'extension'
    ],
    function (http, config, util, $$) {
        return {
            name: 'userInvest',
            init: function () {
                var _this = this;
                _this.pagesInit();
                _this.bindEvent();
            },
            pagesInit: function () {
                var _this = this;
                // 分页配置
                var pageOptions = {
                    number: 1,
                    size: 10,
                    phone: "",
                    type: "",
                    begin: "",
					end : "",
                    offset: 0
                }
                var confirm = $('#confirmModal');
                // 数据表格配置
                var tableConfig = {
                    ajax: function (origin) {
                        http.post(config.api.userinvest.userList, {
                            data: {
                                page: pageOptions.number,
                                rows: pageOptions.size,
                                phone: pageOptions.phone,
                                begin : pageOptions.begin,
								end : pageOptions.end,
                                type: pageOptions.type
                            },
                            contentType: 'form'
                        }, function (rlt) {
                            origin.success(rlt)
                        })
                    },
                    idField: 'oid',
                    pagination: true,
                    sidePagination: 'server',
                    pageList: [10, 20, 30, 50, 100],
                    queryParams: getQueryParams,
                	onClickCell: function (field, value, row, $element) {
						switch (field) {
				        case 'phone':
				        	queryInfo(value,row)
				        	break
						  }
						},
                    columns: [{
                        width: 30,
                        align: 'center',
                        formatter: function (val, row, index) {
                            return pageOptions.offset + index + 1
                        }
                    }, {
                    	width: 50,
                    	field: 'phone',
                    	class:'table_title_detail detail'
                        
                    }, {
                    	width: 50,
                    	field: 'friendPhone'
                  /*      
                    }, {
                    	width: 50,
                    	field: 'type',
                       
                        formatter: function (val, row, index) {
                            return util.enum.transform('channelType', val);
                        }*/
                    }, {
                    	width: 50,
                    	field: 'friends',
                        
                  /*  }, {
                    	width: 50,
                    	field: 'totalReward',*/
                        
                    }, {
                    	width: 50,
						align: 'right',
						field: 'registerTime',
						formatter: function(val, row, index) {
							return util.table.formatter.timestampToDate(val, 'YYYY-MM-DD HH:mm:ss')
						}
					}, {
                    	width: 256,
                    	formatter: function (val, row, index) {
                         	var buttons = [{
									text: '操作',
									type: 'buttonGroup',
									isCloseBottom: index >= $('#dataTable').bootstrapTable('getData').length - 1,
									sub:[/*{
										text: '金额修改',
		                                type: 'button',
		                                class: 'updateMoney',
		                                isRender: row.type == 'channel'
									}, {
		                                text: '降为推广人',
		                                type: 'button',
		                                class: 'referee',
		                                isRender: row.type == 'channel'
									},{
		                                text: '升为渠道',
		                                type: 'button',
		                                class: 'channel',
		                                isRender: row.type == 'referee'
									},{
		                                text: '返佣详情',
		                                type: 'button',
		                                class: 'commission'
									},*/{
		                                text: '签到记录',
		                                type: 'button',
		                                class: 'sign'
									}]
								}]
                         return util.table.formatter.generateButton(buttons, "dataTable");
                        },
                        events: {
                            'click .updateMoney': function (e, value, row) {
                                $('#channelModal').modal({
                                    show: true,
                                    backdrop: 'static'
                                }).find(".modal-title").html("修改金额");
                                $('#channelForm').clearForm();
                                $('#channelForm').find("input[name=oid]").val(row.oid);
                                $("#channelForm").find("input[name=channelAmount]").val(row.channelAmount);
                            },
                            'click .referee': function (e, value, row) {
                                //降为推广人
                                confirm.find('.popover-title').html('提示');
                                var html = "确定将渠道降为普通用户？<hr style='width:200px; height:2px;border-top:2px solid  #C0C0C0;' /><font color='red'>降为普通用户后，享受的佣金将发生改变。</font>"
                                confirm.find('p').html(html);
                                $$.confirm({
                                    container: confirm,
                                    trigger: this,
                                    accept: function () {
                                        http.post(config.api.userinvest.channelToReferee, {
                                            data: {
                                                oid: row.oid
                                            },
                                            contentType: 'form'
                                        }, function (res) {
                                            if (res.resultCode == 0) {
                                                confirm.modal('hide')
                                                $('#dataTable').bootstrapTable('refresh')
                                            } else {
                                                errorHandle(res);
                                            }
                                        })
                                    }
                                })
                            },
                            'click .channel': function (e, value, row) {
                            	$(document.channelForm).validator('destroy');
								util.form.validator.init($(document.channelForm));
                                $('#channelModal').modal({
                                    show: true,
                                    backdrop: 'static'
                                }).find(".modal-title").html("升为渠道");
                                $('#channelForm').clearForm();
                                $('#channelForm').find("input[name=oid]").val(row.oid);
                                $("#channelForm").find("input[name=channelAmount]").val("");
                            },
                            'click .commission': function (e, value, row) {
                            	var commissionOptions = {
			                        number: 1,
			                        size: 5,
			                        oid: row.oid
			                	}
                            	 var commissionTableConfig = {
									ajax: function (origin) {
				                        http.post(config.api.userinvest.commissionDetailPage, {
				                        	data: {
				                        		page:commissionOptions.number,
				                        		rows:commissionOptions.size,
				                        		oid:commissionOptions.oid
				                        	},
				                            contentType: 'form'
				                        }, function (rlt) {
				                            origin.success(rlt)
				                        })
				                    },
									idField: 'oid',
				                    pagination: true,
				                    sidePagination: 'server',
				                    search: false,
				                    pageNumber:1,
				                    pageSize:5,
				                    pageList: [5,10,20,30,50],
				                    queryParams: getCommissionParams,
				                    columns: [{
				                    	width: 100,
				                        align: 'center',
				                    	field:"createTime",
			                    		formatter: function(val, row, index) {
											return util.table.formatter.timestampToDate(val, 'YYYY-MM-DD HH:mm:ss')
										}
				                    },{
				                        align: 'center',
				                    	field:"friendPhone"
				                    },{
				                        align: 'center',
				                    	field:"friendInvest"
				                    },{
				                        align: 'center',
				                    	field:"commissionAmount"
				                    }] 
							 	};
							 	function getCommissionParams(val) {
				                    commissionOptions.size = val.limit;
				                    commissionOptions.number = parseInt(val.offset / val.limit) + 1;
				                    return val;
				                };
				                // 初始化数据表格
				                $('#detailTable').bootstrapTable(commissionTableConfig);
				                $('#detailTable').bootstrapTable("refresh");
				                $('#detailModal').modal({
                                    show: true,
                                    backdrop: 'static'
                                }).find(".modal-title").html("返佣详情");
								
                            },
                            'click .sign': function (e, value, row) {
                            	$("#signTable").bootstrapTable("destroy");
                            	var signPageOptions = {
			                        number: 1,
			                        size: 10,
			                        userId: row.userId,
			                        start:'',
			                        finish:''
				                }
                            	var signTableConfig = {
									ajax: function (origin) {
				                        http.post(config.api.userinvest.signList, {
				                        	data: {
				                        		page:signPageOptions.number,
				                        		rows:signPageOptions.size,
				                        		userId:signPageOptions.userId,
				                        		start:signPageOptions.start,
				                        		finish:signPageOptions.finish
				                        	},
				                            contentType: 'form'
				                        }, function (rlt) {
				                            origin.success(rlt)
				                        })
				                    },
									idField: 'oid',
				                    pagination: true,
				                    sidePagination: 'server',
				                    search: false,
				                    pageNumber:1,
				                    pageSize:10,
				                    pageList: [5,10,20,30,50],
				                    queryParams: getSignPageOptions,
				                    columns: [{
				                        width: 30,
				                        align: 'center',
				                        formatter: function (val, row, index) {
				                            return pageOptions.offset + index + 1
				                        }
				                    },{
				                        align: 'center',
				                    	field:"signInTime",
			                    		formatter: function(val, row, index) {
											return util.table.formatter.timestampToDate(val, 'YYYY-MM-DD HH:mm:ss')
										}
				                    }] 
							 	};
							    function getSignPageOptions(val) {
									// 参数 val 是bootstrap-table默认的与服务器交互的数据，包含分页、排序数据
				                    signPageOptions.size = val.limit;
				                    signPageOptions.number = parseInt(val.offset / val.limit) + 1;
				                    signPageOptions.start = document.signSearchForm.start.value;
				                    signPageOptions.finish =document.signSearchForm.finish.value;
				                    return val;
				                };
				                // 初始化数据表格
				                $('#signTable').bootstrapTable(signTableConfig);
				                $('#signTable').bootstrapTable("refresh");
				                $$.searchInit($('#signSearchForm'), $('#signTable'));
                                $('#signModal').modal({
                                    show: true,
                                    backdrop: 'static'
                                }).find(".modal-title").html("签到记录");
                            }
                        }
                    }]
                };
               
			    
                $('#dataTable').bootstrapTable("refresh");
                $('#dataTable').bootstrapTable(tableConfig);
                $$.searchInit($('#searchForm'), $('#dataTable'));

                function getQueryParams(val) {
                    // 参数 val 是bootstrap-table默认的与服务器交互的数据，包含分页、排序数据
                    var form = document.searchForm;
                    // 分页数据赋值
                    pageOptions.size = val.limit;
                    pageOptions.number = parseInt(val.offset / val.limit) + 1;
                    pageOptions.offset = val.offset;
                    pageOptions.phone = form.phone.value.trim();
                    /*pageOptions.type = form.type.value.trim();*/
                    pageOptions.begin = form.begin.value.trim();
					pageOptions.end = form.end.value.trim();
                    return val;
                }
            
            	function queryInfo(value,row){
					http.post(config.api.userinvest.findUserDetail, {
		                  data: {
		                    oid: row.oid
		                  },
		                  contentType: 'form',
		                  async:'false'
		                }, function (result) {
		                	$$.detailAutoFix($('#userDetailForm'), result); // 自动填充详情 
	                });
					$('#userDetailModal').modal({
						show: true,
						backdrop: 'static'
					}).find('.modal-title').html("详情");
				}
            	$('#channelForm').validator();
            },
            bindEvent: function () {
                //返佣金额修改
                $("#channelSubmit").on("click", function () {
                	if(!$('#channelForm').validator('doSubmitCheck')) return;
                    var oid = document.channelForm.oid.value;
                    var channelAmount = document.channelForm.channelAmount.value;
                    http.post(config.api.userinvest.refereeToChannel, {
                        data: {
                            "oid": oid,
                            "channelAmount": channelAmount
                        },
                        contentType: 'form'
                    }, function (result) {
                        if (result.resultCode == 0) {
                            $('#channelModal').modal('hide');
                            $('#dataTable').bootstrapTable('refresh');
                        }
                    })
                });
            }

        }

    }
)