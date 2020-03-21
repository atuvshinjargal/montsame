<?php
class Model_LibraryAcl extends Zend_Acl
{
    public function __construct ()
    {
        $this->addRole(new Zend_Acl_Role('guests'));
        $this->addRole(new Zend_Acl_Role('users'), 'guests');
        $this->addRole(new Zend_Acl_Role('admins'), 'users');
        $this->add(new Zend_Acl_Resource('library'))->add(
        new Zend_Acl_Resource('library:books'), 'library')
        ->add(
        new Zend_Acl_Resource('library:Languageswitch'), 'library');
        $this->addResource(new Zend_Acl_Resource('admin'))->add(
        new Zend_Acl_Resource('admin:book'), 'admin')->add(
        new Zend_Acl_Resource('admin:users'), 'admin');
        $this->addResource(new Zend_Acl_Resource('default'))
            ->add(new Zend_Acl_Resource('default:autentication'), 
        'default')
            ->add(new Zend_Acl_Resource('default:index'), 'default')
            ->add(new Zend_Acl_Resource('default:error'), 'default');
            
        $this->allow('guests', 'default:index', array('index','process'));  
        $this->allow('guests', 'library:books', 'list');   
        $this->allow('guests', 'default:autentication', 'signup');
        $this->allow('guests', 'default:autentication', 'login');
        $this->allow('guests', 'default:autentication', 'refresh');
        $this->allow('guests', 'default:error', 'error');
        $this->allow('guests', 'library:Languageswitch', 'switch');
        $this->deny('users', 'default:autentication', 'signup');
        $this->deny('users', 'default:autentication', 'login');
        $this->allow('users', 'default:index', array('index','pay','mypay'));
        $this->allow('users', 'default:autentication', 'logout');
        $this->allow('users', 'library:books', array('index', 'list','view'));
        $this->deny('admins', 'default:index', array('pay','mypay'));
        $this->allow('admins', 'admin:users',array('index', 'list','pay','delete','edit','payment','statistics'));
        $this->allow('admins', 'admin:book', 
        array('index', 'add', 'edit', 'delete'));
    }
}