// 载入所需模块;x1
define([
		'http',
		'config',
		'util',
		'extension'
	],
	function(http, config, util, $$) {
		return {
			name: 'ruleProp',
			init: function() {
				var _this = this;
				_this.pagesInit();
				_this.bindEvent();
			},
			pagesInit: function() {
				var _this = this;
				// 分页配置
				var pageOptions = {
					number: 1,
					size: 10,
					offset: 0,
					isdel: '',
					type:'',
					name:''
				}
				var confirm = $('#confirmModal');
				// 数据表格配置
				var tableConfig = {
						ajax: function(origin) {
							http.post(config.api.ruleProp.rulepropList,{
								data: {
									page: pageOptions.number,
									rows: pageOptions.size,
									isdel: pageOptions.isdel,
									name : pageOptions.name,
									type: pageOptions.type
								},
								contentType: 'form'
							},
								function(rlt) {
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
						        case 'name':
						        	queryInfo(value,row)
						        	break
							}
						},
						columns: [{
							width: 30,
							align: 'center',
							formatter: function(val, row, index) {
								return pageOptions.offset + index + 1
							}
						}, {
							field: 'name',
							class:'table_title_detail'
						},{
							field: 'field'
						}
						, {
							field: 'unit',
							formatter: function(val, row, index) {
								return util.enum.transform('rulepropunit', val);
							}
						}, {
							field: 'type',
							formatter: function(val, row, index) {
								return util.enum.transform('ruleproptype', val);
							}
						},{
							field: 'unitvalue'
						},{
							field: 'isdel',
							formatter: function(val, row, index) {
								return util.enum.transform('isdel', val);
							}
						},{
							align:'center',
							formatter: function(val, row, index) {
							var buttons = [{
								text: '启用',
								type: 'button',
								class: 'isDel" data-type="yes"',
								isRender: row.isdel=='yes'
							}]
							var format = util.table.formatter.generateButton(buttons, 'rulePropTable')
			            	if(true){
			            		format += '<span style=" margin:auto 0px auto 10px;cursor: pointer;" class="fa fa-pencil-square-o edit"></span>'
			            		
			            	}
			            	if(row.isdel=='no'){
			            		format += '<span style=" margin:auto 0px auto 10px;cursor: pointer;width:35px;" class="fa fa-trash-o isDel" data-type="no"></span>';
			            	}
			            	return format;
							},
							events:{
								'click .detail':function(e, value, row) {
									
								},
								'click .edit': function(e, value, row) {
									$('#rulePropModal').modal({
										show: true,
										backdrop: 'static'
									}).find(".modal-title").html("修改规则属性");
									$('#rulePropRefreshDiv').removeClass('overlay');
									$('#rulePropRefreshI').removeClass('fa fa-refresh fa-spin');
									http.post(config.api.ruleProp.getRulePropDetail, {
										data: {
											oid: row.oid
										},
										contentType: 'form',
										async: 'false',
									}, function(result) {
										$$.formAutoFix($('#rulePropForm'), result);
										$(document.rulePropForm).validator('destroy');
										util.form.validator.init($(document.rulePropForm));
									}); 										
								},
								'click .isDel': function(e, value, row) {
									var data_type = $(this).attr('data-type');
									confirm.find('.popover-title').html('提示')
									var html=data_type=="yes"?"启用":"删除";
									confirm.find('p').html('确定'+html+'此规则属性？');
									$$.confirm({
										container: confirm,
										trigger: this,
										accept: function() {
											http.post(config.api.ruleProp.activeRuleprop, {
												data: {
													oid: row.oid,
													isdel: data_type
												},
												contentType: 'form'
											}, function(res) {
												if (res.errorCode == 0) {
													confirm.modal('hide')
													$('#rulePropTable').bootstrapTable('refresh')
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
				$('#rulePropTable').bootstrapTable(tableConfig);
				$$.searchInit($('#searchForm'), $('#rulePropTable'));
				$('#rulePropForm').validator();

				function getQueryParams(val) {
					// 参数 val 是bootstrap-table默认的与服务器交互的数据，包含分页、排序数据
					var form = document.searchForm;
					// 分页数据赋值
					pageOptions.size = val.limit;
					pageOptions.number = parseInt(val.offset / val.limit) + 1;
					pageOptions.name = form.name.value.trim();
					pageOptions.type = form.type.value.trim();
					pageOptions.isdel = form.isdel.value.trim();
					return val;
				}
				function queryInfo(value,row){
					http.post(config.api.ruleProp.getRulePropDetail, {
										data: {
											oid: row.oid
										},
										contentType: 'form',
										async: 'false'
									}, function(result) {
										$$.detailAutoFix($('#detailForm'), result); // 自动填充详情 
									});
									$('#detailModal').modal({
										show: true,
										backdrop: 'static'
									}).find('.modal-title').html("详情");
				}
			},
			bindEvent: function() {
				var _this = this;
				//将新增规则属性页面显示出来
				$("#addRuleProp").on("click", function() {
					$('#rulePropRefreshDiv').removeClass('overlay');
					$('#rulePropRefreshI').removeClass('fa fa-refresh fa-spin');
					$('#rulePropForm').clearForm().find('input[type=hidden]').val('');
					$('#rulePropModal').modal('show').find('.modal-title').html("编辑规则属性");
				});
				 //新增或编辑渠道  
				$("#rulePropSubmit").on("click", function() {
					if(!$('#rulePropForm').validator('doSubmitCheck')) return;
					$('#rulePropRefreshDiv').addClass('overlay');
				    $('#rulePropRefreshI').addClass('fa fa-refresh fa-spin');
					$('#rulePropForm').ajaxSubmit({
						url: config.api.ruleProp.saveRuleProp,
						success: function(res) {
							if(res.errorCode == 0) {
								$('#rulePropModal').modal('hide')
								$('#rulePropTable').bootstrapTable('refresh')
							} else {
								errorHandle(res);
							}
							$('#rulePropRefreshDiv').removeClass('overlay');
							$('#rulePropRefreshI').removeClass('fa fa-refresh fa-spin');
						}
					})
				});

			}
		}
	})