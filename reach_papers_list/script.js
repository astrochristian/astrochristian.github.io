function main() {
    // Clear table
    document.getElementById("main_table").innerHTML = '';

    // Open JSON file
    var request = new XMLHttpRequest();
    request.open("GET", "https://raw.githubusercontent.com/astrochristian/reach_papers_list/main/results.json", true);  // last parameter must be true
    
    // Get response
    request.onload = function (e) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                // Parse request
                var parsed_json = JSON.parse(request.response);

                // Get list of papers
                var papers = parsed_json.solr.response.docs;

                // Clear table
                var table_html = "";

                // Loop through papers
                for (var i = 0; i < papers.length; i++) {
                    var paper = papers[i];

                    var title = paper.title[0];
                    var authors = paper.author;
                    var date = paper.pubdate;

                    // Add table row
                    table_html += '<tr class="arxiv_row"><td class="arxiv_item">';

                    // Add title
                    title = title.replace(/(\$)([^\$]+)(\$)/g, "\\($2\\)")
                    
                    var clean_title = title.replace(/<\/?[^>]+(>|$)/g, "");
                    clean_title = clean_title.replace(/Title: /g, "");

                    table_html += '<div class="title">['+(i+1)+"] "+clean_title+'</div>';

                    // Improve formatting of authors
                    var clean_authors = [];

                    for (var j = 0; j < authors.length; j++) {
                        var author_split = authors[j].split(", ");
                        clean_authors.push(author_split[1] + " " + author_split[0])
                    }

                    // Add authors
                    clean_authors = clean_authors.join(', ')
                    table_html += '<div class="author">'+clean_authors+'</div>';

                    // Close column tag
                    table_html += '</td><td class="arxiv_link">';

                    var link = "https://doi.org/" + paper.doi[0];
                    table_html += '<div class="links"><a href="'+link+'" target="_blank" rel="noopener noreferrer">🔗</a></div>';
            
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