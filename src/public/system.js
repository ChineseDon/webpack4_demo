// 获取当前系统
var mobileUAKeywords = ["nokia", "sony", "ericsson", "mot", "samsung", "htc", "sgh", "lg", "sharp", "sie-",
    "philips", "panasonic", "alcatel", "lenovo", "iphone", "ipod", "blackberry", "meizu",
    "android", "netfront", "symbian", "ucweb", "windowsce", "palm", "operamini",
    "operamobi", "opera mobi", "openwave", "nexusone", "cldc", "midp", "wap", "mobile"
];
var userAgent = navigator.userAgent;
var regExp = new RegExp(mobileUAKeywords.join("|"), "i");
var browser = {
    mobile: !!userAgent.match(regExp),
    android: /android/i.test(userAgent) || /linux/i.test(userAgent),
    iPad: /iPad/i.test(userAgent),
    iphone: /iphone/i.test(userAgent),
    ipod: /ipod/i.test(userAgent),
    isWechatBrowser: /micromessenger/i.test(userAgent)
};

// 初始化所需系统为false
var system = {
    android: false,
    ios: false,
    wx: false
}

// 系统识别
if(browser.android) {
    system.android = true;
} else if(browser.iphone || browser.ipod || browser.iPad) {
    system.ios = true;
}
// 微信系统识别
if(browser.isWechatBrowser) {
    system.wx = true;
}