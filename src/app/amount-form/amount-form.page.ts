import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../shared/services/database.service';
import { AlertController } from '@ionic/angular';
import { registerPlugin } from '@capacitor/core';
@Component({
  selector: 'app-amount-form',
  templateUrl: './amount-form.page.html',
  styleUrls: ['./amount-form.page.scss'],
})
export class AmountFormPage implements OnInit, AfterViewInit {
  final;
  validate;
  title = 'New';
  currentId: string;
  amountId: string;
  amountForms = new FormGroup({
    id: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    personId: new FormControl('', [Validators.required]),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataBaseService: DatabaseService,
    private alertController: AlertController,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe((res) => {
      this.currentId = res.id;

      this.getAmountById(res.id);
    });
  }
  ionViewWillEnter() {
    this.getAllData();
  }
  //   this.router.navigateByUrl('/mypageA', {skipLocationChange: true}).then(() => {
  // this.router.navigate(["/mypageA"]);
  // });
  async ngAfterViewInit() {
    await this.dataBaseService.init();
    await this.dataBaseService.openStore(
      'llevacuentasDb',
      'Amount',
      false,
      'no-encryption'
    );

    // await this.getAllData();
  }

  ngOnInit() {}

  async save() {
    const keyId = uuidv4();
    if (!this.validate) {
      this.amountForms.patchValue({
        id: `${keyId}`,
        personId: this.currentId,
      });

      if (this.amountForms.invalid) {
        this.presentAlertNoEmptyForm();
        return;
      }
      await this.dataBaseService.setTable('Amount');
      await this.dataBaseService.setItem(
        `${keyId}`,
        `${JSON.stringify(this.amountForms.value)}`
      );

      this.amountForms.reset();
      this.router.navigate([`form-user/${this.currentId}`]);
    } else {
      if (this.amountForms.invalid) {
        this.presentAlertNoEmptyForm();
        return;
      }
      await this.dataBaseService.setTable('Amount');
      await this.dataBaseService.setItem(
        `${this.amountForms.controls.id.value}`,
        `${JSON.stringify(this.amountForms.value)}`
      );
      this.router.navigate([
        `form-user/${this.amountForms.controls.personId.value}`,
      ]);
      this.amountForms.reset();
    }
    this.getAllData();
  }

  async getAllData() {
    await this.dataBaseService.init();
    await this.dataBaseService.openStore(
      'llevacuentasDb',
      'Amount',
      false,
      'no-encryption'
    );
    await this.dataBaseService.setTable('Amount');
    const todos = await this.dataBaseService.getAllValues();
    this.final = todos.map((x) => JSON.parse(x));
  }

  async presentAlertNoEmptyForm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Aviso!',
      message: 'Debe llenar todos los campos!',
      buttons: [
        {
          text: 'Okay',
          handler: async (blah) => {},
        },
      ],
    });

    await alert.present();
  }

  async getAmountById(id: string) {
    await this.dataBaseService.setTable('Amount');
    this.validate = await this.dataBaseService.isKey(id);
    if (!this.validate) {
      this.validate = false;
      return;
    }
    this.title = 'Edit';
    const currentAmount = JSON.parse(
      await this.dataBaseService.getItem(`${id}`)
    );

    this.amountForms.patchValue({
      id: currentAmount.id,
      personId: currentAmount.personId,
      description: currentAmount.description,
      type: currentAmount.type,
      amount: currentAmount.amount,
      date: currentAmount.date,
    });
  }
}
