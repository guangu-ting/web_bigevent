$(function () {
    getUserInfo()
    var layer = layui.layer
    $('.btnlogout').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            localStorage.removeItem('token')

            location.href = './login.html'
            layer.close(index)

        });


    })
})

function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) return layui.layer.msg(res.message)

            renderAvatar(res.data)

        },
        // complete: function (res) {
        //     console.log(res);
        //     // localStorage.removeItem('token')
        //     // location.href = './login.html'
        // }



    })

}
function renderAvatar(user) {
    var name = user.nickname || user.username
    $('#welcome').html('欢迎  ' + name)

    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        var first = name[0].toUpperCase()
        $('.layui-nav-img').hide()
        $('.text-avatar').html(first).show()
    }
}