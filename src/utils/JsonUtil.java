package utils;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.util.TokenBuffer;

/**
 * Json 관련 마샬링/언마샬링 처리 유틸리티 클래스.
 */
public final class JsonUtil {

   private static final Logger logger = Logger.getLogger(JsonUtil.class);
   
    /**
     * Object를 Jsong Text로 마샬링 한다.
     *
     * @param object the object
     * @return the string
     * @throws Exception the exception
     */
    public static String marshallingJson(Object object) throws Exception {
        TokenBuffer buffer = new TokenBuffer(null);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(buffer, object);
        JsonNode root = objectMapper.readTree(buffer.asParser());
        String jsonText = objectMapper.writeValueAsString(root);
        jsonText = jsonText.replaceAll("null", "\"\"");
        System.out.println("***********************************************************");
        System.out.println(jsonText);
        System.out.println("***********************************************************");
        return jsonText;
    }

    /**
     * Json Text를 Object로 언마샬링 한다.
     *
     * @param <T> 언마샬링 될 제너릭 타입
     * @param jsonText Json 형태의 텍스트
     * @param valueType 언마샬링 될 오브젝트 타입
     * @return the t
     * @throws Exception the exception
     */
    public static <T> T unmarshallingJson(String jsonText, Class<T> valueType) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        return (T) objectMapper.readValue(jsonText, valueType);
    }
    
}
