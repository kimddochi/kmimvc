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
});
//-->
</script>
</head>
<body>
<br/>
<h1>개인예약 기본정보 입력화면</h1>
<!-- <h4> - </h4> -->
<br/>
<form name="formSave" id="formSave" action="personalForm2.web" method="post">
	<input type="" id="codDc"    name="codDc"    value="${pumyi.codDc}"/>
	<input type="" id="numSeq"    name="numSeq"    value="${pumyi.numSeq}"/>
<div id="wrap">
<p>* 기본 정보</p>
<%-- <form:errors path="" cssClass="validError"/> --%>
<table border="1" width="500">
	<colgroup>
		<col width="120px">
		<col width="">
	</colgroup>
	<tr>
		<td>성명</td>
		<td>
			<input type="text" id="descName" name="descName" size="50"/>
		</td>
	</tr>
	<tr>
		<td>생년월일</td>
		<td>
			<input type="text" id="numJumin" name="numJumin" size="50"/>
		</td>
	</tr>
	<tr>
		<td>성별</td>
		<td>
			<input type="radio" name="gubnMan" value="1"/>남
			<input type="radio" name="gubnMan" value="2"/>여
		</td>
	</tr>
	<tr>
		<td>회사명</td>
		<td>
			<input type="text" id="descDept" name="descDept" size="50"/>
		</td>
	</tr>
	<tr>
		<td>휴대폰</td>
		<td>
			<input type="text" id="numTel" name="numTel" size="50"/>
		</td>
	</tr>
	<tr>
		<td>Email</td>
		<td>
			<input type="text" id="descEmail" name="descEmail" size="50"/>
			<%-- <form:errors path="" cssClass="validError"/> --%>
		</td>
	</tr>
</table>
<div style="margin: 20 0 0 0; text-align: center;"><input type="submit" name="btnSubmit" id="btnSubmit" value="다음"/></div>
</div>
</form>
</body>
</html>