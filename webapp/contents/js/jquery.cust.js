/*
 * jQuery Form Plugin
 * version: 2.21 (08-FEB-2009)
 * @requires jQuery v1.2.2 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
;
(function($){

    function josa(str, tail){
        return (hasFinalConsonant(str)) ? tail.substring(0, 1) : tail.substring(1, 2);
    }
    
    function hasFinalConsonant(str){
        str = this != window ? this : str;
        var strTemp = str.substr(str.length - 1);
        return ((strTemp.charCodeAt(0) - 16) % 28 != 0);
    }
    
    function doError(el, type, action){
        var pattern = /{([a-zA-Z0-9_]+)\+?([가-힣]{2})?}/;
        var name = (hname = el.attr("TITLE")) ? hname : el.attr("NAME");
        pattern.exec(type);
        var tail = (RegExp.$2) ? josa(eval(RegExp.$1), RegExp.$2) : "";
        alert(type.replace(pattern, eval(RegExp.$1) + tail));
        if (action == "sel") {
            el.select();
        }
        else {
            el.value = "";
        }
        el.focus();
        return false;
    }
    

    $.fn.required = function(){
        return (this != null && this.val() != "") ? true : doError(this, "{name+을를} 입력하세요");
    };
    
    $.fn.req = function(){
    	return (this != null && this.val() != "") ? true : doError(this, "시스템 필수값이 없습니다. 관리자에게 문의하세요.");
    };
    
    $.fn.emptySelect = function(index) {
        return this.each(function(){
          if (this.tagName=='SELECT') this.options.length = index;
        });
    };


    $.fn.reqSelect = function(){
	    var $item = $("#"+this.attr('id')+"> option:selected").val();
	    return ($item.length > 0) ? true : doError(this, "{name+을를} 선택하세요");
    };
    
    $.fn.reqRadio = function(){
	    var $item = $("input:radio[name='"+this.attr('name')+"']:checked");
	    return ($item.size() > 0) ? true : doError(this, "{name+을를} 선택하세요");
    };
    
    $.fn.enough = function(num){
    	return (this.val().length >= num)? true : doError(this,"{name+은는} "+num+"자 이상입력하세요");	
    };
    
    $.fn.isover = function(num){
    	return (this.val().length <= num)? true : doError(this,"{name+은는} "+num+"자까지만 입력하세요");	
    };
    
    $.fn.isexact = function(num){
    	return (this.val().length == num)? true : doError(this,"{name+은는} "+num+"자리 입니다");	
    };
    
    $.fn.isemail = function(){
        var pattern = /^[_a-zA-Z0-9-\.]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
        return (pattern.test(this.val())) ? true : doError(this,"{name+을를} 바르게 입력해주세요");
    };
    
    $.fn.isemaildiv = function(email){
    	var pattern = /^[_a-zA-Z0-9-\.]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
    	return (pattern.test(email)) ? true : doError(this,"{name+을를} 바르게 입력해주세요");
    };
    
    $.fn.isurl = function(url){
        var pattern = /http:\/\/[A-Za-z0-9\.-]{3,}\.[A-Za-z]{3}/;
        return (pattern.test(url) == true) ? true : doError(this,"{name+을를} 바르게 입력해주세요");
    };
    
    $.fn.isid = function(){
    	var pattern = /^[a-zA-Z]{1}[a-zA-Z0-9_]+$/;
    	return (pattern.test(this.val())) ? true : doError(this,"{name+은는} 첫글자를 영문으로 시작해야하고,\n그 이후에는 영문,숫자, _ 문자만 사용할 수 있습니다");
    };
    
    $.fn.isnum = function(){
    	var pattern = /^[0-9]+$/;
    	return (pattern.test(this.val())) ? true : doError(this,"{name+은는} 숫자로 입력해야 합니다");
    };

    $.fn.iseng = function(){
    	var pattern = /^[a-zA-Z]+$/;
    	return (pattern.test(this.val())) ? true : doError(this,"{name+은는} 영문자로 입력해야 합니다");
    };
    
    $.fn.isengnum = function(){
    	var pattern = /^[a-zA-Z0-9]+$/;
    	return (pattern.test(this.val())) ? true : doError(this,"{name+은는} 영문자,숫자로 입력해야 합니다");
    };
    
    //*************************************
    // 2011-02-05 ihseo 추가 / 2011-02-14 ihseo 수정
    $.fn.isvalidpwd = function(){
    	var pattern1 = /[a-zA-Z]/;
    	var pattern2 = /[0-9]/;
    	var pattern3 = /[\_\-\!\@\$\^\*\=\~\,\.\[\]\{\}\:\;]/;
    	return (pattern1.test(this.val()) && pattern2.test(this.val()) && pattern3.test(this.val())) ? true : doError(this,"{name+은는} 영문(대문자/소문자 구분), 숫자, \n특수문자(_-!@$^*=~,.[]{}:;)를 \n동시에 조합하여 최소 8자리 이상, 20자리 이하의 길이로 구성해야 합니다.");
    };
    //*************************************
    $.fn.ishan = function(){
    	var pattern = /^[가-힣]+$/;
    	return (pattern.test(this.val())) ? true : doError(this,"{name+은는} 한글로 입력해야 합니다");
    };

    $.fn.isenghan = function(){
    	var pattern = /^[가-힣a-zA-Z]+$/;
    	return (pattern.test(this.val())) ? true : doError(this,"{name+은는} 한글,영문자로 입력해야 합니다");
    };

    $.fn.isenghannum = function(){
    	var pattern = /^[가-힣a-zA-Z0-9]+$/;
    	return (pattern.test(this.val())) ? true : doError(this,"{name+은는} 한글,영문자,숫자로 입력해야 합니다");
    };

    $.fn.ishannum = function(){
    	var pattern = /^[가-힣0-9]+$/;
    	return (pattern.test(this.val())) ? true : doError(this,"{name+은는} 한글,숫자로 입력해야 합니다");
    };
    
    $.fn.ishan1 = function(){
    	var pattern = /[가-힣]/;
    	return (pattern.test(this.val())) ? true : doError(this,"{name+은는} 한글을 포함해야 합니다");
    };


    $.fn.isphone = function(num){
        var pattern = /^([0]{1}[0-9]{1,2})-?([1-9]{1}[0-9]{2,3})-?([0-9]{4})$/;
        return (pattern.exec(num))? true : doError(this,"{name+을를} 바르게 입력하세요");
    };
    
    $.fn.ismatch = function(target){
    	return (this.val() == target.val())? true : doError(this,"{name+이가} 일치하지 않습니다.");	
    };
    
	$.fn.reset = function() {
		$( this ).
		find( ':text, :password, textarea' ).
			attr( 'value', '' ).end().
	    find( ':checkbox, :radio' ).
	    	attr( 'checked', false ).end().
	    find( 'select' ).
	    	attr( 'selectedIndex', -1 );
	};
	
	$.fn.isjumin = function(num) {
	    var pattern = /^([0-9]{6})-?([0-9]{7})$/; 
	    if (!pattern.test(num)) return doError(this,"주민번호를 바르게 입력하세요");
	    num = RegExp.$1 + RegExp.$2;

	    var sum = 0;
	    var last = num.charCodeAt(12) - 0x30;
	    var bases = "234567892345";
	    for (var i=0; i<12; i++) {
	        if (isNaN(num.substring(i,i+1))) return doError(this,"주민번호를 바르게 입력하세요");
	        sum += (num.charCodeAt(i) - 0x30) * (bases.charCodeAt(i) - 0x30);
	    }
	    var mod = sum % 11;
	    return ((11 - mod) % 10 == last) ? true : doError(this,"주민번호를 바르게 입력하세요");
	};
})(jQuery);

function isValidJumin(num) {
    var pattern = /^([0-9]{6})-?([0-9]{7})$/; 
    if (!pattern.test(num)) return false;
    num = RegExp.$1 + RegExp.$2;

    var sum = 0;
    var last = num.charCodeAt(12) - 0x30;
    var bases = "234567892345";
    for (var i=0; i<12; i++) {
        if (isNaN(num.substring(i,i+1))) return false;
        sum += (num.charCodeAt(i) - 0x30) * (bases.charCodeAt(i) - 0x30);
    }
    var mod = sum % 11;
    return ((11 - mod) % 10 == last) ? true : false;
}

function toCurrency(anynum, decimal) {
	if('-1' == anynum) return '';
	// decimal - the number of decimals after the digit from 0 to 3
	// -- Returns the passed number as a string in the xxx,xxx.xx format.
	divider = 10;
	switch (decimal) {
	case 0:
		divider = 1;
		break;
	case 1:
		divider = 10;
		break;
	case 2:
		divider = 100;
		break;
	default: // for 3 decimal places
		divider = 1000;
	}

	workNum = Math.abs((Math.round(anynum * divider) / divider));

	workStr = "" + workNum

	if (workStr.indexOf(".") == -1) {
		workStr += "."
	}

	dStr = workStr.substr(0, workStr.indexOf("."));
	dNum = dStr - 0
	pStr = workStr.substr(workStr.indexOf("."))

	while (pStr.length - 1 < decimal) {
		pStr += "0"
	}

	if (pStr == '.')
		pStr = '';

	// --- Adds a comma in the thousands place.
	if (dNum >= 1000) {
		dLen = dStr.length
		dStr = parseInt("" + (dNum / 1000)) + ","
				+ dStr.substring(dLen - 3, dLen)
	}

	// -- Adds a comma in the millions place.
	if (dNum >= 1000000) {
		dLen = dStr.length
		dStr = parseInt("" + (dNum / 1000000)) + ","
				+ dStr.substring(dLen - 7, dLen)
	}
	retval = dStr + pStr
	// -- Put numbers in parentheses if negative.
	if (anynum < 0) {
		retval = "(" + retval + ")";
	}

	// You could include a dollar sign in the return value.
	// retval = "$"+retval

	return retval;
}


$(document).ready(function() {
	//읽기전용속성 지정
	$('.ro').attr('readonly','readonly');
	
	/* 입력제어 한글영문 자동 선택(클래스를 선택하지않고 임의로 스타일 지정 standalone일수도 있으니까.)  */
	//한글전용 클래스 지정
	$('.han').css('ime-mode','active');
	//영문전용 클래스 지정
	$('.eng').css('ime-mode','disabled');
	
	//페이드 효과
	$("input[type='text'], input[type='password']").fadeTo("slow", .60);
	$("input[type='text'], input[type='password']").focus(function(){
		if(!$(this).hasClass('readonly'))
			$(this).fadeTo("fast", 1);
	});
	$("input[type='text'], input[type='password']").blur(function(){
	    $(this).fadeTo("fast", .60);
	});
	
	//클릭시 점선 테두리 없게..난 디자이너야.
	$("input[type='checkbox'], input[type='radio'], input[type='button']").click(function(){
	    $(this).blur();
	});
	
	//데이터 그리드 공통 이펙트
	/* 로딩시 페이드 인 */
	$('.ef_fade tbody tr').fadeTo(1, .10);
	$('.ef_fade tbody tr').each(function() {
		$(this).fadeTo(300, 1);
	});

	/* 로우 구분 색깔 자동 적용 */
	$('.ef_even tbody tr:nth-child(2n+1)').addClass('even_color');
	$('.ef_odd tbody  tr:nth-child(2n)').addClass('even_color');

	/* 호버시 페이드 효과 */
	$('.ef_hover tbody tr').hover(
		function () {
			$(this).addClass('hover_color');
		}, 
		function () {
			$(this).removeClass('hover_color').fadeTo("fast", .7).fadeTo("fast", 1);
	});

	/* image swap on rollover */
	$('.rollover').hover(
		function () {
			var iconName = $(this).attr("src");
			var origen = iconName.split(".")[0];
			$(this).attr({src: "" + origen + "_on.gif"});
		}, 
		function () {
			var iconName = $(this).attr("src");
			var origen = iconName.split("_on.")[0];
			$(this).attr({src: "" + origen + ".gif"});
	});

});		

function onerror(statusText,responseText) {
	alert(responseText); 
}


Array.prototype.sum = function(){
	for(var i=0,sum=0;i<this.length;sum+=this[i++]);
	return sum;
}
Array.prototype.max = function(){
	return Math.max.apply({},this)
}
Array.prototype.min = function(){
	return Math.min.apply({},this)
}

/*
 * 한글 지원 서브스트링
 * keyword : 서브스트링 substr substring
 */
String.prototype.ksub = function(len, tail) {
	var str = this;
	var l = 0;
	for (var i=0; i<str.length; i++) {
		l += (str.charCodeAt(i) > 128) ? 2 : 1;
		if (l > len) return str.substring(0,i)+''+tail;
	}
	return str;
}

/** 
 * 두 날짜의 차이를 일자로 구한다.(조회 종료일 - 조회 시작일) 
 * 
 * @param d1 - 조회 시작일(날짜 ex.2002-01-01) 
 * @param d2 - 조회 종료일(날짜 ex.2002-01-01) 
 * @return 기간에 해당하는 일자 
 */ 
function diffDay(d1, d2) { 
	var FORMAT = "/"; 

	if (d1.length != 10 || d2.length != 10) return null; 
	if (d1.indexOf(FORMAT) < 0 || d2.indexOf(FORMAT) < 0) return null; 

	var start_dt = d1.split(FORMAT); 
	var end_dt = d2.split(FORMAT); 

	start_dt[1] = (Number(start_dt[1]) - 1) + ""; 
	end_dt[1] = (Number(end_dt[1]) - 1) + ""; 

	var from_dt = new Date(start_dt[0], start_dt[1], start_dt[2]); 
	var to_dt = new Date(end_dt[0], end_dt[1], end_dt[2]); 
	return (to_dt.getTime() - from_dt.getTime()) / 1000 / 60 / 60 / 24; 
} 


function validCheckPwd(pwd){
	var check = 0;

	for (var j=0; j<pwd.length; j++) {
		temp1 = "" + pwd.substring(j, j+1);
	    temp2 = "" + pwd.substring(j+1, j+2);

	    if(temp1 == temp2){
	      check++;
	    }
	    else check = 0;

	    if(check == 2){
	      alert("비밀번호는 동일한 문자나 숫자를 3개 이상 연속으로 사용할 수 없습니다.");
	      return false;
	    }
	}

	return true;
}