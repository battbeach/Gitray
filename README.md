Gitray
=========

Gitray makes it easy to view Github projects at a glance. You type in a project and are able to quickly manoeuvre it similarly to as you would in textmate. 

#### Why?
I found I wanted a quick way to check out a project without having to clone it and open it in Sublime. Navigating on Githubs site can be disorienting if it is a large project. There may be a quicker or alternative solution to what I wanted but it was still a joy working with the github api (pretty awesome!);

Limitations
-----------
* Right now there is no authentication so you can not view private repos (even your own). 
* Only able to view the master branch
* No searching

Contribute
----------
I made this rather quickly over the last couple of nights so if you find a bug please submit an issue or fix it and submit a pull request! I will accept it. 

Installation
--------------

```
Clone the repo
Rename credentials.example.json to credentials.json and fill in information (if you want more API requests)

npm install
node server.js
```

Author
------

Feel free to message me: jordan@howlett.io


License
-

MIT
