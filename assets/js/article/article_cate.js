$(function () {
    var layer = layui.layer
    var form = layui.form
    incate()
    function incate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'get',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)

                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexADD = null
    $('#btnAddCate').on('click', function () {

        indexADD = layer.open({
            type: 1, area: ['500px', '250px'],
            title: '在线调试',
            content: $('#dialog-add').html()
        });
    })

    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/my/article/addcates',
            method: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg(res.message)
                incate()
                layer.close(indexADD)
            }
        })

    })
    var indexedit = null
    $('tbody').on('click', '.btn-edit', function () {
        console.log($(this).attr('data-Id'));
        indexedit = layer.open({
            type: 1, area: ['500px', '250px'],
            title: '在线调试',
            content: $('#dialog-edit').html()
        });
        var editid = $(this).attr('data-Id')
        $.ajax({
            url: '/my/article/cates/' + editid,
            method: 'get',

            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                form.val('form-edit', res.data)

            }
        })
    })

    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/my/article/updatecate',
            method: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg(res.message)
                incate()
                layer.close(indexedit)
            }
        })

    })

    $('tbody').on('click', '.btn-del', function () {
        var dataid = $(this).prev().attr('data-Id')
        layer.confirm('is not?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/deletecate/' + dataid,
                method: 'get',

                success: function (res) {
                    if (res.status !== 0) return layer.msg(res.message);
                    form.val('form-edit', res.data)
                    incate()
                    layer.msg(res.message)
                }
            })
            layer.close(index);
        });


        console.log(dataid);

    })
})