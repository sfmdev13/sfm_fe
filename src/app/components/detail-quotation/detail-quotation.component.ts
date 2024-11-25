import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-detail-quotation',
  standalone: true,
  imports: [
    CommonModule, 
    NzTabsModule, 
    NzTableModule
  ],
  templateUrl: './detail-quotation.component.html',
  styleUrl: './detail-quotation.component.scss'
})
export class DetailQuotationComponent {
  date = new Date();

  logMsg = [
    {
      revision: 'R0',
      changes: [
        {
          name: 'Gifino',
          message: 'Change Project location from Jakarta into Batam',
          revision: 'R0'
        },
        {
          name: 'Ramadian',
          message: 'Delete item part number ITM3343',
          revision: 'R0'
        }
      ]
    },
    {
      revision: 'R1',
      changes: [
        {
          name: 'Ramadian',
          message: 'Change quantity item part number ITM33434',
          revision: 'R1'
        }
      ]
    },
  ]
}
