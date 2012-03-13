package kr.or.kmimvc.common;

public enum JisaOne {

	GANGNAM(11), YEOUIDO(12), BONWON(15), SUWON(43), GWANGJU(51), BUSAN(61), DAEGU(71);

	private final int value;
	
	JisaOne(int value) {
		this.value = value;
	}
	
	public int intValue(){
		return this.value;
	}
	
	public static JisaOne valueOf(int value){
		switch(value){
		case 11: return GANGNAM;
		case 12: return YEOUIDO;
		case 15: return BONWON;
		case 43: return SUWON;
		case 51: return GWANGJU;
		case 61: return BUSAN;
		case 71: return DAEGU;
		default: throw new AssertionError("Jisa Unknown value: "+value);
		}
	}
	
}
