function mask1() {

   // Function to initialize phone-related functionality for each phone input
  function initializePhoneInput(inputPhone, clearNumberId) {
    var iti_phone = intlTelInput(inputPhone, {
      preferredCountries: ["ru", "by", "kz"],
      customPlaceholder: function (selectedCountryPlaceholder, selectedCountryData) {
        if (selectedCountryData.iso2 === "ru") {
          return "С‚РµР»РµС„РѕРЅ";
        } else {
          return selectedCountryPlaceholder;
        }
      },
      initialCountry: "auto",
      geoIpLookup: function (callback) {
        $.get('https://ipinfo.io', function () { }, "jsonp").always(function (resp) {
          var countryCode = (resp && resp.country) ? resp.country : "ru";
          callback(countryCode);
        });
      },
      utilsScript: "../../build/js/utils.js?1613236686837"
    });

    var mask;

    function maskAdd(event, el) {
      var updateOptions = {
        mask: region.filter(r => r.cc === event)[0].mask
      };
      if (mask !== undefined) {
        mask.destroy();
        mask = IMask(el, updateOptions);
      } else {
        mask = IMask(el, updateOptions);
      }

      inputPhone.addEventListener("input", function () {
    var maskedNumber = inputPhone.value;
    var clearNumber = maskedNumber.replace(/\D/g, '');
    document.getElementById(clearNumberId).value = "+" + clearNumber;
  });
    }

    inputPhone.onfocus = function () {
      var code = iti_phone.getSelectedCountryData().iso2.toUpperCase();
      maskAdd(code, inputPhone);
    };

    var reset = function () {
      inputPhone.classList.remove("error");
      errorMsg.innerHTML = "";
      errorMsg.classList.add("hide");
      validMsg.classList.add("hide");
    };

    // on blur: validate
    inputPhone.addEventListener('blur', function () {
      reset();
      if (inputPhone.value.trim()) {
        if (iti_phone.isValidNumber()) {
          validMsg.classList.remove("hide");
        } else {
          inputPhone.classList.add("error");
          var errorCode = iti_phone.getValidationError();
          errorMsg.innerHTML = errorMap[errorCode];
          errorMsg.classList.remove("hide");
        }
      }
    });

    // on keyup / change flag: reset
    inputPhone.addEventListener('change', reset);
    inputPhone.addEventListener('keyup', reset);
  }

  // Select all input elements with ID "phone"
 var phoneInputs = document.querySelectorAll('.phone-input');

  // Loop through each phone input and initialize
  phoneInputs.forEach(function (inputPhone) {
  var clearNumberId = inputPhone.getAttribute("data-clear-number-id");
  initializePhoneInput(inputPhone, clearNumberId);
});
}



function launch() {
	mask1();
}

launch();
