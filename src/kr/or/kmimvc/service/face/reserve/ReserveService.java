package kr.or.kmimvc.service.face.reserve;

import java.util.List;
import java.util.Map;

import kr.or.kmimvc.dto.Pumyi;
import kr.or.kmimvc.dto.Pumyigs;

public interface ReserveService {

	public Pumyi findNumSeqByCodDc(String codDc);
	
	public List<?> findDescGmgnByCodDcNumSeq(Pumyigs pumyigs);

	public Pumyigs findPossibleJisa(Pumyigs pumyigs);

	public Object findSelectionOption(Pumyigs pumyigs);

//	public List<?> findPumyigsGmsnItems(Pumyigs pumyigs);
//
//	public boolean findPeriodYn(String codDc);
//
//	public Pumyigs findPumyigsOneItem(Pumyigs pumyigs);
//
//	public List<?> findOption(Pumyigs pumyigs);
//
//	public List<?> findReserveDate(ReserCapa reserCapa);
//	
//	public void save(Reser reser);
//
//	public Reser findReservationConfirm(String confidenceNum);

}
