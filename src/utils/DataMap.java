package utils;

import java.io.IOException;
import java.io.Reader;
import java.io.Serializable;
import java.sql.Clob;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

/**
 * {@link ExtendedMap} �� default implementation
 */
public class DataMap implements ExtendedMap, Serializable {

	static final long serialVersionUID = -5185735896348635052L;

	protected Map<Object, Object> map;

	public DataMap(Map<Object, Object> map) {
		if (map == null) {
			this.map = new LinkedHashMap<Object, Object>();
		} else {
			this.map = map;
		}
	}

	/**
	 * �־��� ���ڿ��� DataMap.parse�� �Ľ��ؼ� �ʿ� �ִ´�.
	 */
	public DataMap(String string) {
		this.map = new LinkedHashMap<Object, Object>();
		parse(string);
	}

	public DataMap() {
		this.map = new LinkedHashMap<Object, Object>();
	}


	public void addAll(Map map) {
		if (map == null)
			return;
		if (this.map == null)
			new DataMap();
		Iterator iter = map.keySet().iterator();
		while (iter.hasNext()) {
			String key = (String) iter.next();
			Object object = map.get(key);
			if (object == null)
				continue;
			if (!(object instanceof String[])) {
				object = new String[] { object.toString() };
			}
			String[] values = (String[]) object;
			if (values.length == 1)
				this.map.put(key, values[0]);
			else {
				List<String> list = new ArrayList<String>();
				for (int i = 0; i < values.length; i++) {
					list.add(values[i]);
				}
				this.map.put(key, list);
			}
		}
	}


	public int size() {
		return map.size();
	}


	public void clear() {
		map.clear();
	}


	public boolean isEmpty() {
		return map.isEmpty();
	}


	public boolean containsKey(Object key) {
		return map.containsKey(key);
	}


	public boolean containsValue(Object key) {
		return map.containsValue(key);
	}


	public Collection<Object> values() {
		return map.values();
	}


	public void putAll(Map<?, ?> subMap) {
		map.putAll(subMap);
	}


	public Set entrySet() {
		return map.entrySet();
	}


	public Set keySet() {
		return map.keySet();
	}


	public Object get(Object key) {
		return map.get(key);
	}


	public Object get(Object key, Object defaultValue) {
		if (map.get(key) == null)
			return defaultValue;
		return map.get(key);
	}


	public String getString(String key) {
		return getString(key, null);
	}

	public String get(String key) {
		return getString(key, "");
	}
	

	public String getString(String key, String defaultValue) {
		String[] strs = getStrings(key);
		if (strs == null || strs[0] == null)
			return defaultValue;
		return strs[0];
	}


	public String[] getStrings(String name) {
		Object obj[] = getValues(name).toArray();
		if (obj == null || obj.length == 0 || obj[0] == null)
			return null;
		String[] strs = new String[obj.length];
		for (int i = 0; i < obj.length; i++) {
			strs[i] = String.valueOf(obj[i]);
		}
		return strs;
	}


	public Object remove(Object key) {
		return map.remove(key);
	}


	public Object put(Object key, Object value) {
		return map.put(key, value);
	}


	public boolean getBoolean(String key) {
		return getBoolean(key, false);
	}


	public boolean getBoolean(String key, boolean defaultValue) {
		String value = getString(key);
		if (value == null) {
			return defaultValue;
		}
		
		if (value.equalsIgnoreCase("true")) {
			return true;
		} else if (value.equalsIgnoreCase("false")) {
			return false;
		}
		return defaultValue;
	}

	/**
	 * �� �޽��� ���ڿ� �Ķ���͸� double��ȯ�Ͽ� �����Ѵ�. ���� null�̰ų� ������ ��������� �ƴ� ��� default
	 * value�� �����Ѵ�. �׷��Ƿ�, �� �޽�尡 ���Ǵ� �Ķ���ʹ� ������ ���� Ÿ���� ��ȿ�� �˻簡 �̷���� �־���Ѵ�.
	 */

	public double getDouble(String key) {
		return getDouble(key, 0.0);
	}


	public double getDouble(String key, double defaultValue) {
		String value = getString(key);
		if (value == null || value.equals(""))
			return defaultValue;
		double num = defaultValue;
		try {
			num = Double.valueOf(value).doubleValue();
		} catch (Exception e) {
		}
		return num;
	}

	/**
	 * @return java.lang.String
	 * @param key
	 *            java.lang.String
	 */

	public float getFloat(String key) {
		return (float) getDouble(key, 0.0);
	}


	public float getFloat(String key, float defaultValue) {
		return (float) getDouble(key, defaultValue);
	}

	/**
	 * @return java.lang.String
	 * @param key
	 *            java.lang.String
	 */

	public int getInt(String key) {
		return getInt(key, 0);
	}


	public int getInt(String key, int defaultValue) {
		return (int) getDouble(key, defaultValue);
	}

	/**
	 * @return java.lang.String
	 * @param key
	 *            java.lang.String
	 */

	public long getLong(String key) {
		return getLong(key, 0L);
	}


	public long getLong(String key, long defaultValue) {
		Object value = map.get(key);

		if (value == null)
			return defaultValue;
		if (value instanceof Timestamp) {
			return ((Timestamp) value).getTime();
		}
		if (value instanceof Date) {
			return ((Date) value).getTime();
		}
		if (value instanceof Number) {
			return ((Number) value).longValue();
		}

		String sValue = value.toString();
		if (sValue.equals(""))
			return defaultValue;
		return Long.parseLong(sValue);
	}


	public List getValues(String key) {
		if (map.get(key) instanceof List) {
			return (List) map.get(key);
		} else {
			List<Object> list = new ArrayList<Object>();
			if (map.containsKey(key))
				list.add(map.get(key));
			return list;
		}
	}


	public String toString() {
		return map.toString();
	}


	public Object clone() throws CloneNotSupportedException {
		if (map instanceof HashMap)
			return new DataMap((Map) ((HashMap) map).clone());
		if (map instanceof TreeMap)
			return new DataMap((Map) ((TreeMap) map).clone());
		return null;
	}


	public int[] getInts(String name) {
		String[] strs = getStrings(name);
		if (strs == null)
			return null;
		int[] ints = new int[strs.length];
		for (int i = 0; i < strs.length; i++) {
			ints[i] = Integer.parseInt(strs[i]);
		}
		return ints;
	}

	/**
	 * "key1=value1, key2=value2, key3=value3"�� ���� ������� ���� ���ڿ��� �Ľ��ؼ� �ʿ� �ִ´�.
	 * 
	 * @param string
	 */
	public void parse(String string) {
		String values[] = string.split(", ");
		for (int i = 0; i < values.length; i++) {
			String pair[] = values[i].split("=");
			if(pair.length > 1)
				map.put(pair[0], pair[1]);
			else
				map.put(pair[0], "");
		}
	}


	public boolean equals(Object o) {
		return map.equals(o);
	}

	/**
	 * 2010-12-15 ihseo 
	 * @param key
	 * @return
	 */
    public String getClob(Object key)
    {
    	Clob value = (Clob) map.get(key);
    	
    	StringBuffer sb = new StringBuffer();
    	Reader rd = null;
    	char[] buf = new char[1024];
    	int readcnt = 0;
    	
    	try{
    		rd = value.getCharacterStream();
    		
    		while((readcnt=rd.read(buf, 0, 1024))!=-1){
    			sb.append(buf, 0, readcnt);
    		}
    	}catch(Exception e){
    		e.printStackTrace();
    	}finally{
    		if(rd!=null)
				try {
					rd.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
    	}

        if (sb.toString() == null)
        {
            return "";
        }
        else
        {
            return sb.toString();
        }
    }
}