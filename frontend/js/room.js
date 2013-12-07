/**
 *
 * User: lin
 * Date: 13-12-7
 * Time: 上午1:27
 *
 */

$(function(){
    
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
            rotateY: '90deg',
            duration: 200
        });
        window.setTimeout(function(){
            container.hide();
            container = containers.shift();
            containers.unshift(container);
            container.show();
            container.transition({
                perspective: '1000px',
                rotateY: '270deg',
                duration: 1
            }).transition({
                perspective: '1000px',
                rotateY: '360deg',
                duration: 200
            }).transition({
                perspective: '1000px',
                rotateY: '0deg',
                duration: 1
            });

        },200)
    });
});