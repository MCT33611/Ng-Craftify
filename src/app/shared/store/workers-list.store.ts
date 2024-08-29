import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { UserService } from '../../features/admin/modules/profiles/services/user.service';
import { lastValueFrom } from 'rxjs';
import { IWorker } from '../../models/iworker';

type WorkersListState = {
    workers: IWorker[] | null;
    isLoading: boolean;
};

const initialState: WorkersListState = {
    workers: null,
    isLoading: false,
};

export const WorkersListStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, userService = inject(UserService)) => ({
        async loadAll(): Promise<void> {
            // Set loading state to true
            patchState(store, { isLoading: true });

            try {
                // Fetch workers data asynchronously
                const workers = (await lastValueFrom(userService.getAllWorkers())).$values;
                
                // Update state with fetched workers data and set loading state to false
                patchState(store, { workers, isLoading: false });
            } catch (error) {
                console.error('Error fetching workers list', error);

                // In case of an error, set loading state to false
                patchState(store, { isLoading: false });
            }
        },
    }))
);