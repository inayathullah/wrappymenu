(function () {
    var module;

    module = angular.module('wrappy.pushmenu', ['ngAnimate', 'wrappy.components']);

    module.directive('wrappyMenu', [
    'wrappyOptions', 'wrappyUtils',
        function (wrappyOptions, wrappyUtils) {
            return {
                scope: {
                    menu: '=',
                    options: '=',
                    payloadReady: '=payloadReady',
                    elementHeight: '=elementHeight',
                    enableScroll:'='
                },
                controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

                    var options, width;
                    $scope.options = options = angular.extend(wrappyOptions, $scope.options);
                    $scope.level = 0;
                    $scope.visible = true;
                    $scope.payloadReady=$scope.payloadReady;
                    width = options.menuWidth || 265;
                    $scope.$watch('menu', function (newVal, oldvalue) {
                        if (newVal != undefined && newVal !== oldvalue) {
                            $element.find('nav').width(width + options.overlapWidth * wrappyUtils.DepthOf($scope.menu));
                        }
                    });

                    this.GetBaseWidth = function () {
                        return width;
                    };
                    this.GetOptions = function () {
                        return options;
                    };
        }],
                templateUrl: '/src/partials/MainMenu.html',
                restrict: 'E',
                replace: true
            };
    }
  ]);

    module.directive('wrappySubmenu', [
    '$animate', 'wrappyUtils',
        function ($animate, wrappyUtils) {
            return {
                scope: {
                    menu: '=',
                    level: '=',
                    visible: '=',
                    payloadReady: '=payloadReady',
                    elementHeight: '=elementHeight',
                    enableScroll:'='
                },
                link: function (scope, element, attr, ctrl) {
                    var collapse, marginCollapsed, onOpen, options;
                    scope.helpTexFromServer=scope.helpText;
                    scope.options = options = ctrl.GetOptions();
                    scope.childrenLevel = scope.level + 1;
                    if (scope.elementHeight == undefined || scope.elementHeight == ''){
                        scope.elementHeight=element.height();
                    }


                    onOpen = function () {
                        element.width(ctrl.GetBaseWidth());

                        if (!scope.collapsed) {
                            scope.inactive = false;
                        }

                        if (scope.enableScroll){

                            element.css({'height':scope.elementHeight,'overflow-y':'scroll', '-webkit-overflow-scrolling' : 'touch'});
                        }else{
                            element.css({'overflow-y':'hidden'});
                        }
                        scope.$emit('submenuOpened', scope.level);
                    };
                    if (scope.level === 0) {
                        scope.collasped = false;
                        marginCollapsed = options.overlapWidth - ctrl.GetBaseWidth();
                        if (options.collapsed) {
                            scope.collapsed = true;
                            scope.inactive = true;
                            element.css({
                                marginLeft: marginCollapsed
                            });
                        }
                        collapse = function () {
                            var animatePromise;
                            scope.collapsed = !scope.collapsed;
                            scope.inactive = scope.collapsed;
                            if (scope.collapsed) {
                                options.onCollapseMenuStart();
                            } else {
                                options.onExpandMenuStart();
                            }
                            animatePromise = $animate.addClass(element, 'slide', {
                                fromMargin: scope.collapsed ? 0 : marginCollapsed,
                                toMargin: scope.collapsed ? marginCollapsed : 0
                            });
                            animatePromise.then(function () {
                                if (scope.collapsed) {
                                    return options.onCollapseMenuEnd();
                                } else {
                                    return options.onExpandMenuEnd();
                                }
                            return;
                            });
                            wrappyUtils.PushContainers(options.containersToPush, scope.collapsed ? marginCollapsed : 0);
                        };
                    }
                    scope.openMenu = function (event, menu) {
                        wrappyUtils.StopEventPropagation(event);
                        scope.$broadcast('menuOpened', scope.level);
                        options.onTitleItemClick(event, menu);
                        if (scope.level === 0 && !scope.inactive || scope.collapsed) {
                            collapse();
                        } else {
                            onOpen();
                        }
                    };
                    scope.onSubmenuClicked = function (item, $event) {

                        if (item.menu) {
                            item.isActive=false;
                            item.visible = true;
                            scope.inactive = true;
                            options.onGroupItemClick($event, item);
                        } else {
                            scope.resetActiveMenu(scope.menu);
                            item.isActive=true;
                            options.onItemClick($event, item);
                        }
                    };
                    scope.goBack = function (event, menu) {
                        options.onBackItemClick(event, menu);
                        scope.visible = false;
                        element.css({'overflow-y': 'hidden'});
                        scope.enableScroll=false;
                        return scope.$emit('submenuClosed', scope.level);

                    };

                    scope.contentItemClicked = function (clickedItemEvent, args) {
                        return scope.$emit(clickedItemEvent, args);
                    };

                    scope.resetActiveMenu = function(menu){
                        for (var i=0; i< menu.items.length; i++){
                            menu.items[i].isActive=false;
                        }
                    };
                    scope.$watch('visible', (function (_this) {
                        return function (visible) {
                            var animatePromise;
                            if (visible) {
                                if (scope.level > 0) {
                                    options.onExpandMenuStart();
                                    animatePromise = $animate.addClass(element, 'slide', {
                                        fromMargin: -ctrl.GetBaseWidth(),
                                        toMargin: 0
                                    });
                                    animatePromise.then(function () {
                                        options.onExpandMenuEnd();
                                    });
                                }
                                onOpen();
                            }
                        };
                    })(this));
                    scope.$on('submenuOpened', (function (_this) {
                        return function (event, level) {
                            var correction, correctionWidth;
                            correction = level - scope.level;
                            correctionWidth = options.overlapWidth * correction;
                            element.width(ctrl.GetBaseWidth() + correctionWidth);
                            if (scope.level === 0) {
                                wrappyUtils.PushContainers(options.containersToPush, correctionWidth);
                            }
                            if (scope.childrenLevel ===3){
                                scope.addScroll=true;
                            }
                        };
                    })(this));
                    scope.$on('submenuClosed', (function (_this) {
                        return function (event, level) {
                            if (level - scope.level === 1) {
                                scope.enableScroll=false;
                                onOpen();
                                wrappyUtils.StopEventPropagation(event);
                            }
                        };
                    })(this));
                    scope.$on('menuOpened', (function (_this) {
                        return function (event, level) {
                            if (scope.level - level > 0) {
                                scope.visible = false;
                            }
                        };
                    })(this));
                },
                templateUrl: '/src/partials/SubMenu.html',
                require: '^wrappyMenu',
                restrict: 'EA',
                replace: true
            };
    }
  ]);

    module.factory('wrappyUtils', function () {
        var DepthOf, PushContainers, StopEventPropagation;
        StopEventPropagation = function (e) {
            if (e.stopPropagation && e.preventDefault) {
                e.stopPropagation();
                e.preventDefault();
            } else {
                e.cancelBubble = true;
                e.returnValue = false;
            }
        };
        DepthOf = function (menu) {
            var start = new Date().getTime();
            var depth, item, maxDepth, _i, _len, _ref;
            maxDepth = 0;
            if (menu !== undefined) {
                if (menu.items) {
                    _ref = menu.items;
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        item = _ref[_i];
                        if (item.menu) {
                            depth = DepthOf(item.menu) + 1;
                        }
                        if (depth > maxDepth) {
                            maxDepth = depth;
                        }
                    }
                }
            }
            return maxDepth;
        };
        PushContainers = function (containersToPush, absoluteDistance) {
            if (!containersToPush) {
                return;
            }
            return $.each(containersToPush, function () {
                return $(this).stop().animate({
                    marginLeft: absoluteDistance
                });
            });
        };
        return {
            StopEventPropagation: StopEventPropagation,
            DepthOf: DepthOf,
            PushContainers: PushContainers
        };
    });

    module.animation('.slide', function () {
        return {
            addClass: function (element, className, onAnimationCompleted, options) {
                element.removeClass('slide');
                element.css({
                    marginLeft: options.fromMargin + 'px'
                });
                element.animate({
                    marginLeft: options.toMargin + 'px'
                }, onAnimationCompleted);
            }
        };
    });

    module.value('wrappyOptions', {
        containersToPush: null,
        wrapperClass: 'wrappymenu_wrapper',
        menuInactiveClass: 'wrappymenu_inactive',
        menuWidth: 0,
        menuHeight: 0,
        collapsed: false,
        fullCollapse: true,
        direction: 'ltr',
        backText: 'Back',
        backItemClass: 'backItemClass',
        backItemIcon: 'fa icon-left-open',
        groupIcon: 'fa icon-right-open',
        mode: 'overlap',
        overlapWidth: 40,
        preventItemClick: true,
        preventGroupItemClick: true,
        swipe: 'both',
        enableScrollLevel:null,
        onCollapseMenuStart: function () {},
        onCollapseMenuEnd: function () {},
        onExpandMenuStart: function () {},
        onExpandMenuEnd: function () {},
        onGroupItemClick: function () {},
        onItemClick: function () {},
        onTitleItemClick: function () {},
        onBackItemClick: function () {},
        onMenuReady: function () {}
    });

}).call(this);

(function () {
    var module;

    module = angular.module('wrappy.components', []);

    module.directive('recursive', [
    '$compile',
        function ($compile) {
            return {
                restrict: 'EACM',
                priority: 900000,
                compile: function (tElement, tAttr) {
                    var compiledContents, contents;
                    contents = tElement.contents().remove();
                    compiledContents = null;
                    return function (scope, iElement, iAttr) {
                        if (!compiledContents) {
                            compiledContents = $compile(contents);
                        }
                        compiledContents(scope, function (clone, scope) {
                            return iElement.append(clone);
                        });
                    };
                }
            };
    }
  ]);

}).call(this);
