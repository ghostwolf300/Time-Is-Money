package com.tim.config;

import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.thymeleaf.spring4.SpringTemplateEngine;
import org.thymeleaf.spring4.view.ThymeleafViewResolver;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import nz.net.ultraq.thymeleaf.LayoutDialect;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;

@Configuration
public class MVCConfig extends WebMvcConfigurerAdapter {
	
	@Bean
	@Description("Thymeleaf template resolver serving HTML5")
	public ClassLoaderTemplateResolver templateResolver() {
		
		ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
        
        templateResolver.setPrefix("templates/");
        templateResolver.setCacheable(false);
        templateResolver.setSuffix(".html");        
        templateResolver.setTemplateMode("HTML5");
        templateResolver.setCharacterEncoding("UTF-8");
        
        return templateResolver;
	}
	
	 @Bean
	 @Description("Thymeleaf template engine with Spring integration")
	 public SpringTemplateEngine templateEngine() {
	        
		 SpringTemplateEngine templateEngine = new SpringTemplateEngine();
	     templateEngine.setTemplateResolver(templateResolver());
	     //-----------To use Thymeleaf Layouts------------
	     templateEngine.addDialect(new LayoutDialect());
	     //-----------------------------------------------
	     return templateEngine;
	 }
	 
	 @Bean
	 @Description("Thymeleaf view resolver")
	 public ViewResolver viewResolver() {

		 ThymeleafViewResolver viewResolver = new ThymeleafViewResolver();

		 viewResolver.setTemplateEngine(templateEngine());
		 viewResolver.setCharacterEncoding("UTF-8");

		 return viewResolver;
	 }
	
	@Override
    public void addViewControllers(ViewControllerRegistry registry) {
        //registry.addViewController("/home").setViewName("home");
        registry.addViewController("/").setViewName("login");
        //registry.addViewController("/hello").setViewName("hello");
        registry.addViewController("/login").setViewName("login");
        registry.addViewController("/test").setViewName("test");
        //registry.addViewController("/users/**").setViewName("test");
    }
	
}
