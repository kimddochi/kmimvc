package kr.or.kmimvc.controller.editor;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value="/editor/")
public class EditorController {

	@RequestMapping(value="form.web")
	public void form(){
	}
	
}
