<?php
class Library_Bootstrap extends Zend_Application_Module_Bootstrap{
	function _initSetTranslations (){
		$bootstrap = $this->getApplication();
		$layout= $bootstrap->getResource('layout');
		$view = $layout->getView();
		
		$translate= new Zend_Translate('gettext',
										APPLICATION_PATH.'/languages',
										null,
										array('scan'=>Zend_Translate::LOCALE_FILENAME));
		
		$session = new Zend_Session_Namespace('zftutorial');																
		$locale=new Zend_Locale();
		if (isset($session->language)){
			$reqlan=$session->language;
		}else {
		$locale->setLocale(Zend_Locale::BROWSER);
		$reqlan=key($locale->getBrowser());
		}
		if (in_array($reqlan,$translate->getList())){
			$language=$reqlan;
		}else {
			$language='en';
		}
		Zend_Registry::set('locale',$language);
		$view->language=$language;
		$translate->setLocale($language);
		$view->translate=$translate;
	}
	
}