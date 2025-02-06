import { Injectable } from '@angular/core';
import { IDataQuotation, IDetailDataQuotation, IDataCategories } from './interfaces';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { ApiService } from './api.service';
import { from, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelQuotationDetailService {

  provinceList: any[] = [];

  constructor(
    private datePipe: DatePipe,
    private apiSvc: ApiService
  ) { 
    this.apiSvc.getProvinces().subscribe((res) => {
      this.provinceList = res
    })
   }

   private async loadImageAsBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async generateExcel(
    dataBasic: IDataQuotation, 
    dataDetail: IDetailDataQuotation, 
    revision: string, 
    productCategory: IDataCategories[],
    fileType: 'excel' | 'pdf'
  ){

    //get data
    const attention = dataBasic.customer.contactPerson
    .filter(cp => cp.is_attention === 1)
    .map((cp, index, arr) => ({ text: `${cp.name}${index === arr.length - 1 ? '' : ', '}` }));

    const address = dataBasic.customer.address
    const [address1, address2] = address.split('\n');

    let customerLocation = '';

    let categorySummary: 
      { 
        id: number;
        name: string; 
        total: number;
        totalUnitPrice: number;
        totalSellingPrice: number;
        totalUnitPriceInstallation: number;
      }[] = [];


    let totalSellingPrice1 = 0;
    let totalSellingPrice2 = 0;

    let tax = 0;

    let preliminaries = 0;
    let supervision = 0;
    let testCommisioning = 0;

    let allGrandTotalSelling = 0;
    let taxPrice = 0;

    const sortedProductCategory = [...productCategory].sort((a, b) => parseInt(a.level ?? '0') - parseInt(b.level ?? '0'));    

    sortedProductCategory.forEach((cat, i) => {

      let count = 0;
      let totalUnitPrice = 0;
      let totalSellingPrice = 0;
      let totalUnitPriceInstallation = 0;

      dataBasic.total_supplier_product.forEach((supp) => {
        if(supp.id === cat.id){
          totalSellingPrice = supp.total_price
        }
      })

      dataDetail.quotation_revision.forEach((data) => {
        if(data.revision === revision){

          allGrandTotalSelling = parseFloat(data.grand_total_selling_price);
          taxPrice = parseFloat(data.tax_price)

          preliminaries = parseFloat(data.preliminaries);
          supervision = parseFloat(data.supervision);
          testCommisioning = parseFloat(data.test_commisioning);

          tax = parseFloat(data.tax)
          totalSellingPrice2 = parseFloat(parseFloat(data.total_installation_price_after_discount).toFixed(2))
          totalSellingPrice1 = parseFloat(parseFloat(data.total_price_after_discount).toFixed(2))
          data.quotation_items.forEach((item) => {
            if(cat.id === item.inventory.supplier_product.id){
              count++
              totalUnitPrice = parseFloat(item.inventory.default_selling_price) + totalUnitPrice;
              totalUnitPriceInstallation = parseFloat(item.inventory.installation.selling_price) + totalUnitPriceInstallation
            }
          })
        }
      })

      categorySummary.push({
        id: cat.id,
        name: cat.name,
        total: count,
        totalUnitPrice,
        totalSellingPrice,
        totalUnitPriceInstallation
      })
    })

    let totalQty = categorySummary.reduce((acc, cat) => {
      return acc + cat.total
    },0)

    let totalGrandUnitPriceInstallation = categorySummary.reduce((acc, cat) => {
      return acc + cat.totalUnitPriceInstallation
    }, 0)
    

  
  const formattedInstallation = categorySummary
  .filter(c => c.total > 0)
  .map(c => c.name)
  .reduce((acc, name, i, arr) => acc + (i === 0 ? '' : (i === arr.length - 1 ? ' dan ' : ', ')) + name, '');

    //setup excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // ✅ Load Image
    const base64Image = await this.loadImageAsBase64('assets/logo-excel.png');
    const base64Image2 = await this.loadImageAsBase64('assets/alamat.png');

    // ✅ Add Image to Workbook
    const imageId = workbook.addImage({
      base64: base64Image.split(',')[1], // Remove 'data:image/png;base64,'
      extension: 'png',
    });
    const imageId2 = workbook.addImage({
      base64: base64Image2.split(',')[1], // Remove 'data:image/png;base64,'
      extension: 'png',
    });
    

    //header
    worksheet.getColumn('A').width = 14.11;
    worksheet.getColumn('B').width = 4.56;
    worksheet.getColumn('C').width = 74.67;
    worksheet.getColumn('D').width = 12.67;
    worksheet.getColumn('E').width = 7.78;
    worksheet.getColumn('F').width = 24.22;
    worksheet.getColumn('G').width = 24.22;

    worksheet.getRow(1).height = 37.5;
    worksheet.getCell('A1').value = {
      richText: [
        { text: 'PROPOSAL HARGA SISTEM AIR HUJAN SIPHONIC sfm Siphonic System' },
        { text: 'TM', font: { vertAlign: 'superscript' } },
      ],
    };

    worksheet.getCell('A1').font={
      bold: true,
      name: 'Arial',
      size: 18
    }

    worksheet.getCell('A1').alignment = {
      horizontal: 'center',
      vertical: 'bottom'
    }

    worksheet.mergeCells('A1:G1');
    worksheet.getCell('A1').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }

    worksheet.getCell('A2').border = {left: {style: 'thick'}}
    worksheet.getCell('A3').border = {left: {style: 'thick'}}
    worksheet.getCell('A4').border = {left: {style: 'thick'}}
    worksheet.getCell('A5').border = {left: {style: 'thick'}}
    worksheet.getCell('A6').border = {left: {style: 'thick'}}
    worksheet.getCell('A7').border = {left: {style: 'thick'}}
    worksheet.getCell('A8').border = {left: {style: 'thick'}}

    worksheet.getCell('F2').value = 'No Quotation';
    worksheet.getCell('F2').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }
    worksheet.getCell('F2').font = { name: 'Arial' }

    worksheet.getCell('G2').value = dataBasic.quotation_no;
    worksheet.getCell('G2').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }
    worksheet.getCell('G2').font = { name: 'Arial' }

    worksheet.getCell('F3').value = 'Reference';
    worksheet.getCell('F3').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }
    worksheet.getCell('F3').font = { name: 'Arial' };

    worksheet.getCell('G3').value = '0';
    worksheet.getCell('G3').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }
    worksheet.getCell('G3').font = { name: 'Arial' };

    worksheet.getCell('F4').value = 'Issued Date';
    worksheet.getCell('F4').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }
    worksheet.getCell('F4').font = { name: 'Arial' };

    worksheet.getCell('G4').value =  this.datePipe.transform(dataBasic.issued_date, 'dd-MMM-yyyy');
    worksheet.getCell('G4').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }
    worksheet.getCell('G4').font = { name: 'Arial' };

    worksheet.getCell('F5').value = 'Revision';
    worksheet.getCell('F5').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }
    worksheet.getCell('F5').font = { name: 'Arial' };

    worksheet.getCell('G5').value = revision;
    worksheet.getCell('G5').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }
    worksheet.getCell('G5').font = { name: 'Arial' };


    worksheet.getCell('F6').value = 'Prepared By';
    worksheet.getCell('F6').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }
    worksheet.getCell('F6').font = { name: 'Arial' };

    worksheet.getCell('G6').value = dataBasic.prepared_by.name;
    worksheet.getCell('G6').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }
    worksheet.getCell('G6').font = { name: 'Arial' };
    
    worksheet.getCell('F7').value = 'Sales/Architect Name';
    worksheet.getCell('F7').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }
    worksheet.getCell('F7').font = { name: 'Arial' };

    worksheet.getCell('G7').value = dataBasic.project.pic.filter((p) => p.is_pic_internal === 1).map((p) => (p.name))[0];
    worksheet.getCell('G7').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }
    worksheet.getCell('G7').font = { name: 'Arial' };

    worksheet.getCell('F8').value = 'Page';
    worksheet.getCell('F8').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }
    worksheet.getCell('F8').font = { name: 'Arial' };

    worksheet.getCell('G8').value = '1/1';
    worksheet.getCell('G8').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }
    worksheet.getCell('G8').font = { name: 'Arial' };


    worksheet.getCell('A9').border = {
      top: {style: 'thick'},
      left: {style: 'thick'}
    }

    worksheet.addImage(imageId, {
      tl: { col: 0.5, row: 2.5 },  // Start at cell A2 (row index is 0-based)
      ext: { width: 125, height: 75 }, // Set fixed dimensions
    });

    worksheet.addImage(imageId2, {
      tl: { col: 2.5, row: 2.5 },  // Start at cell A2 (row index is 0-based)
      ext: { width: 300, height: 100 }, // Set fixed dimensions
    });

    worksheet.getCell('B9').border = {top: {style: 'thick'}}
    worksheet.getCell('C9').border = {top: {style: 'thick'}}
    worksheet.getCell('D9').border = {top: {style: 'thick'}}
    worksheet.getCell('E9').border = {top: {style: 'thick'}}
    worksheet.getCell('G9').border = {top: {style: 'thick'}}
    worksheet.getCell('F9').border = {top: {style: 'thick'}}

    worksheet.getCell('A10').border = {left: {style: 'thick'}};
    worksheet.getCell('A11').border = {left: {style: 'thick'}};
    worksheet.getCell('A12').border = {left: {style: 'thick'}};
    worksheet.getCell('A13').border = {left: {style: 'thick'}};
    worksheet.getCell('A14').border = {left: {style: 'thick'}};
    worksheet.getCell('A15').border = {left: {style: 'thick'}};
    worksheet.getCell('A16').border = {left: {style: 'thick'}};
    worksheet.getCell('A17').border = {left: {style: 'thick'}};

    worksheet.getCell('G9').border = {right: {style: 'thick'}}
    worksheet.getCell('G10').border = {right: {style: 'thick'}};
    worksheet.getCell('G11').border = {right: {style: 'thick'}};
    worksheet.getCell('G12').border = {right: {style: 'thick'}};
    worksheet.getCell('G13').border = {right: {style: 'thick'}};
    worksheet.getCell('G14').border = {right: {style: 'thick'}};
    worksheet.getCell('G15').border = {right: {style: 'thick'}};
    worksheet.getCell('G16').border = {right: {style: 'thick'}};
    worksheet.getCell('G17').border = {right: {style: 'thick'}};
    

    worksheet.getCell('A9').value = 'Kepada';
    worksheet.getCell('A9').font = { name: 'Arial' };

    worksheet.getCell('C9').value = dataBasic.customer.name;
    worksheet.getCell('C9').font = { name: 'Arial' };

    worksheet.getCell('C10').value = address1;
    worksheet.getCell('C10').font = { name: 'Arial' };

    worksheet.getCell('C11').value = address2;
    worksheet.getCell('C11').font = { name: 'Arial' };

    worksheet.getCell('A12').value = 'Nama Proyek';
    worksheet.getCell('A12').font = { name: 'Arial' };
    
    worksheet.getCell('C12').value = dataBasic.project.name;
    worksheet.getCell('C12').font = { name: 'Arial' };

    worksheet.getCell('A13').value = 'Lokasi Proyek';
    worksheet.getCell('A13').font = { name: 'Arial' };

    worksheet.getCell('C13').value = customerLocation;
    worksheet.getCell('C13').font = { name: 'Arial' };

    worksheet.getCell('A14').value = 'Telpon';
    worksheet.getCell('A14').font = { name: 'Arial' };

    worksheet.getCell('C14').value = dataBasic.customer.phone;
    worksheet.getCell('C14').font = { name: 'Arial' };

    worksheet.getCell('A15').value = 'Fax';
    worksheet.getCell('A15').font = { name: 'Arial' };

    worksheet.getCell('C15').value = '-';
    worksheet.getCell('C15').font = { name: 'Arial' };

    worksheet.getCell('A16').value = 'Attn';
    worksheet.getCell('A16').font = { name: 'Arial' };

    worksheet.getCell('C16').value = {
      richText: attention
    };
    worksheet.getCell('C16').font = { name: 'Arial' };
    
    worksheet.getRow(18).height = 27;
    worksheet.getCell('A18').value = 'No';
    worksheet.getCell('A18').alignment = {horizontal: 'center', vertical: 'middle'};
    worksheet.getCell('A18').font = {
      bold: true,
      name: 'Arial',
      size: 12
    }
    worksheet.getCell('A18').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }

    worksheet.getCell('B18').border = {
      top: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }

    worksheet.getCell('C18').value = 'Deskripsi';
    worksheet.getCell('C18').alignment = {horizontal: 'center', vertical: 'middle'};
    worksheet.getCell('C18').font = {
      bold: true,
      name: 'Arial',
      size: 12
    }
    worksheet.getCell('C18').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'}
    }

    worksheet.getCell('D18').value = 'Jumlah';
    worksheet.getCell('D18').alignment = {horizontal: 'center', vertical: 'middle'};
    worksheet.getCell('D18').font = {
      bold: true,
      name: 'Arial',
      size: 12
    }
    worksheet.getCell('D18').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }

    worksheet.getCell('E18').value = 'Satuan';
    worksheet.getCell('E18').alignment = {horizontal: 'center', vertical: 'middle'};
    worksheet.getCell('E18').font = {
      bold: true,
      name: 'Arial',
      size: 12
    }
    worksheet.getCell('E18').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }

    worksheet.getCell('F18').value = 'Harga Satuan';
    worksheet.getCell('F18').alignment = {horizontal: 'center', vertical: 'middle'};
    worksheet.getCell('F18').font = {
      bold: true,
      name: 'Arial',
      size: 12
    }
    worksheet.getCell('F18').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }

    worksheet.getCell('G18').value = 'Total Harga';
    worksheet.getCell('G18').alignment = {horizontal: 'center', vertical: 'middle'};
    worksheet.getCell('G18').font = {
      bold: true,
      name: 'Arial',
      size: 12
    }
    worksheet.getCell('G18').border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
      left: {style: 'thick'}
    }

    worksheet.getCell('A19').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    }

    worksheet.getCell('C19').border = {
      right: {style: 'thick'}
    }

    worksheet.getCell('D19').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    }

    worksheet.getCell('E19').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    }

    worksheet.getCell('G19').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    }

    worksheet.getCell('F19').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    }


    worksheet.getCell('A20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };
    worksheet.getCell('A20').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };


    worksheet.mergeCells('B20:C20');
    worksheet.getRow(20).height = 50;
    worksheet.getCell('C20').value = {
      richText: [
        {text: 'PENAWARAN SISTEM DRAINASE AIR HUJAN - sfm Siphonic System', font: {bold: true, size: 14, name: 'Arial'}},
        { text: 'TM', font: { vertAlign: 'superscript', bold: true, size: 14, name: 'Arial' } },
      ]
    }
    worksheet.getCell('C20').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell('C20').alignment = {horizontal: 'left', wrapText: true, vertical: 'top'}
    worksheet.getCell('C20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };


    worksheet.getCell('D20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };
    worksheet.getCell('D20').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell('E20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };
    worksheet.getCell('E20').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell('G20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };
    worksheet.getCell('G20').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell('F20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };
    worksheet.getCell('F20').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell('A21').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    }

    worksheet.getCell('C21').border = {
      right: {style: 'thick'}
    }

    worksheet.getCell('D21').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    }

    worksheet.getCell('E21').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    }

    worksheet.getCell('G21').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    }

    worksheet.getCell('F21').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    }

    
    worksheet.getRow(22).height = 40;
    worksheet.getCell('A22').value = '1',
    worksheet.getCell('A22').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };
    worksheet.getCell('A22').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell('A22').alignment = {horizontal: 'center', vertical: 'middle'}
    worksheet.getCell('A22').font = {size: 12, bold: true, name: 'Arial'}

    worksheet.mergeCells('B22:C22');

    worksheet.getCell('C22').value = {
      richText: [
        {text: 'PEKERJAAN PENGADAAN MATERIAL KOMPONEN  SFM SIPHONIC SYSTEM', font: {bold: true, size: 12, name: 'Arial'}},
        { text: 'TM', font: { vertAlign: 'superscript', bold: true, size: 12, name: 'Arial' } },
      ]
    }

    worksheet.getCell('C22').alignment = {wrapText: true, vertical: 'middle'}

    worksheet.getCell('C22').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell('C22').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell('D22').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell('D22').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell('E22').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell('E22').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell('G22').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };
    
    worksheet.getCell('G22').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell('F22').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell('F22').border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    let currentRow = 22;

    categorySummary.forEach((cat, i) => {
      if(cat.total > 0) {
        currentRow++;
        worksheet.getRow(currentRow).height = 60;

        worksheet.getCell(`A${currentRow}`).border = {
          right: {style: 'thick'},
          left: {style: 'thick'}
        };


        worksheet.getCell(`B${currentRow}`).value = `1.${i+1}`
        worksheet.getCell(`B${currentRow}`).alignment = {vertical: 'top'};

        if(cat.name.toLowerCase() === 'sro'){
          worksheet.getCell(`C${currentRow}`).value = {
            richText: [
              {text: 'sfm NOFLAF', font: {bold: true, size: 12, name: 'Arial'}},
              { text: 'TM', font: { vertAlign: 'superscript', bold: true, size: 12, name: 'Arial' } },
              { text: ' Siphonic Roof Outlet (SRO) metalik dari material Stainless Steel dan/atau paduan Aluminium untuk aplikasi sistem', font: {size: 12, name: 'Arial'} },
              { text: ' sfm Siphonic System', font: {bold: true, size: 12, name: 'Arial'} },
              { text: 'TM', font: { vertAlign: 'superscript', bold: true, size: 12, name: 'Arial' } },
              { text: '.', font: {size: 12, name: 'Arial' } },
            ]
          }
        } else if(cat.name.toLowerCase() === 'pipe'){
          worksheet.getCell(`C${currentRow}`).value = {
            richText: [
              {text: 'Pipa uPVC', font: {size: 12, name: 'Arial'}},
              {text: ' sfm SiphonicPipe', font: {bold: true, size: 12, name: 'Arial'}},
              { text: 'TM', font: { vertAlign: 'superscript', bold: true, size: 12, name: 'Arial' } },
              { text: ' untuk aplikasi sfm Siphonic System', font: {size: 12, name: 'Arial' } },
              { text: 'TM', font: {vertAlign: 'superscript', size: 12, name: 'Arial'} },
              { text: ' yang dapat menahan tekanan kerja positif 6 bar dan negatif -0.9 bar.', font: { size: 12, name: 'Arial' } },
            ]
          }
        } else if(cat.name.toLowerCase() === 'fitting'){
          worksheet.getCell(`C${currentRow}`).value = {
            richText: [
              {text: 'Fiting uPVC', font: {size: 12, name: 'Arial'}},
              { text: ' untuk aplikasi sfm Siphonic System', font: {size: 12, name: 'Arial' } },
              { text: 'TM', font: {vertAlign: 'superscript', size: 12, name: 'Arial'} },
              { text: ' yang dapat menahan tekanan kerja positif 6 bar dan negatif -0.9 bar.', font: { size: 12, name: 'Arial' } },
            ]
          }
        } else if(cat.name.toLowerCase() === 'bracketing' || cat.name.toLowerCase() === 'standard bracketing' ){
          worksheet.getCell(`C${currentRow}`).value = {
            richText: [
              {text: 'Standard bracketing', font: {size: 12, name: 'Arial'}},
              { text: ' sfm Dinamix', font: {bold: true, size: 12, name: 'Arial' } },
              { text: 'TM', font: {bold: true, vertAlign: 'superscript', size: 12, name: 'Arial'} },
              { text: ' system untuk aplikasi pada', font: { size: 12, name: 'Arial' } },
              {text: ' sfm SiphonicPipe', font: {bold: true, size: 12, name: 'Arial'}},
              { text: 'TM', font: { vertAlign: 'superscript', bold: true, size: 12, name: 'Arial' } },
              { text: '.', font: {size: 12, name: 'Arial' } },
            ]
          }
        } else if(cat.name.toLowerCase() === 'non-standard bracketing'){
          worksheet.getCell(`C${currentRow}`).value = {
            richText: [
              {text: 'Non Standard bracketing', font: {size: 12, name: 'Arial'}},
              {text: ' (Item diluar standar', font: {size: 12, name: 'Arial'}},
              { text: ' sfm Dinamix', font: {bold: true, size: 12, name: 'Arial' } },
              { text: 'TM', font: {bold: true, vertAlign: 'superscript', size: 12, name: 'Arial'} },
              { text: ' menyesuaikan kondisi di gambar/ lapangan) - ', font: { size: 12, name: 'Arial' } },
              {text: 'Exclude', font: {bold: true, size: 12, name: 'Arial', color: {argb: 'ffff0000'}}},
            ]
          }
        } else if(cat.name.toLowerCase() === 'solvent cement'){
          worksheet.getCell(`C${currentRow}`).value = 'Solvent Cement untuk Aplikasi Sistem Siphonic (untuk material uPVC)'
        } else {
          worksheet.getCell(`C${currentRow}`).value = cat.name
        }

        
        worksheet.getCell(`C${currentRow}`).font = {
          name: 'Arial',
          size: 12
        }
        worksheet.getCell(`C${currentRow}`).border = {
          right: {style: 'thick'}
        };
        worksheet.getCell(`C${currentRow}`).alignment = {wrapText: true, vertical: 'top'}

        worksheet.getCell(`D${currentRow}`).value = 1;
        worksheet.getCell(`D${currentRow}`).font = {
          name: 'Arial',
          size: 12
        }
        worksheet.getCell(`D${currentRow}`).border = {
          right: {style: 'thick'},
          left: {style: 'thick'}
        };
        worksheet.getCell(`D${currentRow}`).alignment = {horizontal: 'center', vertical: 'top'};
  
        
        worksheet.getCell(`E${currentRow}`).value = 'lot'
        worksheet.getCell(`E${currentRow}`).font = {
          name: 'Arial',
          size: 12
        }
        worksheet.getCell(`E${currentRow}`).border = {
          right: {style: 'thick'},
          left: {style: 'thick'}
        };
        worksheet.getCell(`E${currentRow}`).alignment = {horizontal: 'center', vertical: 'top'};
  
        worksheet.getCell(`F${currentRow}`).value = cat.totalUnitPrice
        worksheet.getCell(`F${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)'; 
        worksheet.getCell(`F${currentRow}`).font = {
          name: 'Arial',
          size: 12
        }
        worksheet.getCell(`F${currentRow}`).border = {
          right: {style: 'thick'},
          left: {style: 'thick'}
        };
        worksheet.getCell(`F${currentRow}`).alignment = {horizontal: 'center', vertical: 'top'};
  
        worksheet.getCell(`G${currentRow}`).value = cat.totalSellingPrice
        worksheet.getCell(`G${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)'; 
        worksheet.getCell(`G${currentRow}`).font = {
          name: 'Arial',
          size: 12
        }
        worksheet.getCell(`G${currentRow}`).border = {
          right: {style: 'thick'},
          left: {style: 'thick'}
        };
        worksheet.getCell(`G${currentRow}`).alignment = {horizontal: 'center', vertical: 'top'};
      }

      currentRow++;
      worksheet.getCell(`A${currentRow}`).border = {
        right: {style: 'thick'},
        left: {style: 'thick'}
      }
  
      worksheet.getCell(`D${currentRow}`).border = {
        right: {style: 'thick'},
        left: {style: 'thick'},
      }
  
      worksheet.getCell(`E${currentRow}`).border = {
        right: {style: 'thick'},
        left: {style: 'thick'},
      }
  
      worksheet.getCell(`F${currentRow}`).border = {
        right: {style: 'thick'},
        left: {style: 'thick'},
      }
  
      worksheet.getCell(`G${currentRow}`).border = {
        right: {style: 'thick'},
        left: {style: 'thick'},
      }

      const sortOrder = ['Elbow', 'Reducer', 'Branch'];
      dataDetail.quotation_revision.forEach((data) => {
        if (data.revision === revision) {
          data.quotation_items
          .filter((item) => cat.id === item.inventory.supplier_product.id) // Filter first
          .sort((a, b) => {
            if (cat.name.toLowerCase() === 'fitting') {
              const indexA = sortOrder.findIndex((order) => a.inventory.sub_category.name === order);
              const indexB = sortOrder.findIndex((order) => b.inventory.sub_category.name === order);
        
              return (indexA === -1 ? sortOrder.length : indexA) - (indexB === -1 ? sortOrder.length : indexB);
            }
            return 0; // No sorting if not 'fitting'
          })
          .forEach((item) => {

            worksheet.getCell(`A${currentRow}`).border = {
              right: {style: 'thick'},
              left: {style: 'thick'}
            };

            // Column title for inventory
            worksheet.getCell(`C${currentRow}`).value = `- ${item.inventory.description}`;
            worksheet.getCell(`C${currentRow}`).font = {
              name: 'Arial',
              size: 11,
            };
  
            //Column qty
            worksheet.getCell(`D${currentRow}`).value = parseFloat(item.qty);
            worksheet.getCell(`D${currentRow}`).font = {
              name: 'Arial',
              size: 11,
              color: { argb: 'ffff6347' },
            };
            worksheet.getCell(`D${currentRow}`).border = {
              left: { style: 'thick' },
              right: { style: 'thick' },
            };

            worksheet.getCell(`D${currentRow}`).alignment = {horizontal: 'center'}

            //Column Unit
            worksheet.getCell(`E${currentRow}`).value = item.inventory.unit.name;
            worksheet.getCell(`E${currentRow}`).alignment = {horizontal: 'center'}
            worksheet.getCell(`E${currentRow}`).border = {
              left: { style: 'thick' },
              right: { style: 'thick' },
            };

            //Column Unit Price
            worksheet.getCell(`F${currentRow}`).border = {
              left: { style: 'thick' },
              right: { style: 'thick' },
            };

            //Column Total Selling Price
            worksheet.getCell(`G${currentRow}`).border = {
              left: { style: 'thick' },
              right: { style: 'thick' },
            };
  
            currentRow++;

            worksheet.getCell(`A${currentRow}`).border = {
              right: {style: 'thick'},
              left: {style: 'thick'}
            }
        
            worksheet.getCell(`D${currentRow}`).border = {
              right: {style: 'thick'},
              left: {style: 'thick'},
            }
        
            worksheet.getCell(`E${currentRow}`).border = {
              right: {style: 'thick'},
              left: {style: 'thick'},
            }
        
            worksheet.getCell(`F${currentRow}`).border = {
              right: {style: 'thick'},
              left: {style: 'thick'},
            }
        
            worksheet.getCell(`G${currentRow}`).border = {
              right: {style: 'thick'},
              left: {style: 'thick'},
            }
          });
        }
      });
    })

    worksheet.getCell(`A${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    }

    worksheet.getCell(`D${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'},
    }

    worksheet.getCell(`E${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'},
    }

    worksheet.getCell(`F${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'},
    }

    worksheet.getCell(`G${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'},
    }

    currentRow++;
    worksheet.getCell(`A${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    }
    
    worksheet.getCell(`B${currentRow}`).border = {
      left: {style: 'thick'}
    }

    worksheet.getCell(`C${currentRow}`).border = {
      right: {style: 'thick'}
    }

    worksheet.getCell(`D${currentRow}`).value = 'Sub Total 1';
    worksheet.getCell(`D${currentRow}`).border = {
      right: {style: 'thick'},
      top: {style: 'thick'},
      left: {style: 'thick'},
      bottom: {style: 'thick'}
    }

    worksheet.getCell(`E${currentRow}`).border = {
      top: {style: 'thick'},
      bottom: {style: 'thick'}
    }

    worksheet.getCell(`F${currentRow}`).border = {
      top: {style: 'thick'},
      bottom: {style: 'thick'}
    }

    worksheet.getCell(`G${currentRow}`).value = totalSellingPrice1;
    worksheet.getCell(`G${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';
    worksheet.getCell(`G${currentRow}`).border = {
      top: {style: 'thick'},
      bottom: {style: 'thick'},
      right: {style: 'thick'}
    }

    currentRow++;
    worksheet.getCell(`A${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    }
    
    worksheet.getCell(`B${currentRow}`).border = {
      left: {style: 'thick'}
    }

    worksheet.getCell(`C${currentRow}`).border = {
      right: {style: 'thick'}
    }

    worksheet.getCell(`D${currentRow}`).value = 'Discount';
    worksheet.getCell(`D${currentRow}`).border = {
      right: {style: 'thick'},
      top: {style: 'thick'},
      left: {style: 'thick'},
      bottom: {style: 'thick'}
    }

    worksheet.getCell(`E${currentRow}`).border = {
      top: {style: 'thick'},
      bottom: {style: 'thick'}
    }

    worksheet.getCell(`F${currentRow}`).border = {
      top: {style: 'thick'},
      bottom: {style: 'thick'}
    }
    worksheet.getCell(`F${currentRow}`).value = '%0';

    worksheet.getCell(`G${currentRow}`).value = 0;
    worksheet.getCell(`G${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';
    worksheet.getCell(`G${currentRow}`).border = {
      top: {style: 'thick'},
      bottom: {style: 'thick'},
      right: {style: 'thick'}
    }


    currentRow++;
    worksheet.getCell(`A${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    }
    
    worksheet.getCell(`B${currentRow}`).border = {
      left: {style: 'thick'}
    }

    worksheet.getCell(`C${currentRow}`).border = {
      right: {style: 'thick'}
    }


    worksheet.getCell(`D${currentRow}`).value = 'Total 1';
    worksheet.getCell(`D${currentRow}`).font = {
      bold: true
    }
    worksheet.getCell(`D${currentRow}`).border = {
      right: {style: 'thick'},
      top: {style: 'thick'},
      left: {style: 'thick'},
      bottom: {style: 'thick'}
    }
    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell(`E${currentRow}`).border = {
      top: {style: 'thick'},
      left: {style: 'thick'},
      bottom: {style: 'thick'},
    };
    worksheet.getCell(`E${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell(`F${currentRow}`).border = {
      top: {style: 'thick'},
      bottom: {style: 'thick'}
    }

    worksheet.getCell(`F${currentRow}`).border = {
      top: {style: 'thick'},
      bottom: {style: 'thick'},
    };
    worksheet.getCell(`F${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell(`G${currentRow}`).value = totalSellingPrice1;
    worksheet.getCell(`G${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';
    worksheet.getCell(`G${currentRow}`).border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
    };
    worksheet.getCell(`G${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };
    
    currentRow++;
    worksheet.getCell(`A${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`D${currentRow}`).border = {
      left: {style: 'thick'}
    };
    worksheet.getCell(`G${currentRow}`).border = {
      right: {style: 'thick'}
    };
    currentRow++;

    worksheet.getRow(currentRow).height = 50;
    worksheet.getCell(`A${currentRow}`).value = '2',
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };
    worksheet.getCell(`A${currentRow}`).border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`A${currentRow}`).alignment = {horizontal: 'center', vertical: 'middle'}
    worksheet.getCell(`A${currentRow}`).font = {size: 12, bold: true, name: 'Arial'}

    worksheet.mergeCells(`B${currentRow}:C${currentRow}`);
    worksheet.getCell(`B${currentRow}`).value = {
      richText: [
        {text: 'PEKERJAAN PEMASANGAN, SUPERVISI DAN TEST & COMISSIONING  SFM SIPHONIC SYSTEMS', font: {bold: true, size: 12, name: 'Arial'}},
        { text: 'TM', font: { vertAlign: 'superscript', bold: true, size: 12, name: 'Arial' } },
      ]
    }
    worksheet.getCell(`B${currentRow}`).border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`B${currentRow}`).alignment = {wrapText: true, horizontal: 'left', vertical: 'middle'}
    worksheet.getCell(`B${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell(`D${currentRow}`).border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell(`E${currentRow}`).border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`E${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell(`G${currentRow}`).border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`G${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell(`F${currentRow}`).border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`F${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    currentRow++;
    worksheet.getCell(`A${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell(`B${currentRow}`).border = {
      left: {style: 'thick'}
    };

    worksheet.getCell(`C${currentRow}`).border = {
      right: {style: 'thick'}
    };

    worksheet.getCell(`D${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell(`E${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell(`G${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell(`F${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    currentRow++;
    worksheet.getRow(currentRow).height = 32;

    worksheet.getCell(`A${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell(`B${currentRow}`).value = '2.1';
    worksheet.getCell(`B${currentRow}`).alignment = {vertical: 'top'};

    worksheet.getCell(`C${currentRow}`).value = 'Pekerjaan Preliminaries';
    worksheet.getCell(`C${currentRow}`).font = {
      name: 'Arial',
      size: 12
    }
    worksheet.getCell(`C${currentRow}`).alignment = {vertical: 'top', wrapText: true}

    worksheet.getCell(`D${currentRow}`).value = '1';
    worksheet.getCell(`D${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`D${currentRow}`).alignment = {vertical: 'middle', horizontal: 'center'}
    worksheet.getCell(`D${currentRow}`).font = {
      name: 'Arial',
      size: 12
    }

    worksheet.getCell(`E${currentRow}`).value = 'lot'
    worksheet.getCell(`E${currentRow}`).font = {
      name: 'Arial',
      size: 12
    }
    worksheet.getCell(`E${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`E${currentRow}`).alignment = {vertical: 'middle', horizontal: 'center'}

    worksheet.getCell(`F${currentRow}`).value = preliminaries;

    worksheet.getCell(`F${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';

    worksheet.getCell(`F${currentRow}`).font = {
      name: 'Arial',
      size: 12
    }
    worksheet.getCell(`F${currentRow}`).alignment = {vertical: 'middle'};

    worksheet.getCell(`F${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell(`G${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell(`G${currentRow}`).value = preliminaries;

    worksheet.getCell(`G${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';

    worksheet.getCell(`G${currentRow}`).font = {
      name: 'Arial',
      size: 12
    }
    worksheet.getCell(`G${currentRow}`).alignment = {vertical: 'middle'};



    currentRow++;
    worksheet.getRow(currentRow).height = 50;

    worksheet.getCell(`A${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell(`B${currentRow}`).value = '2.2';
    worksheet.getCell(`B${currentRow}`).alignment = {vertical: 'middle'};

    worksheet.getCell(`C${currentRow}`).value = `Pemasangan Material Komponen SFM Siphonic Systems (${formattedInstallation})`;
    worksheet.getCell(`C${currentRow}`).font = {
      name: 'Arial',
      size: 12
    }
    worksheet.getCell(`C${currentRow}`).alignment = {wrapText: true, vertical: 'middle'}

    worksheet.getCell(`D${currentRow}`).value = 1;
    worksheet.getCell(`D${currentRow}`).alignment = {horizontal: 'center', vertical: 'middle'}
    worksheet.getCell(`D${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`E${currentRow}`).value = 'lot'
    worksheet.getCell(`E${currentRow}`).font = {
      name: 'Arial',
      size: 12
    }
    worksheet.getCell(`E${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`E${currentRow}`).alignment = {horizontal: 'center', vertical: 'middle'}

    worksheet.getCell(`G${currentRow}`).value = totalSellingPrice2; 
    worksheet.getCell(`G${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';
    worksheet.getCell(`G${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`G${currentRow}`).font = {
      name: 'Arial',
      size: 12
    }
    worksheet.getCell(`G${currentRow}`).alignment = {vertical: 'middle'};

    worksheet.getCell(`F${currentRow}`).value = totalGrandUnitPriceInstallation;
    worksheet.getCell(`F${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';
    worksheet.getCell(`F${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`F${currentRow}`).font = {
      name: 'Arial',
      size: 12
    }
    worksheet.getCell(`F${currentRow}`).alignment = {vertical: 'middle'};

    currentRow++;

    worksheet.getRow(currentRow).height = 32;

    worksheet.getCell(`A${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell(`B${currentRow}`).value = '2.3';
    worksheet.getCell(`B${currentRow}`).alignment = {vertical: 'top'};

    worksheet.getCell(`C${currentRow}`).value = `Supervision`;
    worksheet.getCell(`C${currentRow}`).font = {
      name: 'Arial',
      size: 12
    }
    worksheet.getCell(`C${currentRow}`).alignment = {vertical: 'top'};

    worksheet.getCell(`D${currentRow}`).value = 1;
    worksheet.getCell(`D${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`D${currentRow}`).alignment = {horizontal: 'center', vertical: 'middle'};

    worksheet.getCell(`E${currentRow}`).value = 'lot'
    worksheet.getCell(`E${currentRow}`).font = {
      name: 'Arial',
      size: 12
    }
    worksheet.getCell(`E${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`E${currentRow}`).alignment = {horizontal: 'center', vertical: 'middle'};

    worksheet.getCell(`G${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell(`G${currentRow}`).value = supervision;

    worksheet.getCell(`G${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';

    worksheet.getCell(`G${currentRow}`).font = {
      name: 'Arial',
      size: 12
    }
    worksheet.getCell(`G${currentRow}`).alignment = {vertical: 'middle'}

    worksheet.getCell(`F${currentRow}`).alignment = {vertical: 'middle'};
    worksheet.getCell(`F${currentRow}`).value = supervision;
    worksheet.getCell(`F${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';
    worksheet.getCell(`F${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    currentRow++;
    worksheet.getRow(currentRow).height = 32;

    worksheet.getCell(`A${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell(`B${currentRow}`).value = '2.4';
    worksheet.getCell(`B${currentRow}`).alignment = {vertical: 'top'};

    worksheet.getCell(`C${currentRow}`).value = `Test & Commisioning`;
    worksheet.getCell(`C${currentRow}`).font = {
      name: 'Arial',
      size: 12
    }
    worksheet.getCell(`C${currentRow}`).alignment = {vertical: 'top'};

    worksheet.getCell(`D${currentRow}`).value = 1;
    worksheet.getCell(`D${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`D${currentRow}`).alignment = {horizontal: 'center', vertical: 'middle'};

    worksheet.getCell(`E${currentRow}`).value = 'lot'
    worksheet.getCell(`E${currentRow}`).font = {
      name: 'Arial',
      size: 12
    }
    worksheet.getCell(`E${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`E${currentRow}`).alignment = {horizontal: 'center', vertical: 'middle'};

    worksheet.getCell(`G${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell(`G${currentRow}`).value = testCommisioning;

    worksheet.getCell(`G${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';

    worksheet.getCell(`G${currentRow}`).font = {
      name: 'Arial',
      size: 12
    }
    worksheet.getCell(`G${currentRow}`).alignment = {vertical: 'middle'};

    worksheet.getCell(`F${currentRow}`).alignment = {vertical: 'middle'};
    worksheet.getCell(`F${currentRow}`).value = testCommisioning;
    worksheet.getCell(`F${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';
    worksheet.getCell(`F${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    currentRow++;
    worksheet.getCell(`A${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell(`B${currentRow}`).border = {
      left: {style: 'thick'}
    };

    worksheet.getCell(`C${currentRow}`).border = {
      right: {style: 'thick'}
    };


    worksheet.getCell(`D${currentRow}`).value = 'Sub Total 2';
    worksheet.getCell(`D${currentRow}`).border = {
      top: {style: 'thick'},
      bottom: {style: 'thick'},
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell(`E${currentRow}`).border = {
      top: {style: 'thick'},
      left: {style: 'thick'},
      bottom: {style: 'thick'},
    };

    worksheet.getCell(`F${currentRow}`).border = {
      top: {style: 'thick'},
      bottom: {style: 'thick'},
    };

    worksheet.getCell(`G${currentRow}`).value = totalSellingPrice2 + preliminaries + supervision + testCommisioning;
    worksheet.getCell(`G${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';
    worksheet.getCell(`G${currentRow}`).border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
    };

    currentRow++;
    worksheet.getCell(`A${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell(`B${currentRow}`).border = {
      left: {style: 'thick'}
    };

    worksheet.getCell(`C${currentRow}`).border = {
      right: {style: 'thick'}
    };


    worksheet.getCell(`D${currentRow}`).value = 'Discount';
    worksheet.getCell(`D${currentRow}`).border = {
      top: {style: 'thick'},
      bottom: {style: 'thick'},
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell(`E${currentRow}`).border = {
      top: {style: 'thick'},
      left: {style: 'thick'},
      bottom: {style: 'thick'},
    };

    worksheet.getCell(`F${currentRow}`).value = '%0';
    worksheet.getCell(`F${currentRow}`).border = {
      top: {style: 'thick'},
      bottom: {style: 'thick'},
    };

    worksheet.getCell(`G${currentRow}`).value = 0;
    worksheet.getCell(`G${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';
    worksheet.getCell(`G${currentRow}`).border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
    };

    currentRow++;
    worksheet.getCell(`A${currentRow}`).border = {
      right: {style: 'thick'},
      left: {style: 'thick'}
    };

    worksheet.getCell(`B${currentRow}`).border = {
      left: {style: 'thick'}
    };

    worksheet.getCell(`C${currentRow}`).border = {
      right: {style: 'thick'}
    };

    worksheet.getCell(`D${currentRow}`).value = 'Total 2';
    worksheet.getCell(`D${currentRow}`).font = {
      bold: true
    }
    worksheet.getCell(`D${currentRow}`).border = {
      top: {style: 'thick'},
      bottom: {style: 'thick'},
      right: {style: 'thick'},
      left: {style: 'thick'}
    };
    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell(`E${currentRow}`).border = {
      top: {style: 'thick'},
      left: {style: 'thick'},
      bottom: {style: 'thick'},
    };
    worksheet.getCell(`E${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell(`F${currentRow}`).border = {
      top: {style: 'thick'},
      bottom: {style: 'thick'},
    };
    worksheet.getCell(`F${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };
  
    worksheet.getCell(`G${currentRow}`).value = totalSellingPrice2 + preliminaries + supervision + testCommisioning;
    worksheet.getCell(`G${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';
    worksheet.getCell(`G${currentRow}`).border = {
      top: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'},
    };
    worksheet.getCell(`G${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    //space kosong
    for (let i = 0; i < 10; i++) {
      currentRow++;
      
      worksheet.getCell(`A${currentRow}`).border = {
        left: { style: 'thick' },
        right: { style: 'thick' }
      };
    
      worksheet.getCell(`C${currentRow}`).border = {
        right: { style: 'thick' }
      };
    
      worksheet.getCell(`G${currentRow}`).border = {
        right: { style: 'thick' }
      };
      
    }
  
    currentRow++;

    worksheet.getCell(`A${currentRow}`).value = 'Note:';
    worksheet.getCell(`A${currentRow}`).font = {
      bold: true,
      name: 'Arial',
      size: 12
    };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    worksheet.getCell(`A${currentRow}`).alignment = {horizontal: 'left'};
    worksheet.getCell(`A${currentRow}`).border = { top: {style: 'thick'}, left: {style: 'thick'} };

    worksheet.getCell(`B${currentRow}`).border = { top: {style: 'thick'} };
    worksheet.getCell(`B${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`C${currentRow}`).border = { top: {style: 'thick'}, right: {style: 'thick'} };
    worksheet.getCell(`C${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`D${currentRow}`).value = 'Total (1+2)';
    worksheet.getCell(`D${currentRow}`).font = {
      name: 'Arial',
      size: 12
    };
    worksheet.getCell(`D${currentRow}`).border = {
      top: {style: 'thick'}, 
      left: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'}
    };

    worksheet.getCell(`E${currentRow}`).border = {
      top: {style: 'thick'}, 
      left: {style: 'thick'},
      bottom: {style: 'thick'}
    };

    worksheet.getCell(`F${currentRow}`).border = {
      top: {style: 'thick'}, 
      right: {style: 'thick'},
      bottom: {style: 'thick'}
    };

    worksheet.getCell(`G${currentRow}`).value = allGrandTotalSelling;
    worksheet.getCell(`G${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';
    worksheet.getCell(`G${currentRow}`).font = {
      name: 'Arial',
      size: 12,
      bold: true
    };
    worksheet.getCell(`G${currentRow}`).border = {
      top: {style: 'thick'}, 
      left: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'}
    };

    currentRow++;


    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`A${currentRow}`).border = { left: {style: 'thick'} };

    worksheet.getCell(`B${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`C${currentRow}`).border = {right: {style: 'thick'} };
    worksheet.getCell(`C${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`D${currentRow}`).value = 'Round';
    worksheet.getCell(`D${currentRow}`).font = {
      name: 'Arial',
      size: 12
    };
    worksheet.getCell(`D${currentRow}`).border = {
      top: {style: 'thick'}, 
      left: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'}
    };

    worksheet.getCell(`E${currentRow}`).border = {
      top: {style: 'thick'}, 
      left: {style: 'thick'},
      bottom: {style: 'thick'}
    };

    worksheet.getCell(`F${currentRow}`).border = {
      top: {style: 'thick'}, 
      right: {style: 'thick'},
      bottom: {style: 'thick'}
    };

    worksheet.getCell(`G${currentRow}`).value = allGrandTotalSelling;
    worksheet.getCell(`G${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';
    worksheet.getCell(`G${currentRow}`).font = {
      name: 'Arial',
      size: 12,
      bold: true
    };
    worksheet.getCell(`G${currentRow}`).border = {
      top: {style: 'thick'}, 
      left: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'}
    };

    currentRow++;

    worksheet.getCell(`A${currentRow}`).value = '1';
    worksheet.getCell(`A${currentRow}`).font = {
      name: 'Arial',
      size: 12
    };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    worksheet.getCell(`A${currentRow}`).alignment = {horizontal: 'right'};

    worksheet.getCell(`A${currentRow}`).border = { left: {style: 'thick'} };

    worksheet.mergeCells(`B${currentRow}:C${currentRow}`);

    worksheet.getCell(`B${currentRow}`).value = ' Waktu Pengiriman: 45 Hari';
    worksheet.getCell(`B${currentRow}`).font = {
      name: 'Arial',
      size: 12
    };
    worksheet.getCell(`B${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    worksheet.getCell(`B${currentRow}`).alignment = {horizontal: 'left'}

    worksheet.getCell(`C${currentRow}`).border = {right: {style: 'thick'} };
    worksheet.getCell(`C${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`D${currentRow}`).value = `TAX ${tax}%`;
    worksheet.getCell(`D${currentRow}`).font = {
      name: 'Arial',
      size: 12
    };
    worksheet.getCell(`D${currentRow}`).border = {
      top: {style: 'thick'}, 
      left: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'}
    };

    worksheet.getCell(`E${currentRow}`).border = {
      top: {style: 'thick'}, 
      left: {style: 'thick'},
      bottom: {style: 'thick'}
    };

    worksheet.getCell(`F${currentRow}`).border = {
      top: {style: 'thick'}, 
      right: {style: 'thick'},
      bottom: {style: 'thick'}
    };

    worksheet.getCell(`G${currentRow}`).value = taxPrice;
    worksheet.getCell(`G${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';
    worksheet.getCell(`G${currentRow}`).font = {
      name: 'Arial',
      size: 12,
      bold: true
    };
    worksheet.getCell(`G${currentRow}`).border = {
      top: {style: 'thick'}, 
      left: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'}
    };

    currentRow++;

    worksheet.getCell(`A${currentRow}`).value = '2';
    worksheet.getCell(`A${currentRow}`).font = {
      name: 'Arial',
      size: 12
    };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    worksheet.getCell(`A${currentRow}`).alignment = {horizontal: 'right'};
    worksheet.getCell(`A${currentRow}`).border = {left: {style: 'thick'} };

    worksheet.mergeCells(`B${currentRow}:C${currentRow}`);

    worksheet.getCell(`B${currentRow}`).value = ' Penawaran Berlaku: 2 Minggu';
    worksheet.getCell(`B${currentRow}`).font = {
      name: 'Arial',
      size: 12
    };
    worksheet.getCell(`B${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    worksheet.getCell(`B${currentRow}`).alignment = {horizontal: 'left'};

    worksheet.getCell(`C${currentRow}`).border = {right: {style: 'thick'} };
    worksheet.getCell(`C${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`D${currentRow}`).value = 'Grand Total';
    worksheet.getCell(`D${currentRow}`).font = {
      name: 'Arial',
      size: 12
    };
    worksheet.getCell(`D${currentRow}`).border = {
      top: {style: 'thick'}, 
      left: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'}
    };

    worksheet.getCell(`E${currentRow}`).border = {
      top: {style: 'thick'}, 
      left: {style: 'thick'},
      bottom: {style: 'thick'}
    };

    worksheet.getCell(`F${currentRow}`).border = {
      top: {style: 'thick'}, 
      right: {style: 'thick'},
      bottom: {style: 'thick'}
    };

    worksheet.getCell(`G${currentRow}`).value = allGrandTotalSelling + taxPrice;
    worksheet.getCell(`G${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)';
    worksheet.getCell(`G${currentRow}`).font = {
      name: 'Arial',
      size: 12,
      bold: true
    };
    worksheet.getCell(`G${currentRow}`).border = {
      top: {style: 'thick'}, 
      left: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style: 'thick'}
    };

    currentRow++;

    worksheet.getCell(`A${currentRow}`).value = '3';
    worksheet.getCell(`A${currentRow}`).font = {
      name: 'Arial',
      size: 12
    };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    worksheet.getCell(`A${currentRow}`).alignment = {horizontal: 'right'};
    worksheet.getCell(`A${currentRow}`).border = { left: {style: 'thick'} };

    worksheet.mergeCells(`B${currentRow}:C${currentRow}`);

    worksheet.getCell(`B${currentRow}`).value = ' Sifat Pekerjaan: Unit Price, Sesuai dengan lingkup Pekerjaan';
    worksheet.getCell(`B${currentRow}`).font = {
      name: 'Arial',
      size: 12
    };
    worksheet.getCell(`B${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'left'};

    worksheet.getCell(`C${currentRow}`).border = {right: {style: 'thick'} };
    worksheet.getCell(`C${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`D${currentRow}`).font = {
      name: 'Arial',
      size: 12
    };
    worksheet.getCell(`D${currentRow}`).border = {
      top: {style: 'thick'}, 
      left: {style: 'thick'},
    };

    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    
    worksheet.getCell(`E${currentRow}`).border = {
      top: {style: 'thick'}, 
    };

    worksheet.getCell(`E${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`F${currentRow}`).border = {
      top: {style: 'thick'}, 
    };

    worksheet.getCell(`F${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`G${currentRow}`).border = {
      top: {style: 'thick'},
      right: {style: 'thick'}, 
    };

    worksheet.getCell(`G${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    currentRow++;

    worksheet.getCell(`A${currentRow}`).value = '4';
    worksheet.getCell(`A${currentRow}`).font = {
      name: 'Arial',
      size: 12
    };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    worksheet.getCell(`A${currentRow}`).alignment = {horizontal: 'right'};
    worksheet.getCell(`A${currentRow}`).border = { left: {style: 'thick'} };

    worksheet.mergeCells(`B${currentRow}:C${currentRow}`);

    worksheet.getCell(`B${currentRow}`).value = ' Termin Pembayaran : DP 40%, MOS 60%';
    worksheet.getCell(`B${currentRow}`).font = {
      name: 'Arial',
      size: 12
    };
    worksheet.getCell(`B${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    worksheet.getCell(`B${currentRow}`).alignment = {horizontal: 'left'}

    worksheet.getCell(`C${currentRow}`).border = {right: {style: 'thick'} };
    worksheet.getCell(`C${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`D${currentRow}`).border = {
      left: {style: 'thick'},
    };

    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    

    worksheet.getCell(`E${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };


    worksheet.getCell(`F${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`G${currentRow}`).border = {
      right: {style: 'thick'}, 
    };

    worksheet.getCell(`G${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    currentRow++;

    worksheet.getCell(`A${currentRow}`).value = '5';
    worksheet.getCell(`A${currentRow}`).font = {
      name: 'Arial',
      size: 12
    };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    worksheet.getCell(`A${currentRow}`).alignment = {horizontal: 'right'};
    worksheet.getCell(`A${currentRow}`).border = { left: {style: 'thick'} };

    worksheet.mergeCells(`B${currentRow}:C${currentRow}`);

    worksheet.getCell(`B${currentRow}`).value = {
      richText: [
        {
          text: ' Semua material mengacu spesifikasi dari'
        },
        {
          text: ' sfm siphonic systems',
          font: {bold: true}
        },
        {
          text: 'TM',
          font: {bold: true, vertAlign: 'superscript'}
        },
      ]
    };
    worksheet.getCell(`B${currentRow}`).font = {
      name: 'Arial',
      size: 12
    };
    worksheet.getCell(`B${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'left' };

    worksheet.getCell(`C${currentRow}`).border = {right: {style: 'thick'} };
    worksheet.getCell(`C${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`D${currentRow}`).font = {
      name: 'Arial',
      size: 12
    };
    worksheet.getCell(`D${currentRow}`).border = {
      left: {style: 'thick'},
    };

    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    

    worksheet.getCell(`E${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`F${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`G${currentRow}`).border = {
      right: {style: 'thick'}, 
    };

    worksheet.getCell(`G${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    currentRow++;

    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`A${currentRow}`).border = { left: {style: 'thick'} };

    worksheet.getCell(`B${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`C${currentRow}`).border = {right: {style: 'thick'} };
    worksheet.getCell(`C${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`D${currentRow}`).border = {
      left: {style: 'thick'},
    };

    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    

    worksheet.getCell(`E${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`F${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`G${currentRow}`).border = {
      right: {style: 'thick'}, 
    };

    worksheet.getCell(`G${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    currentRow++;

 

    worksheet.getCell(`A${currentRow}`).value = 'Siphonic System is a solution for rainwater drainage which can provide a total freedom and flexibility in roof drainage design for both the Architect and Engineer.  PT. Siphonic Flow Mandiri as siphonic specialist provide total solution to the customer. We supply a complete system consist of design calculation, roof outlet, pipe & fittings, support systems and solvent cement.'

    worksheet.getCell(`A${currentRow}`).alignment = {
      wrapText: true,
      horizontal: 'center',
      vertical: 'middle'
    }

    worksheet.getCell(`A${currentRow}`).font = {
      color: {argb: 'ff3bd12a'},
      bold: true,
      italic: true
    }

    worksheet.getCell(`A${currentRow}`).border = {
      top: {style:'thick'},
      left: {style:'thick'},
      bottom: {style:'thick'},
      right: {style:'thick'}
    };

    worksheet.mergeCells(`A${currentRow}:C${currentRow+8}`);

    worksheet.getCell(`D${currentRow}`).border = {
      left: {style: 'thick'},
    };

    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    

    worksheet.getCell(`E${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`F${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`G${currentRow}`).border = {
      right: {style: 'thick'}, 
    };

    worksheet.getCell(`G${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    currentRow++;

    worksheet.getCell(`D${currentRow}`).border = {
      left: {style: 'thick'},
    };

    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    

    worksheet.getCell(`E${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`F${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`G${currentRow}`).border = {
      right: {style: 'thick'}, 
    };

    worksheet.getCell(`G${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    currentRow++;

    worksheet.getCell(`D${currentRow}`).border = {
      left: {style: 'thick'},
    };

    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    

    worksheet.getCell(`E${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`F${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`G${currentRow}`).border = {
      right: {style: 'thick'}, 
    };

    worksheet.getCell(`G${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };


    currentRow++;

    worksheet.getCell(`D${currentRow}`).border = {
      left: {style: 'thick'},
    };

    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    

    worksheet.getCell(`E${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`F${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`G${currentRow}`).border = {
      right: {style: 'thick'}, 
    };

    worksheet.getCell(`G${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };


    currentRow++;


    worksheet.getCell(`D${currentRow}`).border = {
      left: {style: 'thick'},
    };

    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    

    worksheet.getCell(`E${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`F${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`G${currentRow}`).border = {
      right: {style: 'thick'}, 
    };

    worksheet.getCell(`G${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };


    currentRow++;


    worksheet.getCell(`D${currentRow}`).border = {
      left: {style: 'thick'},
    };

    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    

    worksheet.getCell(`E${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`F${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`G${currentRow}`).border = {
      right: {style: 'thick'}, 
    };

    worksheet.getCell(`G${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };


    currentRow++;

    worksheet.getCell(`D${currentRow}`).border = {
      left: {style: 'thick'},
    };

    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };
    

    worksheet.getCell(`E${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`F${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    worksheet.getCell(`G${currentRow}`).border = {
      right: {style: 'thick'}, 
    };

    worksheet.getCell(`G${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };


    currentRow++;

    worksheet.mergeCells(`D${currentRow}:G${currentRow}`);

    worksheet.getCell(`D${currentRow}`).border = {
      left: {style: 'thick'},
      right: {style: 'thick'}
    };
    
    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    
    worksheet.getCell(`D${currentRow}`).value = dataBasic.project.pic.filter((p) => p.is_pic_internal === 1).map((p) => (p.name))[0];
    worksheet.getCell(`D${currentRow}`).font = {
      bold: true,
      underline: true,
      size: 12,
      name: 'Arial'
    }
    worksheet.getCell(`D${currentRow}`).alignment = {
      horizontal: 'center'
    }

    currentRow++;

    worksheet.mergeCells(`D${currentRow}:G${currentRow}`);

    worksheet.getCell(`D${currentRow}`).border = {
      left: {style: 'thick'},
      right: {style: 'thick'},
      bottom: {style:'thick'}
    };
    
    worksheet.getCell(`D${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffffffff' },
    };

    
    worksheet.getCell(`D${currentRow}`).value = 'Area Sales Manager';
    worksheet.getCell(`D${currentRow}`).font = {
      italic: true,
      size: 12,
      name: 'Arial'
    }
    worksheet.getCell(`D${currentRow}`).alignment = {
      horizontal: 'center'
    }

    // Save the workbook to a blob
    this.getProvinceCity(dataBasic.customer.province, dataBasic.customer.city)
    .pipe(
      switchMap((projectLocation) => {
        customerLocation = projectLocation;
        worksheet.getCell('C13').value = customerLocation;
        return from(workbook.xlsx.writeBuffer()); // Convert Promise to Observable
      })
    )
    .subscribe((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const file = new File(
        [buffer], 
        `${dataBasic.quotation_no}R.xlsx`, 
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      );

      const formData = new FormData();
      formData.append('file', file);

      if(fileType === 'pdf'){
        this.apiSvc.convertToPdf(formData).subscribe({
          next: (response) => {
            const base64String = response.pdfBlob; // The Base64 string from your backend
            const byteCharacters = atob(base64String.split(',')[1]); // Decode Base64
            const byteNumbers = new Array(byteCharacters.length);
  
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
  
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
  
            // Trigger file download
            saveAs(blob, `${dataBasic.quotation_no}.pdf`);
          },
          error: (err) => {console.log(err)}
        })
      }

      if(fileType === 'excel'){
        saveAs(blob, `${dataBasic.quotation_no}.xlsx`);
      }
    });
  }

  getProvinceCity(province_id: string, city_id: string): Observable<string>{
    return this.apiSvc.getRegenciesByProvince(parseInt(province_id)).pipe(
      map((res) => {
        const provinceName = this.provinceList.find((item) => item.id === parseInt(province_id))?.province;
        const cityName = res.find((item: any) => item.id === parseInt(city_id))?.regency;
  
        return `${provinceName}-${cityName}`;
      })
    );
  }

}
