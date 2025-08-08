// Cartesian product of arrays
let f = (a, b) => [].concat(...a.map(a => b.map(b => [].concat(a, b))));
let cartesian = (a, b, ...c) => b ? cartesian(f(a, b), ...c) : a;

// Shuffle array
const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

function random_start() {
    /*
    Initializes the scale at a random point
    */
    return Math.floor(Math.random() * 100);
}

function widget_size(val) {
    /*
    Returns CSS parameters to set the size of the widget,
    based on the current slider value (val)
    */

    var widget_scale = Math.round(.75*val+25);
    var scale_str = sprintf('%i%%', widget_scale);
    return {'width': scale_str, 'height': scale_str}
}

function flip(p) {
    return (Math.random() < p)*1
}

function binom(n, p) {
    flips = _.times(n, function() { return flip(p)});
    n_successes = _.reduce(flips, function(m,n) { return m+n });
    return n_successes
}

function loss_str(score) {
    if (score == 0) {
        return ''+score
    } else {
        return sprintf('-%i', score)
    }
}

// JS equivalent of PHP's $_GET
function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") {
        return;
    }

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=");
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) {
            parms[n] = [];
        }

        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

function save_data(data) { //new save data function
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'saveData.php'); // change 'write_data.php' to point to php script.
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      if(xhr.status == 200){
        console.log(xhr.responseText);
        // var response = JSON.parse(xhr.responseText);
        //console.log(response.success);
      }
    };
    xhr.send('['+JSON.stringify(data)+']');
}