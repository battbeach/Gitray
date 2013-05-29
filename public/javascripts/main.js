  $(document).ready( function() {
    var url = window.location.pathname;
    var split = url.split("/").splice(1);
    var name = split[0];
    var project = split[1];
   $.getJSON('/project/'+name + '/' + project, function(data) {
     var readme = data.readme;
     var files = data.files;
     $("#tree").dynatree("getRoot").addChild(files);
     editor.setValue(readme);
     editor.getSession().setMode("ace/mode/markdown");
     editor.clearSelection();
     editor.gotoLine(0);
   });
   
  });
  	$(function(){
  		// --- Initialize sample trees
  		$("#tree").dynatree({
  			autoFocus: true,
  //			persist: true,
  			minExpandLevel: 2,
  			onFocus: function(node) {
  				// Auto-activate focused node after 1 second
  				if(node.data.href){
  					node.scheduleAction("activate", 1000);
  				}
  			},
  			onBlur: function(node) {
  				node.scheduleAction("cancel");
  			},
  			onClick: function(node, event) {
  			  console.log(node);
  			  
  			  var isFolder = node.data.isFolder;
  			  if (isFolder) return;
  			  
  			  var title = node.data.title;
  			  var regex = /(?:\.([^.]+))?$/;
  			  var extension = title.match(regex)[1];
  			  
  			  var sha = node.data.key;
  			  var url = window.location.pathname;
          var split = url.split("/").splice(1);
          var name = split[0];
          var project = split[1];
          
          var mode = modeFromExtension(extension);
          console.log("MODE", mode, "EXTENSION", extension);
          
        $.ajax({
          url: '/content',
          data: {project: project, user: name, sha: sha},
          success: function(data) {
            editor.setValue(data);
            editor.clearSelection();
            editor.getSession().setMode(mode);
            editor.gotoLine(0);
          },
          dataType: 'json'
        });
          
  			},
  			onActivate: function(node){
  				if(node.data.href){
  					window.open(node.data.href, node.data.target);
  				}
  			}
  		});
  	});
  	
// Ace expects the mode in this format
function makeModeString(mode) {
  return "ace/mode/" + mode;
}  	

// List of recognized extensions
var extensions = {
  "c": "c_cpp",
  "js": "javascript",
  "clj": "clojure",
  "cljs": "clojure",
  "coffee": "coffee",
  "cs": "csharp",
  "css": "css",
  "dart": "dart",
  "go": "golang",
  "haml": "haml",
  "hs": "haskell",
  "lhs": "haskell",
  "html": "html",
  "jade": "jade",
  "json": "json",
  "less": "less",
  "lisp": "lisp",
  "md": "markdown",
  "markdown": "markdown",
  "pl": "perl",
  "pm": "perl",
  "php": "php",
  "py": "python",
  "rb": "ruby",
  "erb": "html_ruby",
  "sass": "sass",
  "scala": "scala",
  "scm": "scheme",
  "ss": "scheme",
  "sql": "sql",
  "styl": "stylus",
  "xml": "xml",
  "yml": "yaml",
  "am": "makefile",
  "default": "text",
}

// The messss. Case statement be easier? Or other solution. 
function modeFromExtension(extension) {
  if (extension in extensions) {
    return makeModeString(extensions[extension])
  } else {
    return makeModeString(extensions["default"])
  }
}