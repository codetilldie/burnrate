/**
 *
 * User: lin
 * Date: 13-12-7
 * Time: 上午1:27
 *
 */

$(function(){
    $("#container-login").transition({
        perspective: '1000px',
        rotateY: '180deg',
        duration: 1
    });
    $(".msg").add($("#container-login")).hide();
    $(".btn-success").on('click', function(){
        $(".msg").slideDown('slow');
        window.setTimeout(function(){
            $(".msg").slideUp('slow');
        },2000);
    });

    var containers = [$("#container-create"), $("#container-login")];
    $(".btn-default").on('click', function(){
        container = containers.shift();
        containers.push(container);
        container.show();
        container.transition({
            perspective: '1000px',
            rotateY: '180deg',
            duration: 500
        });
        window.setTimeout(function(){
            container.hide();
            container = containers.shift();
            containers.unshift(container);
            container.show();
            container.transition({
                perspective: '1000px',
                rotateY: '360deg',
                duration: 500
            }).transition({
                perspective: '1000px',
                rotateY: '0deg',
                duration: 1
            });

        },500)
    });
});