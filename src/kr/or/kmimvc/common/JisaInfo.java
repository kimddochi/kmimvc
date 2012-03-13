package kr.or.kmimvc.common;

public enum JisaInfo {

	GANGNAM(11, "강남"), YEOUIDO(12, "여의도"), BONWON(15, "본원"), SUWON(43, "수원"), GWANGJU(51, "광주"), BUSAN(61, "부산"), DAEGU(71, "대구");

	private final int value;
	private final String desc;
	
	JisaInfo(int value, String desc) {
		this.value = value;
		this.desc = desc;
	}
	
	public int intValue(){
		return this.value;
	}
	
	public String descValue(){
		return this.desc;
	}
	
//	public static int valueOf(int value){
//		switch(value){
//		case 11: return GANGNAM.value;
//		case 12: return YEOUIDO.value;
//		case 15: return BONWON.value;
//		case 43: return SUWON.value;
//		case 51: return GWANGJU.value;
//		case 61: return BUSAN.value;
//		case 71: return DAEGU.value;
//		default: throw new AssertionError("Jisa Unknown value: "+value);
//		}
//	}
//	
//	public static String valueOfDesc(int value){
//		switch(value){
//			case 11: return GANGNAM.desc;
//			case 12: return YEOUIDO.desc;
//			case 15: return BONWON.desc;
//			case 43: return SUWON.desc;
//			case 51: return GWANGJU.desc;
//			case 61: return BUSAN.desc;
//			case 71: return DAEGU.desc;
//			default: throw new AssertionError("Jisa Unknown desc: "+value);
//		}
//	}
	
}
