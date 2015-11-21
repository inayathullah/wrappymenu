angular.module('wrappydemo',['wrappy.pushmenu','ngAnimate']);

angular
    .module('wrappydemo')
    .controller('mainController',mainController);

mainController.$injector = ["$scope","payloadService"]
function mainController($scope,payloadService){

    loadData();

    $scope.options={
        onGroupItemClick:menuClicked
    }

    function menuClicked(event,args){
        if (args.enableScroll != undefined && args.enableScroll == true){
            $scope.enableScroll=true;
        }else{
            $scope.enableScroll=false;
        }
    }

    function loadData(){

        var service=payloadService.loadData;

        service().then(function(response){
            $scope.menu=constructMenu(response);;
        });
    }

    function constructMenu(payload){

        var menu={
            title: 'All Categories',
            id: 'menuId',
            icon: 'fa icon-align-justify'
        };
        var sections=payload.sections;
        menu.items=buildSubmenu(payload.sections);
        return menu;
    }

    function buildSubmenu(items){
        var menu=[];
        for (var i=0; i < items.length; i++){

            var item={
                name: items[i].title,
                id: 'itemId',
                icon: 'fa ' +items[i].icon,
                link: '#',
                enableScroll: items[i].enablescroll,
            }
            if (items[i].items != undefined && items[i].items.length>0){
                var subItem={
                    title: items[i].title,
                    icon: 'fa '  +items[i].icon,
                }


                subItem.items=buildSubmenu(items[i].items);
                item.menu= subItem;
            }
            menu.push(item);
        }
        return menu;
    }
}
