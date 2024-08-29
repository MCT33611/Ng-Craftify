import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IUser } from '../../models/iuser';
import { inject } from '@angular/core';
import { UserService } from '../../features/admin/modules/profiles/services/user.service';
import { lastValueFrom } from 'rxjs';

type CustomersListState = {
    users: IUser[] | null;
    isLoading: boolean;
};

const initialState: CustomersListState = {
    users: null,
    isLoading: false,
};

export const CustomersListStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, userService = inject(UserService)) => ({
        async loadAll(): Promise<void> {
            // Set loading state to true
            patchState(store, { isLoading: true });

            try {
                // Fetch users data asynchronously
                const users = (await lastValueFrom(userService.getAllCustomers())).$values;
                
                // Update state with fetched users data and set loading state to false
                patchState(store, { users, isLoading: false });
            } catch (error) {
                console.error('Error fetching customers list', error);

                // In case of an error, set loading state to false
                patchState(store, { isLoading: false });
            }
        },
    }))
);