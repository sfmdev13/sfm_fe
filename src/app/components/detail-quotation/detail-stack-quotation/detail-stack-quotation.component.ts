import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { DetailQuotationStack, IDataCategories, LatestQuotationBom } from 'src/app/interfaces';

@Component({
  selector: 'app-detail-stack-quotation',
  standalone: true,
  imports: [
    NzTabsModule,
    NzButtonModule,
    NzModalModule,
    FormsModule,
    NzSelectModule,
    CommonModule
  ],
  templateUrl: './detail-stack-quotation.component.html',
  styleUrl: './detail-stack-quotation.component.scss'
})
export class DetailStackQuotationComponent {

  private nzData = inject(NZ_MODAL_DATA)

  stackDetail: DetailQuotationStack = this.nzData.stackLatest
  productCategory: IDataCategories[] = this.nzData.productCategory;

  selectedStack: string = '';

  constructor(
    private modal: NzModalRef,
    private cd: ChangeDetectorRef
  ) {
    console.log(this.stackDetail)
  }

  destroyModal(): void{
    this.modal.destroy();
  }
}
