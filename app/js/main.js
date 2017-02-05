$(function(){

    var dataListData = [
        [false, 'SomeBla Bla text description text', '25/08/2017 10:30:45'],
        [true, 'SomeBla Bla text description text 222 222', '25/08/2017 10:30:45'],
        [false, 'SomeBla Bla text 333 333', '25/08/2017 10:30:45'],
        [true, 'SomeBla Bla text Last', '25/08/2017 10:30:45'],
        [true, 'SomeBla Bla text Last', '25/08/2017 10:30:45']
    ];

    var dataListData2 = [
        [true, 'some text', '01/01/2017 00:00:00']
    ];

    $(".todo-list-wrap").todo({
        dataListData: dataListData,
        formDecorFunc: function(){
            $( ".todo-daedline" ).datetimepicker({
                timeFormat: "hh:mm:ss"
            });
        }
    });

    $(".todo-list-wrap-second").todo({
        dataListData: dataListData2,
        formDecorFunc: function(){
            $( ".todo-daedline" ).datetimepicker({
                timeFormat: "hh:mm:ss"
            });
        }
    });

});