// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {memo, useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

import {FormattedMessage} from 'react-intl';

import Constants, {InsightsScopes} from 'utils/constants';

import CircleLoader from '../skeleton_loader/circle_loader/circle_loader';
import TitleLoader from '../skeleton_loader/title_loader/title_loader';
import LineChartLoader from '../skeleton_loader/line_chart_loader/line_chart_loader';
import widgetHoc, {WidgetHocProps} from '../widget_hoc/widget_hoc';

import {getCurrentRelativeTeamUrl, getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';
import {getMyTopChannels, getTopChannelsForTeam} from 'mattermost-redux/actions/insights';
import {TopChannel, TopChannelGraphData} from '@mattermost/types/insights';
import WidgetEmptyState from '../widget_empty_state/widget_empty_state';
import OverlayTrigger from 'components/overlay_trigger';

import Tooltip from 'components/tooltip';
import {getCurrentUserTimezone} from 'selectors/general';

import TopChannelsLineChart from './top_channels_line_chart/top_channels_line_chart';

import './../../activity_and_insights.scss';

const TopChannels = (props: WidgetHocProps) => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [topChannels, setTopChannels] = useState([] as TopChannel[]);
    const [channelLineChartData, setChannelLineChartData] = useState({} as TopChannelGraphData);

    const currentTeamId = useSelector(getCurrentTeamId);
    const currentTeamUrl = useSelector(getCurrentRelativeTeamUrl);
    const timeZone = useSelector(getCurrentUserTimezone);

    const getTopTeamChannels = useCallback(async () => {
        if (props.filterType === InsightsScopes.TEAM) {
            setLoading(true);
            const data: any = await dispatch(getTopChannelsForTeam(currentTeamId, 0, 5, props.timeFrame));
            if (data.data?.items) {
                setTopChannels(data.data.items);
            }
            if (data.data?.channel_post_counts_by_duration) {
                setChannelLineChartData(data.data.channel_post_counts_by_duration);
            }
            setLoading(false);
        }
    }, [props.timeFrame, currentTeamId, props.filterType]);

    useEffect(() => {
        getTopTeamChannels();
    }, [getTopTeamChannels]);

    const getMyTeamChannels = useCallback(async () => {
        if (props.filterType === InsightsScopes.MY) {
            setLoading(true);
            const data: any = await dispatch(getMyTopChannels(currentTeamId, 0, 5, props.timeFrame));
            if (data.data?.items) {
                setTopChannels(data.data.items);
            }
            if (data.data?.channel_post_counts_by_duration) {
                setChannelLineChartData(data.data.channel_post_counts_by_duration);
            }
            setLoading(false);
        }
    }, [props.timeFrame, props.filterType]);

    useEffect(() => {
        getMyTeamChannels();
    }, [getMyTeamChannels]);

    const skeletonTitle = useCallback(() => {
        const titles = [];
        for (let i = 0; i < 5; i++) {
            titles.push(
                <div
                    className='top-channel-loading-row'
                    key={i}
                >
                    <CircleLoader
                        size={16}
                    />
                    <TitleLoader/>
                </div>,
            );
        }
        return titles;
    }, []);

    const tooltip = useCallback((messageCount: number) => {
        return (
            <Tooltip
                id='total-messages'
            >
                <FormattedMessage
                    id='insights.topChannels.messageCount'
                    defaultMessage='{messageCount} total messages'
                    values={{
                        messageCount,
                    }}
                />
            </Tooltip>
        );
    }, []);

    return (
        <>
            <div className='top-channel-container'>
                <div className='top-channel-line-chart'>
                    {
                        loading &&
                        <LineChartLoader/>
                    }
                    {
                        (!loading && topChannels.length !== 0) &&
                        <>
                            <TopChannelsLineChart
                                topChannels={topChannels}
                                timeFrame={props.timeFrame}
                                channelLineChartData={channelLineChartData}
                                timeZone={timeZone || 'utc'}
                            />
                        </>
                    }
                </div>
                <div className='top-channel-list'>
                    {
                        loading &&
                        skeletonTitle()
                    }
                    {
                        (!loading && topChannels.length !== 0) &&
                        <div className='channel-list'>
                            {
                                topChannels.map((channel) => {
                                    const barSize = ((channel.message_count / topChannels[0].message_count) * 0.8);

                                    let iconToDisplay = <i className='icon icon-globe'/>;

                                    if (channel.type === Constants.PRIVATE_CHANNEL) {
                                        iconToDisplay = <i className='icon icon-lock-outline'/>;
                                    }
                                    return (
                                        <Link
                                            className='channel-row'
                                            to={`${currentTeamUrl}/channels/${channel.name}`}
                                            key={channel.id}
                                        >
                                            <div
                                                className='channel-display-name'
                                            >
                                                <span className='icon'>
                                                    {iconToDisplay}
                                                </span>
                                                <span className='display-name'>{channel.display_name}</span>
                                            </div>
                                            <div className='channel-message-count'>
                                                <OverlayTrigger
                                                    trigger={['hover']}
                                                    delayShow={Constants.OVERLAY_TIME_DELAY}
                                                    placement='right'
                                                    overlay={tooltip(channel.message_count)}
                                                >
                                                    <span className='message-count'>{channel.message_count}</span>
                                                </OverlayTrigger>
                                                <span
                                                    className='horizontal-bar'
                                                    style={{
                                                        flex: `${barSize} 0`,
                                                    }}
                                                />
                                            </div>
                                        </Link>
                                    );
                                })
                            }
                        </div>
                    }
                </div>
            </div>
            {
                (topChannels.length === 0 && !loading) &&
                <WidgetEmptyState
                    icon={'globe'}
                />
            }
        </>

    );
};

export default memo(widgetHoc(TopChannels));
