// 载入所需模块
define([
		'http',
		'config',
		'util',
		'extension'
	],
	function(http, config, util, $$) {
		return {
			name: 'rule',
			init: function() {
				var _this = this;
				_this.pagesInit();
				_this.bindEvent();
			},
			ruleInfo: {
				oid: ''
			},
			pagesInit: function() {
				var _this = this;
				// 分页配置
				var pageOptions = {
					number: 1,
					size: 10,
					offset: 0,
					propName: '',
					status: 'yes',
					type: '',					
					classify: ''
				}
				var confirm = $('#confirmModal');
				// 数据表格配置
				var tableConfig = {
						ajax: function(origin) {
							http.post(config.api.rulepropList, {
								data: {
									page: pageOptions.number,
									rows: pageOptions.size,
									propName: pageOptions.propName,
									classify: pageOptions.classify,
									type: pageOptions.type,
									status: pageOptions.status
								},
								contentType: 'form'
							}, function(rlt) {
								origin.success(rlt)
							})
						},
						idField: 'oid',
						pagination: true,
						sidePagination: 'server',
						pageList: [10, 20, 30, 50, 100],
						queryParams: getQueryParams,
						columns: [{
							width: 30,
							align: 'center',
							formatter: function(val, row, index) {
								return pageOptions.offset + index + 1
							}
						}, {
							field: 'propName'
						}, {
							field: 'description'
						}, {
							field: 'unit',
							formatter: function(val, row, index) {
								return util.enum.transform('rulepropunit', val);
							}
						}, {
							field: 'classify',
							formatter: function(val, row, index) {
								return util.enum.transform('classify', val);
							}
						},{
							field: 'unitvalue'
						}, {
							field: 'type',
							formatter: function(val, row, index) {
								return util.enum.transform('ruleproptype', val);
							}
						}, {
							field: 'createTime',
							formatter: function(val, row, index) {
								return util.table.formatter.timestampToDate(val, 'YYYY-MM-DD HH:mm:ss')
							}
						}, {
							field: 'createUser'
						}, {
							field: 'updateTime',
							formatter: function(val, row, index) {
								return util.table.formatter.timestampToDate(val, 'YYYY-MM-DD HH:mm:ss')
							}
						}, {
							field: 'updateUser'
						}, {
							formatter: function(val, row, index) {
								var buttons = [ {
									text: '规则详情',
									type: 'button',
									class: 'detail',
									isRender: true
								}, {
									text: '编辑',
									type: 'button',
									class: 'edit',
									isRender: true
								},{
									text: '删除',
									type: 'button',
									class: 'del',
									isRender: true
								}]
								return util.table.formatter.generateButton(buttons,"ruleTable");
							},
							events: {
								'click .detail': function(e, value, row) {
									$$.detailAutoFix($('#detailForm'), row); // 自动填充详情 
									$('#detailModal').modal('show').find('.modal-title').html("详情");
								},
								'click .edit': function(e, value, row) {
									_this.ruleInfo.oid = row.oid;
									$('#propName').attr('readonly', true);
									$$.formAutoFix($('#ruleForm'), row); // 自动填充详情      
									$('#ruleModal').modal('show').find('.modal-title').html("修改规则属性");
								},
								'click .del': function(e, value, row) {
									confirm.find('.popover-title').html('提示')
									confirm.find('p').html('确定删除此条数据？');
									$$.confirm({
										container: confirm,
										trigger: this,
										accept: function() {
											http.post(config.api.deleteRuleprop, {
												data: {
													oid: row.oid
												},
												contentType: 'form'
											}, function(res) {
												if(res.resultCode == 0) {
													confirm.modal('hide')
													$('#ruleTable').bootstrapTable('refresh')
												} else {
													errorHandle(res);
												}
											})
										}
									})
								}
							}
						}]
					}
					// 初始化数据表格
				$('#ruleTable').bootstrapTable(tableConfig);
				$$.searchInit($('#searchForm'), $('#ruleTable'));
				$('#ruleForm').validator();

				function getQueryParams(val) {
					// 参数 val 是bootstrap-table默认的与服务器交互的数据，包含分页、排序数据
					var form = document.searchForm
						// 分页数据赋值
					pageOptions.size = val.limit
					pageOptions.number = parseInt(val.offset / val.limit) + 1
					pageOptions.offset = val.offset
					pageOptions.propName = form.propName.value.trim()
					pageOptions.classify = form.classify.value.trim()
					pageOptions.type = form.type.value.trim()
					return val
				}
			},
			bindEvent: function() {
				var _this = this;

				//将新增修改渠道页面显示出来
				$("#addRule").on("click", function() {
					$('#editChanelName').attr('readonly', false);
					$('#ruleForm').clearForm()
						.find('input[type=hidden]').val('')
					_this.ruleInfo.oid = '';
					$('#ruleModal').modal('show')
						.find('.modal-title').html("新建规则属性");
				});

				//新增渠道
				$("#ruleSubmit").on("click", function() {
					var url = '';
					if(_this.ruleInfo.oid) {
						url = config.api.updateRuleprop;
						document.ruleForm.oid.value = _this.ruleInfo.oid
					} else {
						url = config.api.addruleprop;
					}
					$('#ruleForm').ajaxSubmit({
						url: url,
						success: function(res) {
							if(res.resultCode == 0) {
								$('#ruleModal').modal('hide')
								$('#ruleTable').bootstrapTable('refresh')
							} else {
								errorHandle(res);
							}
						}
					})
				});

			}

		}
	})