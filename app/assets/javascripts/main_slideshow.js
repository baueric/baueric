
function nav_link_click(div_id) {
    expander_div = $(div_id);
    hidden = expander_div.is(":hidden");

    expander_div.slideToggle(300);
}

function mouse_over_image(div_id) {

    caption_div = $(div_id);
    hidden = caption_div.is(":hidden");
    caption_div.clearQueue();
    caption_div.animate({width: '310px', opacity: '.7'}, 200);
}

function mouse_out_image(div_id) {
    caption_div = $(div_id);
    hidden = caption_div.is(":hidden");
    caption_div.animate({width: '0px', opacity: '0'}, 200);
}

