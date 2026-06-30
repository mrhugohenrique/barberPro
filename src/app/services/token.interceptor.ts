import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
	const token = localStorage.getItem('loginToken');

	if (token) {
		try {
			const parsedToken = JSON.parse(token);
			if (parsedToken && parsedToken.token) {
				const clonedReq = req.clone({
					setHeaders: {
						Authorization: `Bearer ${parsedToken.token}`
					}
				});
				return next(clonedReq);
			}
		} catch (error) {
			// Ignora erros de parsing do localStorage e envia requisição original
		}
	}

	return next(req);
};
