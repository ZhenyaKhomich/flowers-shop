import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DeliveryType} from '../../../../../types/delivery.type';
import {PaymentType} from '../../../../../types/payment.type';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgStyle} from '@angular/common';
import {UserService} from '../../../../services/user.service';
import {UserInfoType} from '../../../../../types/user-info.type';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'info',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NgStyle
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent implements OnInit {
  protected readonly deliveryTypes = DeliveryType;
  protected readonly PaymentType = PaymentType;
  private fb: FormBuilder = inject(FormBuilder);
  private UserService = inject(UserService);
  private snakeBar = inject(MatSnackBar);
  deliveryType: DeliveryType = DeliveryType.delivery;
  formUserInfo = this.fb.group({
    firstName: [''],
    lastName: [''],
    fatherName: [''],
    phone: [''],
    paymentType: [PaymentType.cardOnline],
    email: ['', Validators.required],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
  })

  ngOnInit() {
    this.UserService.getUserInfo().subscribe((data: UserInfoType | DefaultResponseType) => {
      if((data as DefaultResponseType).error !== undefined) {
        const error = (data as DefaultResponseType).message;
        throw new Error(error);
      }

      const userInfo = data as UserInfoType;
      const paramsToUpdate = {
        firstName: userInfo.firstName ? userInfo.firstName : '',
        lastName: userInfo.lastName ? userInfo.lastName : '',
        fatherName: userInfo.fatherName ? userInfo.fatherName : '',
        phone: userInfo.phone ? userInfo.phone: '',
        paymentType: userInfo.paymentType ? userInfo.paymentType : PaymentType.cardOnline,
        email: userInfo.email ? userInfo.email : '',
        street: userInfo.street ? userInfo.street : '',
        house: userInfo.house ? userInfo.house : '',
        entrance: userInfo.entrance ? userInfo.entrance : '',
        apartment: userInfo.apartment ? userInfo.apartment : '',
      }

      this.formUserInfo.setValue(paramsToUpdate);

      if(userInfo.deliveryType) {
        this.deliveryType = userInfo.deliveryType;
      }
    })
  }

  changeDeliveryType(type: DeliveryType) {
    this.deliveryType = type;
    this.formUserInfo.markAsDirty();
  }

  updateUserInfo() {
    if (this.formUserInfo.valid) {
      const paramObject: UserInfoType = {
        email: this.formUserInfo.value.email ? this.formUserInfo.value.email : '',
        deliveryType: this.deliveryType,
        paymentType: this.formUserInfo.value.paymentType ? this.formUserInfo.value.paymentType : PaymentType.cashToCourier,
      }

      if(this.formUserInfo.value.firstName) {
        paramObject.firstName = this.formUserInfo.value.firstName;
      }
      if(this.formUserInfo.value.lastName) {
        paramObject.lastName = this.formUserInfo.value.lastName;
      }
      if(this.formUserInfo.value.fatherName) {
        paramObject.fatherName = this.formUserInfo.value.fatherName;
      }
      if(this.formUserInfo.value.phone) {
        paramObject.phone = this.formUserInfo.value.phone;
      }
      if(this.formUserInfo.value.street) {
        paramObject.street = this.formUserInfo.value.street;
      }
      if(this.formUserInfo.value.house) {
        paramObject.house = this.formUserInfo.value.house;
      }
      if(this.formUserInfo.value.entrance) {
        paramObject.entrance = this.formUserInfo.value.entrance;
      }
      if(this.formUserInfo.value.apartment) {
        paramObject.apartment = this.formUserInfo.value.apartment;
      }

      this.UserService.updateUserInfo(paramObject)
        .subscribe({
          next:  (data:DefaultResponseType) => {
            if(data.error) {
              this.snakeBar.open(data.message, '', {duration: 3000});
              throw new Error(data.message);
            }
            this.snakeBar.open('Данные успешно сохранены', '', {duration: 3000});
            this.formUserInfo.markAsPristine();
          },
          error: (errorResponse: HttpErrorResponse) => {
            if(errorResponse.error && errorResponse.error.message) {
              this.snakeBar.open(errorResponse.error.message, '', {duration: 3000});
            } else {
              this.snakeBar.open('Ошибка сохранения', '', {duration: 3000});
            }
          },
         })
    }
  }
}
