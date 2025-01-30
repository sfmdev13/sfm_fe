import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { IDataCategories, IDataQuotation, IDetailDataQuotation } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}
  generateExcel(
    dataBasic: IDataQuotation, 
    dataDetail: IDetailDataQuotation, 
    revision: string, 
    productCategory: IDataCategories[]
  ): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    let totalGrandInstallation = 0;
    let totalGrandPrice = 0;
    // title
    worksheet.getCell('B2').value = 'RINCIAN RENCANA ANGGARAN BIAYA (RAB)';
    worksheet.getCell('B2').font = {
      name: 'Arial',
      size: 16,
      bold: true
    };
    worksheet.getCell('B2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('B2:P2');

    worksheet.getCell('B3').value = 'PEKERJAAN SISTEM DRAINASE AIR HUJAN sfm Siphonic System';
    worksheet.getCell('B3').font = {
      name: 'Arial',
      size: 16,
      bold: true
    };
    worksheet.getCell('B3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('B3:P3');

    //header column
    worksheet.getCell('B6').value = 'NO';
    worksheet.mergeCells('B6:B7');
    worksheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B6').font = {
      name: 'Arial',
      size: 11,
      bold: true
    };
    worksheet.getCell('B6').border = {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell('C6').value = 'URAIAN';
    worksheet.mergeCells('C7', 'J6');
    worksheet.getCell('C6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C6').font = {
      name: 'Arial',
      size: 11,
      bold: true
    };
    worksheet.getCell('C6').border = {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell('K6').value = 'VOL.';
    worksheet.mergeCells('K6:K7');
    worksheet.getCell('K6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('K6').font = {
      name: 'Arial',
      size: 11,
      bold: true
    };
    worksheet.getCell('K6').border = {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell('L6').value = 'SAT.';
    worksheet.mergeCells('L6:L7');
    worksheet.getCell('L6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('L6').font = {
      name: 'Arial',
      size: 11,
      bold: true
    };
    worksheet.getCell('L6').border = {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell('M6').value = 'HARGA SATUAN';
    worksheet.mergeCells('M6:M7')
    worksheet.getCell('M6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('M').width = 22.15;
    worksheet.getCell('M6').font = {
      name: 'Arial',
      size: 11,
      bold: true
    };
    worksheet.getCell('M6').border = {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell('N6').value = 'JUMLAH';
    worksheet.mergeCells('N6:N7');
    worksheet.getCell('N6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('N').width = 22.15;
    worksheet.getCell('N6').font = {
      name: 'Arial',
      size: 11,
      bold: true
    };
    worksheet.getCell('N6').border = {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    };

    //space
    worksheet.getCell('B8').border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.mergeCells('C8:J8');

    worksheet.getCell('C8').border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell('K8').border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell('L8').border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell('M8').border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell('N8').border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };


    //material title
    worksheet.getRow(9).height = 45.8;
    worksheet.getCell('B9').value = 1;
    worksheet.getCell('B9').font = {
      name: 'Arial',
      size: 14,
      bold: true
    };

    worksheet.getCell('B9').alignment =  { horizontal: 'center', vertical: 'top' };

    worksheet.getCell('B9').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell('B9').border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell('B9').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell('C9').border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell('C9').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell('C9').value = {
      richText: [
        { text: 'PEKERJAAN PENGADAAAN MATERIAL sfm Siphonic System' },
        { text: 'TM', font: { vertAlign: 'superscript' } },
      ],
    };

    worksheet.getCell('C9').font = {
      name: 'Arial',
      size: 14,
      bold: true
    };

    worksheet.getCell('C9').alignment = { wrapText: true };

    worksheet.mergeCells('C9:J9');

    worksheet.getCell('K9').border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell('K9').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell('L9').border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell('L9').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell('M9').border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell('M9').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell('N9').border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell('N9').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    const sortedProductCategory = [...productCategory].sort((a, b) => parseInt(a.level ?? '0') - parseInt(b.level ?? '0'));
    let currentRow = 10; // Start from row 9

    sortedProductCategory.forEach((cat, i) => {
      // Write the category name (cat.name) first
      worksheet.getRow(currentRow).height = 36;
    
      // Column number for category
      worksheet.getCell(`B${currentRow}`).value = `1.${i + 1}`;
      worksheet.getCell(`B${currentRow}`).font = {
        name: 'Arial',
        size: 11,
        bold: true,
      };
      worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center', vertical: 'top' };
      worksheet.getCell(`B${currentRow}`).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
    
      worksheet.getCell(`C${currentRow}`).value = cat.description;
      worksheet.getCell(`C${currentRow}`).font = {
        name: 'Arial',
        size: 11,
        bold: true,
      };
      worksheet.getCell(`C${currentRow}`).alignment = { wrapText: true, vertical: 'top' };

      worksheet.mergeCells(`C${currentRow}:J${currentRow}`);
    
      worksheet.getCell(`K${currentRow}`).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      worksheet.getCell(`L${currentRow}`).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      worksheet.getCell(`M${currentRow}`).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };

      dataBasic.total_supplier_product.forEach((data) => {
        if(data.id === cat.id){
          if(data.total_price !== 0){
            worksheet.getCell(`N${currentRow}`).value = data.total_price
            worksheet.getCell(`N${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)'; 
          }
        }
      })

      worksheet.getCell(`N${currentRow}`).font = {
        name: 'Arial',
        size: 11,
        bold: true,
      };

      worksheet.getCell(`N${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };

      worksheet.getCell(`N${currentRow}`).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
    
      currentRow++; // Move to the next row for inventory items
    
      // Write the inventory items associated with the category
      dataDetail.quotation_revision.forEach((data) => {
        if (data.revision === revision) {
          totalGrandInstallation = parseFloat(parseFloat(data.total_installation_price_after_discount).toFixed(2))
          totalGrandPrice = parseFloat(parseFloat(data.total_price_after_discount).toFixed(2))
          data.quotation_items.forEach((item) => {
            if (cat.id === item.inventory.supplier_product.id) {
              // Column number for inventory
              worksheet.getCell(`B${currentRow}`).border = {
                left: { style: 'thin' },
                right: { style: 'thin' },
              };
    
              // Column title for inventory
              worksheet.getCell(`C${currentRow}`).value = `- ${item.inventory.description}`;
              worksheet.getCell(`C${currentRow}`).font = {
                name: 'Arial',
                size: 11,
              };
    
              //Column qty
              worksheet.getCell(`K${currentRow}`).value = parseFloat(item.qty);
              worksheet.getCell(`K${currentRow}`).font = {
                name: 'Arial',
                size: 11,
                color: { argb: 'ffff6347' },
              };
              worksheet.getCell(`K${currentRow}`).border = {
                left: { style: 'thin' },
                right: { style: 'thin' },
              };

              worksheet.getCell(`K${currentRow}`).alignment = {horizontal: 'center'}

              //Column Unit
              worksheet.getCell(`L${currentRow}`).value = item.inventory.unit.name;
              worksheet.getCell(`L${currentRow}`).alignment = {horizontal: 'center'}
              worksheet.getCell(`L${currentRow}`).border = {
                left: { style: 'thin' },
                right: { style: 'thin' },
              };

              //Column Unit Price
              worksheet.getCell(`M${currentRow}`).value = parseFloat(item.inventory.default_selling_price);
              worksheet.getCell(`M${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)'; 
              worksheet.getCell(`M${currentRow}`).border = {
                left: { style: 'thin' },
                right: { style: 'thin' },
              };

              //Column Total Selling Price
              worksheet.getCell(`N${currentRow}`).value = parseFloat(item.total_price_per_product_after_discount);
              worksheet.getCell(`N${currentRow}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)'; 
              worksheet.getCell(`N${currentRow}`).border = {
                left: { style: 'thin' },
                right: { style: 'thin' },
              };
    
              currentRow++; // Move to the next row after each inventory item
            }
          });
        }
      });
    });

    let currentRowInst = currentRow++;

    //Installation
    worksheet.getRow(currentRowInst).height = 45.8;
    worksheet.getCell(`B${currentRowInst}`).value = 2;
    worksheet.getCell(`B${currentRowInst}`).font = {
      name: 'Arial',
      size: 14,
      bold: true
    };

    worksheet.getCell(`B${currentRowInst}`).alignment =  { horizontal: 'center', vertical: 'top' };

    worksheet.getCell(`B${currentRowInst}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell(`B${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell(`B${currentRowInst}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell(`C${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell(`C${currentRowInst}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell(`C${currentRowInst}`).value = {
      richText: [
        { text: 'PEKERJAAN PEMASANGAN MATERIAL sfm Siphonic Systems' }
      ],
    };

    worksheet.getCell(`C${currentRowInst}`).font = {
      name: 'Arial',
      size: 14,
      bold: true
    };

    worksheet.getCell(`C${currentRowInst}`).alignment = { wrapText: true };

    worksheet.mergeCells(`C${currentRowInst}:J${currentRowInst}`);

    worksheet.getCell(`K${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell(`K${currentRowInst}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell(`L${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell(`L${currentRowInst}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell(`M${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell(`M${currentRowInst}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    worksheet.getCell(`N${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell(`N${currentRowInst}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd9d9d9' },
    };

    currentRowInst++;

    worksheet.getRow(currentRowInst).height = 36;
    
    // Column number for category installation
    worksheet.getCell(`B${currentRowInst}`).value = `2.1`;
    worksheet.getCell(`B${currentRowInst}`).font = {
      name: 'Arial',
      size: 11,
      bold: true,
    };
    worksheet.getCell(`B${currentRowInst}`).alignment = { horizontal: 'center', vertical: 'top' };
    worksheet.getCell(`B${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
  
    worksheet.getCell(`C${currentRowInst}`).value = 'Pekerjaan Persiapan';
    worksheet.getCell(`C${currentRowInst}`).font = {
      name: 'Arial',
      size: 11,
      bold: true,
    };
    worksheet.getCell(`C${currentRowInst}`).alignment = { wrapText: true, vertical: 'top' };

    worksheet.mergeCells(`C${currentRowInst}:J${currentRowInst}`);
    
    worksheet.getCell(`K${currentRowInst}`).value = 1;

    worksheet.getCell(`K${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.getCell(`L${currentRowInst}`).value = 'LS';

    worksheet.getCell(`L${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.getCell(`M${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.getCell(`N${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    currentRowInst++;

    const persiapaanStandard = [
      'Perhitungan desain sistem siphonic, termasuk didalamnya isometri dan perhitungan hidrolika.',
      'Shop drawing (mencantumkan Final sizing dan kuantitas pipa dari sistem siphonic)',
      'As-built drawing',
      'Manajemen proyek dan biaya administrasi lapangan',
      'Pengukuran dan bouwplank',
      'Mobilisasi dan demobilisasi peralatan',
      'Direksi keet dan gudang',
      'Masa Perawatan selama 365 hari'
    ]

    persiapaanStandard.forEach((install) => {
      // Column number for inventory
      worksheet.getCell(`B${currentRowInst}`).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };

      // Column title for inventory
      worksheet.getCell(`C${currentRowInst}`).value = `- ${install}`;
      worksheet.getCell(`C${currentRowInst}`).font = {
        name: 'Arial',
        size: 11,
      };

      //Column qty

      worksheet.getCell(`K${currentRowInst}`).font = {
        name: 'Arial',
        size: 11,
        color: { argb: 'ffff6347' },
      };
      worksheet.getCell(`K${currentRowInst}`).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };

      worksheet.getCell(`K${currentRowInst}`).alignment = {horizontal: 'center'}

      //Column Unit

      worksheet.getCell(`L${currentRowInst}`).alignment = {horizontal: 'center'}
      worksheet.getCell(`L${currentRowInst}`).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };

      //Column Unit Price

      worksheet.getCell(`M${currentRowInst}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)'; 
      worksheet.getCell(`M${currentRowInst}`).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };

      //Column Total Selling Price

      worksheet.getCell(`N${currentRowInst}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)'; 
      worksheet.getCell(`N${currentRowInst}`).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };

      currentRowInst++;
    })

    worksheet.getRow(currentRowInst).height = 36;

    worksheet.getCell(`B${currentRowInst}`).value = `2.2`;
    worksheet.getCell(`B${currentRowInst}`).font = {
      name: 'Arial',
      size: 11,
      bold: true,
    };
    worksheet.getCell(`B${currentRowInst}`).alignment = { horizontal: 'center', vertical: 'top' };
    worksheet.getCell(`B${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
  
    worksheet.getCell(`C${currentRowInst}`).value = 'Pemasangan Material';
    worksheet.getCell(`C${currentRowInst}`).font = {
      name: 'Arial',
      size: 11,
      bold: true,
    };
    worksheet.getCell(`C${currentRowInst}`).alignment = { wrapText: true, vertical: 'top' };

    worksheet.mergeCells(`C${currentRowInst}:J${currentRowInst}`);
    
    worksheet.getCell(`K${currentRowInst}`).value = 1;

    worksheet.getCell(`K${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.getCell(`L${currentRowInst}`).value = 'lot';

    worksheet.getCell(`L${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.getCell(`M${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.getCell(`N${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    currentRowInst++;

    sortedProductCategory.forEach((cat, i) => {
      // Write the category name (cat.name) first
      worksheet.getRow(currentRowInst).height = 36;
    
      // Column number for category
      worksheet.getCell(`B${currentRowInst}`).value = `2.2.${i + 1}`;
      worksheet.getCell(`B${currentRowInst}`).font = {
        name: 'Arial',
        size: 11,
        bold: true,
      };
      worksheet.getCell(`B${currentRowInst}`).alignment = { horizontal: 'center', vertical: 'top' };
      worksheet.getCell(`B${currentRowInst}`).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
    
      worksheet.getCell(`C${currentRowInst}`).value = `Pemasangan ${cat.description}`;
      worksheet.getCell(`C${currentRowInst}`).font = {
        name: 'Arial',
        size: 11,
        bold: true,
      };
      worksheet.getCell(`C${currentRowInst}`).alignment = { wrapText: true, vertical: 'top' };

      worksheet.mergeCells(`C${currentRowInst}:J${currentRowInst}`);
    
      worksheet.getCell(`K${currentRowInst}`).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      worksheet.getCell(`L${currentRowInst}`).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      worksheet.getCell(`M${currentRowInst}`).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };

      dataBasic.total_supplier_product.forEach((data) => {
        if(data.id === cat.id){
          if(data.total_price !== 0){
            worksheet.getCell(`N${currentRowInst}`).value = parseFloat(data.total_installation_price.toFixed(2));
            worksheet.getCell(`N${currentRowInst}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)'; 
          }
        }
      })

      worksheet.getCell(`N${currentRowInst}`).font = {
        name: 'Arial',
        size: 11,
        bold: true,
      };

      worksheet.getCell(`N${currentRowInst}`).alignment = { horizontal: 'center', vertical: 'middle' };

      worksheet.getCell(`N${currentRowInst}`).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
    
      currentRowInst++;
    
      dataDetail.quotation_revision.forEach((data) => {
        if (data.revision === revision) {
          data.quotation_items.forEach((item) => {
            if (cat.id === item.inventory.supplier_product.id) {
              // Column number for inventory
              worksheet.getCell(`B${currentRowInst}`).border = {
                left: { style: 'thin' },
                right: { style: 'thin' },
              };
    
              // Column title for inventory
              worksheet.getCell(`C${currentRowInst}`).value = `- ${item.inventory.description}`;
              worksheet.getCell(`C${currentRowInst}`).font = {
                name: 'Arial',
                size: 11,
              };
    
              //Column qty
              worksheet.getCell(`K${currentRowInst}`).value = parseFloat(item.qty);
              worksheet.getCell(`K${currentRowInst}`).font = {
                name: 'Arial',
                size: 11,
                color: { argb: 'ffff6347' },
              };
              worksheet.getCell(`K${currentRowInst}`).border = {
                left: { style: 'thin' },
                right: { style: 'thin' },
              };

              worksheet.getCell(`K${currentRowInst}`).alignment = {horizontal: 'center'}

              //Column Unit
              worksheet.getCell(`L${currentRowInst}`).value = item.inventory.unit.name;
              worksheet.getCell(`L${currentRowInst}`).alignment = {horizontal: 'center'}
              worksheet.getCell(`L${currentRowInst}`).border = {
                left: { style: 'thin' },
                right: { style: 'thin' },
              };

              //Column Unit Price
              worksheet.getCell(`M${currentRowInst}`).value = parseFloat(item.inventory.installation.selling_price);
              worksheet.getCell(`M${currentRowInst}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)'; 
              worksheet.getCell(`M${currentRowInst}`).border = {
                left: { style: 'thin' },
                right: { style: 'thin' },
              };

              //Column Total Selling Price
              worksheet.getCell(`N${currentRowInst}`).value = parseFloat(item.total_installation_price_after_discount);
              worksheet.getCell(`N${currentRowInst}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)'; 
              worksheet.getCell(`N${currentRowInst}`).border = {
                left: { style: 'thin' },
                right: { style: 'thin' },
              };
    
              currentRowInst++; // Move to the next row after each inventory item
            }
          });
        }
      });
    });

    worksheet.getCell(`B${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.mergeCells(`C${currentRowInst}:J${currentRowInst}`);

    worksheet.getCell(`C${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell(`K${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell(`L${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell(`M${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell(`N${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    currentRowInst++;

    worksheet.getRow(currentRowInst).height = 36;

    worksheet.getCell(`B${currentRowInst}`).value = `2.3`;
    worksheet.getCell(`B${currentRowInst}`).font = {
      name: 'Arial',
      size: 11,
      bold: true,
    };
    worksheet.getCell(`B${currentRowInst}`).alignment = { horizontal: 'center', vertical: 'top' };
    worksheet.getCell(`B${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
  
    worksheet.getCell(`C${currentRowInst}`).value = 'Supervisi';
    worksheet.getCell(`C${currentRowInst}`).font = {
      name: 'Arial',
      size: 11,
      bold: true,
    };
    worksheet.getCell(`C${currentRowInst}`).alignment = { wrapText: true, vertical: 'top' };

    worksheet.mergeCells(`C${currentRowInst}:J${currentRowInst}`);
    

    worksheet.getCell(`K${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.getCell(`L${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.getCell(`M${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.getCell(`N${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    currentRowInst++;

    worksheet.getCell(`B${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.mergeCells(`C${currentRowInst}:J${currentRowInst}`);

    worksheet.getCell(`C${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell(`K${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell(`L${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell(`M${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell(`N${currentRowInst}`).border = {
      left: {style:'thin'},
      right: {style:'thin'}
    };

    currentRowInst++;

    worksheet.getRow(currentRowInst).height = 36;

    worksheet.getCell(`B${currentRowInst}`).value = `2.4`;
    worksheet.getCell(`B${currentRowInst}`).font = {
      name: 'Arial',
      size: 11,
      bold: true,
    };
    worksheet.getCell(`B${currentRowInst}`).alignment = { horizontal: 'center', vertical: 'top' };
    worksheet.getCell(`B${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
  
    worksheet.getCell(`C${currentRowInst}`).value = 'Test Commisioning';
    worksheet.getCell(`C${currentRowInst}`).font = {
      name: 'Arial',
      size: 11,
      bold: true,
    };
    worksheet.getCell(`C${currentRowInst}`).alignment = { wrapText: true, vertical: 'top' };

    worksheet.mergeCells(`C${currentRowInst}:J${currentRowInst}`);
    
    worksheet.getCell(`K${currentRowInst}`).value = 1;

    worksheet.getCell(`K${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.getCell(`L${currentRowInst}`).value = 'lot';

    worksheet.getCell(`L${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.getCell(`M${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.getCell(`N${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    currentRowInst++;

    worksheet.getRow(currentRowInst).height = 36;

    worksheet.getCell(`B${currentRowInst}`).font = {
      name: 'Arial',
      size: 11,
      bold: true,
    };
    worksheet.getCell(`B${currentRowInst}`).alignment = { horizontal: 'center', vertical: 'top' };
    worksheet.getCell(`B${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
  
    worksheet.getCell(`C${currentRowInst}`).value = '- Test Bertekanan/ Test Hydrostatis secara parsial atau keseluruhan mengikuti standar spesialis siphonic';
    worksheet.getCell(`C${currentRowInst}`).font = {
      name: 'Arial',
      size: 11,
    };
    worksheet.getCell(`C${currentRowInst}`).alignment = { wrapText: true, vertical: 'top' };

    worksheet.mergeCells(`C${currentRowInst}:J${currentRowInst}`);

    worksheet.getCell(`K${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.getCell(`L${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.getCell(`M${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.getCell(`N${currentRowInst}`).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    currentRowInst++;

    worksheet.getCell(`B${currentRowInst}`).border = {
      left: {style:'thin'},
      top: {style:'thin'},
      bottom: {style:'thin'}
    };

    worksheet.mergeCells(`C${currentRowInst}:J${currentRowInst}`);

    worksheet.getCell(`C${currentRowInst}`).border = {
      top: {style:'thin'},
      bottom: {style:'thin'}
    };

    worksheet.getCell(`K${currentRowInst}`).border = {
      top: {style:'thin'},
      bottom: {style:'thin'}
    };

    worksheet.getCell(`L${currentRowInst}`).border = {
      top: {style:'thin'},
      bottom: {style:'thin'}
    };

    worksheet.getCell(`M${currentRowInst}`).value = 'TOTAL'
    worksheet.getCell(`M${currentRowInst}`).font = {
      name: 'Arial',
      size: 11,
      bold: true
    }

    worksheet.getCell(`M${currentRowInst}`).border = {
      top: {style:'thin'},
      bottom: {style:'thin'}
    };
    
    worksheet.getCell(`M${currentRowInst}`).alignment = {horizontal: 'right'}

    let totalGrand = totalGrandInstallation + totalGrandPrice
    worksheet.getCell(`N${currentRowInst}`).value = totalGrand;
    worksheet.getCell(`N${currentRowInst}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)'; 

    worksheet.getCell(`N${currentRowInst}`).border = {
      top: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'},
      left: {style:'thin'},
    };

    currentRowInst++;

    worksheet.getCell(`B${currentRowInst}`).border = {
      left: {style:'thin'},
      top: {style:'thin'},
      bottom: {style:'thin'}
    };

    worksheet.mergeCells(`C${currentRowInst}:J${currentRowInst}`);

    worksheet.getCell(`C${currentRowInst}`).border = {
      top: {style:'thin'},
      bottom: {style:'thin'}
    };

    worksheet.getCell(`K${currentRowInst}`).border = {
      top: {style:'thin'},
      bottom: {style:'thin'}
    };

    worksheet.getCell(`L${currentRowInst}`).border = {
      top: {style:'thin'},
      bottom: {style:'thin'}
    };

    worksheet.getCell(`M${currentRowInst}`).value = 'Tax(11%)'
    worksheet.getCell(`M${currentRowInst}`).font = {
      name: 'Arial',
      size: 11,
      bold: true
    }

    worksheet.getCell(`M${currentRowInst}`).alignment = {horizontal: 'right'}

    worksheet.getCell(`M${currentRowInst}`).border = {
      top: {style:'thin'},
      bottom: {style:'thin'}
    };
    
    let tax = ((totalGrandInstallation + totalGrandPrice)*11)/100;
    worksheet.getCell(`N${currentRowInst}`).value = tax
    worksheet.getCell(`N${currentRowInst}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)'; 

    worksheet.getCell(`N${currentRowInst}`).border = {
      top: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'},
      left: {style:'thin'},
    };

    currentRowInst++;

    worksheet.getCell(`B${currentRowInst}`).border = {
      left: {style:'thin'},
      top: {style:'thin'},
      bottom: {style:'thin'}
    };

    worksheet.mergeCells(`C${currentRowInst}:J${currentRowInst}`);

    worksheet.getCell(`C${currentRowInst}`).border = {
      top: {style:'thin'},
      bottom: {style:'thin'}
    };

    worksheet.getCell(`K${currentRowInst}`).border = {
      top: {style:'thin'},
      bottom: {style:'thin'}
    };

    worksheet.getCell(`L${currentRowInst}`).border = {
      top: {style:'thin'},
      bottom: {style:'thin'}
    };

    worksheet.getCell(`M${currentRowInst}`).value = 'Grand Total'
    worksheet.getCell(`M${currentRowInst}`).font = {
      name: 'Arial',
      size: 11,
      bold: true
    }

    worksheet.getCell(`M${currentRowInst}`).alignment = {horizontal: 'right'}

    worksheet.getCell(`M${currentRowInst}`).border = {
      top: {style:'thin'},
      bottom: {style:'thin'}
    };
    
    worksheet.getCell(`N${currentRowInst}`).value = totalGrand - tax
    worksheet.getCell(`N${currentRowInst}`).numFmt = '_("Rp"* #,##0.00_);_("Rp"* (#,##0.00);_("Rp"* "-"??_);_(@_)'; 

    worksheet.getCell(`N${currentRowInst}`).border = {
      left: {style:'thin'},
      top: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'},
    };

    currentRowInst++;

    //signature section
    worksheet.mergeCells(`B${currentRowInst}:L${currentRowInst + 10}`);
    worksheet.getCell(`B${currentRowInst}`).border = {
      left: {style:'thin'},
      top: {style:'thin'},
      bottom: {style:'thin'}
    };

    worksheet.mergeCells(`M${currentRowInst}:N${currentRowInst}`);
    worksheet.getCell(`M${currentRowInst}`).border = {
      right: {style:'thin'},
    };
    worksheet.mergeCells(`M${currentRowInst+1}:N${currentRowInst+1}`);
    worksheet.getCell(`M${currentRowInst+1}`).value = 'Jakarta 20 Desember 2022';
    worksheet.getCell(`M${currentRowInst+1}`).alignment = {horizontal: 'center'};
    worksheet.getCell(`M${currentRowInst+1}`).border = {
      right: {style:'thin'},
    };
    worksheet.getCell(`M${currentRowInst+1}:N${currentRowInst+1}`);

    worksheet.mergeCells(`M${currentRowInst+2}:N${currentRowInst+2}`);
    worksheet.getCell(`M${currentRowInst+2}`).value = 'PT. Siphonic Flow Mandiri';
    worksheet.getCell(`M${currentRowInst+2}`).alignment = {horizontal: 'center'};
    worksheet.getCell(`M${currentRowInst+2}`).border = {
      right: {style:'thin'},
    };
    worksheet.getCell(`M${currentRowInst+2}:N${currentRowInst+2}`);

    worksheet.mergeCells(`M${currentRowInst+3}:N${currentRowInst+7}`);
    worksheet.getCell(`M${currentRowInst+3}`).border = {
      right: {style:'thin'},
    };

    worksheet.getCell(`M${currentRowInst+8}`).value = '(Akwin Indra)';
    worksheet.getCell(`M${currentRowInst+8}`).alignment = {horizontal: 'center'};
    worksheet.getCell(`M${currentRowInst+8}`).border = {
      right: {style:'thin'},
    };
    worksheet.mergeCells(`M${currentRowInst+8}:N${currentRowInst+8}`);

    worksheet.getCell(`M${currentRowInst+9}`).value = 'General Manager';
    worksheet.getCell(`M${currentRowInst+9}`).alignment = {horizontal: 'center'};
    worksheet.getCell(`M${currentRowInst+9}`).border = {
      right: {style:'thin'},
    };
    worksheet.mergeCells(`M${currentRowInst+9}:N${currentRowInst+9}`);


    worksheet.mergeCells(`M${currentRowInst+10}:N${currentRowInst+10}`);
    worksheet.getCell(`M${currentRowInst+10}`).border = {
      right: {style:'thin'},
      bottom: {style:'thin'}
    };


    // Save the workbook to a blob
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${dataBasic.quotation_no}R.xlsx`);
    });
  }
}