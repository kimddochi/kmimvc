<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ include file="../include/base.jsp" %>
<!DOCTYPE>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<%@ include file="../include/title.jsp" %>
<style type="text/css">
</style>
<script type="text/javascript">
<!-- 
$(document).ready(function(){
});
//-->
</script>
</head>
<body>
<br/>
<h1>예약 확인 화면</h1>
<!-- <h4> - </h4> -->
<br/>
<form name="formView" id="formView" action="" method="post">
<table style="border: 1px;">
	<tr>
		<td>이름</td>
		<td>${reser.descName}</td>
	</tr>
	<tr>
		<td></td>
		<td></td>
	</tr>
</table>
</form>
</body>
</html>