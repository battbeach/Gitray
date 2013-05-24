// Regex
// (https?:\/\/(www.)?github.com|github.com)?\/?(\w+)(\/|\s)(\w+)


var express   = require('express')
  , stylus    = require('stylus')
  , nib       = require('nib')
  , GitHubApi = require('github')
  , und       = require("underscore");

var credentials = require("./credentials.json");
  
var github = new GitHubApi({
  version: "3.0.0"
});

github.authenticate({
    type: "basic",
    username: credentials.username,
    password: credentials.password
});
  
var app = express();
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.use(express.bodyParser());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine(".html", require('jade').__express);
app.use(express.logger('dev'));
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
));

app.use(express.static(__dirname + '/public'));
app.use(express.favicon(__dirname + "/public/favicon.ico"));


app.get('/', function (req, res) {
  res.render('index',
  { error: false, message: ""})
});

app.get('/:user/:project', function(req, res) {
  var user = req.params.user;
  var project = req.params.project;
  
  github.repos.getBranches({
    user: user,
    repo: project,
    branch: 'master'
  }, function(err, response) {
    if (err) {
      res.render('index',
      {error: true, message: "Could not find user with that project. Or it's private."});
    } else {
      res.render("code");
    }
  });
});

app.get('/project/:user/:project', function(req, res) {
  var user = req.params.user;
  var project = req.params.project;
  
  github.repos.getBranches({
    user: user,
    repo: project,
    branch: 'master'
  }, function(err, response) {
    // This should be fixed in the Node-github repo. It is returning branches it should not
    // For some reason some return more than one
    
    if (response.length > 1) {
     var branch = und.findWhere(response, {name: 'master'}); 
    } else {
      branch = response[0];
    }
    
    var sha = branch.commit.sha;
    
    github.gitdata.getTree({
      user: user,
      repo: project,
      sha: sha,
      recursive: true
    }, function(err2, response2) {
      // files = [];
      
      var tree = response2.tree;
      var paths = und.map(tree, function(item) {return {path: item.path,
                                                        type: item.type,
                                                        sha: item.sha}});
      files = []
      setupRoot(paths);
      
      for (var i in tree) {
        obj = tree[i];
        var type = obj.type;
        var path = obj.path;
        var sha = obj.sha;
        var name = path.replace(/^.*[\\\/]/, '')

        parseFolder(name, path, type, sha);
      }
      
      github.repos.getReadme({
        user: user,
        repo: project
      }, function(err3, response3) {
        var content = response3.content;
        var decrypted = new Buffer(content, 'base64').toString('ascii');
        var resp = {files: files, readme: decrypted};

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(resp));
        res.end();
      });
    });
  });
});

app.get('/content', function(req, res) {
  var query = req.query
  var sha = query.sha;
  var user = query.user;
  var project = query.project;
  
  github.gitdata.getBlob({
  user: user,
  repo: project,
  sha: sha
  }, function(err, response) {
    var content = response.content;
    var decrypted = new Buffer(content, 'base64').toString('ascii');
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(decrypted));
    res.end();
  });
});

app.post('/project', function(req, res) {
  var project = req.body.project;
  var regex = /(https?:\/\/(www.)?github.com|github.com)?\/?(\w+)(\/|\s)(\w+)/
  var result = project.match(regex);
  
  if (!result) {
    res.render('index',
     { error: true, message: "Github URL entered is formatted incorrectly."});
  }
  
  var username = result[3];
  var project = result[5];
  
  res.redirect("/" + username + "/" + project);
});

app.listen(3000);
console.log("App listening on port 3000");


// Some functions

// Dynatree expects the format to be formatted like an array.
// See this Stackoverflow answer for more info:
// http://stackoverflow.com/questions/16704961/javascript-convert-string-path-to-a-formatted-array
function parseFolder(name, path, type, sha) {
    var cur = files;
    var split = path.split("/");
    if (split.length === 1) {
      return;
    }
    var previous = split[0];
    split.forEach(function(elem){
      var el = und.findWhere(cur, {title: elem});
      
      if (el) {
        // Continue
      } else {
        // This will be a bigger loop
        if (type === "blob" && elem === name) {
          var prev = und.findWhere(cur, {title: previous});
          cur.push({title: name, key: sha});
        } else {
          cur.push({title: elem, key: sha, isFolder: true, children: []});         
        }
      }
      var nextLoop = und.findWhere(cur, {title: elem});
      cur = nextLoop.children;
      previous = elem;
    });
}

function setupRoot(paths) {
  paths.forEach(function(path) {
    var type = path.type;
    var sha = path.sha;
    var path = path.path;
    var split = path.split("/");
    var root = split[0];
    
    var test = !und.findWhere(files, {title: root});
    
    if (type === "blob" && !und.findWhere(files, {title: root})) {
      files.push({title: root, key: sha});
    } else if (type === "tree" && !und.findWhere(files, {title: root, isFolder: true})) {
      files.push({title: root, isFolder: true, key: sha, children: []});
    }
  });
}