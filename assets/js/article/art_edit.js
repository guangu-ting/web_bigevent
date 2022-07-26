$(function () {
    var layer = layui.layer
    var form = layui.form
    var ids = localStorage.getItem('ids')


    initcate()

    function initcate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'get',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
                idedit(ids)
            }
        })
    }

    function idedit(id) {
        $.ajax({
            url: '/my/article/' + id,
            method: 'get',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // var art = 

                // console.log(res.data.cover_img);
                form.val('filter', res.data)

                // 初始化富文本编辑器
                initEditor()
                // form.render()
                // 1. 初始化图片裁剪器
                var $image = $('#image')
                $('#image').attr('src', 'http://big-event-api-t.itheima.net' + res.data.cover_img)

                // 2. 裁剪选项
                var options = {
                    aspectRatio: 400 / 280,
                    preview: '.img-preview',

                }

                // 3. 初始化裁剪区域
                $image.cropper(options)

            }
        })

    }


    $('#btnChooseImage').on('click', function (e) {
        e.preventDefault()

        $('#coverFile').click()
    })
    $('#coverFile').on('change', function (e) {
        var file = e.target.files
        if (file.length === 0) return

        var $image = $('#image')
        var newImgURL = URL.createObjectURL(file[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper({
                aspectRatio: 400 / 280,
                preview: '.img-preview',
            })        // 重新初始化裁剪区域
    })
    var art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    $('#form_pub').on('submit', function (e) {
        e.preventDefault()

        var fd = new FormData($(this)[0])
        fd.append('state', art_state)
        
        var $image = $('#image')
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img', blob)
            // punlishArt(fd)
            fd.forEach((v, k) => {
                console.log(k, v);
            });
            $.ajax({
                url: '/my/article/edit',
                method: 'post',
                data: fd,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) return console.log(res);

                    layer.msg(res.message)
                    location.href = './art_list.html'
                }
            })
        })
    })

})