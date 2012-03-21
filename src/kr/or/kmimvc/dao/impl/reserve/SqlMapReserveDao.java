package kr.or.kmimvc.dao.impl.reserve;

import java.util.List;
import java.util.Map;

import kr.or.kmimvc.dao.face.reserve.ReserveDao;
import kr.or.kmimvc.dto.Pumyi;
import kr.or.kmimvc.dto.Pumyigs;
import kr.or.kmimvc.dto.PumyigsSel;
import kr.or.kmimvc.dto.Reser;
import kr.or.kmimvc.dto.ReserCapa;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Repository;

@Repository
public class SqlMapReserveDao extends SqlSessionDaoSupport implements ReserveDao {
	
	public Pumyi findPumyiByCodDcAndDate(Map<String, Object> params) {
		return (Pumyi)getSqlSession().selectOne("pumyi.getPumyiByCodDcAndDate", params);
	}
	
	public List<?> findPumyigsByCodDcNumSeq(Pumyigs pumyigs) {
		return getSqlSession().selectList("pumyigs.getPumyigsByCodDcNumSeq", pumyigs);
	}
	
	public Pumyigs findPossibleJisa(Pumyigs pumyigs) {
		return (Pumyigs)getSqlSession().selectOne("pumyigs.getPossibleJisa", pumyigs);
	}

	public List<?> findSelectionGmsa(Pumyigs pumyigs) {
		return getSqlSession().selectList("pumyigs_sel.getSelectionGmsa", pumyigs);
	}

	public List<?> findHangmokByCodDc(String[] codHm) {
		return getSqlSession().selectList("hangmok.getHanmokByCodDcCollection", codHm);
	}

	public List<?> findAdditionGmsa(Pumyigs pumyigs) {
		return getSqlSession().selectList("pumyi_suga.getAdditionGmsa", pumyigs);
	}

	public List<?> findReserveDate(ReserCapa reserCapa) {
		return getSqlSession().selectList("reser_capa.getReserveDate", reserCapa);
	}

//	public List<?> findPumyigsGmsnItems(Pumyigs pumyigs) {
//		return getSqlSession().selectList("pumyigs.getPumyigsGmsnItems", pumyigs);
//	}
	
//	public Pumyigs findPumyigsOneItem(Pumyigs pumyigs) {
//		return (Pumyigs)getSqlSession().selectOne("pumyigs.getPumyigsOneItem", pumyigs);
//	}
//
//	public PumyigsSel findOption(Pumyigs pumyigs) {
//		return (PumyigsSel)getSqlSession().selectOne("pumyigs_sel.getOption", pumyigs);
//	}
//
//	public void save(Reser reser) {
//		getSqlSession().insert("reser.save", reser);
//	}
//
//	public Reser findReserByConfidenceNum(String confidenceNum) {
//		return (Reser)getSqlSession().selectOne("reser.getReservationConfirmation", confidenceNum);
//	}

}
