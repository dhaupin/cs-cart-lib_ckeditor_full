/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

 
// Allow empty tags
$.each(CKEDITOR.dtd.$removeEmpty, function (i, value) {
	CKEDITOR.dtd.$removeEmpty[i] = false;
});

// Begin Configs
CKEDITOR.editorConfig = function(config) {
	
	// Toolbars for this package from sample at admin/view/javascript/ckeditor/samples/plugins/toolbar/toolbar.html
	config.toolbar = [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source', '-', 'autoFormat', 'CommentSelectedRange', 'UncommentSelectedRange', 'AutoComplete' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Undo', 'Redo', '-', 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', 'SelectAll' ] },
		{ name: 'editing', groups: [ 'find', 'selection' ], items: [ 'Find', 'Replace' ] },
		//'/',
		{ name: 'insert', items: [ 'Image', 'Embed', 'ckawesome', 'Emojione', 'SpecialChar', 'qrc', 'Table', 'HorizontalRule', 'CreateDiv', 'Iframe', 'ShowBlocks' ] },
		{ name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align' ], items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
		//'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', 'BidiLtr', 'BidiRtl'/*, 'RemoveFormat'*/ ] },
		{ name: 'colors', items: [ 'TextColor', 'BGColor' ] },
		{ name: 'styles', items: [ 'Format', 'Font', 'FontSize', 'letterspacing' ] },
		{ name: 'tools', items: [ 'UIColor', 'Scayt', 'Scribens', 'Maximize' ] }
	];

	// Load Plugins
	config.extraPlugins = 'autolink,autosave,bidi,ckawesome,codemirror,colorbutton,colordialog,div,embed,embedbase,emojione,find,font,iframe,justify,letterspacing,lineutils,notification,notificationaggregator,qrc,scribens,selectall,showblocks,sourcedialog,textselection,uicolor,widget,widgetselection,plugin_wrapper';
	config.removePlugins = 'bidi,div,uicolor,showblocks'; // bugs out
	
	// Interface
	//config.removeDialogTabs = 'image:advanced;link:advanced';
	config.removeButtons = 'BidiLtr,BidiRtl,CreateDiv,UIColor,Font,ShowBlocks';
	config.toolbarCanCollapse = true;

	// Content
	//config.allowedContent = true; /* use this to shut off ACF */
	config.extraAllowedContent = 'a article aside audio b blockquote br button canvas cite code col colgroup dd details dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hr i iframe img input keygen label legend li link main mark menu menuitem meta meter nav noscript object ol optgroup option output p param pre progress s script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time tr track u ul video wbr(*)[*]{*};';
	config.disallowedContent = 'img[width,height]{width,height};';
	
	config.htmlEncodeOutput = false;
	config.entities = false;
	//config.enterMode = CKEDITOR.ENTER_P;
	//config.shiftEnterMode = CKEDITOR.ENTER_BR;
	//config.fontSize_defaultLabel = '84%';
	config.forcePasteAsPlainText = true;
	config.pasteFromWordPromptCleanup = true;
	config.pasteFromWordRemoveFontStyles = true;
	config.pasteFromWordRemoveStyles = true;
	config.ignoreEmptyParagraph = true;
	config.removeFormatAttributes = true;

	// Stylezzz
	//config.skin = 'moonocolor';
	config.uiColor = '#f5f5f5';
	config.dialog_backgroundCoverColor = '#000000';
	config.dialog_backgroundCoverOpacity = 0.5;
	config.height = '340px';
	config.width = 'auto';
	config.filebrowserWindowWidth = '80%';
	config.filebrowserWindowHeight = '70%';
	
	// Scayt
	config.scayt_autoStartup = true;

	// Fontawesome
	//config.contentsCss = '//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
	config.fontawesomePath = '//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
	
	// Autosave
	config.autosave = {};
	
	// Codemirror
	config.codemirror = {
		autoCloseBrackets: false,
		autoCloseTags: false,
		//autoFormatOnStart: true,
		//useBeautify: false,
		lineNumbers: true,
		lineWrapping: true,
		showAutoCompleteButton: true,
		theme: 'default'
	};
};


CKEDITOR.plugins.add('plugin_wrapper', {
	init: function (editor) {
		var trimmed_url = window.location.href,
			ignore_querystrings = [
			'selected_section',
			'switch_company_id'
			]

		$(ignore_querystrings).each(function() { 
			trimmed_url = fn_removeUrlParam(this, null, trimmed_url);
		});
		
		var autosaveConfig = {
			saveDetectionSelectors: '.cm-submit',
			SaveKey: 'autosave | ' + trimmed_url + ' | ' + $('#' + editor.name).attr('name')
		}
		
		CKEDITOR.tools.extend(editor.config.autosave || {}, autosaveConfig, true);
	}
});

// Querystring mitigator - Quick and dirty paste
// From - https://stackoverflow.com/a/11654436/2418655
function fn_removeUrlParam(key, value, url) {
	if (!url) url = window.location.href;
	var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
		hash;

	if (re.test(url)) {
		if (typeof value !== 'undefined' && value !== null) {
			return url.replace(re, '$1' + key + "=" + value + '$2$3');
		} else {
			hash = url.split('#');
			url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
			if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
				url += '#' + hash[1];
			}
			return url;
		}
	} else {
		if (typeof value !== 'undefined' && value !== null) {
			var separator = url.indexOf('?') !== -1 ? '&' : '?';
			hash = url.split('#');
			url = hash[0] + separator + key + '=' + value;
			if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
				url += '#' + hash[1];
			}
			return url;
		} else {
			return url;
		}
	}
}