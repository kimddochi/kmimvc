package kr.or.kmimvc.service.impl.reserve;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import kr.or.kmimvc.dao.face.reserve.ReserveDao;
import kr.or.kmimvc.dto.Hangmok;
import kr.or.kmimvc.dto.Pumyi;
import kr.or.kmimvc.dto.Pumyigs;
import kr.or.kmimvc.dto.PumyigsSel;
import kr.or.kmimvc.dto.SelectionGmsa;
import kr.or.kmimvc.service.face.reserve.ReserveService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import utils.DateTime;
import utils.JsonUtil;

/**
 * @author kimddochi
 *
 */
@Service
public class ReserveServiceImpl implements ReserveService{

	final static int DIGIT = 5;
	
	@Autowired ReserveDao reserveDao;

	
	/* (non-Javadoc)
	 * @see kr.or.kmimvc.service.face.reserve.ReserveService#findNumSeqByCodDc(java.lang.String)
	 * 단체코드가 없을 경우 Exception처리하기
	 */
	public Pumyi findNumSeqByCodDc(String codDc) {
		Map<String, Object> params = new HashMap<String, Object>();
		
		params.put("codDc", codDc);
		params.put("date", DateTime.getShortDateString());
		
		//품의테이블에서 단체코드와 오늘날짜를 기준으로 해당되는 품의 항목의 codDc, numSeq를 조회해온다.
		return this.reserveDao.findPumyiByCodDcAndDate(params);
	}

	
	public List<?> findDescGmgnByCodDcNumSeq(Pumyigs pumyigs) {
		
		List<?> list = new ArrayList<Object>();
		
		list = this.reserveDao.findPumyigsByCodDcNumSeq(pumyigs);
		return list;
	}

	public Pumyigs findPossibleJisa(Pumyigs pumyigs) {
		
		Pumyigs pmy = this.reserveDao.findPossibleJisa(pumyigs);

		pmy.setYn11(Pumyigs.ableYN(pmy.getFloor11()));
		pmy.setYn12(Pumyigs.ableYN(pmy.getFloor12()));
		pmy.setYn15(Pumyigs.ableYN(pmy.getFloor15()));
		pmy.setYn43(Pumyigs.ableYN(pmy.getFloor43()));
		pmy.setYn51(Pumyigs.ableYN(pmy.getFloor51()));
		pmy.setYn61(Pumyigs.ableYN(pmy.getFloor61()));
		pmy.setYn71(Pumyigs.ableYN(pmy.getFloor71()));
		
		return pmy;
	}


	public List<?> findSelectionOption(Pumyigs pumyigs) {
		
		List<SelectionGmsa> result = new ArrayList<SelectionGmsa>();
		
		PumyigsSel pmys = new PumyigsSel();
		
		//PUMYIGS_SEL Table에서 NUM_SEQ, COD_DC, COD_GMGN을 가지고 선택항목을 가지고 온다.
		List<?> list =  this.reserveDao.findSelectionOption(pumyigs);
		
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
				selectionGmsa.setOptionIndex(""+(i+1));
				selectionGmsa.setOptionCnt(optionCnt[tempIndex]);
				selectionGmsa.setHangmok(hangmok);
				tempIndex++;
				
				result.add(selectionGmsa);
			}
		}

		return result;
	}
	
//	public List<?> findSelectionOption(Pumyigs pumyigs) {
//
//		List<?> list = new ArrayList<Object>();
//		List result = new ArrayList();
//		PumyigsSel pmys = new PumyigsSel();
//		
//		//PUMYIGS_SEL에서 NUM_SEQ, COD_DC, COD_GMGN을 가지고 선택항목을 가지고 온다.
//		list =  this.reserveDao.findSelectionOption(pumyigs);
//		
//		String str = "";
//		
//		for (int i = 0; i < list.size(); i++) {
//			pmys = (PumyigsSel) list.get(i);
//			
//			String params = pmys.getCodHm();
//			int temp = pmys.getCodHm().length()/DIGIT;
//			for ( int j = 0; j < temp; j++ ) {
//				if( str == "" ) str = params.substring( (j*DIGIT) + 1, (j*DIGIT) + DIGIT );
//				else str += "H" + params.substring( (j*DIGIT) + 1, (j*DIGIT) + DIGIT );
//			}
//		}
//		
//		String[] codHm = str.split("H");
//		
//		//배열에 담긴 선택항목코드를 가지고 HANGMOK에서 항목명을 가지고 온다.
//		result = this.reserveDao.findHangmokByCodDc(codHm);
//		
//		//선택항목을 선택일련번호에 따라 나누어 담는다. 화면단에서 이중for문 처리를 java단에서 처리한다.
//		
//		
//		return result;
//	}

//	public List<?> findPumyigsGmsnItems(Pumyigs pumyigs) {
//		return this.reserveDao.findPumyigsGmsnItems(pumyigs);
//	}
//	
//	public List<?> findPumyigsAllItems(Pumyigs pumyigs) {
//		return this.reserveDao.findPumyigsAllItems(pumyigs);
//	}
//	
//	public Pumyigs findPumyigsOneItem(Pumyigs pumyigs) {
//		return this.reserveDao.findPumyigsOneItem(pumyigs);
//	}
//
//	public List<?> findOption(Pumyigs pumyigs) {
//		
//		//PUMYIGS_SEL에서 NUM_SEQ, COD_DC, COD_GMGN을 가지고 선택항목을 가지고 온다.
//		PumyigsSel pmys = this.reserveDao.findOption(pumyigs);
//		
//		//선택항목을 5자리씩 짤라서 배열에 담는다.
//		String params = pmys.getCodHm();
//		int len = pmys.getCodHm().length()/DIGIT;
//		String[] codHm = new String[len];
//		
//		System.out.println("["+params+"]");
//		for(int i=0; i<len; i++){
//			codHm[i] = params.substring(i*DIGIT+1, i*DIGIT+DIGIT);
//			System.out.println("["+i+"]["+codHm[i]+"]");
//		}
//		
//		//배열에 담긴 선택항목코드를 가지고 HANGMOK에서 항목명을 가지고 온다.
//		List<?> list = this.reserveDao.findHangmokByCodDc(codHm);
//		
//		return list;
//	}
//
//	public List<?> findReserveDate(ReserCapa reserCapa) {
//		return this.reserveDao.findReserveDate(reserCapa);
//	}
//
//	public void save(Reser reser) {
//		this.reserveDao.save(reser);
//	}
//
//	public Reser findReservationConfirm(String confidenceNum) {
//		return this.reserveDao.findReserByConfidenceNum(confidenceNum);
//	}

}
