function updateMathContent(s) {
   var math = MathJax.Hub.getAllJax("mathdiv")[0];
   MathJax.Hub.Queue(["Text", math, s]);
}

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};

// src: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var len_original   = array.length;
  var original_array = Array.from({length: len_original}, (x, i) => i);
  var shuffled_array = [];

  // While there remain elements to shuffle.
  for (var j = 0; j < len_original; j++) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * original_array.length);

    // Remove from original array
    var index = original_array[randomIndex];

    original_array.splice(randomIndex,1)

    // Add to shuffled array
    shuffled_array.push(index);
  }

  return shuffled_array;
}

function main() {
  // Clear table
  document.getElementById("main_table").innerHTML = '';

  // Open arXiv
  var request = new XMLHttpRequest();
  request.open("GET", "./astro_ph_co.html", true);  // last parameter must be true
  request.responseType = "document";

  // Get response
  request.onload = function (e) {
    if (request.readyState === 4) {
      if (request.status === 200) {
        // Seed random numbers with date
        var date = new Date();
        date_str = date.yyyymmdd();

        Math.seedrandom(date_str);

        // Get HTML response
        var result = request.response;

        // Identify all papers on arXiv page
        var items = result.body.getElementsByTagName("dd");

        var link_items = result.body.getElementsByTagName("dt");

        // Clear table
        var table_html = "";

        // Randomly shuffle the papers
        var shuffled_idx = shuffle(items);

        for (var i = 0; i < items.length; i++) {
          var idx       = shuffled_idx[i];
          var item      = items[idx];
          var link_item = link_items[idx];

          var title_el = item.getElementsByClassName("list-title")[0];
          var auths_el = item.getElementsByClassName("list-authors")[0];
          var comms_el = item.getElementsByClassName("list-comments")[0];
          var subjs_el = item.getElementsByClassName("list-subjects")[0];

          var ident_el = link_item.getElementsByClassName("list-identifier")[0];

          
          // Add table row
          table_html += '<tr class="arxiv_row"><td class="arxiv_item">';

          // Add title
          var title = title_el.innerHTML;

          title = title.replace(/(^|[^\$])\$([^\$]+)\$([^\$]|$)/g, " \\($2\\) ")
          
          var clean_title = title.replace(/<\/?[^>]+(>|$)/g, "");
          clean_title = clean_title.replace(/Title: /g, "");

          table_html += '<div class="title">['+(i+1)+"] "+clean_title+'</div>';

          // Add authors
          var auths = auths_el.innerHTML;
          
          auths = auths.replace(/<span class="descriptor">Authors:<\/span>/g, 'Authors:');
          auths = auths.replace(/href="\//g, 'href="https://arxiv.org/');

          table_html += '<div class="author">'+auths+'</div>';

          // Add comments
          if (typeof comms_el != 'undefined') {
            var comms = comms_el.innerHTML;
            
            comms = comms.replace(/href="\//g, 'href="https://arxiv.org/');

            table_html += '<div class="comms">'+comms+'</div>';
          }

          // Add subjects
          if (typeof subjs_el != 'undefined') {
            var subjs = subjs_el.innerHTML;

            subjs = subjs.replace(/https:\/\/astrochristian.github.io\//g, 'https://arxiv.org/');

            table_html += '<div class="subjs">'+subjs+'</div>';
          }

          // Close column tag
          table_html += '</td><td class="arxiv_link">';

          // Add links
          if (typeof ident_el != 'undefined') {
            // Get link
            var abs_link = ident_el.getElementsByTagName("a")[0].href;
            abs_link = abs_link.replace(/https:\/\/astrochristian.github.io\//g, 'https://arxiv.org/');
			
            var pdf_link = abs_link.replace("abs","pdf")+".pdf";
            pdf_link = pdf_link.replace(/https:\/\/astrochristian.github.io\//g, 'https://arxiv.org/');

            table_html += '<div class="links"><a href="'+abs_link+'" target="_blank" rel="noopener noreferrer">abs</a></div>';
            table_html += '<div class="links"><a href="'+pdf_link+'" target="_blank" rel="noopener noreferrer">pdf</a></div>';
          }

          // Close row tag
          table_html += '</td></tr>';

          // Reload MathJaX
          reload_mathjax();
          
        }
        // Write to the table
        document.getElementById("main_table").innerHTML = table_html;
      } else {
        console.error(request.status, request.statusText);
      }
    }
  };
  request.onerror = function (e) {
    console.error(request.status, request.statusText);
  };
  request.send(null);  // not a POST request, so don't send extra data
}

document.addEventListener('DOMContentLoaded', main, false);