function legend() {
	main_json.done(function(data) {
		console.log("complete initiated");
		var json_root=data[0].VehAvailRSCore;
		$("#legend_left").append('<p>Pick up date / time: <span class="text-info">' + pharse_time(json_root.VehRentalCore['@PickUpDateTime']) + '</span></p>')
		.append('<p>Pick up location: <span class="text-info">' + pharse_time(json_root.VehRentalCore.PickUpLocation['@Name']) + '</span></p>');
		$("#legend_right").append('<p>Return date / time: <span class="text-info">' + pharse_time(json_root.VehRentalCore['@ReturnDateTime']) + '</span></p>')
		.append('<p>Return location: <span class="text-info">' + pharse_time(json_root.VehRentalCore.PickUpLocation['@Name']) + '</span></p>');
	});
}
function procedure_a() {
	main_json.done(function(data) {
		// Create aux_array to group all cars
		json_root = data[0].VehAvailRSCore.VehVendorAvails;
		
		var vendor_count = json_root.length;
		
		//$("#stage").append('<div class="row panel panel-primary">' + aux_array[9].VendorName + '</div>');
		// Group by Vendor - order by price within Group
		
		$("#stage").empty();
		for (i=0; i < vendor_count; i++) {
			$("#stage").append('<div class="row panel panel-primary"></div>');
			$("#stage .row").last().append('<div class="col-sm-12 panel-heading"></div>').children().last().append('<h4>Vendor code: ' + json_root[i].Vendor['@Code'] + ' / Vendor name: ' + json_root[i].Vendor['@Name'] + '</h4>');
			//$("#stage").append('<div class="row"></div>');
			var car_count = json_root[i].VehAvails.length;

			var json_level_2 = data[0].VehAvailRSCore.VehVendorAvails[i].VehAvails;
			
			json_level_2.sort(compare_price);
			
			for (j=0; j < car_count; j++) {
				$("#stage .row").last().append('<div class="col-sm-6 col-md-4 col-lg-3 panel-body"></div>');
				$("#stage .row div").last().append('<div class="panel panel-default"></div>');
				$("#stage .panel").last().append('<div class="panel-heading"></div>').children().last().append("<h4>Status: " + json_root[i].VehAvails[j]['@Status'] + "</h4>");
				if (json_root[i].VehAvails[j]['@Status'] == "Available") {
					$("#stage .panel").last().removeClass("panel-default");
					$("#stage .panel").last().addClass("panel-success");
				} else {
					$("#stage .panel").last().removeClass("panel-default");
					$("#stage .panel").last().addClass("panel-danger");
				}
				$("#stage .panel").last().append('<div class="panel-body text-center"></div>').children().last()
					.append('<p>' + json_root[i].VehAvails[j].Vehicle.VehMakeModel['@Name'] + '</p>')
					.append('<p><img src="' + json_root[i].VehAvails[j].Vehicle.PictureURL + '"></p>')
					.append('<p>Estimated Total<br/><h3>' + json_root[i].VehAvails[j].TotalCharge['@EstimatedTotalAmount'] + " " + json_root[i].VehAvails[j].TotalCharge['@CurrencyCode'] + '</h3></p>');
				$("#stage .panel").last().append('<div class="panel-footer"><button class="btn btn-info" data-vendor-num="' + i + '" data-vehicle-num="' + j + '" onclick="modal_filler_type_a(this)">Details</button></div>');
				//document.getElementById("demo").innerHTML = data[0].VehAvailRSCore.VehRentalCore['@PickUpDateTime'];
			}
		}
	});
}
function procedure_b() {
	main_json.done(function(data) {
		// Create aux_array to group all cars
		json_root = data[0].VehAvailRSCore.VehVendorAvails;
		var vendor_count = json_root.length;
		var aux_array = [];
		for (i=0; i < vendor_count; i++) {
			aux_array = aux_array.concat(data[0].VehAvailRSCore.VehVendorAvails[i].VehAvails);
			var car_count = json_root[i].VehAvails.length;
			var aux_length = aux_array.length;
			for (j=aux_length-car_count; j < aux_length; j++) {
				aux_array[j].VendorName = data[0].VehAvailRSCore.VehVendorAvails[i].Vendor['@Name'];
				aux_array[j].VendorCode = data[0].VehAvailRSCore.VehVendorAvails[i].Vendor['@Code'];
			}
		}
		$("#stage").empty().append('<div class="row"></div>');
		var aux_length = aux_array.length;
		aux_array.sort(compare_price);
		for (i=0; i < aux_length; i++) {
			$("#stage .row").last().append('<div class="col-sm-6 col-md-4 col-lg-3"></div>');
			$("#stage .row div").last().append('<div class="panel panel-default"></div>');
			$("#stage .panel").last().append('<div class="panel-heading"></div>').children().last().append("<h4>Status: " + aux_array[i]['@Status'] + "</h4>");
			if (aux_array[i]['@Status'] == "Available") {
				$("#stage .panel").last().removeClass("panel-default");
				$("#stage .panel").last().addClass("panel-success");
			} else {
				$("#stage .panel").last().removeClass("panel-default");
				$("#stage .panel").last().addClass("panel-danger");
			}
			$("#stage .panel").last().append('<div class="panel-body text-center"></div>').children().last()
				.append('<p>' + aux_array[i].Vehicle.VehMakeModel['@Name'] + '</p>')
				.append('<p><img src="' + aux_array[i].Vehicle.PictureURL + '"></p>')
				.append('<p>Estimated Total<br/><h3>' + aux_array[i].TotalCharge['@EstimatedTotalAmount'] + " " + aux_array[i].TotalCharge['@CurrencyCode'] + '</h3></p>');
			$("#stage .panel").last().append('<div class="panel-footer"><button class="btn btn-info" data-vehicle-num="' + i + '" onclick="modal_filler_type_b(this)">Details</button></div>');
		}
	});
}
function pharse_time(str) {
	str = str.replace("T", " / ");
	str = str.replace("Z", "");
	return str;
}
function compare(a,b) {
	if (a.Vehicle.VehMakeModel['@Name'] < b.Vehicle.VehMakeModel['@Name'])
		return -1;
	if (a.Vehicle.VehMakeModel['@Name'] > b.Vehicle.VehMakeModel['@Name'])
		return 1;
	return 0;
}
function compare_price_bad(a,b) {
	if (a.TotalCharge['@RateTotalAmount'] < b.TotalCharge['@RateTotalAmount'])
		return -1;
	if (a.TotalCharge['@RateTotalAmount'] > b.TotalCharge['@RateTotalAmount'])
		return 1;
	return 0;
}
function compare_price(a,b) {
	return a.TotalCharge['@RateTotalAmount'] - b.TotalCharge['@RateTotalAmount'];
}
function alert_test(a) {
	var vendor = a.getAttribute("data-vendor-num");
	var vehicle = a.getAttribute("data-vehicle-num");
	alert("Argument = " + a + "\n Vendor = " + vendor + "\n Vehicle = " + vehicle);
}
function modal_filler_type_a(a) {
	var vendor = a.getAttribute("data-vendor-num");
	var vehicle = a.getAttribute("data-vehicle-num");
	main_json.always(function(data) {
		var VendorName = data[0].VehAvailRSCore.VehVendorAvails[vendor].Vendor['@Name']
		var VendorCode = data[0].VehAvailRSCore.VehVendorAvails[vendor].Vendor['@Code']
		var Status = data[0].VehAvailRSCore.VehVendorAvails[vendor].VehAvails[vehicle]['@Status'];
		var Name = data[0].VehAvailRSCore.VehVendorAvails[vendor].VehAvails[vehicle].Vehicle.VehMakeModel['@Name'];
		var AirConditionInd = data[0].VehAvailRSCore.VehVendorAvails[vendor].VehAvails[vehicle].Vehicle['@AirConditionInd'];
		var TransmissionType = data[0].VehAvailRSCore.VehVendorAvails[vendor].VehAvails[vehicle].Vehicle['@TransmissionType']; 
		var FuelType = data[0].VehAvailRSCore.VehVendorAvails[vendor].VehAvails[vehicle].Vehicle['@FuelType']; 
		var DriveType = data[0].VehAvailRSCore.VehVendorAvails[vendor].VehAvails[vehicle].Vehicle['@DriveType'];
		var PassengerQuantity = data[0].VehAvailRSCore.VehVendorAvails[vendor].VehAvails[vehicle].Vehicle['@PassengerQuantity'];
		var BaggageQuantity = data[0].VehAvailRSCore.VehVendorAvails[vendor].VehAvails[vehicle].Vehicle['@BaggageQuantity'];
		var Code = data[0].VehAvailRSCore.VehVendorAvails[vendor].VehAvails[vehicle].Vehicle['@Code'];
		var CodeContext = data[0].VehAvailRSCore.VehVendorAvails[vendor].VehAvails[vehicle].Vehicle['@CodeContext'];
		var DoorCount = data[0].VehAvailRSCore.VehVendorAvails[vendor].VehAvails[vehicle].Vehicle['@DoorCount'];
		var pic = data[0].VehAvailRSCore.VehVendorAvails[vendor].VehAvails[vehicle].Vehicle.PictureURL;
		var RateTotalAmount = data[0].VehAvailRSCore.VehVendorAvails[vendor].VehAvails[vehicle].TotalCharge['@RateTotalAmount'];
		var EstimatedTotalAmount = data[0].VehAvailRSCore.VehVendorAvails[vendor].VehAvails[vehicle].TotalCharge['@EstimatedTotalAmount'];
		var CurrencyCode = data[0].VehAvailRSCore.VehVendorAvails[vendor].VehAvails[vehicle].TotalCharge['@CurrencyCode'];
		
		$("#modal_stage .modal-header").empty().append('<h3 class="text-center">' + Name + '</h3>');
		$("#modal_stage .modal-body").empty().append('<p class="text-center"><img src="' + pic + '"></p>')
			.append('<dl class="dl-horizontal"></dl>').children().last()
			.append('<dt>Status</dt><dd><span class="text-success">' + Status + '</span></dd>')
			.append('<dt>Name</dt><dd>' + Name + '</dd>')
			.append('<dt>Air Conditioned</dt><dd>' + ((AirConditionInd == "true") ? '<span class="glyphicon glyphicon-ok text-success"></span>' : '<span class="glyphicon glyphicon-remove text-danger"></span>') + '</dd>')
			.append('<dt>Transmission Type</dt><dd>' + TransmissionType + '</dd>')
			.append('<dt>Fuel Type</dt><dd>' + FuelType + '</dd>')
			.append('<dt>Drive Type</dt><dd>' + DriveType + '</dd>')
			.append('<dt>Passenger Quantity</dt><dd>' + PassengerQuantity + '</dd>')
			.append('<dt>Baggage Quantity</dt><dd>' + BaggageQuantity + '</dd>')
			.append('<dt>Door Count</dt><dd>' + DoorCount + '</dd>')
			.append('<dt>Rate Total Amount</dt><dd>' + RateTotalAmount + '</dd>')
			.append('<dt>Estimated Total Amount</dt><dd>' + EstimatedTotalAmount + '</dd>')
			.append('<dt>Currency Code</dt><dd>' + CurrencyCode + '</dd>')
			.append('<dt>Code</dt><dd>' + Code + '</dd>')
			.append('<dt>Code Context</dt><dd>' + CodeContext + '</dd>')
			.append('<dt>Vendor Name</dt><dd>' + VendorName + '</dd>')
			.append('<dt>Vendor Code</dt><dd>' + VendorCode + '</dd>');
	});
	
	$("#myModal").modal();
}

function modal_filler_type_b(a) {
	// var vendor = a.getAttribute("data-vendor-num");
	var vehicle = a.getAttribute("data-vehicle-num");
	main_json.always(function(data) {
		var json_root = data[0].VehAvailRSCore.VehVendorAvails;
		var vendor_count = json_root.length;
		var aux_array = [];
		for (i=0; i < vendor_count; i++) {
			aux_array = aux_array.concat(data[0].VehAvailRSCore.VehVendorAvails[i].VehAvails);
			var car_count = json_root[i].VehAvails.length;
			var aux_length = aux_array.length;
			for (j=aux_length-car_count; j < aux_length; j++) {
				aux_array[j].VendorName = data[0].VehAvailRSCore.VehVendorAvails[i].Vendor['@Name'];
				aux_array[j].VendorCode = data[0].VehAvailRSCore.VehVendorAvails[i].Vendor['@Code'];
			}
		}
		aux_array.sort(compare_price);
		var VendorName = aux_array[vehicle].VendorName;
		var VendorCode = aux_array[vehicle].VendorCode;
		var Status = aux_array[vehicle]['@Status'];
		var Name = aux_array[vehicle].Vehicle.VehMakeModel['@Name'];
		var AirConditionInd = aux_array[vehicle].Vehicle['@AirConditionInd'];
		var TransmissionType = aux_array[vehicle].Vehicle['@TransmissionType']; 
		var FuelType = aux_array[vehicle].Vehicle['@FuelType']; 
		var DriveType = aux_array[vehicle].Vehicle['@DriveType'];
		var PassengerQuantity = aux_array[vehicle].Vehicle['@PassengerQuantity'];
		var BaggageQuantity = aux_array[vehicle].Vehicle['@BaggageQuantity'];
		var Code = aux_array[vehicle].Vehicle['@Code'];
		var CodeContext = aux_array[vehicle].Vehicle['@CodeContext'];
		var DoorCount = aux_array[vehicle].Vehicle['@DoorCount'];
		var pic = aux_array[vehicle].Vehicle.PictureURL;
		var RateTotalAmount = aux_array[vehicle].TotalCharge['@RateTotalAmount'];
		var EstimatedTotalAmount = aux_array[vehicle].TotalCharge['@EstimatedTotalAmount'];
		var CurrencyCode = aux_array[vehicle].TotalCharge['@CurrencyCode'];
		
		$("#modal_stage .modal-header").empty().append('<h3 class="text-center">' + Name + '</h3>');
		$("#modal_stage .modal-body").empty().append('<p class="text-center"><img src="' + pic + '"></p>')
			.append('<dl class="dl-horizontal"></dl>').children().last()
			.append('<dt>Status</dt><dd><span class="text-success">' + Status + '</span></dd>')
			.append('<dt>Name</dt><dd>' + Name + '</dd>')
			.append('<dt>Air Conditioned</dt><dd>' + ((AirConditionInd == "true") ? '<span class="glyphicon glyphicon-ok text-success"></span>' : '<span class="glyphicon glyphicon-remove text-danger"></span>') + '</dd>')
			.append('<dt>Transmission Type</dt><dd>' + TransmissionType + '</dd>')
			.append('<dt>Fuel Type</dt><dd>' + FuelType + '</dd>')
			.append('<dt>Drive Type</dt><dd>' + DriveType + '</dd>')
			.append('<dt>Passenger Quantity</dt><dd>' + PassengerQuantity + '</dd>')
			.append('<dt>Baggage Quantity</dt><dd>' + BaggageQuantity + '</dd>')
			.append('<dt>Door Count</dt><dd>' + DoorCount + '</dd>')
			.append('<dt>Rate Total Amount</dt><dd>' + RateTotalAmount + '</dd>')
			.append('<dt>Estimated Total Amount</dt><dd>' + EstimatedTotalAmount + '</dd>')
			.append('<dt>Currency Code</dt><dd>' + CurrencyCode + '</dd>')
			.append('<dt>Code</dt><dd>' + Code + '</dd>')
			.append('<dt>Code Context</dt><dd>' + CodeContext + '</dd>')
			.append('<dt>Vendor Name</dt><dd>' + VendorName + '</dd>')
			.append('<dt>Vendor Code</dt><dd>' + VendorCode + '</dd>');
	});
	
	$("#myModal").modal();
}