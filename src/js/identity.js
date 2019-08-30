var reg = {
    mobile: /^1\d{10}$/,
    validCode: /^\d{6}$/
};
var height = {
    footerImg: $("footer > img").height(),
    ftOffsetBottom: $(window).height() - $(".identity-content").height() - $(".identity-content").offset().top
};
var _imgCode = {
    imgId: '',
    imgCode: '',
    imgHead: 'data:image/png;base64,',
    getImgCode: function() {
        $.ajax({
            url: "/sysStationApprove/sendImgCode",
            type: "GET",
            async: true,
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                if(data.success === '0000') {
                    _imgCode.imgId = data.data.imgId;
                    if(data.data.imgStr) {
                        $("#imgCode").attr('src', _imgCode.imgHead + data.data.imgStr);
                    }
                } else {
                    showMessage(data.error)
                }
            },
            error: function(xhr, textStatus) {
                showMessage('请求失败')
            }
        })
    },
    validImgCode: function(mobile, isOperator, imgId, imgCode) {
       $.ajax({
            url: "/sysStationApprove/sendVerifyCode",
            type: "POST",
            async: true,
            data: {
                imgId: imgId,
                imgCode: imgCode
            },
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                if(data.success === '0000') {
                    // 验证成功，发送短信验证码
                    _identity._getValidCode(mobile, isOperator, imgId, imgCode)
                } else if (data.success === '2013' || data.success === '2008') {
                    _imgCode.getImgCode();
                    $('#passcode').val("");
                    showMessage('图形验证码错误');
                } else {
                    showMessage(data.error)
                }
            },
            error: function(xhr, textStatus) {
                showMessage('请求失败')
            }
        }) 
    }
};
var _identity = {
    isOperator: 0,
    getValidate: function() {
        var mobile = $("#mobile").val().trim();
        _imgCode.imgCode = $("#passcode").val().trim();
        if(mobile.length === 11 && reg.mobile.test(mobile)) {
            if(_imgCode.imgCode != '') {
                _imgCode.validImgCode(mobile , _identity.isOperator, _imgCode.imgId , _imgCode.imgCode);
            } else {
                showMessage("请输入图形验证码")
            }
        } else {
            showMessage("请输入正确的手机号")
        }
    },
    nexStep: function() {
        var mobile = $("#mobile").val().trim();
        var validCode = $("#validCode").val().trim();
        if(reg.mobile.test(mobile)) {
            if(reg.validCode.test(validCode)) {
                this._validCode(mobile, validCode)
            } else {
                showMessage("请输入正确验证码")
            }
        } else {
            showMessage("请输入正确的手机号")
        }
    },
    chooseIdentity: function(identityStatus) {
        if(identityStatus === 0) {
            $(".choose-owner").addClass("active");
            $(".choose-operator").removeClass("active");
            this.isOperator = 0;
        } else if(identityStatus === 1) {
            $(".choose-owner").removeClass("active");
            $(".choose-operator").addClass("active");
            this.isOperator = 1;
        }
    },
    _getValidCode: function(mobile, isOperator, imgId, imgCode) {
        $.ajax({
            url: "/sysStationApprove/sendValidateCode/" + mobile,
            type: "POST",
            async: true,
            data: {
                isOperator: isOperator,
                imgId: imgId,
                imgCode: imgCode
            },
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                if(data.success === '0000') {
                    var time = setInterval(function() {
                        if(data.data > 1) {
                            $("#timeOut").val(--data.data);
                            $("#timeOut").attr("disabled", true)
                        } else {
                            $("#timeOut").val("验证");
                            $("#timeOut").attr("disabled", false);
                            clearInterval(time)
                        }
                    }, 1000)
                } else {
                    showMessage(data.error)
                }
            },
            error: function(xhr, textStatus) {
                showMessage('请求失败')
            }
        })
    },
    _validCode: function(mobile, code) {
        $("#nextStep").attr("disabled", true);
        $.ajax({
            url: "/sysStationApprove/verifyCode/" + mobile,
            type: "POST",
            async: true,
            data: {
                code: code
            },
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                $("#nextStep").attr("disabled", false);
                if(data.success === "0000") {
                    showMessage("验证成功");
                    if(website.partyCode) {
                        window.location.href = website.addr + "/hbgStationApply/relevantInfo.html?order=" + data.data + "&mobile=" + mobile + "&isOperator=" + _identity.isOperator + "&partyCode=" + website.partyCode;
                    } else {
                        window.location.href = website.addr + "/hbgStationApply/relevantInfo.html?order=" + data.data + "&mobile=" + mobile + "&isOperator=" + _identity.isOperator;
                    }
                } else {
                    showMessage(data.error)
                }
            },
            error: function(xhr, textStatus) {
                $("#nextStep").attr("disabled", false);
                showMessage('请求失败')
            }
        })
    }
};
$(function() {
    if(height.footerImg < height.ftOffsetBottom) {
        $("footer > img").addClass("imgOffsetBottom")
    } else {
        $("footer > img").addClass("imgOffsetTop")
    }
});
//获取图形验证码
_imgCode.getImgCode();
// 获取宾果号
$(function() {
    website.partyCode = website._getUrlParams('partyCode');
    console.log(website.partyCode)
    // 判断是否有partyCode
    if(website.partyCode) {
//      website._isAuthorization(website.partyCode, function(data) {
//          // partyCode为授权宾果号
//          if(data) {
                // 显示宾果号
                $('.partyCode').css('display', 'block').html('推荐者：' + website.partyCode);
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