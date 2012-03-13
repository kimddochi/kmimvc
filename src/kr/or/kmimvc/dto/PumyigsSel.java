package kr.or.kmimvc.dto;

public class PumyigsSel {

	String numSeq = "";		//품의일련번호
	String codDc = "";		//단체코드
	String codGmgn = "";	//품의유형코드
	String selNo = "";		//선택일련번호
	String codHm = "";		//선택항목
	
	public String getNumSeq() {
		return numSeq;
	}
	public void setNumSeq(String numSeq) {
		this.numSeq = numSeq;
	}
	public String getCodDc() {
		return codDc;
	}
	public void setCodDc(String codDc) {
		this.codDc = codDc;
	}
	public String getCodGmgn() {
		return codGmgn;
	}
	public void setCodGmgn(String codGmgn) {
		this.codGmgn = codGmgn;
	}
	public String getSelNo() {
		return selNo;
	}
	public void setSelNo(String selNo) {
		this.selNo = selNo;
	}
	public String getCodHm() {
		return codHm;
	}
	public void setCodHm(String codHm) {
		this.codHm = codHm.trim();
	}
	
	
}
