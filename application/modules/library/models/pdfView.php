<?php
class Library_Model_pdfView{
	public function getPdfList(){
	$db = Zend_Db_Table::getDefaultAdapter();
	$select = new Zend_Db_Select($db);
	$select->from('books');
	$categorys=$select->query()->fetchAll();
	return $categorys;
	}
}