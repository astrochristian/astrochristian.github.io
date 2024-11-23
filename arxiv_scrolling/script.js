Date.prototype.yyyymmdd = function() {
  var mm = this.getUTCMonth() + 1; // getMonth() is zero-based
  var dd = this.getUTCDate();

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
  // Get URL parameters
  var url = new URL(window.location.href);
  var params = url.searchParams;

  var subjects = ["astro-ph.CO", "astro-ph.GA", "astro-ph.HE", "astro-ph.IM", "astro-ph.SR", "astro-ph.EP"];

  // Loop through subjects
  for (var i = 0; i < subjects.length; i++) {
    var subject = subjects[i];

    // Check if subject is in URL
    if (params.has(subject)) {
      // Add selected class
      document.getElementById(subject).className = "selected";
    }
  }
  
  // Clear table
  document.getElementById("main_table").innerHTML = '';

  // Get selected subjects
  var selected_subjects = [];

  for (var i = 0; i < subjects.length; i++) {
    var subject = subjects[i];

    if (document.getElementById(subject).className == "selected") {
      selected_subjects.push(subject);
    }
  }

  // Check if no subjects are selected
  if (selected_subjects.length == 0) {
    selected_subjects = subjects;

    // Update the URL to remove all subjects
    var new_url = window.location.href.split("?")[0];

    // Update URL
    window.history.pushState({}, document.title, new_url);
  } else {
    // Update the URL to add the selected subjects
    var new_url = window.location.href.split("?")[0] + "?";

    for (var i = 0; i < selected_subjects.length; i++) {
      new_url += selected_subjects[i] + "&";
    }

    // Remove last "&"
    new_url = new_url.slice(0, -1);

    // Update URL
    window.history.pushState({}, document.title, new_url);
  }

  // Open arXiv
  var request = new XMLHttpRequest();
  request.open("GET", "https://raw.githubusercontent.com/astrochristian/astro_ph_co/master/astro_ph.html", true);  // last parameter must be true
  
  request.responseType = "text";

  // Get response
  request.onload = function (e) {
    if (request.readyState === 4) {
      if (request.status === 200) {
        // Seed random numbers with date
        var date = new Date();
        date_str = date.yyyymmdd();

        Math.seedrandom(date_str);

        // Get HTML response
        var result = document.createElement( 'html' );
        result.innerHTML = request.response;

        // Identify all papers on arXiv page
        var items = result.getElementsByTagName("dd");

        var link_items = result.getElementsByTagName("dt");

        // Load list of days at start
        var days = result.getElementsByTagName("li");

        // Check if there's another Friday
        var remove_number = items.length;

        // Get day of week (Friday repeated since no uploads on weekends)
        var day_names = ["Fri", "Mon", "Tue", "Wed", "Thu", "Fri", "Fri"];

        const d = new Date();
        let day_name = day_names[d.getDay()];

        if (days[4].textContent.includes(day_name)) {
          // Get href of child a tag
          var href_link = days[4].innerHTML;

          // Match number
          var remove_number_str = href_link.match(/(?:item)\d+(?=")/)[0]
          remove_number = parseInt(remove_number_str.replace("item", "")) - 1;    
        }

        // Remove wrong day
        items = Array.from(items).slice(0, remove_number);
        link_items = Array.from(link_items).slice(0, remove_number);

        // Clear table
        var table_html = "";

        // Randomly shuffle the papers
        var shuffled_idx = shuffle(items);

        // Initialise paper number
        var paper_number = 0;

        for (var i = 0; i < items.length; i++) {
          var idx       = shuffled_idx[i];
          var item      = items[idx];
          var link_item = link_items[idx];

          var title_el = item.getElementsByClassName("list-title")[0];
          var auths_el = item.getElementsByClassName("list-authors")[0];
          var comms_el = item.getElementsByClassName("list-comments")[0];
          var subjs_el = item.getElementsByClassName("list-subjects")[0];

          var ident_el = link_item//.getElementsByTagName("list-identifier")[0];

          var arxiv_num = ident_el.getElementsByTagName("a")[1].id;
          
          // Remove descriptor span tags
          title_el.querySelector('.descriptor').remove();
          subjs_el.querySelector('.descriptor').remove();

          // Check if selected subject is in the list
          var subj_found = false;

          for (var j = 0; j < selected_subjects.length; j++) {
            var selected_subject = selected_subjects[j];

            if (subjs_el.innerHTML.includes(selected_subject)) {
              subj_found = true;
            }
          }

          if (subj_found) {
            // Add table row
            table_html += '<tr class="arxiv_row"><td class="arxiv_item">';

            // Add title
      
            var title = title_el.innerHTML;

            title = title.replace(/(\$)([^\$]+)(\$)/g, "\\($2\\)")
            
            var clean_title = title.replace(/<\/?[^>]+(>|$)/g, "");
            clean_title = clean_title.replace(/Title: /g, "");

            table_html += '<div class="title">['+(paper_number+1)+"] "+clean_title+'</div>';

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

            // arXiv identifier
            table_html += '<div class="ident">'+arxiv_num+'</div>';

            // Close column tag
            table_html += '</td><td class="arxiv_link">';

            // Add links
            if (typeof ident_el != 'undefined') {
              // Get link
              var abs_link = ident_el.getElementsByTagName("a")[1].href;

              abs_link = abs_link.replace(/https:\/\/astrochristian.github.io\//g, 'https://arxiv.org/');
        

              var pdf_link = abs_link.replace("abs","pdf")+".pdf";
              pdf_link = pdf_link.replace(/https:\/\/astrochristian.github.io\//g, 'https://arxiv.org/');

              table_html += '<div class="links"><a href="'+abs_link+'" target="_blank" rel="noopener noreferrer">abs</a></div>';
              table_html += '<div class="links"><a href="'+pdf_link+'" target="_blank" rel="noopener noreferrer">pdf</a></div>';
            }

            // Close row tag
            table_html += '</td></tr>';

            // Increment paper number
            paper_number += 1;
            
          }
          // Write to the table
          document.getElementById("main_table").innerHTML = table_html;

          // Reload MathJaX
          reload_mathjax();
        }
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