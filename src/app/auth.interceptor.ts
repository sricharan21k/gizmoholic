import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem('token');
  if (req.url == '/login') {
    return next(req);
  }
  const mod = req.clone({
    headers: req.headers.set('authorization', `Bearer ${authToken}`),
  });

  return next(mod);
};
