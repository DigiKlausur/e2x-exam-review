import {NgxDatatableMessages} from '@siemens/ngx-datatable';

export const dataTableDefaultMessages: NgxDatatableMessages = {
  emptyMessage: $localize`:@@app.table.body.empty-notice:No data available`,
  totalMessage: $localize`:@@app.table.footer.total:in total`,
  selectedMessage: $localize`:@@app.table.body.selected:selected`,
  ariaFirstPageMessage: $localize`:@@app.table.footer.button.tooltip.first-page:go to first page`,
  ariaPreviousPageMessage: $localize`:@@app.table.footer.button.tooltip.prev-page:go to previous page`,
  ariaPageNMessage: $localize`:@@app.table.footer.button.tooltip.page-n:page`,
  ariaNextPageMessage: $localize`:@@app.table.footer.button.tooltip.next-page:go to next page`,
  ariaLastPageMessage: $localize`:@@app.table.footer.button.tooltip.last-page:go to last page`,
  ariaGroupHeaderCheckboxMessage: '',
  ariaHeaderCheckboxMessage: '',
  ariaRowCheckboxMessage: ''
}
