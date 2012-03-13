package kr.or.kmimvc.dto;

public class SelectionGmsa {

	String optionIndex;	//선택검사항Index ex)옵션1, 옵션2
	String optionCnt;	//선택검사항목에 종속된 추가선택항목 갯수
	Hangmok hangmok;
	
	public String getOptionIndex() {
		return optionIndex;
	}
	public void setOptionIndex(String optionIndex) {
		this.optionIndex = optionIndex;
	}
	public String getOptionCnt() {
		return optionCnt;
	}
	public void setOptionCnt(String optionCnt) {
		this.optionCnt = optionCnt;
	}
	public Hangmok getHangmok() {
		return hangmok;
	}
	public void setHangmok(Hangmok hangmok) {
		this.hangmok = hangmok;
	}
	
	
}
