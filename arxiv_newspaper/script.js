// Get URL parameter
function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

// Deep copy Array
function deep_copy(array) {
	return JSON.parse(JSON.stringify(array));
}

// Format list of authors
function format_authors(authors) {
	if (authors.length == 1) {
		return authors[0];
	} else if (authors.length == 2) {
		return authors[0] + " &amp; " + authors[1];
	} else if (authors.length == 3) {
		return authors[0] + ", " + authors[1] + " &amp; " + authors[2];
	} else {
		return authors[0] + " et al.";
	}
}

function main() {
	// Clear table HTML
	var table_html = "";
	
	// Get URL component keywords
	var kwords = getURLParameter("key");
	
	var key_entries = [];
	key_entries.length = 0;
	
	if (kwords !== null) {
		var kword_list = kwords.split(",");
		
		console.log(kword_list)
		
		// Find arXiv entries which include key words	
		for (var i = kword_list.length - 1; i >= 0; i--) {
			var kword = kword_list[i];
			
			// Loop through articles checking if key word is in either the title or the abstract
			var arxiv_entries_copy  = deep_copy(arxiv_entries);
			
			for (var j = arxiv_entries.length - 1; j >= 0; j--) {
				if (arxiv_entries[j].title.includes(kword) || arxiv_entries[j].abs.includes(kword)) {
					// Get entry
					var kword_entry = arxiv_entries[j];
					
					// Add entry to key_entries
					key_entries.unshift(kword_entry);		
					
					// Remove entry from arxiv_entries
					arxiv_entries.splice(j, 1);
				}
			}
		}
	
		// Put key word articles at start
		arxiv_entries = key_entries.concat(arxiv_entries);
	}
	
	// Format front-page story
	headline_entry = arxiv_entries[0];
	
	table_html += "<tr><td class='headline_cell' colspan=2>";
	
	// Add title
	headline_entry.title = headline_entry.title.replace(/(^|[^\$])\$([^\$]+)\$([^\$]|$)/g, " \\($2\\) ");
	
	headline_entry.title = headline_entry.title.replace(/\</g, "&lt;");
	headline_entry.title = headline_entry.title.replace(/\>/g, "&gt;");
	
	table_html += "<h1 class='headline_title'><a href='" + headline_entry.link + "'>" + headline_entry.title + "</a></h1>";
	
	// Add authors
	table_html += "<h2 class='headline_authors'>" + format_authors(headline_entry.authors) + "</h2>";
	
	// Add image
	table_html += "<div class='headline_img_container'><img class='headline_img' src='" + headline_entry.img_path + "' /></div>";
	
	// Add abstract
	headline_entry.abs = headline_entry.abs.replace(/(^|[^\$])\$([^\$]+)\$([^\$]|$)/g, " \\($2\\) ");
	
	headline_entry.abs = headline_entry.abs.replace(/\</g, "&lt;");
	headline_entry.abs = headline_entry.abs.replace(/\>/g, "&gt;");
	
	table_html += "<p class='headline_abs'>" + headline_entry.abs + "</p>";
	
	table_html += "</td></tr>";
	
	// Column html
	left_html  = "";
	right_html = "";
	
	// Loop through rest of entries
	for (var k = 1; k < arxiv_entries.length; k++) {
		// Get entry
		entry = arxiv_entries[k];
		
		// Add title
		entry.title = entry.title.replace(/(^|[^\$])\$([^\$]+)\$([^\$]|$)/g, "$1\\($2\\)$3");
		
		entry.title = entry.title.replace(/\</g, "&lt;");
		entry.title = entry.title.replace(/\>/g, "&gt;");
		
		entry_html = "<h1 class='entry_title'><a href='" + entry.link + "'>" + entry.title + "</a></h1>";
			
		// Add authors
		entry_html += "<h2 class='entry_authors'>" + format_authors(entry.authors) + "</h2>";
			
		// Add image
		entry_html += "<div class='entry_img_container'><img class='entry_img' src='" + entry.img_path + "' /></div>";
			
		// Add abstract
		entry.abs = entry.abs.replace(/(^|[^\$])\$([^\$]+)\$([^\$]|$)/g, "$1\\($2\\)$3");
		
		entry.abs = entry.abs.replace(/\</g, "&lt;");
		entry.abs = entry.abs.replace(/\>/g, "&gt;");
		
		entry_html += "<p class='entry_abs'>" + entry.abs + "</p> <br/><hr/><br/>";
		
		// Alternate columns
		if (k % 2 == 1) {
			// Left column
			left_html += entry_html;
			
		} else {
			// Right column
			right_html += entry_html;
		}
	}
	
	// Add columns to html
	table_html += "<tr><td class='entry_column left_column'>" + left_html + "</td><td class='entry_column right_column'>" + right_html + "</td></tr>";
	
	// Set table HTML
	document.getElementById("main_table").innerHTML = table_html;
	
	// Reload MathJaX
    reload_mathjax();
}

document.addEventListener('DOMContentLoaded', main, false);