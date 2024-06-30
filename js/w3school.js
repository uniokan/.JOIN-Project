/**
 * Function to include HTML content from external files into elements with a specific attribute.
 * @param {Function} callback - A callback function to be executed after HTML content is included.
 */
function includeHTML(callback) {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      /*search for elements with a certain atrribute:*/
      file = elmnt.getAttribute("w3-include-html");
      if (file) {
          /* Make an HTTP request using the attribute value as the file name: */
          xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
              if (this.readyState == 4) {
                  if (this.status == 200) { 
                      elmnt.innerHTML = this.responseText; 
                      if (typeof callback === 'function') {
                          callback();
                      }
                  }
                  if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                  /* Remove the attribute, and call this function once more: */
                  elmnt.removeAttribute("w3-include-html");
                  includeHTML(callback);
              }
          }
          xhttp.open("GET", file, true);
          xhttp.send();
          return;
      }
  }
  if (typeof callback === 'function') {
      callback();
  }
}