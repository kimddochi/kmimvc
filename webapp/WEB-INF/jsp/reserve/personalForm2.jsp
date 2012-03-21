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
			beforeSend: function(){
				$('#wrap').block({message: '<img src="/contents/images/common/ajax-loader.gif"/>', css: {border: 'none', backgroundColor: '#666666'}});
			},
			complete: function(){
				$('#wrap').unblock();
			},
			error: function(x, e){
	      if(x.status==0){alert('You are offline!!\n Please Check Your Network.');}else if(x.status==404){alert('Requested URL not found.');}else if(x.status==500){alert('Internel Server Error.');}else if(e=='parsererror'){alert('Error.\nParsing JSON Request failed.');alert(x.responseText);}else if(e=='timeout'){alert('Request Time out.');}else {alert('Unknow Error.\n'+x.responseText);}
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
	
	//검진센터 선택시
	$('#codJisa').change(function(){
		//선택검사
		$.ajax({
			type: 'GET',
			url: './jsonSelectionGmsa.web',
			data: {numSeq:$('#numSeq').val(), codDc:$('#codDc').val(), codGmgn:$('#codGmgn').val()},
			dataType: "json",
			beforeSend: function(){
				$('#wrap').block({message: '<img src="/contents/images/common/ajax-loader.gif"/>', css: {border: 'none', backgroundColor: '#666666'}});
			},
			complete: function(){
				$('#wrap').unblock();
			},
			error: function(x, e){
				if(x.status==0){alert('You are offline!!\n Please Check Your Network.');}else if(x.status==404){alert('Requested URL not found.');}else if(x.status==500){alert('Internel Server Error.');}else if(e=='parsererror'){alert('Error.\nParsing JSON Request failed.');alert(x.responseText);}else if(e=='timeout'){alert('Request Time out.');}else {alert('Unknow Error.\n'+x.responseText);}
			},
			success: function(json){
				var optionIndex = 0;
				$('#selection').children().remove();
				for ( var i = 0; i < json.length; i++ ){
					if( json[i].optionIndex > optionIndex ){
						$('#selection').append('<div id="selection_' + (optionIndex + 1) + '">옵션' + (optionIndex + 1) + ' : </div>');
						optionIndex++;
						$('#selection_' + optionIndex ).append('<input type="checkbox" name="codHmSel" value="'+json[i].hangmok.codHm+'" title="'+json[i].hangmok.descKor+'" />'+json[i].hangmok.descKor);
					}else if( json[i].optionIndex == optionIndex ){
						$('#selection_' + optionIndex ).append('<input type="checkbox" name="codHmSel" value="'+json[i].hangmok.codHm+'" title="'+json[i].hangmok.descKor+'" />'+json[i].hangmok.descKor);
					}
				}
			}
		});

		//추가검사
		$.ajax({
			type: 'GET',
			url: './jsonAdditionGmsa.web',
			data: {numSeq:$('#numSeq').val(), codDc:$('#codDc').val()},
			dataType: "json",
			beforeSend: function(){
				$('#wrap').block({message: '<img src="/contents/images/common/ajax-loader.gif"/>', css: {border: 'none', backgroundColor: '#666666'}});
			},
			complete: function(){
				$('#wrap').unblock();
			},
			error: function(x, e){
				if(x.status==0){alert('You are offline!!\n Please Check Your Network.');}else if(x.status==404){alert('Requested URL not found.');}else if(x.status==500){alert('Internel Server Error.');}else if(e=='parsererror'){alert('Error.\nParsing JSON Request failed.');alert(x.responseText);}else if(e=='timeout'){alert('Request Time out.');}else {alert('Unknow Error.\n'+x.responseText);}
			},
			success: function(json){
				$('#addition').children().remove();
				for ( var i = 0; i < json.length; i++ ){
					$('#addition').append('<input type="checkbox" name="codHmAdd" value="'+json[i].codHm+'" id="'+json[i].cosSuga+'" title="'+json[i].descKor+'" />'+json[i].descKor);
				}
			}
		});
	});
	

	var strSelHangmok = "";		//선택검사항목
	var allPrice = 0;				//총결제금액변수
	var strAddHangmok = "";		//추가검사항목
	var strAddPrice = "";		//추가검사비용
	
	$('input:checkbox[name="codHmSel"]').live('click', function(){
		var selHangmok = $(this).attr('title');
		
		if(strSelHangmok == "") strSelHangmok = selHangmok;
		else strSelHangmok += "H"+selHangmok;

		$('#selHm').val(selHangmok);
	});
	
	//추가검사항목 선택시 이벤트
	//총 결제 금액 계산 및 표시
	$('input:checkbox[name="codHmAdd"]').live('click', function(){
		
		var addHangmok = $(this).attr('title');
		var addPrice = eval($(this).attr('id'));
		
		$('#suga').after('<p>' + addHangmok + ' '+ addPrice +'원</p>');
		
		if(strAddHangmok == "") strAddHangmok = addHangmok;
		else strAddHangmok += "H"+addHangmok;
		
		if(strAddPrice == "") strAddPrice = addPrice;
		else strAddPrice += "H"+addPrice;
		
		$('#addHm').val(strAddHangmok);
		$('#addPr').val(strAddPrice);
		
		allPrice += addPrice;
		$('#allPrice').html(allPrice);
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
<form name="formSave" id="formSave" action="personalForm3.web" method="post">
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
	<!-- 임시 항목 내용 -->
	<input type="" id="selHm" name="selHm" value="" />
	<input type="" id="addHm" name="addHm" value="" />
	<input type="" id="addPr" name="addPr" value="" />
	
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
		<td><div id="selection"></div></td>
	</tr>
	<tr>
		<td>추가검사</td>
		<td><div id="addition"></div></td>
	</tr>
	<tr>
		<td>메모</td>
		<td>
			<textarea id="custGita" name="custGita" rows="5" cols="36" placeholder="검사 받으시는분의 특이사항이나 주의사항이 있으면 꼭 알려주세요."></textarea>
		</td>
	</tr>
</table>
<table border="1" width="500">
	<tr>
		<td>검사비용 확인</td>
	</tr>
	<tr>
		<td><div id="suga">추가검사</div></td>
	</tr>
</table>
<table border="1" width="500">
	<tr>
 		<td>총 결제 예상 금액 : <span id="allPrice"></span></td>
	</tr>
</table>
<div style="margin: 20 0 0 0; text-align: center;"><input type="submit" name="btnSubmit" id="btnSubmit" value="다음"/></div>
</div>
</form>
</body>
</html>