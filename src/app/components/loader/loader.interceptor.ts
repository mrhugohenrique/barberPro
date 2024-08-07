import { inject } from '@angular/core';

import { LoaderService } from './loader.service';
import { finalize } from 'rxjs';
import { HttpInterceptorFn } from '@angular/common/http';

export const LoaderInterceptor: HttpInterceptorFn = (req, next) => {
	const loaderService = inject(LoaderService);

	loaderService.showLoader();
	return next(req).pipe(
		finalize(() => {
			loaderService.hideLoader();
		})
	);
};
