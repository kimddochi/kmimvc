package utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public final class DateCalculate {

	private DateCalculate(){
		throw new AssertionError();
	}
	
	/**
	 * Date type으로 반환
	 * @param curdate
	 * @param pattern
	 * @return
	 * @throws java.text.ParseException
	 */
	public static Date formatDate(int curdate, String pattern) throws java.text.ParseException{
		SimpleDateFormat format = new SimpleDateFormat(pattern);
		String strDate = String.valueOf(curdate);
		return format.parse(strDate);
	}
	
	/**
	 * String type으로 반환
	 * @param curdate
	 * @param pattern
	 * @return
	 * @throws java.text.ParseException
	 */
	public static String formatString(Date curdate, String pattern) throws java.text.ParseException{
		SimpleDateFormat format = new SimpleDateFormat(pattern);
		return format.format(curdate);
	}
	
	/**
	 * 요일을 반환 ( 1:일, 2:월, 3:화, 4:수, 5:목, 6:금, 7:토 )
	 * @param curdate
	 * @return
	 * @throws java.text.ParseException
	 */
	public static int getDayOfWeek(int curdate) throws java.text.ParseException{
		Calendar calendar = Calendar.getInstance();
		
		Date date = formatDate(curdate, "yyyyMMdd");
		calendar.setTime(date);
		
		return calendar.get(Calendar.DAY_OF_WEEK);
	}

	/**
	 * 월에서 주의 순서를 반환
	 * @param curdate
	 * @return
	 * @throws java.text.ParseException
	 */
	public static int getWeekOfMonth(int curdate) throws java.text.ParseException{
		Calendar calendar = Calendar.getInstance();
		
		Date date = formatDate(curdate, "yyyyMMdd");
		calendar.setTime(date);
		
		return calendar.get(Calendar.WEEK_OF_MONTH);
	}
	
	/**
	 * 일을 반환
	 * @param curdate
	 * @return
	 * @throws java.text.ParseException
	 */
	public static int getDay(int curdate) throws java.text.ParseException{
		Calendar calendar = Calendar.getInstance();
		
		Date date = formatDate(curdate, "yyyyMMdd");
		calendar.setTime(date);
		
		return calendar.get(Calendar.DAY_OF_MONTH);
	}
	
	/**
	 * 월을 반환
	 * @param curdate
	 * @return
	 * @throws java.text.ParseException
	 */
	public static int getMonth(int curdate) throws java.text.ParseException{
		Calendar calendar = Calendar.getInstance();
		
		Date date = formatDate(curdate, "yyyyMMdd");
		calendar.setTime(date);
		
		return calendar.get(Calendar.MONTH)+1;
	}
	
	/**
	 * 현재 날짜에서 요청한 기간을 더해서 반환
	 * @param curdate
	 * @param period
	 * @return
	 * @throws java.text.ParseException
	 */
	public static int addDays(int period) throws java.text.ParseException{
		
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DATE, period);
		
		String strDate = formatString(calendar.getTime(), "yyyyMMdd");
		
		return Integer.parseInt(strDate);
	}
	
	/**
	 * 요청한 일에서 요청한 기간을 더해서 반환
	 * @param curdate
	 * @param period
	 * @return
	 * @throws java.text.ParseException
	 */
	public static int addDays(int curdate, int period) throws java.text.ParseException{
		Date date = formatDate(curdate, "yyyyMMdd");
		
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.DATE, period);
		
		String strDate = formatString(calendar.getTime(), "yyyyMMdd");
		
		return Integer.parseInt(strDate);
	}

	/**
	 * 정비예약 상세 (도착예정시간)
	 * 현재의 시간에서 변수로 넘어온 分만큼 minus 한 시간을 YYYYMMDDHHMM 의 형식으로 리턴된다.
	 * 
	 * @return 154120
	 */
	public static String getCurrTimeMinusMin(int cur_hour, int cur_min,
			int minus_min) {
		Locale lc = new Locale("Locale.KOREAN", "Locale.KOREA");
		// TimeZone mySTZ = (TimeZone)TimeZone.getTimeZone ("JST");
		TimeZone mySTZ = TimeZone.getTimeZone("JST");

		Calendar today = Calendar.getInstance(mySTZ, lc);

		today.set(today.HOUR_OF_DAY, cur_hour);
		today.set(today.MINUTE, cur_min);

		today.add(Calendar.MINUTE, -minus_min);

		int hour = today.get(Calendar.HOUR_OF_DAY);
		int min = today.get(Calendar.MINUTE);
		// int sec = today.get(Calendar.SECOND);

		String str = "";

		if (hour < 10)
			str += "0";
		str += hour;

		if (min < 10)
			str += "0";
		str += min;

		// if(sec < 10) str += "0";
		// str += sec;

		return str;
	}

	/**
	 * 두 날짜의 차이를 일자로 구한다.(조회 종료일 - 조회 시작일)
	 * 
	 * @param staDate -
	 *            조회 시작일(날짜 ex.20020101)
	 * @param endDate -
	 *            조회 종료일(날짜 ex.20020214)
	 * @return 기간에 해당하는 일자
	 */
	public static int DatePeriod(String staDate, String endDate) {
		Calendar c1 = null, c2 = null;
		Date date1 = null, date2 = null;
		long d1, d2;
		int result = 0;

		if (staDate != null && staDate.length() == 8 && endDate != null
				&& endDate.length() == 8) {
			c1 = Calendar.getInstance();
			c2 = Calendar.getInstance();

			int staYear = Integer.parseInt(staDate.substring(0, 4));
			int staMonth = Integer.parseInt(staDate.substring(4, 6));
			int staDay = Integer.parseInt(staDate.substring(6, 8));
			int endYear = Integer.parseInt(endDate.substring(0, 4));
			int endMonth = Integer.parseInt(endDate.substring(4, 6));
			int endDay = Integer.parseInt(endDate.substring(6, 8));

			// 날짜 지정
			c1.set(staYear, staMonth, staDay);
			c2.set(endYear, endMonth, endDay);

			// DATE로 형변환
			date1 = c1.getTime();
			date2 = c2.getTime();

			// MilliSecond 로 변환
			d1 = date1.getTime();
			d2 = date2.getTime();

			// 날짜차이
			result = (int) ((d2 - d1) / (1000 * 60 * 60 * 24));
		} else {
			result = 0;
		}

		return result;
	}
	
}
