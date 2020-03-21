<?php
class Model_User extends Zend_Db_Table_Abstract{
	protected $_name='users';
	public function insertUser($data){
	$db = Zend_Db_Table::getDefaultAdapter();
	$db->insert($this->_name, $data);
	}
	public function checkUnique($username){
		$select = $this->_db->select()
                            ->from($this->_name,array('username'))
                            ->where('username=?',$username);
        $result = $this->getAdapter()->fetchOne($select);
        if($result){
            return true;
        }else{
        return false;
        }
	}
	public function getUsers($searchTerm){
		$select = $this->select();
        $select->from($this->_name)
        		->where("username LIKE ? AND role <> 'admins'", $searchTerm);
        return $select;
	}
	public function getUser($id){
		$select = $this->select();
        $select->from($this->_name)
        		->where("user_id = ?", $id);
        return $select->query()->fetchAll();
	}
	public function updateUser($data,$id){
	$db = Zend_Db_Table::getDefaultAdapter();
	$db->update($this->_name, $data,'user_id ='.$id);
	}
	public function deleteUser($id){
		$db = Zend_Db_Table::getDefaultAdapter();
		$db->delete('users', 'user_id = '.$id);
	}
}