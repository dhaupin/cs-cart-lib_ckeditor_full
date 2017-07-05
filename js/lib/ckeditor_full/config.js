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
    config.extraPlugins = 'autolink,autosave,ckawesome,codemirror,colorbutton,colordialog,embed,embedbase,emojione,find,font,iframe,justify,letterspacing,lineutils,notification,notificationaggregator,qrc,scribens,selectall,sourcedialog,textselection,widget,widgetselection';
    config.removePlugins = 'bidi,div,embed,embedbase,uicolor,showblocks,widget'; // bugs out, not sure why embed + widget causes click error
    
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

    // Styles
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
   config.autosave = {
        delay: 10,
        NotOlderThen: 1440,
        autoLoad: false,
        saveOnDestroy: false,
        messageType: 'statusbar',
        diffType: "sideBySide",
        saveDetectionSelectors: '.cm-submit, input[name="dispatch[addons.update]"], input[name="dispatch[product_options.update]"], input[name="dispatch[product_features.update]"], input[name="dispatch[block_manager.update_block]"]',
        saveKeyPrefix: 'autosave',
        saveKeyIgnoreParams: ['selected_section', 'switch_company_id', 'come_from', ,'cc', ,'ctpl', 'gclid'],
        saveKeyIgnoreProtocol: true,
        saveKeyDelimiter: ' | ',
        saveKeyAttribute: 'name'
    };
    
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
