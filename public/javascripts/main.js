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
  	
function makeModeString(mode) {
  return "ace/mode/" + mode;
}  	
  	
function modeFromExtension(extension) {
  if (extension === "c") {
    return makeModeString("c_cpp");
  } else if (extension === "js") {
    return makeModeString("javascript");
  } else if (extension === "clj" || extension === "cljs") {
    return makeModeString("clojure");
  } else if (extension === "coffee") {
    return makeModeString("coffee");
  } else if (extension === "cs") {
    return makeModeString("csharp");
  } else if (extension === "css") {
    return makeModeString("css");
  } else if (extension === "dart") {
    return makeModeString("dart");
  } else if (extension === "go") {
    return makeModeString("golang");
  } else if (extension === "haml") {
    return makeModeString("haml");
  } else if (extension === "hs" || extension === "lhs") {
    return makeModeString("haskell");
  } else if (extension === "html") {
    return makeModeString("html");
  } else if (extension === "jade") {
    return makeModeString("jade");
  } else if (extension === "json") {
    return makeModeString("json");
  } else if (extension === "less") {
    return makeModeString("less");
  } else if (extension === "lisp") {
    return makeModeString("lisp");
  } else if (extension === "md" || extension === "markdown") {
    return makeModeString("markdown");
  } else if (extension === "pl" || extension === "pm") {
    return makeModeString("perl");
  } else if (extension === "php") {
    return makeModeString("php");
  } else if (extension === "py") {
    return makeModeString("python");
  } else if (extension === "rb") {
    return makeModeString("ruby");
  } else if (extension === "erb") {
    return makeModeString("html_ruby");
  } else if (extension === "sass") {
    return makeModeString("sass");
  } else if (extension === "scala") {
    return makeModeString("scala");
  } else if (extension === "scm" || extension === "ss") {
    return makeModeString("scheme");
  } else if (extension === "sql") {
    return makeModeString("sql");
  } else if (extension === "styl") {
    return makeModeString("stylus");
  } else if (extension === "xml") {
    return makeModeString("xml");
  } else if (extension === "yml") {
    return makeModeString("yaml");
  } else if (extension === "am") {
    return makeModeString("makefile");
  }
  
  else {
    return makeModeString("text");
  }
}