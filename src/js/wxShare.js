export var  website = {
    addr: "https://www.haibingo.com",
    partyCode: '',  // 授权验证码
    _getUrlParams: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    },
    _isAuthorization: function (bingoNum, callback) {
        $.ajax({
          url: '/sysStationApprove/verify/partycode',
          type: 'POST',
          async: true,
          data: {
            partyCode: bingoNum
          },
          dataType: 'json',
          success: function (data, textStatus, jqXHR) {
            if (data.success === "0000") {
              // 展示推荐者宾果号
              callback(true)
            } else {
              callback(false);
            }
          },
          error: function (xhr, textStatus) {
            showMessage('请求失败');
          }
        })
    }
};
export var wxShare = {
    title: '实体投注站销量口碑双增长就是这么简单！！！！',
    link: website.addr + '/hbgStationApply/index.html',
    desc: '发展新会员、培育新用户、在线搞活动、查数据轻松搞定',
    imgUrl: website.addr + '/hbgStationApply/img/share.png',
    shareScope: function() {
        wx.ready(function() {
            wx.onMenuShareTimeline({
                title: wxShare.title,
                link: wxShare.link,
                imgUrl: wxShare.imgUrl,
                success: function() {
                    showMessage("分享成功")
                },
                cancel: function() {}
            });
            wx.onMenuShareAppMessage({
                title: wxShare.title,
                desc: wxShare.desc,
                link: wxShare.link,
                imgUrl: wxShare.imgUrl,
                type: '',
                dataUrl: '',
                success: function() {
                    showMessage("分享成功")
                },
                cancel: function() {}
            });
            wx.onMenuShareQQ({
                title: wxShare.title,
                desc: wxShare.desc,
                link: wxShare.link,
                imgUrl: wxShare.imgUrl,
                success: function() {
                    showMessage("分享成功")
                },
                cancel: function() {}
            });
            wx.onMenuShareQZone({
                title: wxShare.title,
                desc: wxShare.desc,
                link: wxShare.link,
                imgUrl: wxShare.imgUrl,
                success: function() {
                    showMessage("分享成功")
                },
                cancel: function() {}
            })
        })
    },
    setWxConfig: function(curUrl) {
        $.ajax({
            type: "post",
            url: "/station/WxPay/1/getSign",
            async: true,
            data: {
                url: encodeURIComponent(curUrl)
            },
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                if(data.success === "0000") {
                    wx.config({
                        debug: false,
                        appId: data.data.appId,
                        timestamp: data.data.timestamp,
                        nonceStr: data.data.nonceStr,
                        signature: data.data.signature,
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone']
                    });
                    wxShare.shareScope()
                } else {
                    showMessage(data.error)
                }
            }
        })
    }
};