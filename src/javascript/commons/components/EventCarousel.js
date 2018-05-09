import React from 'react';
import moment from 'moment'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { APICaller } from '../api';

import { fetch } from '../../redux/actions';

import { service, api, values } from '../configs';

import { Carousel, WingBlank } from 'antd-mobile';

const mapStateToProps = ({fetch}) => {
    const eventList = service.getValue(fetch, 'multipleList.events.results', []).filter((item) => service.getValue(item, 'isShowMobile', false)).filter(item => service.getValue(item, 'data.isShow', false));
    return {
        eventList
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});


class EventCarousel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            boardType : 'NoticeBoard',
            boardName : '학부모이벤트'
        }

        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        const {  boardType, boardName } = this.state;
        const obj = api.getBoard(boardType, {name : boardName});

        APICaller.get(obj.url, obj.params)
        .then(({data}) => {
            if(data){
                return this.props.multipleList([{id: 'events', ...api.getPostList(data.id, {data__eventInfo__end_date__gte : moment().format(values.format.DATE_FORMAT)})}])

            }
        });
    }

    onChange(e){
        e.preventDefault();
        e.stopPropagation();
    }

    makeCarousel(eventList){
        return(
            <div onTouchStart={this.onChange}>
                <Carousel
                    autoplay={false}
                    infinite={true}
                    selectedIndex={0}
                    // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                    // afterChange={index => console.log('slide to', index)}
                    dots={eventList.length === 1 ? false : true}
                >
                    {eventList.map(item => {
                        const imgSrc = service.getValue(item, 'data.eventInfo.appProgressImageUrl', false) ? decodeURI(service.getValue(item, 'data.eventInfo.appProgressImageUrl')) : null
                        return(
                            <Link
                                className="event-item"
                                key={item.id}
                                to={`boards/events/${item.id}`}
                            >
                                <img
                                    src={imgSrc}
                                    alt={service.getValue(item, 'title', "")}
                                    onLoad={() => {
                                        window.dispatchEvent(new Event('resize'));
                                    }}
                                />
                            </Link>
                        );
                    })}
                </Carousel>
            </div>
        );
    }

    render() {
        const { eventList, size } = this.props;
        const hasEvent = service.getValue(eventList, 'length', false);

        return (
            <WingBlank className={`event-carousel ${ hasEvent ? 'has' : 'no'}-event-list`} size={size} >
                { hasEvent  ? this.makeCarousel(eventList) : null }
            </WingBlank>
        );
    }

}

EventCarousel.propTypes = {
    eventList: PropTypes.array,
    size : PropTypes.string,
};

EventCarousel.defaultProps = {
    eventList : [],
    size : 'md'
};

export default  connect(mapStateToProps, mapDispatchProps)(EventCarousel);
