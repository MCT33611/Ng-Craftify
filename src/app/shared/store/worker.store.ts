import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IWorker } from '../../models/iworker';
import { inject } from '@angular/core';
import {  WorkerService } from '../../features/worker/services/worker.service';
import { lastValueFrom } from 'rxjs';

type WorkerState = {
    worker: IWorker | null;
    isLoading: boolean;
};

const initialState: WorkerState = {
    worker: null,
    isLoading: false,
};

export const WorkerStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, workerService = inject(WorkerService)) => ({
        async loadAll(): Promise<void> {
            // Set loading state to true
            patchState(store, { isLoading: true });

            try {
                // Fetch worker data asynchronously
                let worker: IWorker | undefined | null = await lastValueFrom( workerService.get());
                if(!worker){
                    
                    worker = store.worker();
                }
                // Update state with fetched worker data and set loading state to false
                patchState(store, { worker, isLoading: false });
            } catch (error) {
                console.error('Error fetching worker worker', error);

                // In case of an error, set loading state to false
                patchState(store, { isLoading: false });
            }
        },
    }))
);
