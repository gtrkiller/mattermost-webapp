// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';

import TutorialTourTip from 'components/tutorial_tour_tip/tutorial_tour_tip';
import {
    OnBoardingTourSteps,
    TutorialTourCategories,
} from 'components/tutorial_tour_tip/constant';
import {useMeasurePunchouts} from '../tutorial_tour_tip/hooks';
import CustomImg from 'images/Customize-Your-Experience.gif';

const CustomizeYourExperienceTour = () => {
    const telemetryTagText = `tutorial_tip_${OnBoardingTourSteps.SEND_MESSAGE}_Send_Message`;

    const title = (
        <FormattedMessage
            id='onBoardingTour.customizeYourExperience.title'
            defaultMessage={'Customize your experience'}
        />
    );
    const screen = (
        <p>
            <FormattedMessage
                id='onBoardingTour.customizeYourExperience.Description'
                defaultMessage={'Set your availability, add a custom status, and access Settings and your Profile to configure your experience, including notification preferences and custom theme colors.'}
            />
        </p>
    );

    return (
        <TutorialTourTip
            title={title}
            screen={screen}
            imageURL={CustomImg}
            tutorialCategory={TutorialTourCategories.ON_BOARDING}
            step={OnBoardingTourSteps.CUSTOMIZE_EXPERIENCE}
            placement='bottom-end'
            pulsatingDotPlacement='bottom'
            pulsatingDotTranslate={{x: 20, y: -6}}
            offset={[18, 4]}
            telemetryTag={telemetryTagText}
            width={352}
            autoTour={true}
            punchOut={useMeasurePunchouts(['RightControlsContainer'], [], {y: 6, height: 6, x: 74, width: 0})}
        />
    );
};

export default CustomizeYourExperienceTour;