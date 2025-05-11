declare const M: any;
export function toast(message: string, status?: any) {
  if (typeof message !== 'undefined') {
    setTimeout(function () {
      M.toast({
        html: `${!status ? '' : status + ' - '}${message}`,
      });
    }, 200);
  }
}
