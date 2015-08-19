
//= require slides.jquery.js


function mouse_over_image(div_id) {

    var caption_div = $(div_id);
    var hidden = caption_div.is(":hidden");
    caption_div.clearQueue();
    caption_div.animate({width: '310px', opacity: '.7'}, 200);
}

function mouse_out_image(div_id) {
    var caption_div = $(div_id);
    var hidden = caption_div.is(":hidden");
    caption_div.animate({width: '0px', opacity: '0'}, 200);
}

