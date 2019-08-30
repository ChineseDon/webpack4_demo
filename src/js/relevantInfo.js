'use strict';
var reg = {
    chineseName: /^[\u4E00-\u9FA5]+$/,
    stationNum: /^\d{8}$/,
    datePicker: /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
    idCard: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/,
    qq: /^[1-9]\d{4,14}/,
    mobile: /^1\d{10}$/,
    weChat: /^[a-zA-Z0-9_-]{5,19}$/
};
var rvInfo = {
    approveCode: '',
    stationType: '',
    ownerName: '',
    stationNum: '',
    sellStartTime: '',
    sellEndTime: '',
    province: '',
    city: '',
    area: '',
    addr: '',
    x: '',
    y: '',
    gameIdArry: '',
    gameStr: '',
    countryGameLength: 0,
    name: '',
    mobile: '',
    idcard: '',
    ownerIdcard: '',
    ownerMobile: '',
    ownerFileIdcardZ: '',
    ownerFileIdcardF: '',
    fileIdcardS: '',
    fileSell: '',
    fileSellS: '',
    fileDoor: '',
    fileIdcardZ: '',
    fileIdcardF: '',
    protocolFile: '',
    qq: '',
    wechat: '',
    partyCode: '',
    isOperator: 0
};
var rvBase = {
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r != null) {
            return unescape(r[2])
        }
        return null
    },
    scrollAnimate: function(el) {
        $("body,html").animate({
            scrollTop: Math.ceil($(el).offset().top)
        }, 1000)
    },
    transformNum: function(num) {
        if(num <= 9 && num > 0) {
            return '0' + num
        } else {
            return num
        }
    },
    initGameCode: function() {
        $.ajax({
            options: 'GET',
            url: './json/sys_game_province.json',
            async: false,
            dataType: 'json',
            success: function(data) {
                var records = data.RECORDS;
                rvInfo.gameStr = "";
                var str = "";
                for(var i = 0; i < records.length; i += 1) {
                    if(records[i].province_id === 1) {
//                      if(records[i].game_code === "B001") {
                        str = "<div class=\"normal active\"><input type=\"button\" name=\"" + records[i].game_code + "\" value=\"" + records[i].game_name + "\" /><img src=\"./img/relevantInfo/checked.png\" /></div>"
//                      } else if (records[i].hotline_id != null && records[i].hotline_id != '') {
//                          str = "<div class=\"normal\"><input type=\"button\" name=\"" + records[i].game_code + "\" value=\"" + records[i].game_name + "\" /><img src=\"./img/relevantInfo/checked.png\" /></div>"
//                      }
                        rvInfo.gameStr += str;
                        rvInfo.countryGameLength += 1
                    }
                    if(i === records.length - 1) {
                        $("#gameIdArry").append(rvInfo.gameStr).children("div").children("img").show()
                    }
                }
            }
        })
    },
    getGameCode: function(province) {
        $.ajax({
            options: 'GET',
            url: './json/sys_game_province.json',
            async: false,
            dataType: 'json',
            success: function(data) {
                var records = data.RECORDS;
                var gameStr = "";
                var str = "";
                $("#gameIdArry>div").remove();
                for(var i = 0; i < records.length; i += 1) {
                    if(records[i].province_id === province && records[i].hotline_id) {
                        str = "<div class=\"normal active\"><input type=\"button\" name=\"" + records[i].game_code + "\" value=\"" + records[i].game_name + "\" /><img src=\"./img/relevantInfo/checked.png\" /></div>";
                        gameStr += str
                    }
                    if(i === records.length - 1) {
                        $("#gameIdArry").append(rvInfo.gameStr + gameStr).children("div").children("img").show();
                        $("#gameIdArry > div").unbind("click").click(function() {
                            var gameBtn = $(this);
                            if(gameBtn.hasClass("active")) {
                                gameBtn.removeClass("active").children("img").hide()
                            } else {
                                gameBtn.addClass("active").children("img").show()
                            }
                        })
                    }
                }
            }
        })
    },
    uploadFile: function(file, fileName, el) {
        var file_ = base64ToBlob(file);
        var cos = new COS({
            getAuthorization: function(options, callback) {
                $.get('/stationImg/getFederationToken', {
                    bucket: options.Bucket,
                    region: options.Region
                }, function(data) {
                    callback({
                        TmpSecretId: data.data.data.credentials.tmpSecretId,
                        TmpSecretKey: data.data.data.credentials.tmpSecretKey,
                        XCosSecurityToken: data.data.data.credentials.sessionToken,
                        ExpiredTime: data.data.data.expiredTime
                    })
                })
            }
        });
        cos.putObject({
            // 测试Bucket：hibingotest-1253225888
            Bucket: 'hibingotest-1253225888',
            Region: 'ap-guangzhou',
            Key: fileName,
            StorageClass: 'STANDARD',
            Body: file_,
            onProgress: function(progressData) {
                console.log(JSON.stringify(progressData))
            }
        }, function(err, data) {
            if(data && data.statusCode === 200) {
                rvInfo[el] = fileName;
                switch(el) {
                    case 'ownerFileIdcardZ':
                        showMessage("代销者/法人身份证正面上传成功");
                        break;
                    case 'ownerFileIdcardF':
                        showMessage("代销者/法人身份证反面上传成功");
                        break;
                    case 'fileIdcardS':
                        showMessage("手持身份证上传成功");
                        break;
                    case 'fileSell':
                        showMessage("代销证上传成功");
                        break;
                    case 'fileSellS':
                        showMessage("手持代销证上传成功");
                        break;
                    case 'fileDoor':
                        showMessage("站点门头照上传成功");
                        break;
                    case 'fileIdcardZ':
                        showMessage("经营者身份证正面上传成功");
                        break;
                    case 'fileIdcardF':
                        showMessage("经营者身份证反面上传成功");
                        break;
                    case 'protocolFile':
                        showMessage("授权协议书上传成功");
                        break
                }
            } else {
                switch(el) {
                    case 'ownerFileIdcardZ':
                        showMessage("代销者/法人身份证正面上传失败，请重新上传");
                        break;
                    case 'ownerFileIdcardF':
                        showMessage("代销者/法人身份证反面上传失败，请重新上传");
                        break;
                    case 'fileIdcardS':
                        showMessage("手持身份证上传失败，请重新上传");
                        break;
                    case 'fileSell':
                        showMessage("代销证上传失败，请重新上传");
                        break;
                    case 'fileSellS':
                        showMessage("手持代销证上传失败，请重新上传");
                        break;
                    case 'fileDoor':
                        showMessage("站点门头照上传失败，请重新上传");
                        break;
                    case 'fileIdcardZ':
                        showMessage("经营者身份证正面上传失败，请重新上传");
                        break;
                    case 'fileIdcardF':
                        showMessage("经营者身份证反面上传失败，请重新上传");
                        break;
                    case 'protocolFile':
                        showMessage("授权协议书上传失败，请重新上传");
                        break
                }
            }
        })
    },
    getPCA: function(province, city, area) {
        $.ajax({
            options: 'GET',
            url: './json/regions.json',
            async: false,
            dataType: 'json',
            success: function(data) {
                var records = data.RECORDS;
                for(var i = 0; i < records.length; i += 1) {
                    if(records[i].name === province) {
                        rvInfo.province = records[i].id;
                        rvBase.getGameCode(rvInfo.province);
                        continue
                    }
                    if(rvInfo.province === records[i].parent_id && records[i].name === city) {
                        rvInfo.city = records[i].id;
                        continue
                    }
                    if(rvInfo.city === records[i].parent_id && records[i].name === area) {
                        rvInfo.area = records[i].id;
                        break
                    }
                }
            }
        })
    },
    getXY: function() {
        var geocoder = new AMap.Geocoder({
            city: "",
            radius: "50",
            extensions: "all"
        });
        var address = $("#belongPlace").val().split(" ").join("") + $("#addr").val();
        geocoder.getLocation(address, function(status, result) {
            if(status === 'complete' && result.geocodes.length) {
                var lnglat = result.geocodes[0].location;
                rvInfo.x = lnglat.lng;
                rvInfo.y = lnglat.lat
            } else {}
        })
    },
    commitApply: function(rvInfo) {
        $("#commit").attr("disabled", "true");
        $.ajax({
            type: "POST",
            url: "/sysStationApprove/addApprove",
            async: true,
            data: rvInfo,
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                $("#commit").removeAttr("disabled");
                if(data.success === "0000") {
                    showMessage("提交成功");
                    if(website.partyCode) {
                        window.location.href = website.addr + "/hbgStationApply/complete.html" + '?partyCode=' + website.partyCode;
                    } else {
                        window.location.href = website.addr + "/hbgStationApply/complete.html"
                    }
                } else if(data.success === "2014") {
                    showMessage(data.error);
                    setTimeout(function() {
                        if(website.partyCode) {
                            window.location.href = website.addr + "/hbgStationApply/identity.html" + '?partyCode=' + website.partyCode;
                        } else {
                            window.location.href = website.addr + "/hbgStationApply/identity.html"
                        }
                    }, 2000)
                } else {
                    showMessage(data.error)
                }
            },
            error: function(xhr, textStatus) {
                console.log(xhr);
                console.log(textStatus);
                $("#commit").removeAttr("disabled");
                showMessage("请求失败")
            }
        })
    }
};
rvBase.initGameCode();
rvInfo.approveCode = rvBase.getQueryString('order');
rvInfo.isOperator = rvBase.getQueryString('isOperator') || 0;
if(rvInfo.isOperator == 0) {
    rvInfo.ownerMobile = rvBase.getQueryString('mobile');
    $("#ownerMobile").val(rvInfo.ownerMobile);
    $(".operator-hook").css("display", "none")
} else if(rvInfo.isOperator == 1) {
    rvInfo.mobile = rvBase.getQueryString('mobile');
    $("#mobile").val(rvInfo.mobile);
    $(".owner-hook").css("display", "none")
}
$("#gameIdArry>div").click(function() {
    var gameBtn = $(this);
    if(gameBtn.hasClass("active")) {
        gameBtn.removeClass("active").children("img").hide()
    } else {
        gameBtn.addClass("active").children("img").show()
    }
});
$("#ownerMobile_").blur(function() {
    $("#ownerMobile").val(this.value)
});
$("#ownerIdcard, #idcard").blur(function() {
    var idcardValue = $(this).val().toUpperCase();
    $(this).val(idcardValue)
});
$("#ownerFileIdcardZ,#ownerFileIdcardF,#fileIdcardS,#fileSell,#fileSellS,#fileDoor,#fileIdcardZ,#fileIdcardF,#protocolFile").on("change", function(e) {
    var file = this.files[0];
    if(file == "" || file == null) {
        return
    } else {
        showMessage("图片正在上传...")
    }
    var orientation;
    var elesId = e.target.id;
    EXIF.getData(file, function() {
        orientation = EXIF.getTag(this, 'Orientation')
    });
    var reader = new FileReader();
    reader.onload = function(e) {
        getImgData(this.result, orientation, function(data) {
            $($("#" + elesId).siblings()[0]).css('background-image', 'url(' + data + ')');
            rvBase.uploadFile(data, '/STATIONAPPLY/' + parseInt(Math.random() * 1000) + (new Date().getTime()).toString() + parseInt(Math.random() * 1000) + '.png', elesId)
        })
    };
    reader.readAsDataURL(file)
});
$("#addr").blur(function() {
    if($("#belongPlace").val() !== "") {
        rvBase.getXY()
    } else {
        showMessage("请选择站点归属地")
    }
});
$("#ownerName").blur(function() {
    $("#ownerName_").val(this.value)
});
$("#ownerName_").blur(function() {
    $("#ownerName").val(this.value)
});
$("#commit").click(function() {
    rvInfo.ownerName = $("#ownerName").val().trim();
    rvInfo.stationNum = $("#stationNum").val().trim();
    rvInfo.sellStartTime = $("#sellStartTime").val();
    rvInfo.sellEndTime = $("#sellEndTime").val();
    rvInfo.addr = $("#addr").val().trim();
    rvInfo.name = $("#name").val().trim();
    rvInfo.mobile = $("#mobile").val();
    rvInfo.idcard = $("#idcard").val().trim();
    rvInfo.ownerIdcard = $("#ownerIdcard").val().trim();
    rvInfo.qq = $("#qq").val().trim();
    rvInfo.wechat = $("#wechat").val().trim();
    rvInfo.partyCode = $("#partyCode").val();
    rvInfo.gameIdArry = "";
    var gameCodeEles = $("#gameIdArry > div.active >input");
    var gameCodes = [];
    var today = (new Date().getFullYear()) + '-' + rvBase.transformNum(new Date().getMonth() + 1) + '-' + rvBase.transformNum(new Date().getDate());
    if(gameCodeEles.length > 0) {
        for(var i = 0; i < gameCodeEles.length; i += 1) {
            gameCodes.push($(gameCodeEles[i]).prop("name"));
            if(i === gameCodeEles.length - 1) {
                rvInfo.gameIdArry = gameCodes.join(";")
            }
        }
    };
    if(!reg.chineseName.test(rvInfo.ownerName)) {
        showMessage("请正确输入代销者/法人姓名");
        rvBase.scrollAnimate("#ownerName");
        return
    } else if(!reg.stationNum.test(rvInfo.stationNum)) {
        showMessage("请正确输入投注站编号");
        rvBase.scrollAnimate("#stationNum");
        return
    } else if(!reg.datePicker.test(rvInfo.sellStartTime)) {
        showMessage("请正确输入代销证有效起始日期");
        rvBase.scrollAnimate("#sellStartTime");
        return
    } else if(rvInfo.sellEndTime == "" || !reg.datePicker.test(rvInfo.sellEndTime)) {
        showMessage("请正确输入代销证有效截止日期");
        rvBase.scrollAnimate("#sellEndTime");
        return
    } else if(parseInt(rvInfo.sellStartTime.replace(/\-/g, "")) >= parseInt(rvInfo.sellEndTime.replace(/\-/g, ""))) {
        showMessage("代销证起始日期不能大于截止日期");
        rvBase.scrollAnimate("#sellEndTime");
        return
    } else if(parseInt(today.replace(/\-/g, "")) >= parseInt(rvInfo.sellEndTime.replace(/\-/g, ""))) {
        showMessage("代销证截止日期不能小于今天");
        rvBase.scrollAnimate("#sellEndTime");
        return
    } else if($("#belongPlace").val() == "") {
        showMessage("请选择站点归属地");
        rvBase.scrollAnimate("#belongPlace");
        return
    } else if(rvInfo.addr == "") {
        showMessage("请输入投注站详细地址");
        rvBase.scrollAnimate("#addr");
        rvBase.getXY();
        return
    } else if($.inArray("B001", rvInfo.gameIdArry.split(";")) < 0) {
        showMessage("请正确勾选投注机销售游戏");
        rvBase.scrollAnimate("#gameIdArry");
        return
    }
    if(rvInfo.isOperator == 0) {
        if(!reg.idCard.test(rvInfo.ownerIdcard)) {
            showMessage("请正确输入您的身份证号");
            rvBase.scrollAnimate("#ownerIdcard");
            return
        } else if(!reg.mobile.test(rvInfo.ownerMobile)) {
            showMessage("请正确输入您的手机号");
            rvBase.scrollAnimate("#ownerMobile");
            return
        }
    } else if(rvInfo.isOperator == 1) {
        rvInfo.ownerMobile = $("#ownerMobile_").val();
        if(!reg.chineseName.test(rvInfo.name)) {
            showMessage("请输入经营者姓名");
            rvBase.scrollAnimate("#name");
            return
        } else if(!reg.idCard.test(rvInfo.idcard)) {
            showMessage("请正确输入身份证号格式");
            rvBase.scrollAnimate("#idcard");
            return
        } else if(!reg.mobile.test(rvInfo.ownerMobile)) {
            showMessage("请正确输入法人联系方式");
            rvBase.scrollAnimate("#ownerMobile_");
            return
        } else if(rvInfo.fileIdcardZ == "") {
            showMessage("请上传经营者身份证正面照");
            rvBase.scrollAnimate(".rv-approveInfo-hook");
            return
        } else if(rvInfo.fileIdcardF == "") {
            showMessage("请上传经营者身份证反面照");
            rvBase.scrollAnimate(".rv-approveInfo-hook");
            return
        }
    }
    if(rvInfo.ownerFileIdcardZ == "") {
        showMessage("请上传代销者/法人身份证正面照");
        rvBase.scrollAnimate(".rv-approveInfo-hook");
        return
    } else if(rvInfo.ownerFileIdcardF == "") {
        showMessage("请上传代销者/法人身份证反面照");
        rvBase.scrollAnimate(".rv-approveInfo-hook");
        return
    } else if(rvInfo.fileIdcardS == "") {
        showMessage("请上传手持身份证照");
        rvBase.scrollAnimate(".rv-approveInfo-hook");
        return
    } else if(rvInfo.fileSell == "") {
        showMessage("请上传代销证照");
        rvBase.scrollAnimate(".rv-approveInfo-hook");
        return
    } else if(rvInfo.fileSellS == "") {
        showMessage("请上传手持代销证照");
        rvBase.scrollAnimate(".rv-approveInfo-hook");
        return
    } else if(rvInfo.fileDoor == "") {
        showMessage("请上传站点门头照");
        rvBase.scrollAnimate(".rv-approveInfo-hook");
        return
    }
    if(!reg.qq.test(rvInfo.qq) && rvInfo.qq != "") {
        showMessage("请正确输入QQ号");
        return
    } else if(!reg.weChat.test(rvInfo.wechat) && rvInfo.wechat != "") {
        showMessage("请正确输入微信号");
        return
    }
    rvBase.commitApply(rvInfo)
});
var startTime = new LCalendar();
var endTime = new LCalendar();
startTime.init({
    'trigger': '#sellStartTime',
    'type': 'date',
    'minDate': '1980-01-01',
    'maxDate': (new Date().getFullYear()) + '-' + rvBase.transformNum(new Date().getMonth() + 1) + '-' + rvBase.transformNum(new Date().getDate())
});
endTime.init({
    'trigger': '#sellEndTime',
    'type': 'date',
    'minDate': (new Date().getFullYear()) + '-' + rvBase.transformNum(new Date().getMonth() + 1) + '-' + rvBase.transformNum(new Date().getDate()),
    'maxDate': (new Date().getFullYear() + 10) + '-' + rvBase.transformNum(new Date().getMonth() + 1) + '-' + rvBase.transformNum(new Date().getDate())
});

function getImgData(img, dir, next) {
    var image = new Image();
    image.onload = function() {
        var degree = 0,
            drawWidth, drawHeight, width, height;
        drawWidth = this.naturalWidth;
        drawHeight = this.naturalHeight;
        var maxSide = Math.max(drawWidth, drawHeight);
        if(maxSide > 1024) {
            var minSide = Math.min(drawWidth, drawHeight);
            minSide = minSide / maxSide * 1024;
            maxSide = 1024;
            if(drawWidth > drawHeight) {
                drawWidth = maxSide;
                drawHeight = minSide
            } else {
                drawWidth = minSide;
                drawHeight = maxSide
            }
        }
        var canvas = document.createElement('canvas');
        canvas.width = width = drawWidth;
        canvas.height = height = drawHeight;
        var context = canvas.getContext('2d');
        switch(dir) {
            case 3:
                degree = 180;
                drawWidth = -width;
                drawHeight = -height;
                break;
            case 6:
                canvas.width = height;
                canvas.height = width;
                degree = 90;
                drawWidth = width;
                drawHeight = -height;
                break;
            case 8:
                canvas.width = height;
                canvas.height = width;
                degree = 270;
                drawWidth = -width;
                drawHeight = height;
                break
        }
        context.rotate(degree * Math.PI / 180);
        context.drawImage(this, 0, 0, drawWidth, drawHeight);
        next(canvas.toDataURL("image/jpeg", .8))
    };
    image.src = img
}

function base64ToBlob(urlData) {
    var arr = urlData.split(',');
    var mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
    var bytes = window.atob(arr[1]);
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for(var i = 0; i < bytes.length; i += 1) {
        ia[i] = bytes.charCodeAt(i)
    }
    return new Blob([ab], {
        type: mime
    })
};
! function() {
    var $target = $('#belongPlace');
    $target.citySelect();
    $target.on('click', function(event) {
        event.stopPropagation();
        $target.citySelect('open')
    });
    $target.on('done.ydui.cityselect', function(ret) {
        $(this).val(ret.provance + ' ' + ret.city + ' ' + ret.area)
    })
}();
! function() {
    var $target = $('#belongPlace');
    $target.citySelect({
        provance: $target.val().split(" ")[0],
        city: $target.val().split(" ")[1],
        area: $target.val().split(" ")[2]
    });
    $target.on('click', function(event) {
        event.stopPropagation();
        $target.citySelect('open')
    });
    $target.on('done.ydui.cityselect', function(ret) {
        $(this).val(ret.provance + ' ' + ret.city + ' ' + ret.area);
        rvBase.getPCA(ret.provance, ret.city, ret.area)
    })
}();

// 获取宾果号
$(function() {
    website.partyCode = website._getUrlParams('partyCode');
    // 判断是否有partyCode
    if(website.partyCode) {
//      website._isAuthorization(website.partyCode, function(data) {
//          // partyCode为授权宾果号
//          if(data) {
                // 不可修改宾果号，写入宾果号
                $('#partyCode').val(website.partyCode).attr('disabled', 'disabled');
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