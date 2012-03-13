<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ include file="../include/base.jsp" %>
<!DOCTYPE>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<%@ include file="../include/title.jsp" %>
<script type="text/javascript">
//[!CDATA[
          var xed;
          
          window.onload = function(){
        	  xed= new xq.Editor("editor");
        	  xed.config.contentCssList = ["stylesheet/xq_contents.css"];
        	  xed.setEditMode('wysiwyg');
          };
//]]</script>
<script type="text/javascript">
<!-- 
$(document).ready(function(){
});
//-->
</script>
</head>
<body>
<br/>
<h1>Editor Sample</h1>
<h4>
 - 에마 죽었으~
</h4>
<form name="formSave" id="formSave" action="./save.web" method="post">
	<textarea id="editor">Hollo fom Xquared</textarea>
</form>
</body>
</html>