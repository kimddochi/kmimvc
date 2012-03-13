package kr.or.kmimvc.dto;



public class Pumyigs {

	String numSeq = "";			//일련번호
	String codGmgn = "";		//검진구분+검진유형 코드
	String codDc = "";			//단체코드
	String gubnGmsa = "";		//검진구분
	String descGmgn = "";		//검진유형
	String codJangbi = "";		//장비
	String floor11 = "";		//강남센터 검진여부 (99일 경우 검진불가)
	String floor12 = "";		//여의도센터 검진여부 (99일 경우 검진불가)
	String floor15 = "";		//본원센터 검진여부 (99일 경우 검진불가)
	String floor43 = "";		//수원센터 검진여부 (99일 경우 검진불가)
	String floor51 = "";		//광주센터 검진여부 (99일 경우 검진불가)
	String floor61 = "";		//부산센터 검진여부 (99일 경우 검진불가)
	String floor71 = "";		//대구센터 검진여부 (99일 경우 검진불가)
	String gubnMan = "";		//남여구분 - 남:1 여:2
	
	boolean yn11 = false;		//강남지사 검진 가능여부
	boolean yn12 = false;		//여의도지사 검진 가능여부
	boolean yn15 = false;		//본원지사 검진 가능여부
	boolean yn43 = false;		//수원지사 검진 가능여부
	boolean yn51 = false;		//광주지사 검진 가능여부
	boolean yn61 = false;		//부산지사 검진 가능여부
	boolean yn71 = false;		//대구지사 검진 가능여부
	
	public String getNumSeq() {
		return numSeq;
	}
	public void setNumSeq(String numSeq) {
		this.numSeq = numSeq;
	}
	public String getCodGmgn() {
		return codGmgn;
	}
	public void setCodGmgn(String codGmgn) {
		this.codGmgn = codGmgn;
	}
	public String getCodDc() {
		return codDc;
	}
	public void setCodDc(String codDc) {
		this.codDc = codDc;
	}
	public String getGubnGmsa() {
		return gubnGmsa;
	}
	public void setGubnGmsa(String gubnGmsa) {
		this.gubnGmsa = gubnGmsa.trim();
	}
	public String getDescGmgn() {
		return descGmgn;
	}
	public void setDescGmgn(String descGmgn) {
		this.descGmgn = descGmgn;
	}
	public String getCodJangbi() {
		return codJangbi;
	}
	public void setCodJangbi(String codJangbi) {
		this.codJangbi = codJangbi.trim();
	}
	public String getFloor15() {
		return floor15;
	}
	public void setFloor15(String floor15) {
		this.floor15 = floor15.trim();
	}
	public String getFloor12() {
		return floor12;
	}
	public void setFloor12(String floor12) {
		this.floor12 = floor12.trim();
	}
	public String getFloor11() {
		return floor11;
	}
	public void setFloor11(String floor11) {
		this.floor11 = floor11.trim();
	}
	public String getFloor43() {
		return floor43;
	}
	public void setFloor43(String floor43) {
		this.floor43 = floor43.trim();
	}
	public String getFloor61() {
		return floor61;
	}
	public void setFloor61(String floor61) {
		this.floor61 = floor61.trim();
	}
	public String getFloor71() {
		return floor71;
	}
	public void setFloor71(String floor71) {
		this.floor71 = floor71.trim();
	}
	public String getFloor51() {
		return floor51.trim();
	}
	public void setFloor51(String floor51) {
		this.floor51 = floor51.trim();
	}
	public String getGubnMan() {
		return gubnMan;
	}
	public void setGubnMan(String gubnMan) {
		this.gubnMan = gubnMan;
	}
	public boolean isYn11() {
		return yn11;
	}
	public void setYn11(boolean yn11) {
		this.yn11 = yn11;
	}
	public boolean isYn12() {
		return yn12;
	}
	public void setYn12(boolean yn12) {
		this.yn12 = yn12;
	}
	public boolean isYn15() {
		return yn15;
	}
	public void setYn15(boolean yn15) {
		this.yn15 = yn15;
	}
	public boolean isYn43() {
		return yn43;
	}
	public void setYn43(boolean yn43) {
		this.yn43 = yn43;
	}
	public boolean isYn51() {
		return yn51;
	}
	public void setYn51(boolean yn51) {
		this.yn51 = yn51;
	}
	public boolean isYn61() {
		return yn61;
	}
	public void setYn61(boolean yn61) {
		this.yn61 = yn61;
	}
	public boolean isYn71() {
		return yn71;
	}
	public void setYn71(boolean yn71) {
		this.yn71 = yn71;
	}

	public static boolean ableYN(String value){
		if("99".equals(value)){
			return false;
		}else{
			return true;
		}
	}
	
}
