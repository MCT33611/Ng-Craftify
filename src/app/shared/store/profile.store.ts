import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IUser } from '../../models/iuser';
import { inject } from '@angular/core';
import { ProfileService } from '../../features/profile/services/profile.service';

type ProfileState = {
    user: IUser | null;
    isLoading: boolean;
};

const initialState: ProfileState = {
    user: null,
    isLoading: false,
};

export const ProfileStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, profileService = inject(ProfileService)) => ({
        async loadAll(): Promise<void> {
            // Set loading state to true
            patchState(store, { isLoading: true });

            try {
                // Fetch user data asynchronously
                let user: IUser | undefined | null = await profileService.get().toPromise();
                if(!user){
                    
                    user = store.user();
                }
                // Update state with fetched user data and set loading state to false
                patchState(store, { user, isLoading: false });
            } catch (error) {
                console.error('Error fetching user profile', error);

                // In case of an error, set loading state to false
                patchState(store, { isLoading: false });
            }
        },
    }))
);
