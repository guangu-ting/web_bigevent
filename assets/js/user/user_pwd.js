$(function () {
    var form = layui.form
   

    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (vlaue) {
            if (vlaue === $('[name=oldPwd]').val()) return '新旧密码不能相同'
        },
        rePwd: function (vlaue) {
            if (vlaue !== $('[name=newPwd]').val()) return '两次密码不相同'
        }
    })
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method:'post',
            url:'/my/updatepwd',
            data: $(this).serialize(),
            success:function(res){
                if(res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                $('.layui-form')[0].reset()
            }
        })
      })
   
})