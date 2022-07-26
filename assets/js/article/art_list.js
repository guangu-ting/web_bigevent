$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    queryArticle()
    initcate()
    function queryArticle() {
        $.ajax({
            url: '/my/article/list',
            method: 'get',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    function initcate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'get',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)

                var htmlStrs = template('tpl-cate', res)
                // console.log(htmlStrs);
                // console.log($('[name=cate_id]').html());
                // console.log($('[name=cate_id]').html(htmlStrs)[0]);
                $('[name=cate_id]').html(htmlStrs)
                form.render()

            }
        })
    }

    $('#form_search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        queryArticle()
    })

    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'PageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 5, 8, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    queryArticle()
                }
            }

        })

    }

    $('tbody').on('click', '.btn-del', function () {
        var len = $('.btn-del').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + id,
                method: 'get',
                success: function (res) {
                    if (res.status !== 0) return layer.msg(res.message)
                    layer.msg(res.message)
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    queryArticle()
                }
            })
            layer.close(index);
        });
    })

    $('tbody').on('click', '.btn-edit', function () {
        var id = $(this).attr('data-id')
        
        localStorage.setItem('ids',id)
        location.href = './art_edit.html'
        
    })
})