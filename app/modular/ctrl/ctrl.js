var $ = require("zepto"),
    Config = require("./ctrl.json"),
    underscore = require("underscore"),
    Iscroll = require("iscroll"),

    //checkLogin = require("./checklogin"),
    hashStr, Foldar, control, main;

Foldar = Config.foldar;

control = function(argument) {
    var fnHashChang, fnChangHash, jumpPage, hash, param = {},
        hasSearch;
    fnHashChang = function(e) {
        e.preventDefault();
        var hashArray, i = 0,
            j = 0,
            resultUrl = "",
            key = "path",
            baseName = "base",
            callBackName = "",
            tempIndex = 0;

        hash = decodeURI(window.location.hash.replace("#", ""));
        hasSearch = hash.lastIndexOf('?');
        hashStr = hasSearch > 0 ? hash.substring(0, hasSearch) : hash;
        if (hasSearch > 0) {
            param = hash.substring(hash.lastIndexOf('?') + 1);
            param = "{\"" + param.replace(/\&/g, "\"\,\"").replace(/\=/g, "\"\:\"") + "\"\}";
            param = JSON.parse(param);
        }

        tempIndex = hashStr.indexOf("|");
        callBackName = hashStr.substr(Number(tempIndex + 1));
        hashStr = hashStr.substr(0, tempIndex);
        hashArray = hashStr.split("-");
        var temp = Foldar;
        for (j = hashArray.length; i < j; i++) {
            temp = temp[hashArray[i]] || temp.children[hashArray[i]]; //children
            if (!underscore.isEmpty(temp[baseName])) {
                resultUrl += temp[baseName] + "/";
            }
            if (!underscore.isEmpty(temp[key])) {
                resultUrl += temp[key] + "/";
            }

        }
        jumpPage(resultUrl, callBackName, temp, hashArray, param);

        //console.error("触发 这个 ？？？？")

        return false;
    };
    fnChangHash = function(url, param) {
        //console.log("触发 这个 ？？？？")

        hashStr = decodeURI(window.location.hash.replace("#", ""));
        //let urlLast = {};
        if (hashStr == url) {

            $(window).trigger("hashchange", function() {
                //console.error("5555555555555 这个 ？？？？")
                fnHashChang();
            });
            return false;
        } else {
            //urlLast.hash = "#" + url;
            //window.location = Object.assign({},urlLast);
            window.location.hash = "#" + url + jsonTosearch(param);

            console.log("window.location.hash " + window.location.hash);
        }
        return false;
    }


    var jsonTosearch = function(param) {
        if (!param) {
            return "";
        }
        let result = "",
            length = param.length;

        underscore.map(param, function(value, index) {
            result += index + "=" + value + "&";
        });

        //console.log("result",result);
        return "?" + result.substring(0, result.lastIndexOf('&'));
    }

    const $main = $(".main");
    const $next = $(".jsNextPage");
    const $now = $("#container-body");

    jumpPage = function(path, callBackName, param, hashArray, callBackArgument) {

        //console.log(path,callBackName,param,hashArray,"-------------------");
        require.ensure([], function() {

            /*param["html"]&&require(["../../"+ path + param["html"] + ".html"], function(doHtml) {
             doHtml==""||$main.html(doHtml);
             require(["../../"+ path + param["js"] + ".js"], function(doJS) {
             doJS[callBackName]&&doJS[callBackName](callBackArgument);
             window.isScroll.refresh()
             });

             });*/
            /*param["html"]&&require(["./app/"+ path + param["html"] + ".html"], function(doHtml) {
             doHtml==""||$main.html(doHtml);
             require(["/app"+ path + param["js"] + ".js"], function(doJS) {
             doJS[callBackName]&&doJS[callBackName](callBackArgument);
             window.isScroll.refresh()
             });

             });*/
            /*
             var html = $.trim($main.html());
             if(html!=""){
             $next.html(html).addClass('nowPage').removeClass('hide');
             $now.addClass('hide nextPage');
             $main.children().remove();
             }*/

            $main.children().remove();

            param["html"] && require(["../../modular/" + path + param["html"] + ".html"], function(doHtml) {
                doHtml == "" || $main.html(doHtml);

                require(["../../modular/" + path + param["js"] + ".js"], function(doJS) {
                    doJS[callBackName] && doJS[callBackName](callBackArgument);

                    //window.isScroll.refresh()
                    /*if(html!=""){
                     $now.removeClass('hide').animate({
                     left: 0
                     },
                     300, function() {
                     $now.removeClass('nextPage');
                     $next.addClass('hide').removeClass('nowPage').children().remove();
                     console.log("---------------")
                     })
                     }*/
                    /*	$main.removeClass('hide').animate({
                     left: 0
                     },
                     300, function() {

                     $main.removeClass('nextPage')
                     $next.children().remove().addClass('hide').removeClass('nowPage');
                     })*/
                });

            });
            /*var doHtml =  param["html"]&&require(["../../modular/"+path+ param["html"] + ".html"]);
             var doJS = require(["../../modular/"+path+param["js"] + ".js"]);

             doHtml==""||$main.html(doHtml);
             doJS[callBackName]&&doJS[callBackName](callBackArgument);
             window.isScroll.refresh()*/



        })
    }


    $(window).off("hashchange", fnHashChang).on("hashchange", function(e) {
        //console.error("666666666666666666666 这个 ？？？？")
        fnHashChang(e);
    });

    //e.preventDefault();
    return {
        fnChangHash: fnChangHash
    }

};


main = function() {
    //alert("aaa")

    var controlObj = new control();
    window.control = controlObj;
    hashStr = decodeURI(window.location.hash.replace("#", ""));
    hashStr = hashStr == "" ? "uc-in|init" : hashStr;

    //hashStr = isLogin ? hashStr : "uc-login|init";

    /*var href = window.location.href.replace(window.location.hash, "");
     var arr = href.split("?");	*/
    if (hashStr && hashStr.length > 0) {
        controlObj.fnChangHash(hashStr);
    }



    //console.error("刷新 页面")
}

var scrollInit = function() {
    /*document.addEventListener('touchmove', function (e) {
     e.preventDefault(); ////console.log("阻止浏览器 默认touchmove事件")
     }, false);*/

    //console.log("添加 默认 整屏滚动")
    /*	window.isScroll = new Iscroll("#container-body",{
     tap: false,
     disableMouse: true
     });*/
    /*window.isScroll = new Iscroll("#container-body",{
     tap: false,
     disableMouse: true,
     preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/}
     });*/

}
main();




module.exports = main;
