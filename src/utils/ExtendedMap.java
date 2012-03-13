package utils;

import java.util.List;
import java.util.Map;

public interface ExtendedMap extends Map<Object, Object>, Cloneable {
 
    void addAll(Map map);

    Object get(Object key, Object defaultValue);

    String getString(String key);

    String getString(String key, String defaultValue);

    String[] getStrings(String name);

    int[] getInts(String name);

    boolean getBoolean(String key);

    boolean getBoolean(String key, boolean defaultValue);

    double getDouble(String key);

    double getDouble(String key, double defaultValue);

    float getFloat(String key);

    float getFloat(String key, float defaultValue);

    int getInt(String key);

    int getInt(String key, int defaultValue);

    long getLong(String key);

    long getLong(String key, long defaultValue);

    List getValues(String key);

}