import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/api/auth/auth.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hidePassword = true;
  constructor(private fb: FormBuilder, private obj: AuthService, private route: Router) { 
    localStorage.clear();
  }

  formLogin = this.fb.group({
    title: this.fb.control(''),
    password: this.fb.control('', [Validators.required]),
    username: this.fb.control('', [Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
  })

  formForgotPassword = this.fb.group({
    email: this.fb.control('', [Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
  })

  login(){
    if(this.formLogin.valid){
      this.formLogin.value.title = this.formLogin.value.username;
      this.obj.postLogin(this.formLogin.value).subscribe({
        next: (res: any) =>{
          console.log(res)
          if (res != null){
            localStorage.setItem('accessToken', res.token);
            localStorage.setItem('user', res.id);
            // localStorage.setItem('farm', '');
            // localStorage.setItem('greenhouse', '');
            this.route.navigate(['../home']);
            // window.location.href = "../home"
          }
        },
        error: (e) => {
          console.error(e)
          alert("Tài khoản hoặc mật khẩu không đúng. Vui lòng kiểm tra lại tài khoản !");
        }
      })
    }
  }

  forgotPassword(){
    if(this.formForgotPassword.valid){
      this.obj.postResetPassword(this.formForgotPassword.value).subscribe({
        next: (res: any) =>{
          console.log(res)
          if (res != null){
            alert("Xác thực đã được gửi, vui lòng kiểm tra Email !")
          }
        },
        error: (e) => {
          console.error(e)
          alert("Tài khoản không đúng. Vui lòng kiểm tra lại tài khoản !");
        }
      })
    }
  }

  resetFormForgotPassword(){
    this.formForgotPassword.patchValue({
      email: ""
    })
  }
}
