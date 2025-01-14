// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {savePreferences} from 'mattermost-redux/actions/preferences';
import {getLicense} from 'mattermost-redux/selectors/entities/general';
import {GenericAction} from 'mattermost-redux/types/actions';
import {getStandardAnalytics} from 'mattermost-redux/actions/admin';
import {getCloudSubscription, getCloudCustomer} from 'mattermost-redux/actions/cloud';

import {isCurrentUserSystemAdmin} from 'mattermost-redux/selectors/entities/users';
import {
    checkSubscriptionIsLegacyFree,
    getCloudSubscription as selectCloudSubscription,
    getCloudCustomer as selectCloudCustomer,
    getSubscriptionProduct,
} from 'mattermost-redux/selectors/entities/cloud';
import {cloudFreeEnabled} from 'mattermost-redux/selectors/entities/preferences';
import {CloudProducts} from 'utils/constants';

import {openModal} from 'actions/views/modals';

import {GlobalState} from 'types/store';

import PaymentAnnouncementBar from './payment_announcement_bar';

function mapStateToProps(state: GlobalState) {
    const subscription = selectCloudSubscription(state);
    const customer = selectCloudCustomer(state);
    const isCloudFreeEnabled = cloudFreeEnabled(state);
    const subscriptionProduct = getSubscriptionProduct(state);
    return {
        userIsAdmin: isCurrentUserSystemAdmin(state),
        isCloud: getLicense(state).Cloud === 'true',
        subscription,
        customer,
        isLegacyFree: checkSubscriptionIsLegacyFree(state),
        isStarterFree: isCloudFreeEnabled && subscriptionProduct?.sku === CloudProducts.STARTER,
    };
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators(
            {
                savePreferences,
                getStandardAnalytics,
                openModal,
                getCloudSubscription,
                getCloudCustomer,
            },
            dispatch,
        ),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentAnnouncementBar);
