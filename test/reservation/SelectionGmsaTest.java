package reservation;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import java.util.ArrayList;
import java.util.List;

import kr.or.kmimvc.dao.face.reserve.ReserveDao;
import kr.or.kmimvc.dto.Hangmok;
import kr.or.kmimvc.dto.Pumyigs;
import kr.or.kmimvc.dto.PumyigsSel;
import kr.or.kmimvc.dto.SelectionGmsa;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import utils.JsonUtil;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"classpath:config/application-context.xml"})
public class SelectionGmsaTest {
	
	final static int DIGIT = 5;
	
	@Autowired ReserveDao reserveDao;
	
	Pumyigs pumyigs = new Pumyigs();
	
	@Before
	public void setUp(){
		this.pumyigs.setCodDc("900000");
		this.pumyigs.setNumSeq("1");
		this.pumyigs.setCodGmgn("05");
	}
	
	@Test
	public void selectionOptionTest() throws Exception {
		
		List<SelectionGmsa> result = new ArrayList<SelectionGmsa>();
		
		PumyigsSel pmys = new PumyigsSel();
		
		//PUMYIGS_SEL Table에서 NUM_SEQ, COD_DC, COD_GMGN을 가지고 선택항목을 가지고 온다.
		List<?> list =  this.reserveDao.findSelectionGmsa(pumyigs);
		
		//선택검사 코드값에 추가옵션 여부 : 1 = 없다, 2이상 = 추가선택검사가 있고 2이상의 값이 추가선택검사에서 선택할 수 있는 갯수을 의미함.
		String optCnt = "";
		//코드값을 담는 변수
		String cdHm = "";
		
		int[] arrange = new int[list.size()];
		
		for (int i = 0; i < list.size(); i++) {
			
			pmys = (PumyigsSel) list.get(i);
			
			//ex) params = 1JJ501JJ511JJ521JJ54
			String params = pmys.getCodHm();
			
			int len = pmys.getCodHm().length()/DIGIT;
			
			for ( int j = 0; j < len; j++ ) {
				if( cdHm == "" ){
					optCnt = params.substring( (j*DIGIT), (j*DIGIT) + 1 );
					cdHm = params.substring( (j*DIGIT) + 1, (j*DIGIT) + DIGIT );
				}else{
					optCnt += "H"+params.substring( (j*DIGIT), (j*DIGIT) + 1 );
					cdHm += "H" + params.substring( (j*DIGIT) + 1, (j*DIGIT) + DIGIT );
				}
			}
			arrange[i] = len;
		}
		
		String[] optionCnt = optCnt.split("H");
		String[] codHm = cdHm.split("H");
		
		//배열에 담긴 선택항목코드를 가지고 HANGMOK Table에서 항목명을 가지고 온다.
		List<?> temp = this.reserveDao.findHangmokByCodDc(codHm);
		int tempIndex = 0;
		
		for (int i = 0; i < arrange.length; i++) {
			for (int j = 0; j < arrange[i]; j++) {
				Hangmok hangmok = (Hangmok) temp.get(tempIndex);
				
				SelectionGmsa selectionGmsa = new SelectionGmsa();
				selectionGmsa.setOptionIndex(""+i);
				selectionGmsa.setOptionCnt(optionCnt[tempIndex]);
				selectionGmsa.setHangmok(hangmok);
				tempIndex++;
				
				System.out.println("=============================================");
				System.out.println(selectionGmsa.getHangmok().getCodHm());
				System.out.println("=============================================");
				result.add(selectionGmsa);
			}
			result.add(null);
			JsonUtil.marshallingJson(result);
		}
	}
	
}
