"use strict";

$(document).ready(function() {
	var companiesList;

	$("#signForm").on("submit", function(event) {
		event.preventDefault();
		var form = $(this),
		formData = form.serializeArray(); //получаем данные из формы в виде массива
		
		$.ajax({
			type: form.attr("method"), //передаем данные на сервер
			url: form.attr("action"), 
			data: formData,
			success: function(response) { //обрабатываем ответ сервера
				if (response.status == "OK") {
					var url = "./companies.html";
					$(location).attr('href',url); //редирект на страницу компаний 
				}
				else if (response.status == "Form Error") {
					alert(response.message);
				}
				else if (response.status == "Error") {
					alert(response.message);
				}
				else {
					alert("Oops... Something went wrong. Try again later.");
				}
			},
			error:function(xhr,err){
    			alert("readyState: " + "status: " + xhr.status + "\n responseText: " + xhr.responseText);
			}
        });
	});

	$.ajax({
		type: "get",
		url: "http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList", //получаем данные с сервера 
		success: function(response) {
			companiesList = response.list;
      		$(".loader").delay(2000).fadeOut(300); //убираем лоадер
			$(".totalComp span").delay(100).text(companiesList.length); //выводим инфо о количестве компаний в блок

			var namesList = '';

			$.each(companiesList, function(index) {
				namesList += '<li data-id="' + index + '">' + this.name + '</li>'; //формируем список компаний
			});
			$(".listComp ul").html(namesList);

			if ($(".listComp ul").height() > $(".listComp").height()) { //скролл компаний
				$(".listComp").css("overflow-y", "scroll");
			}

			$(".listComp ul li").on("click", function() { //подсветка активного элемента
				$(".listComp ul li").removeClass("active");
				$(this).toggleClass("active");
				$(".partners").slideDown("slow").css("display", "inline-block"); //открываем блок Партнеры

				var id = $(this).attr("data-id"),
				currentComp = companiesList[id], //находим компанию в массиве по id
				partners = "";

				$.each(currentComp.partners, function() { //перебираем массив, получаем данные о партнерах, выводим в блок
					partners += '<div class="item">' +
						'<div class="partnName"><span>' + this.name + '</span></div>' +
						'<div class="value">' + this.value + '%</div>' +
					'</div>';
				});

				$(".graph").html(partners);

				if ($(".graph").width() > $(".graphWrapp").width()) { 
					$(".graphWrapp").css("overflow-x", "scroll"); //скролл партнеров
				}
				else if ($(".graph").width() < $(".graphWrapp").width()) { 
					$(".graphWrapp").css("overflow-x", "hidden");
				}
			});
		},
		error:function(xhr,err) {
    		alert("readyState: " + "status: " + xhr.status + "\n responseText: " + xhr.responseText);
		}
    });

	$(window).on("resize", function() { //скролл партнеров по ресайзу
		if ($(".graph").width() > $(".graphWrapp").width()) {
			$(".graphWrapp").css("overflow-x", "scroll"); 
		}
		else if ($(".graph").width() < $(".graphWrapp").width()) {
			$(".graphWrapp").css("overflow-x", "hidden"); 
		}
	});	
});