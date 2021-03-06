// Generated by CoffeeScript 1.10.0
var aImages;

App.initHelpers(['datepicker', 'datetimepicker', 'colorpicker', 'maxlength', 'select2', 'masked-inputs', 'rangeslider', 'tags-inputs']);

aImages = [];

Parse.Cloud.run('web_getLangObj').then(function(res) {
  var $language;
  console.log('web_getLangObj success', res);
  $language = $('.lang_option');
  $language.empty();
  return $.each(res.data, function(key, value) {
    var html;
    html = '<label class="css-input css-checkbox css-checkbox-primary m-r-15"> <input type="checkbox" id="language' + key + '" name="oData[language][]" value="' + key + '"><span></span> ' + value + ' </label>';
    return $language.append(html);
  });
}, function(error) {
  swal('出错了...', error.message, 'error');
  return console.log('Error: ' + error.code + ' ' + error.message);
});

Parse.Cloud.run('manage_getCity', {
  oOption: {
    nLimit: 100
  }
}).then(function(res) {
  console.log('manage_getCity success', res);
  $('#liveIn').empty();
  return _(res.data.list.forEach(function(item) {
    var html;
    item = item.toJSON();
    html = "<option value='" + item.objectId + "'>" + item.name + "</option>";
    return $('#liveIn').append(html);
  }));
}, function(error) {
  swal('出错了...', error.message, 'error');
  return console.log('Error: ' + error.code + ' ' + error.message);
});

$('.start_qiniu').click(function() {
  $('.qiniu_area').show();
  return commonFn.qiniuFn();
});
Parse.Cloud.run('manage_getUserList').then(function(res) {
  var editFn, table, targetTr, usersList;
  var totalPages=res.data.count;
  console.log('manage_getUserList success', res);
  return $('#pagination-prop').empty().removeData("twbs-pagination").off("page").twbsPagination({
    totalPages: Math.ceil(totalPages / 20),
    visiblePages: 10,
    onPageClick: function(event, page) {
      var searchProp;
      console.log('page on click', event, page);
      searchProp = {
        oOption: {
          nSkip: (page - 1) * 20
        }
      };
      return Parse.Cloud.run('manage_getUserList',searchProp).then(function(res) {
        console.log('resd',res);
        usersList = [];
        _(res.data.list.forEach(function(item) {
          item = item.toJSON();
          item['linkUserName'] = '<a href="' + config.frontEndUrl + 'user-show.html?userId=' + item.objectId + ' " target="_blank">' + item.username + '</a>';
          item.createdAt = moment(item.createdAt).format('LLL');
          if(item.nickname==undefined){
            item.nickname='暂未填写';
          }
          console.log('item.nickname',item.nickname);
          item.updatedAt = moment(item.updatedAt).format('LLL');
          item['action'] = '<a href="#userModal" data-toggle="modal" data-obj-id="' + item.objectId + '" class="btn_edit"><i class="fa fa-edit text-primary"></i></a>';
          if (item.identity) {
            item.idType = item.identity.type;
            item.idNum = item.identity.number;
          }
          return usersList.push(item);
        }));
        table = $('#tableUsersList').DataTable({
          data: usersList,
          bDestroy: true,
          bInfo: false,
          paging: false,
          "aaSorting": [[5, "desc"]],
          searching:false,
          columns: [
            {
              data: 'objectId',
              title: 'id'
            }, {
              data: 'linkUserName',
              title: '用户名'
            }, {
              data: 'nickname',
              title: '全名'
            }, {
              data: 'email',
              title: '邮箱'
            }, {
              data: 'updatedAt',
              title: '更新时间'
            }, {
              data: 'createdAt',
              title: '创建时间'
            }, {
              data: 'action',
              title: '操作'
            }
          ]
        });
        targetTr = '';
        editFn = function(e) {
          var targetId, targetObj;
          console.log(e);
          targetId = e.currentTarget.dataset.objId;
          targetTr = $(e.currentTarget).parent().parent();
          targetObj = _.find(usersList, {
            'objectId': targetId
          });
          $('#editId').val(targetId);
          console.log('匹配到需要编辑的对象', targetObj);
          $('.qiniu_area').hide();
          $('.user_info_form')[0].reset();
          $('#success').hide();
          $('.table.table-striped.table-hover.text-left').hide();
          $('#fsUploadProgress').empty();
          $('#summernoteDesc').summernote('destroy');
          $('#summernoteDesc').empty();
          commonFn.fillToForm('user_info_form', targetObj);
          $('#liveIn').val(targetObj.liveIn);
          $('#gender').val(targetObj.gender);
          $('#status').val(targetObj.status);
          $('#address').text(targetObj.address);
          $("#remark").val(targetObj.remark);
          $('#summernoteDesc').append(targetObj.description);
          $('#summernoteDesc').summernote({
            height: 150
          });
          $('input[type="checkbox"]').prop("checked", false);
          if (targetObj.language) {
            return $.each(targetObj.language, function(key, value) {
              return $('#language' + value + '').prop("checked", true);
            });
          }
        };
        $('.btn_edit').on('click', editFn);
        $('.btn_edit1').click(function() {
          var targetId, targetObj;
          targetId = $(this).data('objId');
          targetTr = $(this).parent().parent();
          targetObj = _.find(usersList, {
            'objectId': targetId
          });
          $('#editId').val(targetId);
          console.log('匹配到需要编辑的对象', targetObj);
          $('.qiniu_area').hide();
          $('.user_info_form')[0].reset();
          $('#success').hide();
          $('.table.table-striped.table-hover.text-left').hide();
          $('#fsUploadProgress').empty();
          $('#summernoteDesc').summernote('destroy');
          $('#summernoteDesc').empty();
          commonFn.fillToForm('user_info_form', targetObj);
          $('#liveIn').val(targetObj.liveIn);
          $('#gender').val(targetObj.gender);
          $('#status').val(targetObj.status);
          $('#address').text(targetObj.address);
          $("#remark").val(targetObj.remark);
          $('#summernoteDesc').append(targetObj.description);
          $('#summernoteDesc').summernote({
            height: 150
          });
          $('input[type="checkbox"]').prop("checked", false);
          if (targetObj.language) {
            return $.each(targetObj.language, function(key, value) {
              return $('#language' + value + '').prop("checked", true);
            });
          }
        });
        return $('.btn_save').click(function() {
          var saveObj;
          saveObj = $('.user_info_form').serializeObject();
          saveObj.oData.Status = parseInt(saveObj.oData.status);
          saveObj.oData.gender = parseInt(saveObj.oData.gender);
          saveObj.oData.description=$('#summernoteDesc').summernote('code');
          saveObj.oData.liveIn=$("#liveIn").val();
          saveObj.oData.remark=$("#remark").val();
              if (aImages.length) {
            saveObj['oData']['avatar'] = aImages[0];
          }
          console.log('saveObj',saveObj);
          if ($('.user_info_form').valid()) {
            return Parse.Cloud.run('manage_User', saveObj).then(function(res) {
              var newData;
              console.log('manage_User success', res);
              newData = res.data.toJSON();
              newData['linkUserName'] = '<a href="' + config.frontEndUrl + 'user-show.html?userId=' + newData.objectId + ' " target="_blank">' + newData.username + '</a>';
              newData.createdAt = moment(newData.createdAt).format('LLL');
              newData.updatedAt = moment(newData.updatedAt).format('LLL');
              newData['action'] = '<a href="#userModal" data-toggle="modal" data-obj-id="' + newData.objectId + '" class="btn_edit"><i class="fa fa-edit text-primary"></i></a>';
              table.row(targetTr).data(newData).draw();
              $('#userModal').modal('hide');
              return aImages = [];
            }, function(error) {
              swal('出错了...', error.message, 'error');
              return console.log('Error: ' + error.code + ' ' + error.message);
            });
          }
        });
      }, function(error) {
        swal('出错了...', error.message, 'error');
        return console.log('Error: ' + error.code + ' ' + error.message);
      });
    }
  });
});



$('.user_info_form').validate({
  ignore: [],
  errorClass: 'help-block text-right animated fadeInDown',
  errorElement: 'div',
  errorPlacement: function(error, e) {
    jQuery(e).parents('.form-group > div').append(error);
  },
  highlight: function(e) {
    var elem;
    elem = jQuery(e);
    elem.closest('.form-group').removeClass('has-error').addClass('has-error');
    elem.closest('.help-block').remove();
  },
  success: function(e) {
    var elem;
    elem = jQuery(e);
    elem.closest('.form-group').removeClass('has-error');
    elem.closest('.help-block').remove();
  },
  rules: {
    'oData[username]': {

    },
    'oData[nickname]': {
      minlength: 2
    },
    'oData[phoneNumber]': {
      number: true,
      minlength: 8,
      maxlength: 11
    },
    'oData[email]': {
      email: true
    }
  },
  messages: {
    //'oData[username]': '必填,确定是一个正确的邮箱地址',
    'oData[nickname]': '必填,并且至少2个字',
    'oData[phoneNumber]': '必填,确定是一个正确的手机号',
    'oData[email]': '必填,确定是一个正确的邮箱地址'
  }
});

//# sourceMappingURL=users_list.js.map
