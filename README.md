## Updated & Extended CKEditor for CS-Cart
Adds an updated and extended CKEditor for use in CS-Cart admin and storefront. Includes extra plugins such as autosave, codemirror, fontawesome, & more. This addon is still under development regarding things like autosave latest branch additions and certain content filter tweaks. Submit an issue if you run into anything funky, but no guarantees I will get to solving it if its a fringe case of content filtering.


## Installing
This repo is still a work in progress and therefore not currently packaged as releases. To install into CS-Cart, first download the repo and extract. Add the `app` and `js` folders to a new zip file called `lib_ckeditor_full.zip`. In CS-Cart admin, nav to "Add-ons > Manage Add-ons" and add the zip to install. To activate CKEditor Full nav to "Settings > Appearance > Default wysiwyg editor" and choose CKEditor Full.

## Configuration
Unlike the default CKEditor, this addon does *not* use `/js/tygh/editors/ckeditor_full.editor.js` for its settings/configuration. Sure you can bootstrap CK params there if you prefer, but all CK configurations for this addon are found at `/js/lib/ckeditor_full/config.js`.
