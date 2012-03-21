package reservation;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import java.util.ArrayList;
import java.util.List;

import kr.or.kmimvc.dao.face.reserve.ReserveDao;
import kr.or.kmimvc.dto.Hangmok;
import kr.or.kmimvc.dto.PumyiSuga;
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
public class AdditionGmsaTest {
	
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
	public void additionOptionTest() throws Exception {
		
		List<?> list = this.reserveDao.findAdditionGmsa(pumyigs);
		
		
		
//		for (int i = 0; i < list.size(); i++) {
//			PumyiSuga pumyiSuga = (PumyiSuga)list.get(i);
//			System.out.println("getDescKor() => "+pumyiSuga.getDescKor());
//			System.out.println("getDescEng() => "+pumyiSuga.getDescEng());
//		}
		
	}
	
}
