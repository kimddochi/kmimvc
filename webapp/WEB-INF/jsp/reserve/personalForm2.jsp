<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ include file="../include/base.jsp" %>
<!DOCTYPE>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<%@ include file="../include/title.jsp" %>
<script type="text/javascript">
<!-- 
$(document).ready(function(){
	
	//검진프로그램 선택시 검진센터 노출
	$('#gmgnGubn').change(function(){
		$.ajax({
			type: 'GET',
			url: './jsonPossibleJisa.web',
			data: {numSeq:$('#numSeq').val(), codDc:$('#codDc').val(), codGmgn:$(this).val()},
			dataType: "json",
			beforSend: function(){
				//$('#wrap').block({message: '<img src="/contents/images/common/ajax-loader.gif"/>', css: {border: 'none'}, overlayCSS: {backgroundColor: '#FFFFFF'}});
				$('#wrap').block({message: '<img src="/contents/images/common/ajax-loader.gif"/>', css: {border: 'none'}});
			},
			complete: function(){
				$('#warp').unblock();
			},
			error: function(x, e){
	      if(x.status==0){
	    	  alert('You are offline!!\n Please Check Your Network.');
	      }else if(x.status==404){
	        alert('Requested URL not found.');
	      }else if(x.status==500){
	        alert('Internel Server Error.');
	      }else if(e=='parsererror'){
	        alert('Error.\nParsing JSON Request failed.');
	        alert(x.responseText);
	      }else if(e=='timeout'){
	        alert('Request Time out.');
	      }else {
	        alert('Unknow Error.\n'+x.responseText);
	      }
			},
			success: function(json){
				$('#codJisa').children().remove();
				$('#codJisa').append('<option value="">== 선택 ===</option>');
				
				if(json.yn11) $('#codJisa').append('<option value="11">강남</option>');
				if(json.yn12) $('#codJisa').append('<option value="12">여의도</option>');
				if(json.yn15) $('#codJisa').append('<option value="15">본원</option>');
				if(json.yn43) $('#codJisa').append('<option value="43">수원</option>');
				if(json.yn51) $('#codJisa').append('<option value="51">광주</option>');
				if(json.yn61) $('#codJisa').append('<option value="61">부산</option>');
				if(json.yn71) $('#codJisa').append('<option value="71">대구</option>');
				
				//선택한 검진프로그램의 코드값 입력
				$('#codGmgn').val(json.codGmgn);
			}
		});
	});
	
	//검진센터 선택시 선택검사 노출
	$('#codJisa').change(function(){
		$.ajax({
			type: 'GET',
			url: './jsonSelectionOption.web',
			data: {numSeq:$('#numSeq').val(), codDc:$('#codDc').val(), codGmgn:$('#codGmgn').val()},
			dataType: "json",
			beforSend: function(){
				//$('#wrap').block({message: '<img src="/contents/images/common/ajax-loader.gif"/>', css: {border: 'none'}, overlayCSS: {backgroundColor: '#FFFFFF'}});
				$('#wrap').block({message: '<img src="/contents/images/common/ajax-loader.gif"/>', css: {border: 'none'}});
			},
			complete: function(){
				$('#warp').unblock();
			},
			error: function(x, e){
	      if(x.status==0){
	    	  alert('You are offline!!\n Please Check Your Network.');
	      }else if(x.status==404){
	        alert('Requested URL not found.');
	      }else if(x.status==500){
	        alert('Internel Server Error.');
	      }else if(e=='parsererror'){
	        alert('Error.\nParsing JSON Request failed.');
	        alert(x.responseText);
	      }else if(e=='timeout'){
	        alert('Request Time out.');
	      }else {
	        alert('Unknow Error.\n'+x.responseText);
	      }
			},
			success: function(json){
				var optionIndex = 1;
				$('#sel').children().remove();
				$('#sel').append('<div>옵션' + optionIndex + ' : ');
				/* 
				console.log("============================>"+json.length);
				for ( var i = 0; i < json.length; i++ ){
					if( json[i].optionIndex > optionIndex ){
						$('#sel').append('</div><div>옵션' + (++optionIndex) + ' : ');
						$('#sel').append('<input type="checkbox" name="codHm" value="'+json[i].hangmok.codHm+'"/>'+json[i].hangmok.descKor);
					}else{
						$('#sel').append('<input type="checkbox" name="codHm" value="'+json[i].hangmok.codHm+'"/>'+json[i].hangmok.descKor);
					}
				}
				$('#sel').append('</div>');
				 */
					
			}
		});
	});
});
//-->
</script>
</head>
<body>
<br/>
<h1>개인고객 예약정보 입력화면</h1>
<!-- <h4> - </h4> -->
<br/>
<form name="formSave" id="formSave" action="individualFormThree.web" method="post">
	<!-- 검진프로그램 기본정보 -->
	<input type="" id="numSeq"   name="numSeq"   value="${pumyigs.numSeq}"/>
	<input type="" id="codDc"    name="codDc"    value="${pumyigs.codDc}"/>
	<input type="" id="codGmgn"  name="codGmgn"  value=""/>
	<%--<input type="" id="gubnGmsa" name="gubnGmsa" value="${pumyigs.gubnGmsa}" />
	<input type="" id="descGmgn" name="descGmgn" value="${pumyigs.descGmgn}" /> --%>
	<!-- 고객 기본정보 -->	
	<input type="" id="descName"  name="descName"  value="${reser.descName}"/>
	<input type="" id="descDept"  name="descDept"  value="${reser.descDept}"/>
	<input type="" id="numJumin"  name="numJumin"  value="${reser.numJumin}"/>
	<input type="" id="numTel"    name="numTel"    value="${reser.numTel}"/>
	<input type="" id="descEmail" name="descEmail" value="${reser.descEmail}" />
	
	
<div id="wrap">
<p>* 검진프로그램 선택</p>
<table border="1" width="500">
	<colgroup>
		<col width="120px">
		<col width="">
	</colgroup>
	<tr>
		<td>검진구분 </td>
		<td>
			<select name="gmgnGubn" id="gmgnGubn">
				<option value="">== 선택 ===</option>
				<c:forEach var="descGmgn" items="${descGmgn}">
					<option value="${descGmgn.codGmgn}">${descGmgn.descGmgn}</option>
				</c:forEach>
			</select>
		</td>
	</tr>
	<tr>
		<td>검진센터 </td>
		<td><select name="codJisa" id="codJisa"></select></td>
	</tr>
	<tr>
		<td>안내사항</td>
		<td>
			<textarea id="descGita" name="descGita" rows="10" cols="36"></textarea>
		</td>
	</tr>
	<tr>
		<td>선택검사</td>
		<td><div id="sel"></div></td>
	</tr>
	<tr>
		<td>메모</td>
		<td>
			<textarea id="custGita" name="custGita" rows="10" cols="36" placeholder="검사 받으시는분의 특이사항이나 주의사항이 있으면 꼭 알려주세요."></textarea>
		</td>
	</tr>
</table>
<div style="margin: 20 0 0 0; text-align: center;"><input type="submit" name="btnSubmit" id="btnSubmit" value="다음"/></div>
</div>
</form>
</body>
</html>