# Angular Multi Level Menu (wrappymenu)

A dynamic light weight multi level menu which supports

- Load menu dynamically from JSON payload
- Control each element thru JSON with icon, text, submenu and number of level.
- Support n level mix and match menu. One menu can have 3 submenu, and another menu can have 2 submenu etc.,  
- Highlights active focused sub menu.
- Highlights active focused main menu.
- Complete reusable Angular Directive
- Supports individual menu item click handler (subscribe:contentItemClicked, bubbles the event from clicked menu to subscribed angular controller.)
    This event will wrap the content of the menu item clicked. Helpfull to wrap items inside each menu item.
- Complete Customizable fontastic.me icons.

##How to use:

- Download src folder from this project (wrappymenu.js,wrappymenu.css,fontastic font folder).
- Include reference of these files.
- Create new angular directive as below
- ```<wrappy-menu menu="menu" options="options" payload-ready="loading" enable-scroll="enableScroll"></wrappy-menu>```
- Load the module angular.module('wrappydemo',['wrappy.pushmenu','ngAnimate']);
- Thats it!
- Menu is ready for render.
- Populate menu either Javascript Array or JSON payload as per payload.js for your reference.
- Refer app.js for configuration and payload processing.
- Your menu is ready!
- Dynamically change the payload based on requirement. On demand can load subitems as another JSON payload and menu will render according to the new payload.

##Supported Events
    - onCollapseMenuStart
    - onCollapseMenuEnd
    - onExpandMenuStart
    - onExpandMenuEnd
    - onGroupItemClick
    - onItemClick
    - onTitleItemClick
    - onBackItemClick
    - onMenuReady
    - contentItemClicked
    
Snapshots

![menu-1](https://raw.githubusercontent.com/inayathullah/wrappymenu/master/screenshot-1.png)
![menu-2](https://raw.githubusercontent.com/inayathullah/wrappymenu/master/screenshot-2.png)

Inspired from this repository 
https://github.com/wuxiaoying/angular-multilevelpushmenu