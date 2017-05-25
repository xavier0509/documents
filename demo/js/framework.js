var app = {
    canonical_uri: function(src, base_path) {
        var root_page = /^[^?#]*\//.exec(location.href)[0],
            root_domain = /^\w+\:\/\/\/?[^\/]+/.exec(root_page)[0],
            absolute_regex = /^\w+\:\/\//;
        // is `src` is protocol-relative (begins with // or ///), prepend protocol  
        if (/^\/\/\/?/.test(src)) {
            src = location.protocol + src;
        }
        // is `src` page-relative? (not an absolute URL, and not a domain-relative path, beginning with /)  
        else if (!absolute_regex.test(src) && src.charAt(0) != "/") {
            // prepend `base_path`, if any  
            src = (base_path || "") + src;
        }
        // make sure to return `src` as absolute  
        return absolute_regex.test(src) ? src : ((src.charAt(0) == "/" ? root_domain : root_page) + src);
    },

    rel_html_imgpath: function(iconurl) {
        console.log(app.canonical_uri(iconurl.replace(/.*\/([^\/]+\/[^\/]+)$/, '$1')));
        return app.canonical_uri(iconurl.replace(/.*\/([^\/]+\/[^\/]+)$/, '$1'));
    },

    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.handleBackButton, false);
    },
    handleBackButton: function() {
		navigator.app.exitApp();
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        app.triggleButton();

        document.getElementById("btn1").focus();

        coocaaosapi.notifyJSMessage("hello",function(message) {
            console.log(message); 
        },function(error) { 
            console.log(error);
        });
		
        coocaaosapi.getDeviceInfo(function(message) {
            deviceInfo = message;
            mac = message.mac;
            androidsdk = message.androidsdk;
            console.log("mac " + message.mac);
            console.log("androidsdk " + message.androidsdk);
        }, function(error) {
            console.log(error);
        });

        coocaaosapi.hasCoocaaUserLogin(function(message) {
            console.log("haslogin " + message.haslogin);
            loginstatus = message.haslogin;        
                coocaaosapi.getUserInfo(function(message) {
                    userInfo = message;
                    mobile = message.mobile;
                    console.log("external_info " + message.external_info);
                    console.log("open_id " + message.open_id);
                    console.log("mobile "+message.mobile);
                    console.log("nick_name "+message.nick_name);
                    coocaaosapi.getUserAccessToken(function(message) {
                        console.log("usertoken " + message.accesstoken);
                        accesstoken = message.accesstoken;
                    }, function(error) {
                        console.log(error);
                    });
                }, function(error) {
                    console.log(error);
                });
        }, function(error) {
            console.log(error);
        });       
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var receivedElement = parentElement.querySelectorAll('.received');
        for (var i = 0, j = receivedElement.length; i < j; i++) {
            receivedElement[i].setAttribute('style', 'display:block;');
        }
        console.log('Received Event: ' + id);
    },
    triggleButton: function() {
        cordova.require("coocaa-plugin-coocaaosapi.coocaaosapi");

        document.getElementById("btn1").addEventListener("click", function() {
            //open1();
        }, false);       
    }
};
app.initialize();