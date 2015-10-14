

var expanders = new Array();

function nav_link_click(div_id) {

    var contains_element = false;
    for (var i=0;i<expanders.length;i++) {
        if (expanders[i] == div_id) {
            contains_element = true;
            break;
        }
    }

    if (contains_element === false) {
        expanders.push(div_id);
    }

    var expander_div = jQuery(div_id);
    var open_div = null;
    var hidden = expander_div.is(':hidden');

    if (hidden) {
        for (var i=0;i<expanders.length;i++) {
            if (expanders[i] == div_id) {
                continue;
            }
            open_div = jQuery(expanders[i]);
            if (!open_div.is(':hidden')) {
                break;
            }
            open_div = null;
        }
    }

    if (open_div !== null) {
      open_div.slideToggle(300, function() {expander_div.slideToggle(300);});
    }
    else {
      expander_div.slideToggle(300);
    }
}

