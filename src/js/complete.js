"use strict";
// 分享页面
function goBack() {
    if(system.android) {
        try {
            AndroidFunction.goBack("1");
        } catch(e) {
            //TODO handle the exception
            if(website.partyCode) {
                window.location.href = website.addr + "/hbgStationApply/index.html" + '?partyCode=' + website.partyCode;
            } else {
                window.location.href = website.addr + "/hbgStationApply/index.html";
            }
        }
    } else if(system.ios) {
        try {
            window.webkit.messageHandlers.GoBack.postMessage("1");
        } catch(e) {
            //TODO handle the exception
            if(website.partyCode) {
                window.location.href = website.addr + "/hbgStationApply/index.html" + '?partyCode=' + website.partyCode;
            } else {
                window.location.href = website.addr + "/hbgStationApply/index.html";
            }
        }
    } else if(system.wx) {
        if(website.partyCode) {
            window.location.href = website.addr + "/hbgStationApply/index.html" + '?partyCode=' + website.partyCode;
        } else {
            window.location.href = website.addr + "/hbgStationApply/index.html";
        }
    } else {
        if(website.partyCode) {
            window.location.href = website.addr + "/hbgStationApply/index.html" + '?partyCode=' + website.partyCode;
        } else {
            window.location.href = website.addr + "/hbgStationApply/index.html";
        }
    }
}

// 控制分享
$(function() {
    website.partyCode = website._getUrlParams('partyCode');
    // 判断是否有partyCode
    if(website.partyCode) {
//      website._isAuthorization(website.partyCode, function(data) {
//          // partyCode为授权宾果号
//          if(data) {
                // 微信分享链接修改
                wxShare.link = website.addr + '/hbgStationApply/index.html' + '?partyCode=' + website.partyCode;
//          } else {
//              website.partyCode = null;
//          }
            // 执行微信分享
            wxShare.setWxConfig(document.location.href.split('#')[0]);
//      })
    } else {
        // 执行微信分享
        wxShare.setWxConfig(document.location.href.split('#')[0]);
    }
});