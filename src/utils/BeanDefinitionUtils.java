package utils;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.support.GenericApplicationContext;

public class BeanDefinitionUtils {

	public static void printBeanDefinitions(GenericApplicationContext cwax){
		List<List<String>> roleBeanInfos = new ArrayList<List<String>>();
		roleBeanInfos.add(new ArrayList<String>());
		roleBeanInfos.add(new ArrayList<String>());
		roleBeanInfos.add(new ArrayList<String>());
		
		for(String name : cwax.getBeanDefinitionNames()){
			int role = cwax.getBeanDefinition(name).getRole();
			List<String> beanInfos = roleBeanInfos.get(role);
			beanInfos.add("[" + role + "]["+ name + "][" + cwax.getBean(name) +"]");
		}
		
		for(List<String> beanInfos : roleBeanInfos){
			for(String beanInfo : beanInfos){
				System.out.println(beanInfo);
			}
		}
	}
}
