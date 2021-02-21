// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

$('.illustration-image-block a').ambaImageViewer({
    loaderImage: "/media/default/img/loader.gif"
});

hljs.initHighlightingOnLoad();


// mobile menu
var $mobileMenu = $('#show-for-medium-down');
var $articles = [];

$('.left-menu-items-list>ul>li').each(function (i, listItem) {
    var $el = $(listItem);
    var $sublist = $el.find('li');
    if ($sublist.length) {
        //has subitems
        var $section = $('<li>' + $el.html() + '</li>');
        $articles.push($section);
        $sublist.each(function (i, sublistItem) {
            var $sublistItem = $(sublistItem).clone();
            $articles.push($sublistItem);
        });
    } else {        
        $mobileMenu.append($el.clone());
    }
});
$mobileMenu.append($articles);


function uloginCallback(token) {
    $.ajax({
        url: "/ulogin/login",
        type: "POST",
        data: { token: token }
    }).done(function (data) {
        location.reload();
    });
}


$().ready(function () {

    // comments
    var formHtml = $('#comment-form-box').html();
    $('.reply-form-box').each(function (i, box) {
        var $box = $(box);
        var $form = $(formHtml);
        $box.append($form);
        var commentId = $box.attr('data-comment-id');
        $form.find('#Comments_RepliedOn').val(commentId);
        var action = $form.attr('action');
        $form.attr('action', action + "-" + commentId);

        var $replyButton = $('#reply-button-' + commentId);
        $replyButton.click(function () {
            $box.toggle();
            return false;
        });
    });

    // search
    function getURLParameter(name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
    }

    var q = getURLParameter('q');
    if (q != "null" && typeof q !== "undefined") {
        var query = decodeURIComponent(q).replace('+', ' ');
        $('.search-query-input').val(query);
    } else {
        $('.search-query-input').val('');
    }

    $('#input-search-button').click(function() {
        $(this).closest("form").submit();
    });
    //aimp
});