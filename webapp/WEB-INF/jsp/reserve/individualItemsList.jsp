<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ include file="../include/base.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<%@ include file="../include/title.jsp" %>
<script type="text/javascript">
<!--
$(document).ready(function(){
	
	/***********************************
	  라디오버튼 클릭 기본입력창으로 넘어 간다.
	************************************/
	$("input[name='btnRadio']").click(function(){
 		
		$("#numSeq").val($(this).val().split("HHH")[0]);
		$("#codGmgn").val($(this).val().split("HHH")[1]);
		$("#codDc").val($(this).val().split("HHH")[2]);
		
		$("#formList").attr("action", "./individualFormOne.web").submit();
	});
});
//-->
</script>
</head>
<body>
<br />
<h1>개인고객 상품 목록 화면</h1>
<h4>
 - 다음 단계의 안심실명인증은 생략합니다. 예약정보 입력으로 바로 넘어갑니다.<br/>
 - 여기에서 codGmgn을 가져와서 조회하게 됩니다.
</h4>

<form id="formList" name="formList" method="post" action="">
	<input type="" id="numSeq"   name="numSeq"   value="${pumyigs.numSeq}" />
	<input type="" id="codDc"    name="codDc"    value="${pumyigs.codDc}" />
	<input type="" id="codGmgn"  name="codGmgn"  value="${pumyigs.codGmgn}" />
	<input type="" id="gubnGmsa" name="gubnGmsa" value="${pumyigs.gubnGmsa}" />
	
	<table border="1">
		<tr>
			<td>검진구분</td>
			<td>검진유형</td>
			<td>선 택</td>
		</tr>
		<c:forEach var="pumyigsList" items="${pumyigsList}">
			<tr>
				<td>${pumyigsList.gubnGmsa}</td>
				<td>${pumyigsList.descGmgn}</td>
				<td><input type="radio" name="btnRadio" value="${pumyigsList.numSeq}HHH${pumyigsList.codGmgn}HHH${pumyigsList.codDc}"></td>
			</tr>
		</c:forEach>
	</table>
</form>
</body>
</html>