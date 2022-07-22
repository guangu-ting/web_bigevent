$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (vlaue) {
            if (vlaue.length > 6) return '昵称长度必须在1~6个字符之间'
        }
    })
    inituser()
    function inituser() {
        $.ajax({
            url: '/my/userinfo',
            method: 'get',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                // console.log(res);
                form.val('filter', res.data)

            }

        })
    }
    $('.layui-btn-primary').on('click', function (e) {
        e.preventDefault()
        inituser()
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/my/userinfo',
            method: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)

                layer.msg(res.message)
                window.parent.getUserInfo()
            }
        })
    })
})