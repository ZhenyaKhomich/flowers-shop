import {Component, ElementRef, inject, OnInit, TemplateRef, ViewChild, viewChild} from '@angular/core';
import {BasketService} from '../../../../services/basket.service';
import {BasketType} from '../../../../../types/basket.type';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeliveryType} from '../../../../../types/delivery.type';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {PaymentType} from '../../../../../types/payment.type';
import {NgIf, NgStyle} from '@angular/common';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {OrderService} from '../../../../services/order.service';
import {OrderType} from '../../../../../types/order.type';
import {HttpErrorResponse} from '@angular/common/http';
import {UserService} from '../../../../services/user.service';
import {UserInfoType} from '../../../../../types/user-info.type';
import {AuthService} from '../../../../services/auth.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgStyle,
    NgIf,
    MatDialogModule,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  private BasketService = inject(BasketService);
  private OrderService = inject(OrderService);
  private AuthService = inject(AuthService);
  private UserService = inject(UserService);
  private router = inject(Router);
  private snakeBar = inject(MatSnackBar);
  private fb: FormBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);
  protected readonly PaymentType = PaymentType;
  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null;
  basket: BasketType | null = null;
  totalAmount: number = 0;
  totalCount: number = 0;
  deliveryType: DeliveryType = DeliveryType.delivery;
  deliveryTypes = DeliveryType;
  formOrder = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    fatherName: [''],
    phone: ['', Validators.required],
    paymentType: [PaymentType.cardOnline, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
    comment: [''],
  })

  ngOnInit(): void {
    this.BasketService.getBasket().subscribe((data: BasketType | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        const error = (data as DefaultResponseType).message;
        throw new Error(error);
      }
      this.basket = data as BasketType;

      if (!this.basket || (this.basket && this.basket.items.length === 0)) {
        this.router.navigate(['/']);
        this.snakeBar.open('Корзина пустая', '', {duration: 3000});
        return;
      }
      this.calculateTotal();
    })

    if(this.AuthService.getIsLoggedIn()) {
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
          comment: '',
        }

        this.formOrder.setValue(paramsToUpdate);

        if(userInfo.deliveryType) {
          this.deliveryType = userInfo.deliveryType;
        }
        this.updateValidators();
      })
    } else {
      this.updateValidators();
    }
  }

  calculateTotal() {
    if (this.basket) {
      this.totalAmount = 0;
      this.totalCount = 0;
      this.basket.items.forEach(item => {
        this.totalAmount += item.product.price * item.quantity;
        this.totalCount += item.quantity;
      })
    }
  }

  changeDeliveryType(type: DeliveryType) {
    this.deliveryType = type;
    this.updateValidators();
  }

  updateValidators() {
    const street = this.formOrder.get('street');
    const house = this.formOrder.get('house');

    if (this.deliveryType === DeliveryType.delivery) {
      street?.addValidators(Validators.required);
      house?.addValidators(Validators.required);
    } else {
      street?.removeValidators(Validators.required);
      house?.removeValidators(Validators.required);
      street?.setValue('');
      house?.setValue('');
      this.formOrder.get('entrance')?.setValue('');
      this.formOrder.get('apartment')?.setValue('');
      this.formOrder.get('street')?.setValue('');
    }
    street?.updateValueAndValidity();
    house?.updateValueAndValidity();
  }

  createOrder() {
    if (this.formOrder.valid && this.formOrder.value.firstName &&
      this.formOrder.value.lastName && this.formOrder.value.phone &&
      this.formOrder.value.paymentType && this.formOrder.value.email) {
      const paramObject: OrderType = {
        deliveryType: this.deliveryType,
        firstName: this.formOrder.value.firstName,
        lastName: this.formOrder.value.lastName,
        phone: this.formOrder.value.phone,
        paymentType: this.formOrder.value.paymentType,
        email: this.formOrder.value.email,
      }

      if (this.deliveryType === DeliveryType.delivery) {
        if(this.formOrder.value.street) {
          paramObject.street = this.formOrder.value.street;
        }
        if( this.formOrder.value.house) {
          paramObject.house = this.formOrder.value.house;
        }
        if(this.formOrder.value.entrance) {
          paramObject.entrance = this.formOrder.value.entrance;
        }
        if(this.formOrder.value.apartment) {
          paramObject.apartment = this.formOrder.value.apartment;
        }
      }

      if(this.formOrder.value.comment) {
        paramObject.comment = this.formOrder.value.comment;
      }

      this.OrderService.createOrder(paramObject)
        .subscribe({
            next: (data: OrderType | DefaultResponseType) => {
              if((data as DefaultResponseType).error !== undefined) {
                const error = (data as DefaultResponseType).message;
                throw new Error(error);
              }

              this.dialogRef = this.dialog.open(this.popup, {
                width: '747px',
                maxWidth: 'none',
              });

              this.dialogRef.backdropClick().subscribe(() => {
                this.BasketService.setCount(0);
                this.router.navigate(['/']);
              })

            }, error: (errorResponse: HttpErrorResponse) => {
              if(errorResponse.error && errorResponse.error.message) {
                this.snakeBar.open(errorResponse.error.message, '', {duration: 3000});
              } else {
                this.snakeBar.open('Ошибка заказа', '', {duration: 3000});
              }
            }
          }
        )
    } else {
      this.formOrder.markAllAsTouched();
      this.snakeBar.open('Заполните необходимые поля', '', {duration: 3000});
    }
  }

  closePopup(): void {
    this.dialogRef?.close();
    this.BasketService.setCount(0);
    this.router.navigate(['/']);
  }


}
