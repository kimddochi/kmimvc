package kr.or.kmimvc.dao.face.reserve;

import java.util.List;
import java.util.Map;

import kr.or.kmimvc.dto.Pumyi;
import kr.or.kmimvc.dto.Pumyigs;
import kr.or.kmimvc.dto.PumyigsSel;
import kr.or.kmimvc.dto.Reser;
import kr.or.kmimvc.dto.ReserCapa;

public interface ReserveDao {

	public Pumyi findPumyiByCodDcAndDate(Map<String, Object> params);

	public List<?> findPumyigsByCodDcNumSeq(Pumyigs pumyigs);

	public Pumyigs findPossibleJisa(Pumyigs pumyigs);

	public List<?> findSelectionOption(Pumyigs pumyigs);
	
	public List<?> findHangmokByCodDc(String[] codHm);
	
//	public List<?> findPumyigsGmsnItems(Pumyigs pumyigs);
//
//	public Pumyigs findPumyigsOneItem(Pumyigs pumyigs);
//
//	public PumyigsSel findOption(Pumyigs pumyigs);
//
//
//	public List<?> findReserveDate(ReserCapa reserCapa);
//
//	public void save(Reser reser);
//
//	public Reser findReserByConfidenceNum(String confidenceNum);

}
