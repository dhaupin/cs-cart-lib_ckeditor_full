<?php

use Tygh\Registry;

if(!defined('BOOTSTRAP')) {die('Access denied');}

function fn_lib_ckeditor_full_uninstall() {
	if (is_file(DIR_ROOT . '/js/lib/ckeditor_full/config.js')) {
		rename(DIR_ROOT . '/js/lib/ckeditor_full', DIR_ROOT . '/js/lib/ckeditor_full.uninstalled.bak');
	}
	if (is_file(DIR_ROOT . '/js/tygh/editors/ckeditor_full.editor.js')) {
		rename(DIR_ROOT . '/js/tygh/editors/ckeditor_full.editor.js', DIR_ROOT . '/js/tygh/editors/ckeditor_full.editor.js.uninstalled.bak');
	}
}

function fn_lib_ckeditor_full_install() {
	if (is_file(DIR_ROOT . '/js/lib/ckeditor_full.uninstalled.bak/config.js')) {
		rename(DIR_ROOT . '/js/lib/ckeditor_full.uninstalled.bak', DIR_ROOT . '/js/lib/ckeditor_full');
	}
	if (is_file(DIR_ROOT . '/js/tygh/editors/ckeditor_full.editor.js.uninstalled.bak')) {
		rename(DIR_ROOT . '/js/tygh/editors/ckeditor_full.editor.js.uninstalled.bak', DIR_ROOT . '/js/tygh/editors/ckeditor_full.editor.js');
	}
}