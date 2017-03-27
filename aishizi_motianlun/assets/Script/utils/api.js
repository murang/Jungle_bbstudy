var api = {

    api_endpoint: "http://api-growup-test.hxkid.com",
    sync_learned_time_path: "/api/baby_learnning/users/courses/:appid/learn_time",

    syncLearnedTime: function(appid, access_token, learnSeconds){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                cc.log(response);
            }
        };

        var params = ["learn_time=" + learnSeconds, "access_token=" + access_token].join("&")
        var url = this.api_endpoint + this.sync_learned_time_path.replace(":appid", appid) + "?" + params
        cc.log("url: " + url);
        xhr.open("POST", url, true);
        xhr.send();  
    },

};

module.exports = api;