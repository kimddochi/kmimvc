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
	$('#formSave').submit(function(){
		var val = '';
		var cnt = 0;
		$('input[name="codHm"]').each(function(x){
			if($(this).attr("checked")){
				val += $(this).val();
				cnt++;
			}
		});
		$('#selHm').val(val);
		$('#selCnt').val(cnt);

		//if(!$('#selHm').reqRadio()) return false;
		
	});
});
//-->
</script>
</head>
<body>
<br/>
<h1>개인고객 예약정보 입력화면</h1>
<h4> 
 - 항목의 옵션이 최대 10개.....데이터에서 걸러서 들어 오지 않는지?<br/>
 - 선택항목 중 하위 항목을 검색할때는 profile, profile_hm??? 듣고도 까먹은 듯~!<br/>
 - 추가항목 페이지 미구현<br/>
 - 검진 비용 미구현
</h4>
<form name="formSave" id="formSave" action="individualFormFour.web" method="post">
	<!-- 검진프로그램 기본정보 -->
	<input type="hidden" id="numSeq"   name="numSeq"   value="${pumyigs.numSeq}"/>
	<input type="hidden" id="codDc"    name="codDc"    value="${pumyigs.codDc}"/>
	<input type="hidden" id="codGmgn"  name="codGmgn"  value="${pumyigs.codGmgn}"/>
	<input type="hidden" id="gubnGmsa" name="gubnGmsa" value="${pumyigs.gubnGmsa}" />
	<input type="hidden" id="descGmgn" name="descGmgn" value="${pumyigs.descGmgn}" />
	<!-- 고객 기본정보 -->	
	<input type="hidden" id="codJisa"   name="codJisa"   value="${reser.codJisa}"/>
	<input type="hidden" id="descName"  name="descName"  value="김의학"/>
	<input type="hidden" id="descDept"  name="descDept"  value="${reser.descDept}"/>
	<input type="hidden" id="numTel"    name="numTel"    value="${reser.numTel}"/>
	<input type="hidden" id="descEmail" name="descEmail" value="${reser.descEmail}" />
	<input type="hidden" id="custGita"  name="custGita"  value="${reser.custGita}" />
	<input type="hidden" id="selHm"     name="selHm"     value="" />
	<input type="hidden" id="selCnt"    name="selCnt"    value="" />

<div id="wrap">
<p>* 검진프로그램 선택</p>
<table border="1" width="900">
	<colgroup>
		<col width="120px">
		<col width="">
	</colgroup>
	<tr>
		<td>선택항목</td>
		<td>
			<c:forEach var="hangmok" items="${hangmok}">
				<input type="checkbox" id="codHm" name="codHm" value="${hangmok.codHm}"/>${hangmok.descKor}
			</c:forEach>
		</td>
	</tr>
</table>
<div style="margin: 20 0 0 0; text-align: center;"><input type="submit" name="btnSubmit" id="btnSubmit" value="다음"/></div>
</div>
</form>
</body>
</html>