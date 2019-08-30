import index from '../css/index.css';
import iconfont from '../css/ref/iconfont.css';
import reset from '../css/ref/reset.min.css';
import {website, wxShare} from './wxShare'


var indexNav = $("#indexNav");
var doc = $(document);
var indexNavTop = indexNav.offset().top;
console.log(doc)
window._index = {
    tab: function(el, index) {
        $(el).hide().fadeOut();
        $(el).eq(index).fadeIn().show()
    },
    toPage: function() {
        if(website.partyCode) {
            window.location.href = website.addr + "/hbgStationApply/identity.html" + "?partyCode=" + website.partyCode;
        } else {
            window.location.href = website.addr + "/hbgStationApply/identity.html";
        }
    },
    fixNav: function() {
        if(doc.scrollTop() >= indexNavTop) {
            indexNav.addClass("tab-nav-fixed")
        } else {
            if(indexNav.hasClass("tab-nav-fixed")) {
                indexNav.removeClass("tab-nav-fixed")
            }
        }
    }
};
$("ul.tab-nav > li").click(function() {
	console.log(_index);
    $("ul.tab-nav > li").removeClass("active");
    $(this).addClass("active");
    if(indexNav.hasClass("tab-nav-fixed")) {
        $("html,body").animate({
            scrollTop: Math.ceil($(".index-tab").offset().top)
        }, 300)
    } else {
        $("html,body").animate({
            scrollTop: Math.ceil($(this).offset().top)
        }, 300)
    }
    _index.tab("ul.tab-content > li", $(this).index())
});
$(window).scroll(function() {
    _index.fixNav()
});
$(function() {
    $(".nav-hook").height(indexNav.height() + 'px');
    _index.tab("ul.tab-content > li", 0);
    _index.fixNav();
    if(indexNav.hasClass("tab-nav-fixed")) {
        $("html,body").animate({
            scrollTop: Math.ceil($(".index-tab").offset().top)
        }, 300)
    }
});
// 控制分享
$(function() {
    website.partyCode = website._getUrlParams('partyCode');
	console.log(website);
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