import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl
} from "@angular/forms";

export class CustomValidator2 {
  static cannotContainspace(ctrl: FormControl) {
    if (String(ctrl.value).indexOf(" ") >= 0) {
      // console.log(String(ctrl.value).indexOf(' '));
      return { cannotContainspace: true };
    } else {
      return null;
    }
  }

  static email(control: FormControl) {
    var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var valid = regEx.test(control.value);
    return valid ? null : { email: true };
  }

  static atleastonespecialcharacter(control: FormControl) {
    var regEx = /^(?=.*[!~/@#$%^&+=]).*$/;
    var valid = regEx.test(control.value);
    return valid ? null : { atleastonespecialcharacter: true };
  }

  static atleastoneuppercaseletter(control: FormControl) {
    var regEx = /^(?=.*[A-Z]).*$/;
    var valid = regEx.test(control.value);
    return valid ? null : { atleastoneuppercaseletter: true };
  }

  static atleastonenumber(control: FormControl) {
    var regEx = /^(?=.*\d).*$/;
    var valid = regEx.test(control.value);
    return valid ? null : { atleastonenumber: true };
  }

  static numberonly(control: FormControl) {
    var regEx = /^[0-9]*$/;
    var valid = regEx.test(control.value);
    return valid ? null : { numberonly: true };
  }

  static urlonly(control: FormControl) {
    var regEx = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    var valid = regEx.test(control.value);
    return valid ? null : { urlonly: true };
  }

  static passwordsShouldMatch(group: FormGroup) {
    var newPassword = group.controls.user_pass.value;
    var confirmPassword = group.controls.reuser_pass.value;
    // If either of these fields is empty, the validation
    // will be bypassed. We expect the required validator to be
    // applied first.
    if (newPassword == "" || confirmPassword == "") return null;

    if (newPassword != confirmPassword) return { passwordsShouldMatch: true };

    return null;
  }

  static userpasswordsShouldMatch(group: FormGroup) {
    var newPassword = group.controls.userPass.value;
    var confirmPassword = group.controls.comnfirmPass.value;
    // If either of these fields is empty, the validation
    // will be bypassed. We expect the required validator to be
    // applied first.
    if (newPassword == "" || confirmPassword == "") return null;

    if (newPassword != confirmPassword)
      return { userpasswordsShouldMatch: true };

    return null;
  }

  static userpasswordsShouldMatch2(group: FormGroup) {
    var newPassword = group.controls.userpass.value;
    var confirmPassword = group.controls.reuser_pass.value;
    // If either of these fields is empty, the validation
    // will be bypassed. We expect the required validator to be
    // applied first.
    if (newPassword == "" || confirmPassword == "") return null;

    if (newPassword != confirmPassword)
      return { userpasswordsShouldMatch2: true };

    return null;
  }

  static oldandnewpasswordcannotbesame(group: FormGroup) {
    var oldpassowrd = group.controls.olduser_pass.value;
    var newpassword = group.controls.userpass.value;

    // If either of these fields is empty, the validation
    // will be bypassed. We expect the required validator to be
    // applied first.
    if (oldpassowrd == "" || newpassword == "") {
      return null;
    }

    if (oldpassowrd === newpassword) {
      return { oldandnewpasswordcannotbesame: true };
    }

    return null;
  }

  static passwordcannotcontainusername(group: FormGroup) {
    var username = group.controls.adusername.value;
    var newpassword = group.controls.user_pass.value;
    if (username != "" && newpassword != "") {
      let stringToSplit = username.trim();
      let x = stringToSplit.split(" ");
      var str = newpassword.toLowerCase();
      if (x.length > 0) {
        for (let i = 0; i < x.length; i++) {
          if (str.search(x[i].toLowerCase()) != -1) {
            return { passwordcannotcontainusername: true };
          }
        }
      }
    }
    return null;
  }

  static isNumberCheck(control: FormGroup) {
    var regEx = /^[0-9]+(\.[0-9]{1,2})?$/;
    var valid = regEx.test(control.value);
    return valid ? null : { numberonly: true };
  }

  // Asnyc Validator : check promise in details
  // static shouldbeunique(ctrl: FormControl)
  // {
  //     return new Promise((resolve, reject) => {
  //         setTimeout(function() {
  //             if(ctrl.value == "chintan")
  //             {
  //                 resolve({shouldbeunique: true});
  //             }
  //             else
  //             {
  //                 resolve(null);
  //             }
  //         }, 5000);
  //     });
  // }
}
