import { Injectable } from '@angular/core';
import pdfMake, { TCreatedPdf } from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { IDataQuotation, IDetailDataQuotation, IDataCategories } from './interfaces';
import { Alignment, Margins } from 'pdfmake/interfaces';
import { CurrencyPipe } from '@angular/common';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfRabService {
  constructor( private currencyPipe: CurrencyPipe) {
  }

  generatePdf(
    dataBasic: IDataQuotation,
    dataDetail: IDetailDataQuotation,
    revision: string,
    productCategory: IDataCategories[]
  ): void {
    const materials = this.generateMaterial(dataBasic, dataDetail, revision, productCategory);
    const installation = this.generateInstallation(dataBasic, dataDetail, revision, productCategory);
    let totalGrandInstallation = 0;
    let totalGrandPrice = 0;

    const sortedProductCategory = [...productCategory].sort((a, b) => parseInt(a.level ?? '0') - parseInt(b.level ?? '0'));
    sortedProductCategory.forEach((cat, i) => {
      dataDetail.quotation_revision.forEach((data) => {
        if (data.revision === revision) {
          totalGrandInstallation = parseFloat(parseFloat(data.total_installation_price_after_discount).toFixed(2))
          totalGrandPrice = parseFloat(parseFloat(data.total_price_after_discount).toFixed(2))
        }
      })
    })

    const documentDefinition = {
      content: [
          {
              text: 'RINCIAN RENCANA ANGGARAN BIAYA(RAB)',
              bold: true,
              alignment: 'center' as Alignment,
          },
          {
              text: 'PEKERJAAN SISTEM DRAINASE AIR HUJAN sfm Siphonic System',
              bold: true,
              alignment: 'center' as Alignment,
          },
          {
              style: 'table',
              table: {
                  widths: [20, 200, 'auto', 'auto', '*', '*'],
              body: [
              [
                  {
                      text: 'No',
                      bold: true,
                      alignment: 'center' as Alignment,
                  },
                  {
                      text: 'Uraian',
                      bold: true,
                      alignment: 'center' as Alignment
                  },
                  {
                      text: 'Vol.',
                      bold: true,
                      alignment: 'center' as Alignment
                  },
                  {
                      text: 'Sat.',
                      bold: true,
                      alignment: 'center' as Alignment
                  },
                  {
                      text: 'Harga Satuan',
                      bold: true,
                      alignment: 'center' as Alignment
                  },
                  {
                      text: 'Jumlah',
                      bold: true,
                      alignment: 'center' as Alignment
                  }
              ],
              ['', '', '', '', '', ''],
              //material title
              [
                {
                  text: '1',
                  bold: true,
                  alignment: 'center' as Alignment,
                  fillColor: '#dddddd'
                },
                {
                  text: 'PEKERJAAN PENGADAAN MATERIAL sfm Siphonic System TM',
                  bold: true,
                  fillColor: '#dddddd'
                },
                {
                    text: '',
                    fillColor: '#dddddd'
                },
                {
                    text: '',
                    fillColor: '#dddddd'
                },
                {
                    text: '',
                    fillColor: '#dddddd'
                },
                {
                    text: '',
                    fillColor: '#dddddd'
                }
              ],
              //header material
              //start mapping material here


              //content material
              ...materials,

              //end mapping material here
              //title installation
              [
                {
                  text: '2',
                  bold: true,
                  alignment: 'center' as Alignment,
                  fillColor: '#dddddd'
                },
                {
                  text: 'PEKERJAAN PEMASANGAN MATERIAL sfm Siphonic Systems',
                  bold: true,
                  fillColor: '#dddddd'
                },
                {
                    text: '',
                    fillColor: '#dddddd'
                },
                {
                    text: '',
                    fillColor: '#dddddd'
                },
                {
                    text: '',
                    fillColor: '#dddddd'
                },
                {
                    text: '',
                    fillColor: '#dddddd'
                }
              ],
              //header installation
              [
                {
                  text: '2.1',
                  bold: true,
                  alignment: 'center' as Alignment,
                  fillColor: '#dddddd'
                },
                {
                  text: 'Pekerjaan Persiapan',
                  bold: true,
                  fillColor: '#dddddd'
                },
                {
                    text: '1',
                  fillColor: '#dddddd'				        
                },
                {
                    text: 'LS',
                  fillColor: '#dddddd'				        
                },
                {
                    text: '',
                  fillColor: '#dddddd'				        
                },
                {
                    text: '',
                    alignment: 'center' as Alignment,
                  fillColor: '#dddddd'				        
                }
              ],
              //content installation
              [
                {
                  text: '',
                  alignment: 'center' as Alignment,
                },
                {
                  text: '- Perhitungan desain sistem siphonic, termasuk didalamnya isometri dan perhitungan hidrolika.',
                  colSpan: 3,
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                }
              ],
              [
                {
                  text: '',
                  alignment: 'center' as Alignment,
                },
                {
                  text: '- Shop drawing (mencantumkan Final sizing dan kuantitas pipa dari sistem siphonic)',
                  colSpan: 3,
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                }
              ],
              [
                {
                  text: '',
                  alignment: 'center' as Alignment,
                },
                {
                  text: '- As Built Drawing',
                  colSpan: 3,
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                }
              ],
              [
                {
                  text: '',
                  alignment: 'center' as Alignment,
                },
                {
                  text: '- Manajemen proyek dan biaya administrasi lapangan',
                  colSpan: 3,
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                }
              ],
              [
                {
                  text: '',
                  alignment: 'center' as Alignment,
                },
                {
                  text: '- Pengukuran dan bouwplank',
                  colSpan: 3,
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                }
              ],
              [
                {
                  text: '',
                  alignment: 'center' as Alignment,
                },
                {
                  text: '- Mobilisasi dan demobilisasi peralatan',
                  colSpan: 3,
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                }
              ],
              [
                {
                  text: '',
                  alignment: 'center' as Alignment,
                },
                {
                  text: '- Direksi keet dan gudang',
                  colSpan: 3,
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                }
              ],
              [
                {
                  text: '',
                  alignment: 'center' as Alignment,
                },
                {
                  text: '- Masa Perawatan selama 365 hari',
                  colSpan: 3,
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                }
              ],
              [
                {
                  text: '2.2',
                  bold: true,
                  alignment: 'center' as Alignment,
                  fillColor: '#dddddd'
                },
                {
                  text: 'Pemasangan Material',
                  bold: true,
                  fillColor: '#dddddd'
                },
                {
                    text: '1',
                  fillColor: '#dddddd'				        
                },
                {
                    text: 'lot',
                  fillColor: '#dddddd'				        
                },
                {
                    text: '',
                  fillColor: '#dddddd'				        
                },
                {
                    text: '',
                    alignment: 'center' as Alignment,
                  fillColor: '#dddddd'				        
                }
              ],
              //mapping other installation start here
              ...installation,
              //mapping other installation end  here
              [
                {
                  text: '2.3',
                  bold: true,
                  alignment: 'center' as Alignment,
                  fillColor: '#dddddd'
                },
                {
                  text: 'Supervisi',
                  bold: true,
                  fillColor: '#dddddd'
                },
                {
                    text: '',
                  fillColor: '#dddddd'				        
                },
                {
                    text: '',
                  fillColor: '#dddddd'				        
                },
                {
                    text: '',
                  fillColor: '#dddddd'				        
                },
                {
                    text: '',
                    alignment: 'center' as Alignment,
                  fillColor: '#dddddd'				        
                }
              ],
              ['', '', '', '', '', ''],
              [
                {
                  text: '2.4',
                  bold: true,
                  alignment: 'center' as Alignment,
                  fillColor: '#dddddd'
                },
                {
                  text: 'Test Commisioning',
                  bold: true,
                  fillColor: '#dddddd'
                },
                {
                    text: 1,
                  fillColor: '#dddddd'				        
                },
                {
                    text: 'lot',
                  fillColor: '#dddddd'				        
                },
                {
                    text: '',
                  fillColor: '#dddddd'				        
                },
                {
                    text: '',
                    alignment: 'center' as Alignment,
                  fillColor: '#dddddd'				        
                }
              ],
              [
                {
                  text: '',
                  alignment: 'center' as Alignment,
                },
                {
                  text: '- Test Bertekanan/ Test Hydrostatis secara parsial atau keseluruhan mengikuti standar spesialis siphonic',
                  colSpan: 3,
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                },
                {
                    text: '',
                    alignment: 'center' as Alignment
                }
              ],
              ['', '', '', '', '', ''],
              [
                  {
                      text: 'TOTAL',
                      bold: true,
                      colSpan: 5,
                      alignment: 'right' as Alignment
                  },
                            '',
                            '',
                            '',
                            '',
                            this.currencyPipe.transform(totalGrandInstallation + totalGrandPrice, 'Rp ', 'symbol', '1.0-2')
              ],
              [
                  {
                      text: 'PAJAK 11%',
                      bold: true,
                      colSpan: 5,
                      alignment: 'right' as Alignment
                  },
                            '',
                            '',
                            '',
                            '',
                            this.currencyPipe.transform(((totalGrandInstallation + totalGrandPrice)*11)/100, 'Rp ', 'symbol', '1.0-2')
              ],
              [
                  {
                      text: 'GRAND TOTAL',
                      bold: true,
                      colSpan: 5,
                      alignment: 'right' as Alignment
                  },
                            '',
                            '',
                            '',
                            '',
                            this.currencyPipe.transform((totalGrandInstallation + totalGrandPrice) - (((totalGrandInstallation + totalGrandPrice)*11)/100), 'Rp ', 'symbol', '1.0-2')
              ]
            ],
    
          },
          margin: [0, 20] as Margins
          },
          {
          alignment: 'right' as Alignment,
          columns: [
                    '',
                    {
                        text: [
                            {
                                text: 'Jakarta, 20 Desember 2017\n',
                            },
                            {
                                text: 'PT. Siphonic Flow Mandiri\n\n\n\n'
                            },
                            {
                                text: '(Akwin Indra)\n'
                            },
                            {
                                text: 'General Manager'
                            }
                        ],
                        alignment:  'center' as Alignment
                    }
          ]
            }
      ],
      styles: {
          table: {
          fontSize: 10
        }
      },
      defaultStyle: {
            fontSize: 10
        }
      
    }

    pdfMake.createPdf(documentDefinition).open();
  }

  generateMaterial(
    dataBasic: IDataQuotation,
    dataDetail: IDetailDataQuotation,
    revision: string,
    productCategory: IDataCategories[]
  ){

    let newMaterial: any[] = [];
    
    const sortedProductCategory = [...productCategory].sort((a, b) => parseInt(a.level ?? '0') - parseInt(b.level ?? '0'));
    sortedProductCategory.forEach((cat, i) => {
      let totalPriceCategory = 0
      dataBasic.total_supplier_product.forEach((data) => {
        if(data.id === cat.id){
          if(data.total_price !== 0){
            totalPriceCategory = data.total_price
          }
        }
      })

      const material = [
        {
          text: `1.${i + 1}`,
          bold: true,
          alignment: 'center' as Alignment,
          fillColor: '#dddddd'
        },
        {
          text: cat.description,
          bold: true,
          fillColor: '#dddddd'
        },
        {
          text: '',
          fillColor: '#dddddd'				        
        },
        {
            text: '',
          fillColor: '#dddddd'				        
        },
        {
          text: '',
          fillColor: '#dddddd'				        
        },
        {
          text: totalPriceCategory === 0  ? '' : this.currencyPipe.transform(totalPriceCategory, 'Rp ', 'symbol', '1.0-2'),
          alignment: 'center' as Alignment,
          fillColor: '#dddddd'				        
        }
      ]

      newMaterial.push(material);

      dataDetail.quotation_revision.forEach((data) => {
        if(data.revision === revision){

          data.quotation_items.forEach((item) => {
            const material = [
              {
                text: '',
                bold: true,
                alignment: 'center' as Alignment,
              },
              {
                text: `- ${item.inventory.description}`,
                bold: true,
              },
              {
                text: parseFloat(item.qty),
                alignment: 'center' as Alignment,	        
              },
              {
                text: item.inventory.unit.name,
                alignment: 'center' as Alignment,       
              },
              {
                text: parseFloat(item.inventory.default_selling_price) === 0  ? '' : this.currencyPipe.transform(item.inventory.default_selling_price, 'Rp ', 'symbol', '1.0-2'),
                alignment: 'center' as Alignment,
              },
              {
                text: parseFloat(item.total_price_per_product_after_discount) === 0   ? '' : this.currencyPipe.transform(item.total_price_per_product_after_discount, 'Rp ', 'symbol', '1.0-2'),
                alignment: 'center' as Alignment,	        
              }
            ]

            newMaterial.push(material);
          })
        }
      })
    })

    return newMaterial;
  }

  generateInstallation(
    dataBasic: IDataQuotation,
    dataDetail: IDetailDataQuotation,
    revision: string,
    productCategory: IDataCategories[]
  ){
    const newInstallation: any[] = [];
    
    const sortedProductCategory = [...productCategory].sort((a, b) => parseInt(a.level ?? '0') - parseInt(b.level ?? '0'));
    sortedProductCategory.forEach((cat, i) => {
      let totalPriceCategory = '';
      dataBasic.total_supplier_product.forEach((data) => {
        if(data.id === cat.id){
          if(data.total_price !== 0){
            totalPriceCategory = data.total_installation_price.toFixed(2)
          }
        }
      })

      const installation = [
        {
          text: `2.2.${i + 1}`,
          bold: true,
          alignment: 'center' as Alignment,
          fillColor: '#dddddd'
        },
        {
          text: `Pemasangan ${cat.description}`,
          bold: true,
          fillColor: '#dddddd'
        },
        {
          text: '',
          fillColor: '#dddddd'				        
        },
        {
            text: '',
          fillColor: '#dddddd'				        
        },
        {
          text: '',
          fillColor: '#dddddd'				        
        },
        {
          text: parseFloat(totalPriceCategory) === 0  ? '' : this.currencyPipe.transform(totalPriceCategory, 'Rp ', 'symbol', '1.0-2'),
          alignment: 'center' as Alignment,
          fillColor: '#dddddd'				        
        }
      ]

      newInstallation.push(installation);

      dataDetail.quotation_revision.forEach((data) => {
        if(data.revision === revision){
          data.quotation_items.forEach((item) => {
            const installation = [
              {
                text: '',
                bold: true,
                alignment: 'center' as Alignment,
              },
              {
                text: `- ${item.inventory.description}`,
                bold: true,
              },
              {
                text: parseFloat(item.qty),
                alignment: 'center' as Alignment,	        
              },
              {
                text: item.inventory.unit.name,
                alignment: 'center' as Alignment,       
              },
              {
                text: parseFloat(item.inventory.installation.selling_price) === 0  ? '' : this.currencyPipe.transform(item.inventory.installation.selling_price, 'Rp ', 'symbol', '1.0-2'),
                alignment: 'center' as Alignment,
              },
              {
                text: parseFloat(item.total_installation_price_after_discount) === 0   ? '' : this.currencyPipe.transform(item.total_installation_price_after_discount, 'Rp ', 'symbol', '1.0-2'),
                alignment: 'center' as Alignment,	        
              }
            ]

            newInstallation.push(installation);
          })
        }
      })
    })

    return newInstallation;
  }
}


