<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ include file="../include/base.jsp" %>
<!DOCTYPE>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<%@ include file="../include/title.jsp" %>
<style type="text/css">
.weekday {font-size: small;}
.other-month {color: #CCCCCC;}
.current-month {color: #333333;}
.saturday {color: blue;}
.sunday {color: red;}
.font-emphasize { font-weight: bold; font-style: italic; font-size: medium;}
</style>
<script type="text/javascript">
<!-- 
$(document).ready(function(){
	
	var date = new Date();
	var dYear = date.getFullYear();
	var dMonth = date.getMonth();		//시스템의 이번달-1 ex.) 2월일 경우 1이 할당된다.
	var dDate = date.getDate();
	var datYeyak = '';		//저장 및 파라미터로 쓰이는 날짜 전체 데이터;
	
	$(function(){
		//년을 만든다.
		$('#frmYear').append('<option value="'+(dYear-1)+'">'+(dYear-1)+'</option>')
								 .append('<option value="'+dYear+'" selected="selected">'+dYear+'</option>')
								 .append('<option value="'+(dYear+1)+'">'+(dYear+1)+'</option>');
		
		//월을 만든다.
		var arrMonth = [1,2,3,4,5,6,7,8,9,10,11,12];
		$.each(arrMonth, function(idx, mon){
			if(mon==(dMonth+1)){
				$('#frmMonth').append('<option value="'+mon+'" selected="selected">'+mon+'</option>');
			}else{
				$('#frmMonth').append('<option value="'+mon+'">'+mon+'</option>');
			}
		});
		
		//일을 만든다.
		makeDate();
		reserveInfo();

	});

	
	/* 
	 시스템의 현재년도, 현재월-1이 값을 주입한다. ex)2월일 경우 dMonth=1
	 */
	$('#calendar').calendarWidget({
		month: dMonth,
		year: dYear
	});
	
	/*
	 년도를 변경했을때 이벤트. 변경한 년도와 먼저 선택된 월-1의 값을 주입한다.
	 */
	$('#frmYear').change(function(){
		$('#calendar').calendarWidget({
			month: ($('#frmMonth').val()-1),
			year: $(this).val()
		});
		makeDate();
		reserveInfo();
	});
	
	/*
	 월을 변경했을때 이벤트. 변경한 월-1과 먼저 선택된 년의 값을 주입한다.
	 */
	$('#frmMonth').change(function(){
		$('#calendar').calendarWidget({
			month: ($(this).val()-1),
			year: $('#frmYear').val()
		});
		makeDate();
		reserveInfo();
	});
	
	$('#frmDate').change(function(){
		$('.current-month').removeClass('font-emphasize');		//현재선택가능한 날짜중에 강조된 css삭제
		$('.day'+$(this).val()).addClass('font-emphasize');		//현재선택한 날짜 강조
		reserveInfo();
	});
	
	function makeDate(){
		var mkYear = $('#frmYear').val();
		var mkMonth = ($('#frmMonth').val()-1);
		
		$('#frmDate').children().remove();
		
		for(d=1; d<($.fn.getFinalDay(mkMonth,mkYear)+1); d++){
			if(d==dDate){
				$('#frmDate').append('<option value="'+d+'" selected="selected">'+d+'</option>');
			}else{
				$('#frmDate').append('<option value="'+d+'">'+d+'</option>');
			}
		}
		//현재날짜를 강조하는 css추가
		$('.day'+$('#frmDate').val()).addClass('font-emphasize');
	}
	
	function digitCheck(val){
		if(val=='') return '00';
		if(val<10) val = '0'+val;
		
		return val;
	}
	
	function reserveInfo(){
		
		//저장 및 파라미터로 쓰일 전체날짜를 조합한다.
		datYeyak = $('#frmYear').find(':selected').val()+digitCheck($('#frmMonth').find(':selected').val())+digitCheck($('#frmDate').find(':selected').val());
		
		$.ajax({
			type: 'GET',
			url: './jsonReserveDate.web',
			data: {codJisa: '${reser.codJisa}', datYeyak: datYeyak},
			dataType: 'json',
			beforeSend: function(){
				$('#wrapCalendar').block({message: '<img src="${pageContext.request.contextPath}/contents/images/common/ajax-loader.gif"/>',
																	css: {border: 'none'},
																	overlayCss: {backgroundColor: '#FFFFFF'}});
			},
			complete: function(){
				$('#wrapCalendar').unblock();
			},
			error: function(x, e){
				alert("["+e+"]["+x.status+"]");
			},
			success: function(json){
				var capable = '';
				var gubn = '';
				$('#reserveInfo').text('');
				if(json==''){
					$('#reserveInfo').append('예약정보가 없습니다.');
				}else{
					$.each(json, function(idx, val){
						if(val.ysnoMagam=='N'){
							capable = '예약불가';
						}else{
							capable = '예약가능';
						}
						if(val.gubnApm == 'AM'){
							gubn = '오전';
						}else{
							gubn = '오후';
						}
						$('#reserveInfo').append(gubn+'('+capable+'), '+gubn+'('+capable+')</br>');
					});
				}
			}
		});
	}
	
	$('#btnSubmit').click(function(){
		$('#datYeyak').val(datYeyak);
		console.log($('#frmYear').find(':selected').val());
		$('#year').val($('#frmYear').find(':selected').val());
		$('#formSave').submit();
	});
	
});
//-->
</script>
</head>
<body>
<br/>
<h1>개인고객 예약 날짜/시간 선택화면</h1>
<h4>
 - PUMYIGS.DESC_GMGN의 값이 남/여로 들어 오는데 RESER_2012.GUBN_PYPY로 어떻게 넣어야 하나요?<br/>
 - 오전/오후 미구현, 강남/여의도시 시간 선택 미구현<br/>
 - 예약불가일 경우 미구현<br/>
 - 검진 비용 미구현 
</h4>
<form name="formSave" id="formSave" action="./save.web" method="post">
	<!-- 검진프로그램 기본정보 -->
	<input type="" id="idx"         name="idx"         value="${pumyigs.numSeq}"/>		<!-- RESER_2012.IDX -->
	<input type="" id="codDc"       name="codDc"       value="${pumyigs.codDc}"/>			<!-- RESER_2012.COD_DC -->
	<input type="" id="gubnPyyh"    name="gubnPyyh"    value="${pumyigs.codGmgn}"/>		<!-- RESER_2012.GUBN_PYYH -->
	<input type="" id="descHangmok" name="descHangmok" value="${pumyigs.gubnGmsa}+" />	<!-- RESER_2012.DESC_HANGMOK -->
	<!-- ??????????????????????????? 남/여로 데이터가 들어옴...어떻게 넣어요???-->
<%-- 	<input type="" id="gubnPypy"    name="gubnPypy"    value="${pumyigs.descGmgn}" />	<!-- RESER_2012.GUBN_PYPY --> --%>
	<input type="" id="gubnPypy"    name="gubnPypy"    value="12" />	<!-- RESER_2012.GUBN_PYPY -->
	<!-- 고객 기본정보 -->	
	<input type="" id="codJisa"   name="codJisa"   value="${reser.codJisa}"/>
	<input type="hidden" id="descName"  name="descName"  value="김의학"/>
	<input type="" id="descDept"  name="descDept"  value="${reser.descDept}"/>
	<input type="" id="numTel"    name="numTel"    value="${reser.numTel}"/>
	<input type="" id="descEmail" name="descEmail" value="${reser.descEmail}" />
	<input type="" id="custGita"  name="custGita"  value="${reser.custGita}" />
	<input type="" id="selHm"     name="selHm"     value="${reser.selHm}" />
	<input type="" id="selCnt"    name="selCnt"    value="${reser.selCnt}" />
	<input type="" id="datYeyak"  name="datYeyak"  value="" />
	<input type="" id="year"      name="year"      value="" />
	
	
<div id="wrap">
<table border="1" width="900">
	<colgroup>
		<col width="120px">
		<col width="">
	</colgroup>
	<tr>
		<td>날짜선택</td>
		<td>
			<select id="frmYear" name="frmYear"></select>
			<select id="frmMonth" name="frmMonth"></select>
			<select id="frmDate" name="frmDate"></select>
		</td>
	</tr>
</table>
<p>* 예약 날짜/시간 선택</p>
<div id="wrapCalendar">
<div id="calendar"><p>Please enable Javascript to view this Calendar.</p></div>
<p>&nbsp;</p>
<table border="1" width="900">
	<colgroup>
		<col width="">
	</colgroup>
	<tr>
		<td id="reserveInfo"></td>
	</tr>
</table>
</div>
<div style="margin: 20 0 0 0; text-align: center;"><input type="submit" name="btnSubmit" id="btnSubmit" value="완료"/></div>
</div>
</form>
</body>
</html>