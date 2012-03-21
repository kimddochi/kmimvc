package kr.or.kmimvc.dto;


public class Reser {
	
	String year = "";				//예약년도
	String numSeq = "";				//예약번호
	String idx = "";				//일련번호
	String codJisa = "";			//예약지사
	String datYeyak = "";			//예약일자
	String descName = "";			//사용자이름
	String codDc = "";				//단체코드(개인일경우에도 dummy코드 부여됨)
	String numJumin = "";			//생년월일 - 생년월일 필드가 없어 주민필드로 대처함.
	String descDept = "";			//회사명(=부서명)
	String ysnoFolk = "";			//가족구분
	String gubnStatus = "1";		//예약상태 - 0:예약, 1:예약대기, 2:예약취소
	String gubnReser = "2";			//예약구분 - 0:콜예약, 1:일괄예약, 2:Web예약
	String descHangmok = "";		//예약항목명
	String gubnPyseq = "";			//검사일련번호(PUMYIGS.NUM_SEQ)
	String gubnPy = "";				//검사구분구분(PUMYIGS.GUBN_GMSA)
	String gubnPyyh = "";			//검사유형코드(PUMYIGS.COD_GMGN)
	String selCnt = "";				//선택항목갯수
	String selHm = "";				//선택항목
	String addHm = "";				//추가항목
	String addPr = "";				//추가항목
	String custGita = "";			//고객기타사항
	String numTel = "";				//휴대폰
	String descEmail = "";			//이메일
	
	String confidenceNum = "1111";		//안심실명인증번호

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	public String getNumSeq() {
		return numSeq;
	}

	public void setNumSeq(String numSeq) {
		this.numSeq = numSeq;
	}

	public String getIdx() {
		return idx;
	}

	public void setIdx(String idx) {
		this.idx = idx;
	}

	public String getCodJisa() {
		return codJisa;
	}

	public void setCodJisa(String codJisa) {
		this.codJisa = codJisa;
	}

	public String getDatYeyak() {
		return datYeyak;
	}

	public void setDatYeyak(String datYeyak) {
		this.datYeyak = datYeyak;
	}

	public String getDescName() {
		return descName;
	}

	public void setDescName(String descName) {
		this.descName = descName;
	}

	public String getCodDc() {
		return codDc;
	}

	public void setCodDc(String codDc) {
		this.codDc = codDc;
	}

	public String getNumJumin() {
		return numJumin;
	}

	public void setNumJumin(String numJumin) {
		this.numJumin = numJumin;
	}

	public String getDescDept() {
		return descDept;
	}

	public void setDescDept(String descDept) {
		this.descDept = descDept;
	}

	public String getYsnoFolk() {
		return ysnoFolk;
	}

	public void setYsnoFolk(String ysnoFolk) {
		this.ysnoFolk = ysnoFolk;
	}

	public String getGubnStatus() {
		return gubnStatus;
	}

	public void setGubnStatus(String gubnStatus) {
		this.gubnStatus = gubnStatus;
	}

	public String getGubnReser() {
		return gubnReser;
	}

	public void setGubnReser(String gubnReser) {
		this.gubnReser = gubnReser;
	}

	public String getDescHangmok() {
		return descHangmok;
	}

	public void setDescHangmok(String descHangmok) {
		this.descHangmok = descHangmok;
	}

	public String getGubnPyseq() {
		return gubnPyseq;
	}

	public void setGubnPyseq(String gubnPyseq) {
		this.gubnPyseq = gubnPyseq;
	}

	public String getGubnPy() {
		return gubnPy;
	}

	public void setGubnPy(String gubnPy) {
		this.gubnPy = gubnPy;
	}

	public String getGubnPyyh() {
		return gubnPyyh;
	}

	public void setGubnPyyh(String gubnPyyh) {
		this.gubnPyyh = gubnPyyh;
	}

	public String getSelCnt() {
		return selCnt;
	}

	public void setSelCnt(String selCnt) {
		this.selCnt = selCnt;
	}

	public String getSelHm() {
		return selHm;
	}

	public void setSelHm(String selHm) {
		this.selHm = selHm;
	}

	public String getAddHm() {
		return addHm;
	}

	public void setAddHm(String addHm) {
		this.addHm = addHm;
	}

	public String getCustGita() {
		return custGita;
	}

	public void setCustGita(String custGita) {
		this.custGita = custGita;
	}

	public String getNumTel() {
		return numTel;
	}

	public void setNumTel(String numTel) {
		this.numTel = numTel;
	}

	public String getDescEmail() {
		return descEmail;
	}

	public void setDescEmail(String descEmail) {
		this.descEmail = descEmail;
	}

	public String getConfidenceNum() {
		return confidenceNum;
	}

	public void setConfidenceNum(String confidenceNum) {
		this.confidenceNum = confidenceNum;
	}
	
	
}
