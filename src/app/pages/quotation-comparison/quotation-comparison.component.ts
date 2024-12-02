import { Component, OnInit } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IQuotation, IRootQuotation } from 'src/app/interfaces';


@Component({
  selector: 'app-quotation-comparison',
  templateUrl: './quotation-comparison.component.html',
  styleUrl: './quotation-comparison.component.scss'
})
export class QuotationComparisonComponent implements OnInit {

  quotationList$!: Observable<IRootQuotation>;
  quotationDetail$!: Observable<IQuotation[]>;
  
  selectedQuotation: string = '';

  revisionList: string[] = [];

  revision1: string = '';
  revision2: string  = '';

  quotationDetailsList: IQuotation[] = [];

  objectKeys = Object.keys;

  result: any;

  constructor(
    private apiSvc: ApiService
  ){}

  ngOnInit(): void {
    this.quotationList$ = this.apiSvc.getQuotation();
  }

  quotationChange(): void{
    this.quotationDetail$ = this.apiSvc.getDetailQuotation(this.selectedQuotation).pipe(
      tap((res) => {
        this.revisionList = res.map((q) => (q.revision))
        this.quotationDetailsList = res;
      })
    );
  }

  revisionChange(): void{
    if(this.revision1 !== '' && this.revision2 !== ''){
      const object1 = this.quotationDetailsList.filter((q) => q.revision === this.revision1)[0];
      const object2 = this.quotationDetailsList.filter((q) => q.revision === this.revision2)[0];

      const result = this.getObjectDifferences(object1, object2);
      console.log(result)
      this.result = result
    }
  }

  getObjectDifferences(
    obj1: Record<string, any>,
    obj2: Record<string, any>
  ) {
    const differences: Record<string, any> = {};
  
    const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  
    keys.forEach((key) => {
      // Special condition for `project_document`
      if (key === 'project_document') {
        const doc1 = obj1[key];
        const doc2 = obj2[key];
  
        // Skip if `file_name` is the same
        if (doc1?.file_name === doc2?.file_name) {
          return;
        }
      }
  
      // Special condition for `quotation_items`
      if (key === 'quotation_items') {
        const items1 = obj1[key] || [];
        const items2 = obj2[key] || [];
  
        const filteredDifferences = items1.filter((item1: any, index: any) => {
          const item2 = items2[index];
  
          // Compare item properties individually rather than the entire object
          // Adjust comparison based on specific fields (like `code`, `dn_1`, `dn_2`, `qty`)
          if (
            item1?.inventory?.code === item2?.inventory?.code &&
            item1?.dn_1 === item2?.dn_1 &&  // Comparing dn_1 between obj1 and obj2
            item1?.dn_2 === item2?.dn_2 &&  // Comparing dn_2 between obj1 and obj2
            item1?.qty === item2?.qty       // Comparing qty between obj1 and obj2
          ) {
            // If all conditions match, it's considered identical, so return false to filter out this item
            return false;
          }
  
          // If any condition doesn't match, include the item in the filteredDifferences array
          return true;
        });
  
        // If there are differences, add them to the differences object
        if (filteredDifferences.length > 0) {
          differences[key] = {
            obj1Value: items1,
            obj2Value: items2,
          };
        }
        return;
      }

      //special condition for `quotation stack`
      if(key === 'quotation_stack'){
        const items1 = obj1[key] || [];
        const items2 = obj2[key] || [];

        const filteredDifferences = items1.filter((item1: any, index: any) => {
          const item2 = items2[index];

          if (
            item1?.name === item2?.name &&
            item1?.stack_file?.name === item2?.stack_file?.name 
          ) {
            // If all conditions match, it's considered identical, so return false to filter out this item
            return false;
          }
  
          // If any condition doesn't match, include the item in the filteredDifferences array
          return true;
        });
  
        // If there are differences, add them to the differences object
        if (filteredDifferences.length > 0) {
          differences[key] = {
            obj1Value: items1,
            obj2Value: items2,
          };
        }
        return;
      }
  
      // General comparison for other fields
      if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        differences[key] = {
          obj1Value: obj1[key],
          obj2Value: obj2[key],
        };
      }
    });
  
    return differences;
  }
  
  compareValues(key: string, item1: any, item2: any): boolean {
    // Check if the values for the given key in the two items are different
    if(item1 && item2){
      return item1[key] !== item2[key];
    }

    return false
  }
  

  formatTitleTab(input: string): string {
    return input
      .split('_') // Split the string by underscores
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' '); // Join the words with spaces
  }

  isStacksByIndexObj1(key: string, index: number): boolean {
    const obj1Value = this.result[key]['obj1Value'];
    const obj2Value = this.result[key]['obj2Value'];

    // Get the current item from obj1Value
    const item1 = obj1Value[index];
    const item2 = obj2Value[index];

    return item1 && !item2
  }


  isStacksByIndexObj2(key: string, index: number): boolean {
    const obj1Value = this.result[key]['obj1Value'];
    const obj2Value = this.result[key]['obj2Value'];

    // Get the current item from obj1Value
    const item1 = obj1Value[index];
    const item2 = obj2Value[index];

    return item2 && !item1
    
  }

  isFirstInOnlyObj1(key: string, index: number): boolean {
    const obj1Value = this.result[key]['obj1Value'];
    const obj2Value = this.result[key]['obj2Value'];
  
    // Get the current item from obj1Value
    const item1 = obj1Value[index];
    
    // Check if this item exists in obj2Value
    const existsInObj2 = obj2Value.some((item2: any) => item2.inventory.id === item1.inventory.id);
  
    // Highlight red only if:
    // - The item does not exist in obj2Value
    // - It is the first unmatched item in obj1Value

    const firstUnmatchedIndex = obj1Value.findIndex(
      (item: any) => !obj2Value.some((item2: any) => item2.inventory.id === item.inventory.id)
    );
  
    return !existsInObj2 && firstUnmatchedIndex === index;
  }

  isFirstInOnlyObj2(key: string, index: number): boolean {
    const obj1Value = this.result[key]['obj1Value'];
    const obj2Value = this.result[key]['obj2Value'];
  
    // Get the current item from obj2Value
    const item2 = obj2Value[index];
  
    // Check if this item exists in obj1Value
    const existsInObj1 = obj1Value.some((item1: any) => item1.inventory.id === item2.inventory.id);
  
    // Highlight green only if:
    // - The item does not exist in obj1Value
    // - It is the first unmatched item in obj2Value
    const firstUnmatchedIndex = obj2Value.findIndex(
      (item: any) => !obj1Value.some((item1: any) => item1.inventory.id === item.inventory.id)
    );
  
    return !existsInObj1 && firstUnmatchedIndex === index;
  }
}
