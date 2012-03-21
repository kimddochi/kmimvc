package kr.or.kmimvc.controller.reserve;

import kr.or.kmimvc.dto.Pumyigs;
import kr.or.kmimvc.dto.Reser;
import kr.or.kmimvc.dto.ReserCapa;
import kr.or.kmimvc.service.face.reserve.ReserveService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import utils.JsonUtil;

@Controller
@RequestMapping(value="/reserve/")
public class ReserveController {

	@Autowired ReserveService reserveService;
	
	/**
	 * 개인예약 index
	 */
	@RequestMapping(value="personalIndex.web", method=RequestMethod.GET)
	public void personalIndex(){
	}
	
	/**
	 * 기본정보를 입력하는 화면.
	 * @param codDc
	 * @param model
	 */
	@RequestMapping(value="personalForm1.web", method=RequestMethod.GET)
	public void personalForm1(@RequestParam(value="codDc") String codDc, Model model){
		model.addAttribute("pumyi", this.reserveService.findNumSeqByCodDc(codDc));
	}
	
	@RequestMapping(value="personalForm2.web", method=RequestMethod.POST)
	public void personalForm2(@ModelAttribute Pumyigs pumyigs,
							  @ModelAttribute Reser reser,
							  Model model){
		model.addAttribute("descGmgn", this.reserveService.findDescGmgnByCodDcNumSeq(pumyigs));
	}
	
	@RequestMapping(value="jsonPossibleJisa.web", method=RequestMethod.GET)
	@ResponseBody
	public String jsonPossibleJisa(@ModelAttribute Pumyigs pumyigs) throws Exception{
		return JsonUtil.marshallingJson(this.reserveService.findPossibleJisa(pumyigs));
	}

	@RequestMapping(value="jsonSelectionGmsa.web", method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<String> jsonSelectionOption(@ModelAttribute Pumyigs pumyigs) throws Exception{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.add("Content-Type", "text/html; charset=UTF-8");
		return new ResponseEntity<String>(JsonUtil.marshallingJson(this.reserveService.findSelectionGmsa(pumyigs)), responseHeaders, HttpStatus.CREATED);
	}
	
//Spring3.0.5버젼에서 @ResopnseBody로 return시 한글깨짐 방지 소스
//http://tedwon.com/pages/viewpage.action?pageId=35061800
	@RequestMapping(value="jsonAdditionGmsa.web", method=RequestMethod.GET)
	public ResponseEntity<String> jsonAdditionGmsa(@ModelAttribute Pumyigs pumyigs) throws Exception{

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.add("Content-Type", "text/html; charset=UTF-8");
        return new ResponseEntity<String>(JsonUtil.marshallingJson(this.reserveService.findAdditionGmsa(pumyigs)), responseHeaders, HttpStatus.CREATED);
	}

//한글깨지는 이슈가 발생...ㅠ,.ㅠ...
//	@RequestMapping(value="jsonAdditionGmsa.web", method=RequestMethod.GET)
//	@ResponseBody
//	public String jsonAdditionGmsa(@ModelAttribute Pumyigs pumyigs) throws Exception{
//		return JsonUtil.marshallingJson(this.reserveService.findAdditionGmsa(pumyigs));
//	}

	@RequestMapping(value="personalForm3.web", method=RequestMethod.POST)
	public void individualFormFour(@ModelAttribute Pumyigs pumyigs, 
								   @ModelAttribute Reser reser){
	}
	
	@RequestMapping(value="jsonReserveDate.web", method=RequestMethod.GET)
	@ResponseBody
	public String jsonReserveDate(@ModelAttribute ReserCapa reserCapa) throws Exception{
		return JsonUtil.marshallingJson(this.reserveService.findReserveDate(reserCapa));
	}
	
	
	
//		model.addAttribute("hangmok", this.reserveService.findOption(pumyigs));
	
//	@RequestMapping(value="individualItemsList.web", method=RequestMethod.POST)
//	public void individualItemsList(@ModelAttribute Pumyigs pumyigs, Model model){
//		model.addAttribute("pumyigsList", reserveService.findPumyigsAllItems(pumyigs));
//	}
//	
//	@RequestMapping(value="individualFormOne.web", method=RequestMethod.POST)
//	public void individualFormOne(@ModelAttribute Pumyigs pumyigs){
//	}
//	
//	@RequestMapping(value="individualFormTwo.web", method=RequestMethod.POST)
//	public void individualFormTwo(@ModelAttribute Pumyigs pumyigs,
//								  @ModelAttribute Reser reser,
//								  Model model){
//		model.addAttribute("pumyigs", this.reserveService.findPumyigsOneItem(pumyigs));
//	}
//	
//	@RequestMapping(value="individualFormThree.web", method=RequestMethod.POST)
//	public void individualFormThree(@ModelAttribute Pumyigs pumyigs,
//									@ModelAttribute Reser reser,
//									Model model){
//		model.addAttribute("hangmok", this.reserveService.findOption(pumyigs));
//	}
//	
//	@RequestMapping(value="individualFormFour.web", method=RequestMethod.POST)
//	public void individualFormFour(@ModelAttribute Pumyigs pumyigs, 
//								   @ModelAttribute Reser reser){
//	}
//	
//	@RequestMapping(value="save.web", method=RequestMethod.POST)
//	public String save(@ModelAttribute Reser reser){
//		
//		//Validation 체크하기
//		
//		this.reserveService.save(reser);
//		
//		return "redirect:reservationConfirm.web?confidenceNum="+reser.getConfidenceNum();
//	}
//	
//	@RequestMapping(value="reservationConfirm.web", method=RequestMethod.GET)
//	@ResponseBody
//	public String reservationConfirm(@RequestParam("confidenceNum") String confidenceNum, Model model) throws Exception{
//		return JsonUtil.marshallingJson(this.reserveService.findReservationConfirm(confidenceNum));
//	}
	
}