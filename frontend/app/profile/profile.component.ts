import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProfileService} from "./profile.service";
import {Router} from "@angular/router";
import {User} from "../auth/registeration/registeration.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {AccountLinkComponent} from "./account-link/account-link.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  updateForm: FormGroup;

  selectedFile: File;

  unlink

  user: User;

  isThirdParty: boolean;

  constructor(private fb: FormBuilder,
              private profileService: ProfileService,
              private modalService: BsModalService,
              private router: Router) {}

  fetchUser() {
    this.user = new User();
    this.profileService.getUser()
      .subscribe((user) => {
        if(user){
          this.user.netId = user['username'];
          this.user.display_name = user['display_name'];
          this.user.email = user['email'];
          this.user.phone = user['phone'];
          this.user.dob = user['dob'];
          this.user.zipcode = user['zipcode'];
          this.user.avatar = user['avatar'];
          this.user.headline = user['headline'];
        }
        this.isThirdParty = this.user.netId.includes('@fb');
      });
  }

  initForm(): void{
    this.updateForm = this.fb.group({
      name: ['', []],
      email: ['', [Validators.email]],
      phone: ['', [this.profileService.checkPhone]],
      zipcode: ['', [this.profileService.checkZipcode]],
      password: ['', [Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.initForm();
    this.fetchUser();
  }

  get updateName() { return this.updateForm.get('name'); }

  get updateEmail() { return this.updateForm.get('email'); }

  get updatePhone() { return this.updateForm.get('phone'); }

  get updateZipcode() { return this.updateForm.get('zipcode');}

  get updatePassword() { return this.updateForm.get('password');}

  onUpdate(): void{
    this.profileService.onUpdate(this.updateForm, this.user);
    this.initForm();
  }

  updateAvatar(event){
    if(event.target.files && event.target.files[0]){
      this.selectedFile = <File>event.target.files[0];
      /*const imgReader = new FileReader();
      imgReader.onload = (e : any) => this.imgUrl = e.target.result;
      imgReader.readAsDataURL(event.target.files[0]);*/

      let fd = new FormData();
      fd.append('image', this.selectedFile, this.selectedFile.name);
      this.profileService.uploadAvatar(fd).subscribe((res) => {
        if(res['img']){
          this.user.avatar = res['img'];
          this.profileService.updateAvatar(this.user.avatar).subscribe((res) => {});
        }
      });
    }
  }

  accountLinkModal: BsModalRef;
  linkAccount(){
    this.accountLinkModal = this.modalService.show(AccountLinkComponent, {
      initialState:{
        title: 'Link to your normal account',
      }
    });
  }

  unlinkAccount(){
    this.profileService.unlinkAccount().subscribe(res => {
      this.unlink = res['result'];
      setTimeout(() => {
        this.unlink = '';
      }, 2000);
    });
  }

  toMain(){
    this.router.navigate(['main']);
  }
}
