import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/api/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  hidePassword = true;
  hideRePassword = true;
  passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}/;

  constructor(private fb: FormBuilder, private obj: AuthService, private route: Router) { }
  
  formRegister = this.fb.group({
    username: this.fb.control('', [Validators.required, Validators.minLength(5)]),
    title: this.fb.control(''),
    password: this.fb.control('', [Validators.required, 
      Validators.pattern(this.passwordRegex)]),
    rePassword: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
  }, {
    validators: this.mustMatch('password', 'rePassword')
  })

  mustMatch(password: any, rePassword:any){
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const rePasswordControl = formGroup.controls[rePassword];
      if(rePasswordControl.errors && !rePasswordControl.errors['mustMatch']){
        return;
      }
      if(passwordControl.value != rePasswordControl.value){
        rePasswordControl.setErrors({ mustMatch: true});
      }
      else{
        rePasswordControl.setErrors(null);
      }
    }
  }

  register(){
    if(this.formRegister.valid){
      this.formRegister.value.title = this.formRegister.value.email;
      this.obj.postRegister(this.formRegister.value).subscribe({
        next: (res: any) =>{
          console.log(res.status)
          // if (res != null){
            this.route.navigate(['./login'])
            // window.location.href = "./#/login";
          // }
        },
        error: (e) => console.error(e)
      })
    }
  }
}
