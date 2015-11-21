# Angular Multi Level Menu (wrappymenu)

A dynamic light weight multi level menu which supports

- Load menu dynamically from JSON payload
- Control each element thru JSON like icon, text, submenu, number of level
- Support N-level mix and match menus like, multi level mix and match
- Indicates Active Sub Menu
- Indicated Active Main Menu
- Complete reusable Angular Directive
- Support Individual Menu Content Click Handling (subscribe:contentItemClicked)
    This event will wrap the content of the menu item clicked. Helpfull to wrap items inside each menu item.
- Complete Customizable fontastic.me icons.

##How to use:

- Download the wrappymenu.js and wrappymenu.css
- Include the reference of the both files.
- Include below directive
- '''<wrappy-menu menu="menu" options="options" payload-ready="loading" enable-scroll="enableScroll"></wrappy-menu>'''
- Load the module angular.module('wrappydemo',['wrappy.pushmenu','ngAnimate']);
- Thats it!
- Menu is ready to render
- Load the menu items as per payload.js
- Call the menu items as app.js
- Your menu is ready!
- Dynamically change the payload based on requirement. On demand can load subitems as another JSON payload and menu will render according to the new payload.


