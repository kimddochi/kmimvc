package kr.or.kmimvc.dto;

public class Hangmok {
	
	String codHm = "";		//항목코드
	String descKor = "";	//항목명_국문
	String descEng = "";	//항목명_영문
	
	public String getCodHm() {
		return codHm;
	}
	public void setCodHm(String codHm) {
		this.codHm = codHm;
	}
	public String getDescKor() {
		return descKor;
	}
	public void setDescKor(String descKor) {
		this.descKor = descKor;
	}
	public String getDescEng() {
		return descEng;
	}
	public void setDescEng(String descEng) {
		this.descEng = descEng;
	}
	
	
}
