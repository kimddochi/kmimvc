package utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;

/**
 * @(#) Copyright 1999-2000 by LG-EDS Systems, Inc., Information Technology
 *      Group, Application Architecture Team, Application Intrastructure Part.
 *      236-1, Hyosung-2dong, Kyeyang-gu, Inchun, 407-042, KOREA. All rights
 *      reserved.
 * 
 * NOTICE ! You can copy or redistribute this code freely, but you should not
 * remove the information about the copyright notice and the author.
 * 
 * @author WonYoung Lee, wyounglee@lg.co.kr.
 */
public final class DateTime
{

	/**
	 * Don't let anyone instantiate this class
	 */
	private DateTime()
	{
	}

	/**
	 * check date string validation with the default format "yyyy-MM-dd".
	 * 
	 * @param s
	 *            date string you want to check with default format
	 *            "yyyy-MM-dd".
	 */
	public static void check(String s) throws Exception
	{
		DateTime.check(s, "yyyy-MM-dd");
	}

	/**
	 * check date string validation with an user defined format.
	 * 
	 * @param s
	 *            date string you want to check.
	 * @param format
	 *            string representation of the date format. For example,
	 *            "yyyy-MM-dd".
	 */
	public static void check(String s, String format)
			throws java.text.ParseException
	{
		if (s == null)
			throw new NullPointerException("date string to check is null");
		if (format == null)
			throw new NullPointerException(
					"format string to check date is null");

		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(
				format, java.util.Locale.KOREA);
		java.util.Date date = null;
		try
		{
			date = formatter.parse(s);
		}
		catch (java.text.ParseException e)
		{
			throw new java.text.ParseException(e.getMessage()
					+ " with format \"" + format + "\"", e.getErrorOffset());
		}

		if (!formatter.format(date).equals(s))
			throw new java.text.ParseException("Out of bound date:\"" + s
					+ "\" with format \"" + format + "\"", 0);
	}

	/**
	 * @return formatted string representation of current day with "yyyy-MM-dd".
	 */
	public static String getDateString()
	{
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(
				"yyyy-MM-dd", java.util.Locale.KOREA);
		return formatter.format(new java.util.Date());
	}

	/**
	 * 
	 * For example, String time = DateTime.getFormatString("yyyy-MM-dd
	 * HH:mm:ss");
	 * 
	 * @param java.lang.String
	 *            pattern "yyyy, MM, dd, HH, mm, ss and more"
	 * @return formatted string representation of current day and time with your
	 *         pattern.
	 */
	public static int getDay()
	{
		return getNumberByPattern("dd");
	}

	/**
	 * 
	 * For example, String time = DateTime.getFormatString("yyyy-MM-dd
	 * HH:mm:ss");
	 * 
	 * @param java.lang.String
	 *            pattern "yyyy, MM, dd, HH, mm, ss and more"
	 * @return formatted string representation of current day and time with your
	 *         pattern.
	 */
	public static String getFormatString(String pattern)
	{
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(
				pattern, java.util.Locale.KOREA);
		String dateString = formatter.format(new java.util.Date());
		return dateString;
	}

	/**
	 * 
	 * For example, String time = DateTime.getFormatString("yyyy-MM-dd
	 * HH:mm:ss");
	 * 
	 * @param java.lang.String
	 *            pattern "yyyy, MM, dd, HH, mm, ss and more"
	 * @return formatted string representation of current day and time with your
	 *         pattern.
	 */
	public static int getMonth()
	{
		return getNumberByPattern("MM");
	}

	/**
	 * 
	 * For example, String time = DateTime.getFormatString("yyyy-MM-dd
	 * HH:mm:ss");
	 * 
	 * @param java.lang.String
	 *            pattern "yyyy, MM, dd, HH, mm, ss and more"
	 * @return formatted string representation of current day and time with your
	 *         pattern.
	 */
	public static int getNumberByPattern(String pattern)
	{
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(
				pattern, java.util.Locale.KOREA);
		String dateString = formatter.format(new java.util.Date());
		return Integer.parseInt(dateString);
	}

	/**
	 * @return formatted string representation of current day with "yyyyMMdd".
	 */
	public static String getShortDateString()
	{
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(
				"yyyyMMdd", java.util.Locale.KOREA);
		return formatter.format(new java.util.Date());
	}

	/**
	 * @return formatted string representation of current time with "HHmmss".
	 */
	public static String getShortTimeString()
	{
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(
				"HHmmss", java.util.Locale.KOREA);
		return formatter.format(new java.util.Date());
	}

	/**
	 * @return formatted string representation of current time with "HHmmss".
	 */
	public static String getDefaultDateTime()
	{
		return getShortDateString()+getShortTimeString();
	}
	
	/**
	 * @return formatted string representation of current time with
	 *         "yyyy-MM-dd-HH:mm:ss".
	 */
	public static String getTimeStampString()
	{
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(
				"yyyy-MM-dd-HH:mm:ss:SSS", java.util.Locale.KOREA);
		return formatter.format(new java.util.Date());
	}

	/**
	 * @return formatted string representation of current time with "HH:mm:ss".
	 */
	public static String getTimeString()
	{
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(
				"HH:mm:ss", java.util.Locale.KOREA);
		return formatter.format(new java.util.Date());
	}

	/**
	 * 
	 * For example, String time = DateTime.getFormatString("yyyy-MM-dd
	 * HH:mm:ss");
	 * 
	 * @param java.lang.String
	 *            pattern "yyyy, MM, dd, HH, mm, ss and more"
	 * @return formatted string representation of current day and time with your
	 *         pattern.
	 */
	public static int getYear()
	{
		return getNumberByPattern("yyyy");
	}
	
	public static String getDateTerm(int term) {
		Calendar rightNow = Calendar.getInstance();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
		rightNow.add(Calendar.DATE,+(term));
		return formatter.format(rightNow.getTime());
	}

	public static String getDay(String dateString) {
		try {
			String year = dateString.substring(0, 4);
			String month = dateString.substring(4, 6);
			String day = dateString.substring(6, 8);
			String[] dayOfWeek={"일","월","화","수","목","금","토"};
			java.util.Calendar c=new java.util.GregorianCalendar();
			c.set(Integer.parseInt(year),Integer.parseInt(month)-1,Integer.parseInt(day));
			return dayOfWeek[c.get(java.util.Calendar.DAY_OF_WEEK)-1];
		} catch (NumberFormatException e) {
			return "";
		}
	}

	/**
	 * get the date of today in the format 'yyyyMMdd'.
	 * 
	 * @return String
	 */
	public static final String getToday() {
		return getDateInProperFormat(new java.util.Date(), "yyyyMMdd");
	}
	
	/**
	 * get the month of year in the format 'yyyyMM'.
	 * 
	 * @return String
	 */
	public static final String getThisYM() {
		return getDateInProperFormat(new java.util.Date(), "yyyyMM");
	}

	/**
	 * get the today date with the specified format.
	 * 
	 */
	public static final String getTodayTime() {
		java.util.Date today = new java.util.Date();
		return getTimeInProperFormat(today);
	}
	

	/**
	 * get the date with the specified format.
	 * 
	 * <p>
	 * 
	 * <pre>
	 * String formattedDate = getDateInProperFormat(new java.util.Date(), &quot;yyyyMMdd&quot;);
	 * System.out.println(&quot;formatted date: &quot; + formattedDate);
	 * </pre>
	 * 
	 * In the output, '20050118' can be shown.
	 * </p>
	 * 
	 * @param now
	 *            Date now.
	 * @param format
	 *            String format in which the date should be represented.
	 * @return String formatted date.
	 */
	public static final String getDateInProperFormat(java.util.Date now,
			String format) {
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		return sdf.format(now);
	}
	

	
	/**
	 * get the date string in the proper format.
	 * 
	 * @param now
	 *            Date date instance.
	 * @return String formatted string.
	 */
	public static final String getTimeInProperFormat(java.util.Date now) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		return sdf.format(now);
	}



	/**
	 * format the date string with the specified delimiter which is hyphen
	 * character as a default in the jsp page.
	 * 
	 * for instance, "yyyMMdd" could be formatted to "yyyy-MM-dd".
	 * 
	 * @param dateStr
	 *            String
	 * @param delimiter
	 *            String
	 * @return String
	 */
	public static String formatDate(String dateStr) {
		return formatDate(dateStr, "-");
	}

	/**
	 * format the date string of the format "yyyyMMdd" with the specified
	 * delimiter in the jsp page. for instance, the formatted date string could
	 * be as a format "yyyy-MM-dd".
	 * 
	 * @param dateStr
	 *            String
	 * @param delimiter
	 *            String
	 * @return String
	 */
	public static String formatDate(String dateStr, String delimiter) {
		if (dateStr != null) {
			dateStr = dateStr.trim();
			int length = dateStr.length();

			if (length == 6) {
				String year = dateStr.substring(0, 2);
				String month = dateStr.substring(2, 4);
				String day = dateStr.substring(4, 6);

				StringBuffer sb = new StringBuffer();
				sb.append(year).append(":");
				sb.append(month).append(":");
				sb.append(day);

				dateStr = sb.toString();
			} else if (length == 8) {
				String year = dateStr.substring(0, 4);
				String month = dateStr.substring(4, 6);
				String day = dateStr.substring(6, 8);

				StringBuffer sb = new StringBuffer();
				sb.append(year).append(delimiter);
				sb.append(month).append(delimiter);
				sb.append(day);

				dateStr = sb.toString();
			} else if (length == 12) {
				String year = dateStr.substring(0, 4);
				String month = dateStr.substring(4, 6);
				String day = dateStr.substring(6, 8);
				String hh = dateStr.substring(8, 10);
				String mm = dateStr.substring(10, 12);
				
				StringBuffer sb = new StringBuffer();
				sb.append(year).append(delimiter);
				sb.append(month).append(delimiter);
				sb.append(day).append(" ");
				sb.append(hh).append(":");
				sb.append(mm);
				
				dateStr = sb.toString();
			} else if (length == 14) {
				String year = dateStr.substring(0, 4);
				String month = dateStr.substring(4, 6);
				String day = dateStr.substring(6, 8);
				String hh = dateStr.substring(8, 10);
				String mm = dateStr.substring(10, 12);
				String ss = dateStr.substring(12, 14);

				StringBuffer sb = new StringBuffer();
				sb.append(year).append(delimiter);
				sb.append(month).append(delimiter);
				sb.append(day).append(" ");
				sb.append(hh).append(":");
				sb.append(mm).append(":");
				sb.append(ss);

				dateStr = sb.toString();
			}
		}

		return dateStr;
	}
	
	public static String smartDate(String dateStr) {
		if(dateStr == null || dateStr.length() != 14) return "";
		else {
			if(dateStr.substring(0,8).equals(getToday())) return formatDate(dateStr.substring(8,14));
			else return formatDate(dateStr.substring(0,8));			
		}
	}
	
	public static String smartDateKorean(String dateStr) {
		if(dateStr == null || dateStr.length() != 14) return "";
		else {
			if(dateStr.substring(0,8).equals(getToday())) return formatDateKorean(dateStr.substring(8,14));
			else return formatDateKorean(dateStr.substring(0,8));			
		}
	}
	
	public static String formatDateKorean(String dateStr) {
		if (dateStr != null) {
			dateStr = dateStr.trim();
			int length = dateStr.length();

			if (length == 6) {
				String year = dateStr.substring(0, 2);
				String month = dateStr.substring(2, 4);
				String day = dateStr.substring(4, 6);

				StringBuffer sb = new StringBuffer();
				sb.append(year).append("년 ");
				sb.append(month).append("월 ");
				sb.append(day).append("일");

				dateStr = sb.toString();
			} else if (length == 8) {
				String year = dateStr.substring(0, 4);
				String month = dateStr.substring(4, 6);
				String day = dateStr.substring(6, 8);

				StringBuffer sb = new StringBuffer();
				sb.append(year).append("년 ");
				sb.append(month).append("월 ");
				sb.append(day).append("일");

				dateStr = sb.toString();
			} else if (length == 14) {
				String year = dateStr.substring(0, 4);
				String month = dateStr.substring(4, 6);
				String day = dateStr.substring(6, 8);
				String hh = dateStr.substring(8, 10);
				String mm = dateStr.substring(10, 12);
				String ss = dateStr.substring(12, 14);

				StringBuffer sb = new StringBuffer();
				sb.append(year).append("년 ");
				sb.append(month).append("월 ");
				sb.append(day).append("일");
				sb.append(hh).append(" 시");
				sb.append(mm).append(" 분");
				sb.append(ss).append(" 초");

				dateStr = sb.toString();
			}
		}

		return dateStr;
	}
}