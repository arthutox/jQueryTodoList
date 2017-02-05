(function($){
    jQuery.fn.todo = function(options){
        options = $.extend({
            dataListData: null,
            emptyText: 'Data not available',
            removeAllText: 'Data deleted',
            tableClassName: 'todo-table',
            removeControlText: 'Remove',
            headersList: ['Status', 'Description', 'Daed Line', "Controls"],
            formDecorFunc: function(){}
        }, options);

    var Todo = function(element){
        this.element = element;
        this.emptyText = options.emptyText;
        this.removeAllText = options.removeAllText;
        this.tableClassName = options.tableClassName;
        this.tableTemplate = "<table class=" + this.tableClassName + "></table>";
        this.dataListData = options.dataListData;
        this.headersList = options.headersList;
        this.todoRemoveItemClassName = 'todo-remove-item';
        this.removeControl = function(arrIndex){
            return "<a href='#' class='" + this.todoRemoveItemClassName + "' data-row-index='" + arrIndex + "'>" + options.removeControlText + "</a>";
        };
        this.CheckControl = "<input type='checkbox' />";
        this.CheckControlChecked = "<input type='checkbox' checked />";
        this.classDodoAddItemFormBox = 'todo-add-item-form-box';
        this.classTodoStatus = 'todo-status';
        this.classTodoText = 'todo-text';
        this.classTodoDaedline ='todo-daedline';
        this.classTodoAdd = 'todo-add';
        this.todoTextPlaceholder = 'Enter text';
        this.todoTimePlaceholder = 'DD.MM.YYYY	HH:MI:SS';
        this.todoAdddButtonText = "Add Item";
        this.formTemplate = "<div class='todo-add-item-form-box'>" +
                                "<form>" +
                                    "<div>" +
                                        "<input type='checkbox' class='" + this.classTodoStatus + "' />" +
                                    "</div>" +
                                    "<div>" +
                                        "<textarea placeholder='" + this.todoTextPlaceholder + "' class='" + this.classTodoText + "'></textarea>" +
                                    "</div>" +
                                    "<div>" +
                                        "<input type='text' placeholder='" + this.todoTimePlaceholder + "' class='" + this.classTodoDaedline + "' />" +
                                    "</div>" +
                                    "<div>" +
                                        "<button type='button' class='" + this.classTodoAdd + "'>" + this.todoAdddButtonText + "</button>" +
                                    "</div>" +
                                "</form>" +
                            "</div>";
        this.formDecorFunc = options.formDecorFunc;
    };

        Todo.prototype.tableCreate = function(){

            if ( this.dataListData == null ) {
                this.element.text(this.emptyText);
            } else {
                this.tableRender();
                this.formCreate();
            }

        }

        Todo.prototype.tableRender = function(){
            this.element.html(this.tableTemplate);
            this.headerRowCreate(this.headersList);
            this.rowCreate();
            this.colCreate();
            this.removeItem();
        }

        Todo.prototype.tableRemove = function(){
            this.element.find('.' + this.tableClassName).remove();
        }

        Todo.prototype.reTableRender = function(){

            if ( this.dataListData.length == 0 ) {
                this.element.text(this.removeAllText);
                this.formCreate();
            } else {
                this.tableRemove();
                this.tableCreate();
            }

        }

        Todo.prototype.headerRowCreate = function(headers){

            var arr = this.dataListData,
                headers = this.headersList;
            this.element.find("."+this.tableClassName).prepend("<thead><tr></tr></thead>");
            for ( var i = 0; i < arr[0].length; i++ ) {

                if ( i == arr[0].length - 1 ) {
                    this.element.find("."+this.tableClassName).find("thead:first").find("tr").append("<th>" + headers[i] + "</th><th>" + headers[i + 1] + "</th>");
                } else {
                    this.element.find("."+this.tableClassName).find("thead:first").find("tr").append("<th>" + headers[i] + "</th>");
                }
            }

        }

        Todo.prototype.rowCreate = function(){

            var arr = this.dataListData;
            for ( var i = 0; i < arr.length; i++ ) {
                this.element.find('.'+this.tableClassName).append("<tr class='true'></tr>");
            }

        }

        Todo.prototype.colCreate = function(){
            var row = this.element.find('.'+this.tableClassName).find("tbody").find("tr"),
                rowCounter = row.length;

            for ( var i = 0; i < rowCounter; i++ ){
                for ( var ii = 0; ii < this.dataListData[i].length; ii++ ){
                    if ( ii == 0 ){
                        if ( this.dataListData[i][ii] == true ) {
                            row.eq(i).append("<td>" + this.CheckControl + "</td>");
                        } else {
                            row.eq(i).append("<td>" + this.CheckControlChecked + "</td>");
                        }

                    } else if ( ii == (this.dataListData[i].length - 1) ) {
                        row.eq(i).append("<td>" + this.dataListData[i][ii] + "</td><td>" + this.removeControl(i) + "</td>");
                    } else {
                        row.eq(i).append("<td>" + this.dataListData[i][ii] + "</td>");
                    }

                }
            }

        }

        Todo.prototype.removeItem = function(){

            var _this = this,
                $thisDataListData = _this.dataListData;

            this.element.on('click', '.' + this.todoRemoveItemClassName, function(e){
                e.preventDefault();
                e.stopImmediatePropagation();
                var $removeIndex;
                $removeIndex = $(this).data('row-index');
                $thisDataListData.splice($removeIndex, 1);
                _this.reTableRender();
            });

        }

        Todo.prototype.formCreate = function(){
            this.element.append(this.formTemplate);
            this.formAddItem();
            this.formDecorFunc();
        }

        Todo.prototype.formAddItem = function(){

            var _this = this,
                $classDodoAddItemFormBox = this.classDodoAddItemFormBox,
                $classTodoStatus = this.classTodoStatus,
                $classTodoStatusData,
                $classTodoText = this.classTodoText,
                $classTodoTextData,
                $classTodoDaedline = this.classTodoDaedline,
                $classTodoDaedlineData,
                $classTodoAdd = this.classTodoAdd,
                $itemArr = this.dataListData,
                $newItemArr = [];

            this.element.on('click', '.'+$classTodoAdd, function(e){
                e.preventDefault();
                e.stopImmediatePropagation();

                var parentBox = $(this).parents("."+$classDodoAddItemFormBox),
                    descriptioInput = parentBox.find("."+$classTodoText),
                    dateInput = parentBox.find("."+$classTodoDaedline);

                if ( _this.emptyFormCheck(descriptioInput) && _this.emptyFormCheck(dateInput) ) {
                    $classTodoStatusData = (function(){
                        if ( parentBox.find("."+$classTodoStatus).prop("checked") ) {
                            return false;
                        } else {
                            return true;
                        }
                    })();
                    $classTodoTextData = (function(){
                        return descriptioInput.val();
                    })();
                    $classTodoDaedlineData = (function(){
                        return dateInput.val();
                    })();

                    $newItemArr.push($classTodoStatusData, $classTodoTextData, $classTodoDaedlineData);
                    $itemArr.push($newItemArr);

                    _this.reTableRender();

                    $newItemArr = [];
                }

            });

        }

        Todo.prototype.emptyFormCheck = function(input){
            if ( input.val() == '' ){
                return false;
            } else {
                return true;
            }
        }

    var make = function(){

        var $this = $(this);
        var todo = new Todo($this);
        todo.tableCreate();

    };

    return this.each(make);
};
})(jQuery);