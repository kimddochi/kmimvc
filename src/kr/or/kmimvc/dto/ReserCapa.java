package kr.or.kmimvc.dto;

public class ReserCapa {

	String codJisa = "";
	String datYeyak = "";
	String gubnApm = "";
	String gubnTime = "";
	String gubnGmsa = "";
	String gubnFloor = "";
	String gubnWeek = "";
	int numCapa = 0;
	String ysnoMagam = "";
	
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
		this.datYeyak = datYeyak.trim();
	}
	public String getGubnApm() {
		return gubnApm;
	}
	public void setGubnApm(String gubnApm) {
		this.gubnApm = gubnApm.trim();
	}
	public String getGubnTime() {
		return gubnTime;
	}
	public void setGubnTime(String gubnTime) {
		this.gubnTime = gubnTime.trim();
	}
	public String getGubnGmsa() {
		return gubnGmsa;
	}
	public void setGubnGmsa(String gubnGmsa) {
		this.gubnGmsa = gubnGmsa.trim();
	}
	public String getGubnFloor() {
		return gubnFloor;
	}
	public void setGubnFloor(String gubnFloor) {
		this.gubnFloor = gubnFloor.trim();
	}
	public String getGubnWeek() {
		return gubnWeek;
	}
	public void setGubnWeek(String gubnWeek) {
		this.gubnWeek = gubnWeek.trim();
	}
	public int getNumCapa() {
		return numCapa;
	}
	public void setNumCapa(int numCapa) {
		this.numCapa = numCapa;
	}
	public String getYsnoMagam() {
		return ysnoMagam;
	}
	public void setYsnoMagam(String ysnoMagam) {
		this.ysnoMagam = ysnoMagam;
	}
	
	
}
