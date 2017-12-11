define([
        'http',
        'config',
        'util',
        'extension'
    ],
    function (http, config, util, $$) {
        return {


            name: 'article',
            init: function () {

                var operating = {
                    operateType: '',
                    row: {}
                };
                var offTable = [];
                var onTable = [];
                var pageOptions = {
                    number: 1,
                    size: 10,
                    offset: 0,
                    title: '',
                    channelOid: '',
                    approveStatus: '',
                    releaseStatus: ''
                };
                var tableConfig = {
                    ajax: function (origin) {
                        http.post(config.api.article.articleList, {
                            data: {
                                page: pageOptions.number,
                                rows: pageOptions.size,
                                name: pageOptions.name,
                                status: pageOptions.status
                            },
                            contentType: 'form'
                        }, function (rlt) {
                            origin.success(rlt)
                        })
                    },
                    pagination: true,
                    sidePagination: 'server',
                    queryParams: getQueryParams,
                    onClickCell: function (field, value, row, $element) {
                        switch (field) {
                            case 'title': {
                                queryInfo(value, row)
                            }
                                break;
                            case 'imageUrl':
                                viewImage(value, row);
                                break
                        }
                    },
                    columns: [
                        {
                            width: 30,
                            align: 'center',
                            formatter: function (val, row, index) {
                                return pageOptions.offset + index + 1
                            }
                        },
                        {
                            field: 'gameName',
                            align: 'center'
                        },
                        {
                            field: 'title',
                            align: 'center'
                        }/*,
                        {
                            field: 'content',
                            align: 'center',
                            height:100
                        }*/,
                        {
                            field: 'status',
                            align: 'center',
                            formatter: function (val) {
                                return util.enum.transform('gameLibraryStatus', val);
                            }
                        },
                        {
                            field: 'createTime',
                            align: 'center',
                        },
                        {
                            align: 'center',
                            formatter: function (val, row, index) {


                                var editStatus = true;
                                //新增时候发布状态是null
                                if (row.approveStatus == 'pass' && !row.releaseStatus) {
                                    editStatus = false;
                                }
                                if (row.approveStatus == 'pass' && row.releaseStatus == 'ok') {
                                    editStatus = false;
                                }

                                var buttons = [{
                                    text: '审核',
                                    type: 'button',
                                    class: 'item-approve',
                                    isRender: row.approveStatus == 'toApprove'
                                }];
                                var format = util.table.formatter.generateButton(buttons, 'bannerTable')
                                if (editStatus) {
                                    format += '<span style=" margin:auto 0px auto 10px;cursor: pointer;" class="fa fa-pencil-square-o item-update"></span>'

                                }
                                if (row.releaseStatus != 'ok') {
                                    format += '<span style=" margin:auto 0px auto 10px;cursor: pointer;" class="fa fa-trash-o item-delete"></span>';
                                }
                                return format;
                            },
                            events: {
                                'click .item-detail': function (e, value, row) {

                                },
                                'click .item-update': function (e, value, row) {
                                    //去除重复提交样式
                                    $('#refreshDiv').removeClass('overlay');
                                    $('#refreshI').removeClass('fa fa-refresh fa-spin');
                                    $('#picForm').clearForm();
                                    $('#createForm')
                                        .clearForm()
                                        .find('input[type=hidden]').val('');

                                    operating.operateType = 'update';
                                    operating.row = row;
                                    CKEDITOR.instances.editor.setData(row.content)

                                    $$.formAutoFix($('#createForm'), row);
                                    $('#createModal')
                                        .modal('show')
                                        .find('.modal-title').html('修改此标签');
                                },
                                'click .item-delete': function (e, value, row) {
                                    $('#confirmDiv').find('p').html('确定删除此条数据?');
                                    $$.confirm({

                                        container: $('#confirmDiv'),
                                        trigger: this,
                                        accept: function () {
                                            http.post(config.api.article.articleDelete, {
                                                data: {
                                                    id: row.id
                                                },
                                                contentType: 'form'
                                            }, function (result) {
                                                $('#bannerTable').bootstrapTable('refresh')
                                            })
                                        }
                                    })
                                }
                            }
                        }
                    ]
                };


                $('#bannerTable').bootstrapTable(tableConfig);

                $$.searchInit($('#searchForm'), $('#bannerTable'));

                util.form.validator.init($('#createForm'));
                util.form.validator.init($('#picForm'));
                util.form.validator.init($('#approveForm'));

                $('#createBanner').on('click', function () {



                    //添加表单验证初始化
                    var form = document.createForm;
                    $(form).validator('destroy');
                    util.form.validator.init($(form));

                    var picForm = document.picForm;
                    $(picForm).validator('destroy');
                    util.form.validator.init($(picForm));

                    operating.operateType = 'add';
                    $('#createForm').clearForm().find('input[type=hidden]').val('');
                    $('#picForm').clearForm();

                    util.form.reset($('#createForm'));
                    util.form.reset($('#picForm'));

                    $('#createModal')
                        .modal('show')
                        .find('.modal-title').html('添加新的道具')
                });

                $('#sortBanner').on('click', function () {
                    sortConfig();
                    $('#sortModal').modal('show')
                });

                $("#sortSelect").on('change', function () {
                    sortConfig();
                });

                //新建gameItems
                $('#createSubmit').on('click', function () {
                    if (!$('#createForm').validator('doSubmitCheck')) return;

                    var toPage = $('input[name="toPage"]:checked').val();


                    dataFromSubmit();


                });

                function dataFromSubmit() {
                    $('#refreshDiv').addClass('overlay');
                    $('#refreshI').addClass('fa fa-refresh fa-spin');
                    var url = '';
                    if (operating.operateType === 'update') {
                        url = config.api.article.articleUpdate;
                    } else {
                        url = config.api.article.articleAdd;
                    }

                    $('#createForm').ajaxSubmit({
                        data:{content:CKEDITOR.instances.editor.getData()},
                        url: url,
                        success: function (result) {
                            if (result.errorCode == 0) {
                                $('#createModal').modal('hide');
                                $('#bannerTable').bootstrapTable('refresh');
                            } else {
                                errorHandle(result);
                                //去除重复提交样式
                                $('#refreshDiv').removeClass('overlay');
                                $('#refreshI').removeClass('fa fa-refresh fa-spin');
                            }
                        }
                    })
                }

                http.post(config.api.library.getLibrary, {

                    contentType: 'form',
                    async: false
                }, function(result) {
                    var option_str="<option value=''>  请选择  </option>";
                    for (var i = 0; i < result.rows.length; i++) {
                        var obj = result.rows[i];
                        option_str=option_str+"<option value='"+obj.id+"'>"+obj.name+"</option>";
                    }

                    var libraryName=$("#libraryName");

                    libraryName.append(option_str);
                });



                $('#sortSubmit').on('click', function () {
                    var length = onTable.length;


                    var x = []
                    if (length > 0) {
                        for (var i = 0; i < length; i++) {
                            x.push(onTable[i].oid)
                        }
                    }
                    http.post(config.api.banner.bannerActive, {
                        data: {
                            'oids': x.join(','),
                            channelOid: $("#sortSelect").val()
                        },
                        contentType: 'form',
                    }, function (result) {
                        $('#sortModal').modal('hide')
                        $('#bannerTable').bootstrapTable('refresh')
                    })


                });

                $('#createReset').on('click', function () {
                    var form = document.createForm;
                    if (operating.operateType === 'update') {
                        $$.formAutoFix($('#createForm'), operating.row);
                    } else {
                        document.createForm.reset();

                    }
                });

                $('#sortReset').on('click', function () {
                    sortConfig()
                });

                //获取查询表单数据
                function getQueryParams(val) {

                    var form = document.searchForm;
                    pageOptions.size = val.limit;
                    pageOptions.number = parseInt(val.offset / val.limit) + 1;
                    pageOptions.offset = val.offset;
                    pageOptions.title = form.title.value.trim();
                    pageOptions.status = form.status.value;
                    return val
                }

                //点击标题后事件
                function queryInfo(value, row) {
                    $$.detailAutoFix($('#detailForm'), row); // 自动填充详情
                    $('#detailImageUrl').attr('src', row.imageUrl);
                    $('#updateTime').html(null == row.updateTime ? '--' : util.table.formatter.timestampToDate(row.updateTime, 'YYYY-MM-DD HH:mm:ss'));
                    $('#approveTime').html(null == row.approveTime ? '--' : util.table.formatter.timestampToDate(row.approveTime, 'YYYY-MM-DD HH:mm:ss'));
                    $('#releaseTime').html(null == row.releaseTime ? '--' : util.table.formatter.timestampToDate(row.releaseTime, 'YYYY-MM-DD HH:mm:ss'));
                    $('#detailRemark').val(row.remark);
                    $('#detailModal').modal('show')
                }

                function viewImage(value, row) {
                    $('#viewImage').attr('src', row.imageUrl)
                    $('#viewModal').modal('show')
                }
            }
        }
    })